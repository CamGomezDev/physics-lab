function mouseClicked() {
  engine.clicked()
  panel.clicked()
}

function mousePressed() {
  drawingcnv.pressed()
  panel.graphpanel.pressed()
}
 
function mouseDragged() {
  drawingcnv.dragged()
  panel.graphpanel.dragged()
}

function mouseReleased() {
  drawingcnv.released()
  panel.graphpanel.released()
}