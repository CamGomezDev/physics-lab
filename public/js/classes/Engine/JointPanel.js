class JointPanel {
  placeGravity() {
    engine.env_interacts.push({vector: createVector(0, -9.8)})
    this.gravity = engine.env_interacts[engine.env_interacts.length - 1]
  }

  removeGravity() {
    engine.env_interacts.splice(engine.env_interacts.indexOf(this.gravity), 1)
  }

  placeFloor() {
    engine.still_objects.push(new Floor(engine.still_objects.length))
    this.floor = engine.still_objects[engine.still_objects.length - 1]
  }

  removeFloor() {
    engine.still_objects[engine.still_objects.indexOf(this.floor)].remove()
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