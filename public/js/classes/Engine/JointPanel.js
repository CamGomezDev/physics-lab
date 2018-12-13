class JointPanel {
  placeGravity() {
    engine.still_objects_dis.push({vector: createVector(0, -9.8), isgravity: true, id: uuidv4()})
    this.gravity = engine.still_objects_dis[engine.still_objects_dis.length - 1]
    engine.orderObjects()
    panel.indexPanel.updateHighlight()
    panel.openControl(this.gravity.id)
  }

  removeGravity() {
    engine.still_objects_dis.splice(engine.still_objects_dis.indexOf(this.gravity), 1)
    engine.orderObjects()
    panel.indexPanel.updateHighlight()
  }

  placeFloor() {
    engine.still_objects_dis.push(new Floor())
    this.floor = engine.still_objects_dis[engine.still_objects_dis.length - 1]
    engine.orderObjects()
    panel.indexPanel.updateHighlight()
    panel.openControl(this.floor.id)
  }

  removeFloor() {
    engine.still_objects_dis.splice(engine.still_objects_dis.indexOf(this.floor), 1)
    engine.orderObjects()
    panel.indexPanel.updateHighlight()
  }

  createPointMass() {
    engine.dyn_objects_dis.push(new PointMass())
    engine.objectonhold = true
    engine.justAdded = true
  }

  createSpring() {
    engine.dyn_objects_dis.push(new Spring())
    engine.objectonhold = true
    engine.justAdded = true
  }

  createIncline() {
    engine.dyn_objects_dis.push(new Incline())
    engine.objectonhold = true
    engine.justAdded = true
  }

  createGraph() {
    engine.dyn_objects_dis.push(new Graph())
    engine.objectonhold = true
    engine.justAdded = true
  }
}