/* eslint-disable no-param-reassign, no-self-assign */
function configureLabels(options) {
  const labels = [];

  options.labels.forEach((label) => {
    labels.push({
      fillStyle: "#222222",
      font: "22px Arial",
      ...label
    });
  });

  return labels;
}

function configureData(options) {
  const data = [];

  options.data.forEach((set) => {
    data.push({
      fill: false,
      fillStyle: set.color || "rgba(5, 143, 196, 0.25)",
      pathLineWidth: 4,
      pathStrokeStyle: set.color || "#058fc4",
      pointFillStyle: set.color || "#058fc4",
      pointRadius: 5,
      ...set
    });
  });

  return data;
}

function configureGrid(ctx, options) {
  const grid = {
    axes: [],
    options: {
      font: "18px Arial",
      innerLines: 1,
      lineWidth: 0.5,
      max: 10,
      strokeStyle: "#555555",
      ...options.grid
    }
  };

  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  grid.center = {x: canvasWidth / 2, y: canvasHeight / 2};
  grid.radius = (canvasWidth > canvasHeight ? canvasHeight : canvasWidth) / Math.PI;

  for(let axis = 0; axis < options.labels.length; axis += 1) {
    grid.axes.push({
      angle: (2 * Math.PI * (axis / options.labels.length)) + (1 / 2) * Math.PI
    });
  }

  return grid;
}

export default class CanvasRadarChart {
  constructor(ctx, options) {
    this.ctx = ctx;
    this.data = configureData(options);
    this.labels = configureLabels(options);
    this.grid = configureGrid(ctx, options);
  }
  destroy() {
    const {canvas} = this.ctx;

    canvas.width = canvas.width;
  }
  render() {
    this.renderGrid();
    this.renderLabels();
    this.renderData();
    this.resize();
  }
  resize() {
    const {canvas} = this.ctx;
    const container = canvas.parentNode;
    const newWidth = container.clientWidth;
    const aspectRatio = canvas.width / canvas.height;

    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${(newWidth / aspectRatio)}px`;
  }
  renderGrid() {
    const {innerLines} = this.grid.options;

    for(let line = 0; line <= innerLines + 1; line += 1) {
      this.renderPolygon(this.grid.radius * (line / (innerLines + 1)), line);
    }
  }
  renderPolygon(radius, line) {
    const {options} = this.grid;

    this.ctx.strokeStyle = options.strokeStyle;
    this.ctx.lineWidth = options.lineWidth;
    this.ctx.beginPath();

    this.grid.axes.concat(this.grid.axes[0]).forEach((axis, index) => {
      const x = this.grid.center.x + radius * -Math.cos(axis.angle);
      const y = this.grid.center.y + radius * -Math.sin(axis.angle);

      if(index === 0) {
        const scale = parseInt(options.max * (line / (options.innerLines + 1)), 10);
        this.ctx.font = options.font;
        this.ctx.fillText(scale, x + 5, y + 20);
      }

      this.ctx.lineTo(x, y);
      if(radius === this.grid.radius) {
        this.ctx.lineTo(this.grid.center.x, this.grid.center.y);
        this.ctx.moveTo(x, y);
      }
    });

    this.ctx.closePath();
    this.ctx.stroke();
  }
  renderLabels() {
    this.grid.axes.forEach((axis, index) => {
      const label = this.labels[index];
      axis.img = new Image();
      axis.img.src = label.image;
      axis.img.onload = () => {
        const diagonal = Math.sqrt((axis.img.width ** 2) + (axis.img.height ** 2));
        const x = (this.grid.center.x - axis.img.width / 2)
          + (this.grid.radius + (diagonal / 2) * 1.10) * -Math.cos(axis.angle);
        const y = (this.grid.center.y - axis.img.height / 2)
          + (this.grid.radius + (diagonal / 2) * 1.10) * -Math.sin(axis.angle);
        this.ctx.drawImage(axis.img, x, y);

        this.renderLabelText(label, x + axis.img.width / 2, y + axis.img.height);
      };
    });
  }
  renderLabelText(label, x, y) {
    this.ctx.fillStyle = label.fillStyle;
    this.ctx.font = label.font;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "top";
    const textLength = this.ctx.measureText(label.text).width;

    if(x < 150 || x > 680) {
      const lines = label.text.split(" ");
      if(lines.length > 1) {
        lines.forEach((line, index) => {
          this.ctx.fillText(line, x, y + (index * 22));
        });
      } else if(textLength > 145 && x < 150) {
        this.ctx.fillText(label.text, x - 20, y);
      } else if(textLength > 145 && x > 680) {
        this.ctx.fillText(label.text, x + 20, y);
      } else {
        this.ctx.fillText(label.text, x, y);
      }
    } else {
      this.ctx.fillText(label.text, x, y);
    }
  }
  renderData() {
    this.data.forEach((data) => {
      const points = [];

      this.ctx.strokeStyle = data.pathStrokeStyle;
      this.ctx.lineWidth = data.pathLineWidth;
      this.ctx.beginPath();
      this.grid.axes.forEach((axis, index) => {
        const value = this.grid.radius * (data.values[index] / this.grid.options.max);
        const x = this.grid.center.x + value * -Math.cos(axis.angle);
        const y = this.grid.center.y + value * -Math.sin(axis.angle);
        points.push({x, y});
        this.ctx.lineTo(x, y);
      });
      this.ctx.closePath();

      if(data.fill) {
        this.ctx.fillStyle = data.fillStyle;
        this.ctx.fill();
      }
      this.ctx.stroke();

      this.ctx.fillStyle = data.pointFillStyle;
      points.forEach((point) => {
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, data.pointRadius, 0, 2 * Math.PI, false);
        this.ctx.fill();
      });
    });
  }
}
