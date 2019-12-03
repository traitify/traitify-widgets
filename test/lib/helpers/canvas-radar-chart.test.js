/* eslint-disable no-param-reassign */
import CanvasRadarChart from "lib/helpers/canvas-radar-chart";

describe("Helpers", () => {
  describe("canvasRadarChart", () => {
    let chart;
    let ctx;
    let options;

    beforeEach(() => {
      ctx = {
        arc: jest.fn().mockName("arc"),
        beginPath: jest.fn().mockName("beginPath"),
        canvas: {
          height: 700,
          parentNode: {
            clientHeight: 700,
            clientWidth: 820
          },
          style: {
            height: "700px",
            width: "820px"
          },
          _width: 820,
          get width() { return this._width; },
          set width(value) { this._width = value; }
        },
        closePath: jest.fn().mockName("closePath"),
        drawImage: jest.fn().mockName("drawImage"),
        fill: jest.fn().mockName("fill"),
        fillText: jest.fn().mockName("fillText"),
        lineTo: jest.fn().mockName("lineTo"),
        measureText: jest.fn((text) => ({width: text.length * 20})).mockName("measureText"),
        moveTo: jest.fn().mockName("moveTo"),
        stroke: jest.fn().mockName("stroke")
      };
      options = {
        data: [
          {fill: true, values: [4, 7, 1, 5, 5]},
          {values: [2, 4, 6, 8, 10]}
        ],
        grid: {innerLines: 2},
        labels: [
          {font: "18px Arial", text: "Top", image: "https://google.com/banana.png"},
          {text: "TopRight", image: "https://google.com/banana.png"},
          {text: "Middle Right Split", image: "https://google.com/banana.png"},
          {text: "BottomRight", image: "https://google.com/banana.png"},
          {text: "BottomLeft", image: "https://google.com/banana.png"},
          {text: "MiddleLeft", image: "https://google.com/banana.png"},
          {text: "TopLeft", image: "https://google.com/banana.png"}
        ]
      };
      chart = new CanvasRadarChart(ctx, options);
    });

    describe("constructor", () => {
      it("configures data", () => {
        expect(chart.data[0]).toMatchObject({fill: true, pointRadius: 5});
        expect(chart.data[1]).toMatchObject({fill: false, pointRadius: 5});
      });

      it("configures grid", () => {
        expect(chart.grid.axes).toEqual([
          {angle: Math.PI / 2},
          {angle: 2 * Math.PI * (1 / 7) + (Math.PI / 2)},
          {angle: 2 * Math.PI * (2 / 7) + (Math.PI / 2)},
          {angle: 2 * Math.PI * (3 / 7) + (Math.PI / 2)},
          {angle: 2 * Math.PI * (4 / 7) + (Math.PI / 2)},
          {angle: 2 * Math.PI * (5 / 7) + (Math.PI / 2)},
          {angle: 2 * Math.PI * (6 / 7) + (Math.PI / 2)}
        ]);
        expect(chart.grid.center).toEqual({x: 410, y: 350});
        expect(chart.grid.options).toMatchObject({innerLines: 2, lineWidth: 0.5});
        expect(chart.grid.radius).toEqual(700 / Math.PI);
      });

      it("configures grid with radius based on width", () => {
        ctx.canvas.width = 600;
        chart = new CanvasRadarChart(ctx, options);

        expect(chart.grid.radius).toEqual(600 / Math.PI);
      });

      it("configures labels", () => {
        expect(chart.labels[0]).toMatchObject({font: "18px Arial"});
        expect(chart.labels[1]).toMatchObject({font: "22px Arial"});
        expect(chart.labels[2]).toMatchObject({font: "22px Arial"});
        expect(chart.labels[3]).toMatchObject({font: "22px Arial"});
        expect(chart.labels[4]).toMatchObject({font: "22px Arial"});
        expect(chart.labels[5]).toMatchObject({font: "22px Arial"});
        expect(chart.labels[6]).toMatchObject({font: "22px Arial"});
      });
    });

    describe("destroy", () => {
      it("reassigns the width", () => {
        const spy = jest.spyOn(ctx.canvas, "width", "set");
        chart.destroy();

        expect(spy).toHaveBeenCalled();
      });
    });

    describe("render", () => {
      it("renders data", () => {
        chart.renderGrid = () => {};
        chart.renderLabels = () => {};
        chart.render();

        expect(ctx.arc).toHaveBeenCalledTimes(14);
        expect(ctx.beginPath).toHaveBeenCalledTimes(16);
        expect(ctx.closePath).toHaveBeenCalledTimes(2);
        expect(ctx.drawImage).toHaveBeenCalledTimes(0);
        expect(ctx.fill).toHaveBeenCalledTimes(15);
        expect(ctx.fillText).toHaveBeenCalledTimes(0);
        expect(ctx.lineTo).toHaveBeenCalledTimes(14);
        expect(ctx.measureText).toHaveBeenCalledTimes(0);
        expect(ctx.moveTo).toHaveBeenCalledTimes(0);
        expect(ctx.stroke).toHaveBeenCalledTimes(2);
      });

      it("renders grid", () => {
        chart.renderData = () => {};
        chart.renderLabels = () => {};
        chart.render();

        expect(ctx.arc).toHaveBeenCalledTimes(0);
        expect(ctx.beginPath).toHaveBeenCalledTimes(4);
        expect(ctx.closePath).toHaveBeenCalledTimes(4);
        expect(ctx.drawImage).toHaveBeenCalledTimes(0);
        expect(ctx.fill).toHaveBeenCalledTimes(0);
        expect(ctx.fillText).toHaveBeenCalledTimes(4);
        expect(ctx.lineTo).toHaveBeenCalledTimes(40);
        expect(ctx.measureText).toHaveBeenCalledTimes(0);
        expect(ctx.moveTo).toHaveBeenCalledTimes(8);
        expect(ctx.stroke).toHaveBeenCalledTimes(4);
      });

      it("renders labels", () => {
        chart.renderData = () => {};
        chart.renderGrid = () => {};
        chart.render();
        chart.grid.axes.forEach((axis) => {
          axis.img.height = 400;
          axis.img.width = 400;
          axis.img.onload();
        });

        expect(ctx.arc).toHaveBeenCalledTimes(0);
        expect(ctx.beginPath).toHaveBeenCalledTimes(0);
        expect(ctx.closePath).toHaveBeenCalledTimes(0);
        expect(ctx.drawImage).toHaveBeenCalledTimes(7);
        expect(ctx.fill).toHaveBeenCalledTimes(0);
        expect(ctx.fillText).toHaveBeenCalledTimes(9);
        expect(ctx.lineTo).toHaveBeenCalledTimes(0);
        expect(ctx.measureText).toHaveBeenCalledTimes(7);
        expect(ctx.moveTo).toHaveBeenCalledTimes(0);
        expect(ctx.stroke).toHaveBeenCalledTimes(0);
      });
    });

    describe("resize", () => {
      beforeEach(() => {
        ctx.canvas.parentNode.clientWidth = 1640;

        chart = new CanvasRadarChart(ctx, options);
        chart.resize();
      });

      it("updates dimensions", () => {
        expect(chart.ctx.canvas.style.height).toBe("1400px");
        expect(chart.ctx.canvas.style.width).toBe("1640px");
      });
    });
  });
});
