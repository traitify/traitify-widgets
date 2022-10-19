/** @jest-environment jsdom */
import StackedChart from "lib/helpers/stacked-chart";

describe("Helpers", () => {
  describe("StackedChart", () => {
    let chart;
    let ctx;
    let gradient;
    let options;

    beforeEach(() => {
      gradient = {addColorStop: jest.fn().mockName("addColorStop")};
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
        createLinearGradient: jest.fn().mockName("createLinearGradient").mockReturnValue(gradient),
        drawImage: jest.fn().mockName("drawImage"),
        fill: jest.fn().mockName("fill"),
        fillRect: jest.fn().mockName("fillRect"),
        fillText: jest.fn().mockName("fillText"),
        lineTo: jest.fn().mockName("lineTo"),
        measureText: jest.fn((text) => ({width: text.length * 20})).mockName("measureText"),
        moveTo: jest.fn().mockName("moveTo"),
        stroke: jest.fn().mockName("stroke")
      };

      options = {
        columns: [
          {
            data: [
              {max: 10, min: 10},
              {color: "rgba(255, 210, 210, 0.5)", max: 4, min: 1},
              {color: "rgba(165, 229, 167, 0.5)", max: 9, min: 7},
              {color: "rgba(252, 239, 172, 0.5)", max: 6, min: 5}
            ],
            label: {
              font: "18px Arial",
              fontSize: 18,
              heading: "Friendly",
              image: "https://google.com/banana.png",
              text: "But Not Too Friendly"
            }
          },
          {
            data: [
              {color: "rgba(252, 239, 172, 0.5)", max: 10, min: 6},
              {color: "rgba(252, 239, 172, 0.5)", max: 5, min: 1}
            ],
            label: {
              heading: "Medium Friendly",
              image: "https://google.com/banana.png",
              text: "But Not Too Medium Friendly"
            }
          },
          {
            data: [
              {color: "rgba(255, 210, 210, 0.5)", max: 4, min: 1},
              {color: "rgba(165, 229, 167, 0.5)", max: 10, min: 6},
              {color: "rgba(252, 239, 172, 0.5)", max: 5, min: 5}
            ],
            label: {
              heading: "Neutral",
              image: "https://google.com/banana.png"
            }
          },
          {
            data: [
              {color: "rgba(252, 239, 172, 0.5)", max: 2, min: 1},
              {color: "rgba(252, 239, 172, 0.5)", max: 4, min: 3},
              {color: "rgba(255, 210, 210, 0.5)", max: 6, min: 5},
              {color: "rgba(165, 229, 167, 0.5)", max: 8, min: 7},
              {color: "rgba(252, 239, 172, 0.5)", max: 10, min: 9}
            ],
            label: {
              heading: "Medium Evil",
              image: "https://google.com/banana.png",
              text: "But Not Too Medium Evil"
            }
          },
          {
            data: [
              {color: "rgba(252, 239, 172, 0.5)", max: 10, min: 1}
            ],
            label: {
              heading: "Evil",
              image: "https://google.com/banana.png",
              text: "But Not Too Evil"
            }
          }
        ],
        line: {
          data: [
            {score: 20},
            {color: "#F25749", score: 5},
            {color: "#55BA60", score: 20},
            {color: "#EFC354", score: 10},
            {color: "#55BA60", score: 20}
          ]
        }
      };
      chart = new StackedChart(ctx, options);
    });

    describe("constructor", () => {
      it("configures columns", () => {
        expect(chart.columns[0].data[0]).toMatchObject({fillStyle: "rgba(5, 143, 196, 0.25)"});
        expect(chart.columns[1].data[0]).toMatchObject({fillStyle: chart.columns[1].data[0].color});
      });

      it("configures grid", () => {
        expect(chart.grid.axes[0]).toEqual({
          base: {x: 50, y: 9 * chart.grid.options.barHeight},
          name: 1
        });
        expect(chart.grid.axes[9]).toEqual({base: {x: 50, y: 0}, name: 10});
        expect(chart.grid.base).toEqual({bottom: 500, left: 50, right: 820, top: 0});
        expect(chart.grid.options).toMatchObject({
          barHeight: 500 / 10,
          barWidth: 770 / 5,
          lines: 11,
          lineWidth: 1
        });
      });

      it("configures labels", () => {
        expect(chart.labels[0]).toMatchObject({font: "18px Arial"});
        expect(chart.labels[1]).toMatchObject({font: "22px Arial"});
      });

      it("configures line", () => {
        expect(chart.line.data[0]).toMatchObject({fillStyle: "rgba(5, 143, 196, 0.25)"});
        expect(chart.line.data[1]).toMatchObject({fillStyle: chart.line.data[1].color});
      });
    });

    describe("destroy", () => {
      it("reassigns the width", () => {
        const spy = jest.spyOn(ctx.canvas, "width", "set");
        chart.destroy();

        expect(spy).toHaveBeenCalled();
      });

      /* eslint-disable no-param-reassign */
      it("renders doesn't render labels", () => {
        chart.renderColumns = () => {};
        chart.renderGrid = () => {};
        chart.renderLine = () => {};
        chart.render();
        chart.destroy();
        chart.labels.forEach((label) => {
          label.img.height = 400;
          label.img.width = 400;
          label.img.onload();
        });

        expect(ctx.arc).toHaveBeenCalledTimes(0);
        expect(ctx.beginPath).toHaveBeenCalledTimes(0);
        expect(ctx.createLinearGradient).toHaveBeenCalledTimes(0);
        expect(ctx.drawImage).toHaveBeenCalledTimes(0);
        expect(ctx.fill).toHaveBeenCalledTimes(0);
        expect(ctx.fillRect).toHaveBeenCalledTimes(0);
        expect(ctx.fillText).toHaveBeenCalledTimes(0);
        expect(ctx.lineTo).toHaveBeenCalledTimes(0);
        expect(ctx.measureText).toHaveBeenCalledTimes(0);
        expect(ctx.moveTo).toHaveBeenCalledTimes(0);
        expect(ctx.stroke).toHaveBeenCalledTimes(0);
        expect(gradient.addColorStop).toHaveBeenCalledTimes(0);
      });
      /* eslint-enable no-param-reassign */
    });

    describe("render", () => {
      it("renders columns", () => {
        chart.renderGrid = () => {};
        chart.renderLabels = () => {};
        chart.renderLine = () => {};
        chart.render();

        expect(ctx.arc).toHaveBeenCalledTimes(0);
        expect(ctx.beginPath).toHaveBeenCalledTimes(0);
        expect(ctx.createLinearGradient).toHaveBeenCalledTimes(0);
        expect(ctx.drawImage).toHaveBeenCalledTimes(0);
        expect(ctx.fill).toHaveBeenCalledTimes(15);
        expect(ctx.fillRect).toHaveBeenCalledTimes(50);
        expect(ctx.fillText).toHaveBeenCalledTimes(0);
        expect(ctx.lineTo).toHaveBeenCalledTimes(0);
        expect(ctx.measureText).toHaveBeenCalledTimes(0);
        expect(ctx.moveTo).toHaveBeenCalledTimes(0);
        expect(ctx.stroke).toHaveBeenCalledTimes(0);
        expect(gradient.addColorStop).toHaveBeenCalledTimes(0);
      });

      it("renders grid", () => {
        chart.renderColumns = () => {};
        chart.renderLabels = () => {};
        chart.renderLine = () => {};
        chart.render();

        expect(ctx.arc).toHaveBeenCalledTimes(0);
        expect(ctx.beginPath).toHaveBeenCalledTimes(2);
        expect(ctx.createLinearGradient).toHaveBeenCalledTimes(0);
        expect(ctx.drawImage).toHaveBeenCalledTimes(0);
        expect(ctx.fill).toHaveBeenCalledTimes(0);
        expect(ctx.fillRect).toHaveBeenCalledTimes(0);
        expect(ctx.fillText).toHaveBeenCalledTimes(10);
        expect(ctx.lineTo).toHaveBeenCalledTimes(10 + 3);
        expect(ctx.measureText).toHaveBeenCalledTimes(10);
        expect(ctx.moveTo).toHaveBeenCalledTimes(10 + 3);
        expect(ctx.stroke).toHaveBeenCalledTimes(2);
        expect(gradient.addColorStop).toHaveBeenCalledTimes(0);
      });

      /* eslint-disable no-param-reassign */
      it("renders labels", () => {
        chart.renderColumns = () => {};
        chart.renderGrid = () => {};
        chart.renderLine = () => {};
        chart.render();
        chart.labels.forEach((label) => {
          label.img.height = 400;
          label.img.width = 400;
          label.img.onload();
        });

        expect(ctx.arc).toHaveBeenCalledTimes(0);
        expect(ctx.beginPath).toHaveBeenCalledTimes(0);
        expect(ctx.createLinearGradient).toHaveBeenCalledTimes(0);
        expect(ctx.drawImage).toHaveBeenCalledTimes(5);
        expect(ctx.fill).toHaveBeenCalledTimes(0);
        expect(ctx.fillRect).toHaveBeenCalledTimes(0);
        expect(ctx.fillText).toHaveBeenCalledTimes(9);
        expect(ctx.lineTo).toHaveBeenCalledTimes(0);
        expect(ctx.measureText).toHaveBeenCalledTimes(9);
        expect(ctx.moveTo).toHaveBeenCalledTimes(0);
        expect(ctx.stroke).toHaveBeenCalledTimes(0);
        expect(gradient.addColorStop).toHaveBeenCalledTimes(0);
      });
      /* eslint-enable no-param-reassign */

      it("renders line", () => {
        chart.renderColumns = () => {};
        chart.renderGrid = () => {};
        chart.renderLabels = () => {};
        chart.render();

        expect(ctx.arc).toHaveBeenCalledTimes(5);
        expect(ctx.beginPath).toHaveBeenCalledTimes(5 + 4);
        expect(ctx.createLinearGradient).toHaveBeenCalledTimes(4);
        expect(ctx.drawImage).toHaveBeenCalledTimes(0);
        expect(ctx.fill).toHaveBeenCalledTimes(5);
        expect(ctx.fillRect).toHaveBeenCalledTimes(0);
        expect(ctx.fillText).toHaveBeenCalledTimes(0);
        expect(ctx.lineTo).toHaveBeenCalledTimes(4);
        expect(ctx.measureText).toHaveBeenCalledTimes(0);
        expect(ctx.moveTo).toHaveBeenCalledTimes(4);
        expect(ctx.stroke).toHaveBeenCalledTimes(4);
        expect(gradient.addColorStop).toHaveBeenCalledTimes(8);
      });
    });

    describe("resize", () => {
      beforeEach(() => {
        ctx.canvas.parentNode.clientWidth = 1640;

        chart = new StackedChart(ctx, options);
        chart.resize();
      });

      it("updates dimensions", () => {
        expect(chart.ctx.canvas.style.height).toBe("1400px");
        expect(chart.ctx.canvas.style.width).toBe("1640px");
      });
    });
  });
});
