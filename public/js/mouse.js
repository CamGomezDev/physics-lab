function mouseClicked() {
  engine.clicked()
}

let movingGraph = false
let graphIndex = 0
function mousePressed() {
  //Most of this is logic for moving the graph
  if(drawingcnv.mouseisover()) {
    engine.graphs.forEach(element => {
      if(element.mouseisover()) {
        graphIndex = engine.graphs.findIndex(thing => thing == element)
        if(!element.mouseoverinner()) {
          element.outerDragged = true
          element.innerDragged = false
        } else {
          element.outerDragged = false
          element.innerDragged = true
        }
        element.pressed()
        movingGraph = true
      }
    })
    //Until here
    if(!movingGraph) {
      drawingcnv.pressed()
      
    }
  }
}
 
function mouseDragged() {
  if(drawingcnv.mouseisover()) {
    if(movingGraph) {
      engine.graphs[graphIndex].dragged()
    } else {
      drawingcnv.dragged()
    }
  }
}

function mouseReleased() {
  if(movingGraph) {
    movingGraph = false
    engine.graphs[graphIndex].released()
  }
  drawingcnv.released()
}