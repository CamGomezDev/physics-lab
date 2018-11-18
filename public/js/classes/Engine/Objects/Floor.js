class Floor {
  constructor() {
    this.y = 0
    this.render()
  }

  render() {
    stroke(100)
    fill(200)
    rect(drawingcnv.x, drawingcnv.y, drawingcnv.width, this.y - drawingcnv.y)
  }

  mouseisover() {
    return false
  }

  remove() {
    engine.still_objects.splice(engine.still_objects.indexOf(this), 1)
  }
}