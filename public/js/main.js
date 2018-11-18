// Init GUI Components
let canvasDiv = document.getElementById("canvas")
let panelDiv  = document.getElementById("panel")

let scl = 100, sclp = 60, margin = 8, tot_margin = 2*margin
let cnv, panel, drawingcnv, engine
let rmouseX, rmouseY, px
let running = false

function setup() {
  engine = new Engine()
  panel = new Panel()
  setFillerCanvas()
  cnv = createCanvas(windowWidth - panel.width - margin*3, windowHeight - tot_margin)
  centerCanvas()
  drawingcnv = new DrawingCanvas(width)
  drawingcnv.update()
  drawingcnv.grid()
}

let i = 0
let fpsText
function draw() {
  background(255)
  push()
  rmouseX = (mouseX + drawingcnv.x)/scl
  rmouseY = (height - mouseY + drawingcnv.y)/scl
  frameRate(engine.fps)
  drawingcnv.update()
  if(engine.running) {
    engine.update()
  }
  engine.renderObjects()
  drawingcnv.grid()
  drawingcnv.drawAxis()
  pop()
  engine.renderGraphs()
  drawingcnv.frame()
  panel.update()
  //FPS stuff
  i = i + 1
  if(i%20 == 0) {
    fpsText = "FPS = " + frameRate().toFixed(2)
  }
  textAlign(LEFT, LEFT)
  fill(color(150,150,0))
  textSize(18)
  text(fpsText, drawingcnv.width - 100, 20)
  //there
}

// function renderCanvas() {
//   drawingcnv.grid()
//   engine.renderObjects()
//   drawingcnv.late()
// }


function windowResized() {
  setFillerCanvas()
  resizeCanvas(windowWidth - panel.width - margin*3, windowHeight - tot_margin);
  drawingcnv.width = width
  centerCanvas()
  background(255)
  // panel.update()
}

function setFillerCanvas() {
  canvasDiv.width = windowWidth - panel.width - margin*3;
  canvasDiv.height = windowHeight - tot_margin;
  panelDiv.setAttribute("style", "height:" + canvasDiv.height + "px");
  canvasDiv.setAttribute("style", "background:blue")
}

function centerCanvas() {
  let x = floor((windowWidth - panel.width - margin - width)/2)
  let y = floor((windowHeight - height)/2)
  cnv.position(x, y)
}