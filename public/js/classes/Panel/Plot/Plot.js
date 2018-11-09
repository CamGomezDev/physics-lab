class Plot {
  constructor() {
    this.x = - sclp
    this.y = - floor(panel.graphpanel.height/2)
    this.x_arr = []
    this.y_arr = []
  }

  update() {
    if(engine.lastPointMass != -1 && engine.running) {
      this.x_arr.push(engine.time)
      this.y_arr.push(engine.dyn_objects[engine.lastPointMass].pos.x)
    }
  }

  render() {
    noFill()
    strokeWeight(4)
    stroke(color(200, 100, 100))
    let lastOnGrid = false
    let shapeBegun = false
    for(let i = 0; i < this.x_arr.length; i++) {
      if(this.isOnGrid(this.x_arr[i]*sclp, this.y_arr[i]*sclp) && this.isOnGrid(this.x_arr[i]*sclp, this.y_arr[i]*sclp) != lastOnGrid) {
        beginShape()
        vertex(this.x_arr[i]*sclp, this.y_arr[i]*sclp)
        shapeBegun = true
        lastOnGrid = true
      } else if(this.isOnGrid(this.x_arr[i]*sclp, this.y_arr[i]*sclp) && lastOnGrid) {
        vertex(this.x_arr[i]*sclp, this.y_arr[i]*sclp)
        lastOnGrid = true
      } else if(!this.isOnGrid(this.x_arr[i]*sclp, this.y_arr[i]*sclp) && lastOnGrid) {
        vertex(this.x_arr[i]*sclp, this.y_arr[i]*sclp)
        endShape()
        lastOnGrid = false
        shapeBegun = false
      } else {
        lastOnGrid = false
      }
    }
    if(shapeBegun) {
      endShape()
    }
  }

  drawAxis() {
    if(this.isOnGrid(0,0)) {
      stroke(0)
      strokeWeight(1)
      line(-sclp, 0, sclp, 0)
      line(0, -sclp, 0, sclp)
    }
  }

  isOnGrid(x, y) {
    if(x > this.x && x < this.x + panel.graphpanel.width && y > this.y && y < this.y + panel.graphpanel.height) {
      return true
    }
    return false
  }
}