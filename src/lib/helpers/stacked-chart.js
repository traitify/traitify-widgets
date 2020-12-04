function configureColumns({columns}) {
  return columns.map((column) => ({
    data: column.data.map((set) => ({
      fillStyle: set.color || "rgba(5, 143, 196, 0.25)",
      ...set
    }))
  }));
}

function configureGrid(ctx, options) {
  const grid = {
    axes: [],
    base: {},
    options: {
      font: "18px Arial",
      fontSize: 18,
      lines: 11,
      lineWidth: 1,
      strokeStyle: "#555555",
      ...options.grid
    }
  };

  grid.base.bottom = ctx.canvas.height - 200;
  grid.base.left = 50;
  grid.base.right = ctx.canvas.width;
  grid.base.top = 0;
  grid.options.barHeight = (grid.base.bottom - grid.base.top) / (grid.options.lines - 1);
  grid.options.barWidth = (grid.base.right - grid.base.left) / options.columns.length;
  grid.axes = Array(grid.options.lines - 1).fill().map((_, i) => (i + 1)).map((index) => ({
    base: {
      x: grid.base.left,
      y: grid.base.top + (grid.options.lines - index - 1) * grid.options.barHeight
    },
    name: index
  }));

  return grid;
}

function configureLabels({columns}) {
  return columns.map(({label}) => ({
    fillStyle: "#222222",
    font: "22px Arial",
    fontSize: 22,
    ...label
  }));
}

function configureLine({line}) {
  return {
    width: 8,
    ...line,
    data: line.data.map((point) => ({
      fill: true,
      fillStyle: point.color || "rgba(5, 143, 196, 0.25)",
      radius: 10,
      ...point
    }))
  };
}

export default class StackedChart {
  constructor(ctx, options) {
    this.ctx = ctx;
    this.columns = configureColumns(options);
    this.grid = configureGrid(ctx, options);
    this.labels = configureLabels(options);
    this.line = configureLine(options);
  }
  destroy() {
    const {canvas} = this.ctx;

    canvas.width = canvas.width; /* eslint-disable-line no-self-assign */

    this.destroyed = true;
  }
  render() {
    this.renderGrid();
    this.renderLabels();
    this.renderColumns();
    this.renderLine();
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
  renderColumns() {
    const {columns, grid: {base, options}} = this;

    columns.forEach((column, index) => {
      column.data.forEach((set) => {
        const x = base.left + index * options.barWidth;

        this.ctx.fillStyle = set.fillStyle;

        Array(set.max - set.min + 1).fill().map((_, i) => (i + set.min)).forEach((score) => {
          const y = base.top + options.barHeight * (10 - score);

          this.ctx.fillRect(x, y, options.barWidth, options.barHeight);
        });

        this.ctx.fill();
      });
    });
  }
  renderGrid() {
    const {axes, base, options} = this.grid;

    this.ctx.strokeStyle = options.strokeStyle;
    this.ctx.lineWidth = options.lineWidth;
    this.ctx.beginPath();
    this.ctx.font = options.font;

    axes.forEach((axis) => {
      this.ctx.fillText(
        axis.name,
        axis.base.x - this.ctx.measureText(axis.name).width - 5,
        axis.base.y + (options.barHeight + options.fontSize) / 2
      );

      this.ctx.moveTo(axis.base.x, axis.base.y);
      this.ctx.lineTo(base.right, axis.base.y);
    });

    this.ctx.moveTo(base.left, base.top);
    this.ctx.lineTo(base.left, base.bottom);
    this.ctx.moveTo(base.right, base.top);
    this.ctx.lineTo(base.right, base.bottom);
    this.ctx.stroke();

    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(base.left, base.bottom);
    this.ctx.lineTo(base.right, base.bottom);
    this.ctx.stroke();
  }
  renderLabels() {
    const {base, options} = this.grid;

    /* eslint-disable no-param-reassign */
    this.labels.forEach((label, index) => {
      label.img = new Image();
      label.img.src = label.image;
      label.img.onload = () => {
        if(this.destroyed) { return; }

        const x = base.left + options.barWidth * (index + 0.5);
        const y = base.bottom + 10;
        this.ctx.drawImage(label.img, x - label.img.width / 2, y);
        this.ctx.fillStyle = label.fillStyle;
        this.ctx.font = `bold ${label.font}`;
        this.ctx.textBaseline = "top";
        this.ctx.fillText(
          label.heading,
          x - this.ctx.measureText(label.heading).width / 2,
          y + label.img.height + 5
        );
        if(label.text) {
          this.ctx.font = `italic ${label.font}`;
          this.ctx.fillText(
            label.text,
            x - this.ctx.measureText(label.text).width / 2,
            y + label.img.height + 5 + label.fontSize + 2
          );
        }
      };
    });
    /* eslint-enable no-param-reassign */
  }
  renderLine() {
    const {grid: {base, options}, line: {data, ...line}} = this;

    data.forEach((point, index) => {
      const x = base.left + options.barWidth * (index + 0.5);
      const y = base.top + options.barHeight * (10 - point.score + 0.5);

      this.ctx.beginPath();
      this.ctx.arc(x, y, point.radius, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = point.fillStyle;
      this.ctx.fill();

      const nextPoint = data[index + 1];

      if(nextPoint) {
        const nextX = base.left + options.barWidth * (index + 1.5);
        const nextY = base.top + options.barHeight * (10 - nextPoint.score + 0.5);
        const gradient = this.ctx.createLinearGradient(x, y, nextX, nextY);
        gradient.addColorStop(0, point.fillStyle);
        gradient.addColorStop(1, nextPoint.fillStyle);

        this.ctx.lineWidth = line.width;
        this.ctx.strokeStyle = gradient;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(nextX, nextY);
        this.ctx.stroke();
      }
    });
  }
}
