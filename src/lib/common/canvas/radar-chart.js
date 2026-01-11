/* eslint-disable no-param-reassign */
export default class CanvasRadarChart {
  constructor(context, options) {
    this.context = context;
    this.#configure(options);
  }
  destroy() {
    this.#clear();
  }
  update(options) {
    this.#clear();
    this.#configure(options);
    this.render();
  }
  render() {
    this.#prepareCanvas();
    this.#renderGrid();
    this.#renderLabels();
    this.#renderLegend();
    this.#renderData();
  }
  resize() {
    this.#clear();
    this.render();
  }
  #clear() {
    const {canvas} = this.context;

    this.context.save();
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, canvas.width, canvas.height);
    this.context.restore();
  }
  #colorFrom({color: _color, opacity}) {
    const color = _color.startsWith("--") ? getComputedStyle(this.context.canvas).getPropertyValue(_color) : _color;

    return `rgb(from ${color} r g b / ${opacity || 1})`;
  }
  #configure(options) {
    this.#configureData(options);
    this.#configureLabels(options);
    this.#configureLegend(options);
    this.#configureGrid(options);
  }
  #configureData(options) {
    const data = [];

    options.data.forEach((set) => {
      const color = set.color || "--private-traitify-theme";

      data.push({
        fill: false,
        fillOpacity: 0.6,
        fillStyle: color,
        pathLineWidth: 2,
        pathOpacity: 1,
        pathStrokeStyle: color,
        pointFillStyle: color,
        pointOpacity: 1,
        pointRadius: 5,
        ...set
      });
    });

    this.data = data;
  }
  #configureGrid(options) {
    const grid = {
      axes: [],
      options: {
        fontSize: "16px",
        innerLines: 1,
        lineWidth: 0.5,
        max: 10,
        strokeStyle: "--private-traitify-border-dark",
        ...options.grid,
        labels: {show: true, ...options.grid?.labels || {}}
      }
    };

    for(let axis = 0; axis < options.labels.length; axis += 1) {
      grid.axes.push({
        angle: (2 * Math.PI * (axis / options.labels.length)) + (1 / 2) * Math.PI
      });
    }

    this.grid = grid;
  }
  #configureLabels(options) {
    const labels = [];

    options.labels.forEach((label) => {
      labels.push({
        fillStyle: "--private-traitify-secondary",
        fontSize: "12px",
        ...label
      });
    });

    this.labels = labels;
  }
  #configureLegend(options) {
    this.legend = {
      fillStyle: "--private-traitify-text",
      fontSize: "16px",
      padding: 10,
      pointRadius: 10,
      show: this.data.length > 1,
      ...options.legend,
      height: 0
    };

    if(!this.legend.show) { return; }

    this.legend.height = this.#textHeight("Label", {fontSize: this.legend.fontSize}) * this.data.length
      + (this.legend.padding * (this.data.length + 1));
  }
  #prepareCanvas() {
    const {height, width} = this.context.canvas.getBoundingClientRect();
    const resized = this.context.canvas.width !== width || this.context.canvas.height !== height;
    if(this.grid.container && !resized) { return; }

    const gridHeight = height - this.legend.height;
    this.grid.container = {height, width};
    this.grid.center = {x: width / 2, y: gridHeight / 2};
    this.grid.radius = (width > gridHeight ? gridHeight : width) / Math.PI;

    // NOTE: Scaled to account for pixel density
    const {devicePixelRatio: ratio = 1} = window;
    this.context.canvas.width = width * ratio;
    this.context.canvas.height = height * ratio;
    this.context.scale(ratio, ratio);
  }
  #renderData() {
    this.data.forEach((data) => {
      const points = [];

      this.context.strokeStyle = this.#colorFrom({
        color: data.pathStrokeStyle, opacity: data.pathOpacity
      });
      this.context.lineWidth = data.pathLineWidth;
      this.context.beginPath();
      this.grid.axes.forEach((axis, index) => {
        const value = this.grid.radius * (data.values[index] / this.grid.options.max);
        const x = this.grid.center.x + value * -Math.cos(axis.angle);
        const y = this.grid.center.y + value * -Math.sin(axis.angle);
        points.push({x, y});
        this.context.lineTo(x, y);
      });
      this.context.closePath();

      if(data.fill) {
        this.context.fillStyle = this.#colorFrom({
          color: data.fillStyle, opacity: data.fillOpacity
        });
        this.context.fill();
      }
      this.context.stroke();

      this.context.fillStyle = this.#colorFrom({
        color: data.pointFillStyle, opacity: data.pointOpacity
      });
      points.forEach((point) => {
        this.context.beginPath();
        this.context.arc(point.x, point.y, data.pointRadius, 0, 2 * Math.PI, false);
        this.context.fill();
      });
    });
  }
  #renderGrid() {
    const {innerLines} = this.grid.options;

    for(let line = 0; line <= innerLines + 1; line += 1) {
      this.#renderGridPolygon(this.grid.radius * (line / (innerLines + 1)), line);
    }
  }
  #renderGridPolygon(radius, line) {
    const {options} = this.grid;

    this.context.strokeStyle = this.#colorFrom({color: options.strokeStyle, opacity: 1});
    this.context.lineWidth = options.lineWidth;
    this.context.beginPath();

    this.grid.axes.concat(this.grid.axes[0]).forEach((axis, index) => {
      const x = this.grid.center.x + radius * -Math.cos(axis.angle);
      const y = this.grid.center.y + radius * -Math.sin(axis.angle);

      if(index === 0 && options.labels.show) {
        const scale = parseInt(options.max * (line / (options.innerLines + 1)), 10);
        this.#setFontSize(options.fontSize);
        this.context.fillText(scale, x + 5, y + 20);
      }

      this.context.lineTo(x, y);
      if(radius === this.grid.radius) {
        this.context.lineTo(this.grid.center.x, this.grid.center.y);
        this.context.moveTo(x, y);
      }
    });

    this.context.closePath();
    this.context.stroke();
  }
  #renderLabels() {
    const buffer = 5;
    const height = 100;
    const width = 100;

    this.grid.axes.forEach((axis, index) => {
      const label = this.labels[index];
      if(!label.image) {
        const x = this.grid.center.x
          + (this.grid.radius + buffer) * -Math.cos(axis.angle);
        const y = this.grid.center.y
          + (this.grid.radius + buffer) * -Math.sin(axis.angle);

        this.#renderLabelText(label, {x, y});
        return;
      }

      axis.img = new Image(width, height);
      axis.img.src = label.image;
      axis.img.onload = () => {
        const diagonal = Math.sqrt((axis.img.width ** 2) + (axis.img.height ** 2));
        const x = (this.grid.center.x - axis.img.width / 2)
          + (this.grid.radius + (diagonal / 2) * 1.10) * -Math.cos(axis.angle);
        const y = (this.grid.center.y - axis.img.height / 2)
          + (this.grid.radius + (diagonal / 2) * 1.10) * -Math.sin(axis.angle);
        this.context.drawImage(axis.img, x, y, axis.img.width, axis.img.height);

        this.#renderLabelImageText(label, x + axis.img.width / 2, y + axis.img.height);
      };
    });
  }
  #renderLabelImageText(label, x, y) {
    this.context.fillStyle = this.#colorFrom({color: label.fillStyle, opacity: 1});
    this.#setFontSize(label.fontSize);
    this.context.textAlign = "center";
    this.context.textBaseline = "top";
    const textLength = this.context.measureText(label.text).width;

    // TODO: Remove these static numbers in favor of actual data
    if(x < 150 || x > 680) {
      const lines = label.text.split(" ");
      if(lines.length > 1) {
        lines.forEach((line, index) => {
          this.context.fillText(line, x, y + (index * 22));
        });
      } else if(textLength > 145 && x < 150) {
        this.context.fillText(label.text, x - 20, y);
      } else if(textLength > 145 && x > 680) {
        this.context.fillText(label.text, x + 20, y);
      } else {
        this.context.fillText(label.text, x, y);
      }
    } else {
      this.context.fillText(label.text, x, y);
    }
  }
  #renderLabelText(label, point) {
    this.context.fillStyle = this.#colorFrom({color: label.fillStyle, opacity: 1});
    this.#setFontSize(label.fontSize);
    const buffer = 5; // NOTE: Math with pi leads to rounding issues
    let limit;
    const roundingBuffer = 5;
    const {x, y} = point;

    if(point.x < this.grid.center.x - roundingBuffer) {
      this.context.textAlign = "right";
      limit = point.x - buffer;
    } else if(point.x > this.grid.center.x + roundingBuffer) {
      this.context.textAlign = "left";
      limit = this.grid.container.width - point.x - buffer;
    } else {
      this.context.textAlign = "center";
    }

    if(point.y < this.grid.center.y - roundingBuffer) {
      this.context.textBaseline = "bottom";
    } else if(point.y > this.grid.center.y + roundingBuffer) {
      this.context.textBaseline = "top";
    } else {
      this.context.textBaseline = "top";
    }

    this.context.fillText(label.text, x, y, limit);
  }
  #renderLegend() {
    if(!this.legend.show) { return; }

    let y = this.grid.container.height - this.legend.height;
    this.#setFontSize(this.legend.fontSize);
    this.context.textAlign = "left";
    this.context.textBaseline = "middle";

    this.data.forEach((data) => {
      const limit = this.grid.container.width - this.legend.pointRadius - this.legend.padding * 3;
      const textHeight = this.#textHeight(data.name);
      const textWidth = this.#textWidth(data.name);
      let x = this.grid.container.width / 2 - textWidth / 2
        - this.legend.pointRadius - this.legend.padding * 2;
      if(x < this.legend.padding) { x = this.legend.padding; }
      const point = {x: x + this.legend.pointRadius * 0.5, y: y + textHeight * 0.5};
      this.context.fillStyle = this.#colorFrom({
        color: data.pointFillStyle, opacity: data.pointOpacity
      });
      this.context.beginPath();
      this.context.arc(point.x, point.y, this.legend.pointRadius, 0, 2 * Math.PI, false);
      this.context.fill();

      x += this.legend.pointRadius + this.legend.padding;
      this.context.fillStyle = this.#colorFrom({color: this.legend.fillStyle});
      this.context.fillText(data.name, x, y + textHeight * 0.5, limit);

      y += textHeight + this.legend.padding;
    });
  }
  #setFontSize(fontSize) {
    this.context.font = `${fontSize} "Open Sans", "Source Sans Pro", "Helvetica Neue", Verdana, Arial, sans-serif`;
  }
  #textHeight(text, {fontSize} = {}) {
    const {font, textBaseline} = this.context;
    this.context.textBaseline = "top";
    if(fontSize) { this.#setFontSize(fontSize); }

    // NOTE: Currently using actual height over font height
    // const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    const metrics = this.context.measureText(text);
    const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;

    this.context.textBaseline = textBaseline;
    if(fontSize) { this.context.font = font; }

    return fontHeight;
  }
  #textWidth(text) {
    return this.context.measureText(text).width;
  }
}
