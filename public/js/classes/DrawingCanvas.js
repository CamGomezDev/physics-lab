class DrawingCanvas {
  constructor(widthArg) {
    this.x = - 1*scl
    this.y = - 2*scl
    this.width = widthArg
    this.transqueue = createVector(0,0)
    this.zoom = 1
    this.grid()
    this.late()
    this.zoomin = this.zoomin.bind(this)
    this.zoomout = this.zoomout.bind(this)
    px = 1/scl
  }

  update() {
    scale(1, -1)
    translate(- this.x, - height - this.y)
    translate(this.transqueue.x, this.transqueue.y)
    this.x = this.x - this.transqueue.x
    this.y = this.y - this.transqueue.y
    this.transqueue.x = 0
    this.transqueue.y = 0
  }

  zoomin() {
    scl = 1.2*scl
    px = 1/scl
  }

  zoomout() {
    scl = 0.8*scl
    px = 1/scl
  }

  // render() {
  //   this.grid()
  //   this.drawAxis()
  // }

  pressed() {
    if(this.mouseisover()) {
      this.mousepressed = true
      this.prevmouse = createVector(mouseX, mouseY)
    }
  }

  dragged() {
    if(this.mouseisover() && this.mousepressed) {
      this.transqueue.x = mouseX - this.prevmouse.x
      this.transqueue.y = this.prevmouse.y - mouseY
      this.prevmouse.x = mouseX
      this.prevmouse.y = mouseY
    }
  }

  released() {
    if(this.mousepressed) {
      this.mousepressed = false
    }
  }

  grid() {
    fill(255)
    stroke(255)
    rect(this.x, this.y, this.width, height - 1)
    stroke(200)

    let xx
    if(this.x <= 0) {
      xx = abs(this.x)%scl
    } else {
      xx = scl - this.x%scl
    }
    let xy
    if(this.y <= 0) {
      xy = abs(this.y)%scl
    } else {
      xy = scl - this.y%scl
    }

    let lastx = floor(this.width/scl)
    if(this.width - lastx*scl < xx) {
      lastx = lastx - 1
    }
    let lasty = floor(this.width/scl)
    if(this.width - lasty*scl < xy) {
      lasty = lasty - 1
    }

    for(let i = 0; i < lastx + 1; i++) {
      line(xx + this.x + scl*i, this.y, xx + this.x + scl*i, this.y + height)
    }
    for(let i = 0; i < lasty + 1; i++) {
      line(this.x, xy + this.y + scl*i, this.x + this.width, xy + this.y + scl*i)
    }
  }

  frame() {
    fill(color(255,255,255,0))
    stroke(0)
    rect(this.x, this.y, this.width, height - 1)
  }

  drawAxis() {
    stroke(0)
    line(-scl, 0, scl, 0)
    line(0, -scl, 0, scl)
  }

  late() {
    this.frame()
    this.drawAxis()
  }

  mouseisover() {
    if(mouseX > 0 && mouseX < this.width && mouseY > 0 && mouseY < height) {
      return true
    }
    return false
  }
}