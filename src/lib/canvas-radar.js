import { h, Component } from "preact";

export default class NewRadar extends Component {
  constructor(context, data, config){
    super();
    this.context = context
    this.data = data
    this.config = config

    // Bind Methods
    // this.defaultFor = this.defaultFor.bind(this)
    // Graph Structure Method
    this.drawRadarGraph = this.drawRadarGraph.bind(this)
    this.drawGraphStructure = this.drawGraphStructure.bind(this)
    this.drawPolygon = this.drawPolygon.bind(this)

    // Data Method
    this.renderData = this.renderData.bind(this)
    this.renderDataPoints = this.renderDataPoints.bind(this)
    this.loadIcon = this.loadIcon.bind(this)
    this.renderDataLabel = this.renderDataLabel.bind(this)
    this.renderDataName = this.renderDataName.bind(this)
    this.renderDataImage = this.renderDataImage.bind(this)

    this.resize = this.resize.bind(this)
    this.wordWrap = this.wordWrap.bind(this)

    // TODO: Remove later
    this.tempReformatData = this.tempReformatData.bind(this)

    // Variables for graphing
    // this.canvasWidth = this.context.canvas.clientWidth
    // this.canvasHeight = this.context.canvas.clientHeight
    this.canvasWidth = this.context.canvas.width
    this.canvasHeight = this.context.canvas.height
    this.xCenter = this.canvasWidth / 2;
    this.yCenter = this.canvasHeight / 2;
    if (this.canvasWidth > this.canvasHeight) {
      this.radius = this.canvasHeight / 3.1;
    }else{
      this.radius = this.canvasWidth / 3.1;
    }

    // Variables for context
    this.graphStrokeStyle = "#555555"
    this.graphLineWidth = .5

    // Variables for config
    // TODO: Make this a config option instead of from the data object
    this.dataColor = this.data.datasets[0].borderColor;
    this.dataLineWidth = 4;
    this.dataPointRadius = 5;

    this.fillData = false;
    this.dataFillStyleColor = "rgba(255,0,0,.3)";
    this.labelTextColor = "#222222"

    this.labelFont = "22px Arial";

    this.drawInnerLines = true
    this.numberInnerLines = 1

    this.numberOfValues = this.data.datasets[0].data.length
    this.maxValue = 10

    // TODO: Remove or replace for a better fallback?
    // this.placeHolderImage = "http://placehold.it/50x50";

    // TODO: Remove this later and just change data
    this.tempReformatData()

    this.drawRadarGraph()
  }
  // Graph min and max (Default to 0 and max data value)
  // Graph color
  // Draw Inner lines
  // How many inner lines? (default 3)
  // Inner line labels (true or false? Default false)
  // accept data style (color, thickness, fill or not)
  // Each data element should have value, image, label. Image or label optional
  // defaultFor(arg, val) { return typeof arg !== 'undefined' ? arg : val; }

  // TODO: Remove this and pass in data correctly initially
  tempReformatData() {
    console.log(this.data)
    let dataLabels = this.data.labels;
    let dataValues = this.data.datasets[0].data;
    let formattedData = []

    for (var i = 0; i < dataLabels.length; i++) {
      var name = dataLabels[i].text
      var image = dataLabels[i].image
      var value = dataValues[i]
      formattedData.push({name: name, image: image, value: value})
    }

    this.formattedData = formattedData
  }

  //TODO: Make more robust
  resize() {
    var canvas = this.context.canvas;
    var container = canvas.parentNode;
    var newWidth = container.clientWidth
    this.context.canvas.style.width = newWidth + "px"
    this.context.canvas.style.height = newWidth + "px"
  }

  drawRadarGraph() {
    this.drawGraphStructure()
    this.renderData()
  }

  drawGraphStructure() {
    for (var i = 0; i <= this.numberInnerLines; i++){
      this.drawPolygon(this.radius * (i/(this.numberInnerLines+1)))
    }
    this.drawPolygon(this.radius, true)
  }

  drawPolygon(radius, outerMost = false) {
    let ctx = this.context
    let xCenter = this.xCenter
    let yCenter = this.yCenter
    let sides = this.numberOfValues
    let drawInnerLines = this.drawInnerLines

    ctx.strokeStyle = this.graphStrokeStyle
      ctx.lineWidth = this.graphLineWidth
    ctx.beginPath();

    for (var i = 0; i <= sides; i++) {
      let angle = (2 * Math.PI * i / sides) + 1/2 * Math.PI;

      let x = this.xCenter + radius * -Math.cos(angle);
      let y = this.yCenter + radius * -Math.sin(angle);

      ctx.lineTo(x, y);
      if (drawInnerLines && outerMost && i != 0) {
        ctx.lineTo(xCenter,yCenter);
        ctx.moveTo(x, y);
      }
    }

    ctx.closePath();
    ctx.stroke();
  }

  renderData() {
    let data = this.formattedData
    console.log(data)

    let ctx = this.context
    let dataColor = this.dataColor
    ctx.strokeStyle = dataColor;
    ctx.lineWidth = this.dataLineWidth
    ctx.beginPath();

    let sides = data.length
    let dataPoints = [];
    let radius = this.radius
    let xCenter = this.xCenter
    let yCenter = this.yCenter
    let maxValue = this.maxValue

    for (var i = 0; i < sides; i++) {
      let angle = (2 * Math.PI * i / sides) + 1/2 * Math.PI;

      let value = radius * data[i].value / maxValue

      let x = xCenter + value * -Math.cos(angle);
      let y = yCenter + value * -Math.sin(angle);

      dataPoints.push({x: x, y: y, name: data[i].name})

      ctx.lineTo(x, y);

      this.renderDataLabel(data[i].name, data[i].image, angle);
    }
    ctx.closePath();
    ctx.fillStyle = this.dataFillStyleColor;
    if (this.fillData) {
      ctx.fill()
    }
    ctx.stroke();

    this.renderDataPoints(dataPoints);
  }

  // FINISHED
  renderDataPoints(dataPoints) {
    let ctx = this.context
    ctx.fillStyle = this.dataColor

    let radius = this.dataPointRadius

    dataPoints.map(function(dataPoint){
      let x = dataPoint.x
      let y = dataPoint.y
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
      ctx.closePath()
      ctx.fill()
    })
  }

  checkDataPointCollision = function(e) {
    document.removeEventListener('mousemove', checkDataPointCollision, false);
    x = e.layerX
    y = e.layerY

    dataPoints.map(function(dataPoint) {
      dx = x - dataPoint.x
      dy = y - dataPoint.y
      if ((dx*dx+dy*dy) <= 9){
        console.log("Inside")
        console.log(dataPoint.name)
      }
    })
  }

  // Axis Image Rendering Functions
  renderDataLabel(name, image, angle) {
    this.renderDataImage(name, image, angle)
  }
  renderDataName(name, x, y) {
    let ctx = this.context
    ctx.font = this.labelFont
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.fillStyle = this.labelTextColor

    // TODO: This is hardcoded to check if the text is near the edges
    // and cause a word wrap if so
    if ((x < 62 || x > 638) ){
      var lines = this.wordWrap(name)
      for (var i = 0; i < lines.length; i++){
        ctx.fillText(lines[i], x, y + (i * 22))
      }
    } else {
      ctx.fillText(name, x, y)
    }
  }
  renderDataImage(name, image, angle) {
    let me = this
    this.loadIcon(image, function() {
      let ctx = me.context
      let img = new Image;
      img.src = image
      var xCenter = me.xCenter
      var yCenter = me.yCenter
      var radius = me.radius
      var img_w = img.width
      var img_h = img.height
      var img_diagonal = Math.sqrt((Math.pow(img_w, 2) + Math.pow(img_h, 2)))

      // TODO: Fix this ratio
      let x = (xCenter - img_w / 2) + (radius + (img_diagonal / 2) * 1.10) * -Math.cos(angle);
      let y = (yCenter - img_h / 2) + (radius + (img_diagonal / 2) * 1.10) * -Math.sin(angle);
      ctx.drawImage(img, x, y)

      // TODO: Remove enscribing of icons
      // ctx.beginPath()
      // ctx.arc(x + img_w / 2, y + img_h / 2, img_diagonal/2, 0, 2*Math.PI, false)
      // ctx.closePath()
      // ctx.stroke()

      // TODO: Remove enscribing of icon
      // ctx.beginPath()
      // ctx.lineTo(x, y)
      // ctx.lineTo(x + img_w, y)
      // ctx.lineTo(x + img_w, y + img_h)
      // ctx.lineTo(x, y + img_h)
      // ctx.closePath()
      // ctx.stroke()

      x = x + img_w / 2
      y = y + img_h
      me.renderDataName(name, x, y)
    })
  }
  loadIcon(src, callback) {
    var sprite = new Image();
    sprite.onload = callback;
    sprite.src = src;
  }
  wordWrap(text) {
    var words = text.split(" ");
    var lines = []
    var currentLine = words[0]

    for (var i = 1; i < words.length; i++) {
      var word = words[i];

      lines.push(currentLine)
      currentLine = word;
    }

    lines.push(currentLine)
    return lines;

  }
}
//============================================
//============================================
//============================================
//============================================
//============================================
//==================================


  // console.log("Angle")
  // console.log(angle)
  // degrees0 = 0
  // degrees90 = 1/2 * Math.PI
  // degrees180 = Math.PI
  // degrees270 = 3/2 * Math.PI
  // degrees360 = 2 * Math.PI
  // angle = angle / (2 * Math.PI)
  //
  // console.log(angle)
  // console.log(degrees90)
  // console.log(degrees180)
  // console.log(degrees270)
  // console.log(degrees360)
  //
  // switch(angle){
  //   case (angle > degrees0 && angle < degrees90):
  //     console.log("1st Quadrant")
  //     break;
  //   case (angle == degrees90):
  //     console.log("90 Degrees")
  //     break;
  //   case (angle > degrees90 && angle < degrees180):
  //     console.log("2nd Quadrant")
  //     break;
  //   case (angle == degrees180):
  //     console.log("180 Degrees")
  //     break;
  //   case angle > Math.PI && angle < 3/2 * Math.PI:
  //     console.log("Third Quadrant")
  //     break;
  //   case angle == degrees270:
  //     console.log("270 Degrees")
  //     break;
  //   case angle > 3/2 * Math.PI && angle < 2 * Math.PI:
  //     console.log("Fourth Quadrant")
  //     break;
  //   case angle == degrees360:
  //     console.log("360 Degrees")
  //     break;
  //   default:
  //     console.log("Unknown Quadrant")
  //     break;
  // }
  // console.log(image.width)
  // console.log(angle)
