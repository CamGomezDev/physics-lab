let scl = 100, sclp = 60, margin = 8, tot_margin = 2*margin
let cnv, panel, drawingcnv, engine
let rmouseX, rmouseY, px
let running = false

function setup() {
  engine = new Engine()
  cnv = createCanvas(windowWidth - tot_margin, windowHeight - tot_margin)
  centerCanvas()
  panel = new Panel()
  panel.subs()
  drawingcnv = new DrawingCanvas(width - panel.width - margin)
  panel.controlpanel.interactions()
}
var lastLoop = new Date();

//FPS stuff
let lastDate = new Date()
let texti
let i = 0
//there
function draw() {
  push()
  rmouseX = (mouseX + drawingcnv.x)/scl
  rmouseY = (height - mouseY + drawingcnv.y)/scl
  frameRate(engine.fps)
  drawingcnv.update()
  drawingcnv.grid()
  if(engine.running) {
    engine.update()
  }
  engine.render()
  drawingcnv.late()
  pop()
  panel.update()
  panel.render()

  //FPS stuff
  let currentDate = new Date()
  i = i + 1
  if(i%30 == 0) {
    texti = "FPS = " +  (1000/(currentDate - lastDate)).toFixed(2)
  }
  lastDate = currentDate
  fill(color(150,150,0))
  textSize(18)
  text(texti, drawingcnv.width - 120, 20)
  //there
}

function renderCanvas() {
  drawingcnv.grid()
  engine.render()
  drawingcnv.late()
}

// Filler functions
function windowResized() {
  resizeCanvas(windowWidth - tot_margin, windowHeight - tot_margin);
  drawingcnv.width = width - panel.width - margin
  centerCanvas()
  background(255)
  panel.update()
}
function centerCanvas() {
  var x = (windowWidth - width)/2;
  var y = (windowHeight - height)/2;
  cnv.position(x, y);
}