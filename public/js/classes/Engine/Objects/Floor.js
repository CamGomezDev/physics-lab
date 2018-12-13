class Floor {
  constructor() {
    this.id = uuidv4()
    this.y = 0
    this.isfloor = true
    this.frictionOn = true
    this.statcoeff = 0
    this.kincoeff = 0
  }

  render() {
    stroke(100)
    fill(200)
    rect(drawingcnv.x, drawingcnv.y, width, this.y - drawingcnv.y)
  }

  mouseisover() {
    return false
  }
}