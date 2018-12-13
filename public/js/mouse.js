function mouseClicked() {
  engine.clicked()
}

let movingGraph = false
let draggingMassVel = false
let graphIndex = 0
let massIndex = 0
function mousePressed() {
  //Most of this is logic for moving the graph
  if(drawingcnv.mouseisover()) {
    // Moving graph
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
    // Dragging velocity arrows
    if(!movingGraph) {
      engine.dyn_objects.forEach(element => {
        if(element.ispointmass) {
          if(element.isOnVelSelector()) {
            massIndex = engine.dyn_objects.findIndex(thing => thing == element)
            draggingMassVel = true
          }
        }
      })
    }
    // Moving canvas
    if(!movingGraph && !draggingMassVel) {
      drawingcnv.pressed()      
    }
  }
}
 
function mouseDragged() {
  if(drawingcnv.mouseisover()) {
    if(movingGraph) {
      engine.graphs[graphIndex].dragged()
    } 
    if(!movingGraph && draggingMassVel) {
      engine.dyn_objects[massIndex].dragVelSelector()
    }
    if(!movingGraph && !draggingMassVel) {
      drawingcnv.dragged()
    }
  }
}

function mouseReleased() {
  if(movingGraph) {
    movingGraph = false
    engine.graphs[graphIndex].released()
  } else if(draggingMassVel) {
    draggingMassVel = false
    engine.dyn_objects[massIndex].releasedVelSelector()
  }
  drawingcnv.released()
}