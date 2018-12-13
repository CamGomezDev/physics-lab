class DrawingCanvas {
  constructor() {
    this.x = - 1*scl
    this.y = - 2*scl
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
    let center = createVector((this.x + width/2)/scl, (this.y + height/2)/scl)
    scl = 1.2*scl
    px = 1/scl
    this.x = (center.x*scl - width/2)
    this.y = (center.y*scl - height/2)
  }

  zoomout() {
    let center = createVector((this.x + width/2)/scl, (this.y + height/2)/scl)
    scl = 0.8*scl
    px = 1/scl
    this.x = (center.x*scl - width/2)
    this.y = (center.y*scl - height/2)
  }

  // render() {
  //   this.grid()
  //   this.drawAxis()
  // }

  pressed() {
    this.mousepressed = true
    this.prevmouse = createVector(mouseX, mouseY)
  }

  dragged() {
    if(this.mousepressed) {
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

    let lastx = floor(width/scl)
    if(width - lastx*scl < xx) {
      lastx = lastx - 1
    }
    let lasty = floor(height/scl)
    if(height - lasty*scl < xy) {
      lasty = lasty - 1
    }

    textAlign(CENTER, CENTER)
    textFont('Calibri')
    fill(0)
    textSize(16)
    for(let i = 0; i < lastx + 1; i++) {
      line(xx + this.x + scl*i, this.y, xx + this.x + scl*i, this.y + height)
      if(abs(xx + this.x + scl*i) > 1) {
        push()
        if(this.y > -18) {
          translate(xx + this.x + scl*i, this.y + 20)
        } else if (this.y < -height) {
          translate(xx + this.x + scl*i, this.y + height)
        } else {
          translate(xx + this.x + scl*i, 0)
        }
        scale(1, -1)
        text(((xx + this.x + scl*i)/scl).toFixed(0), 0, 10)
        pop()
      }
    }
    for(let i = 0; i < lasty + 1; i++) {
      line(this.x, xy + this.y + scl*i, this.x + width, xy + this.y + scl*i)
      push()
      if(this.x > -22) {
        translate(this.x + 22, xy + this.y + scl*i)
      } else if (this.x < -width) {
        translate(this.x + width, xy + this.y + scl*i)
      } else {
        translate(0, xy + this.y + scl*i)
      }
      scale(1, -1)
      if(abs(xy + this.y + scl*i) > 1) {
        text(((xy + this.y + scl*i)/scl).toFixed(0), -10, 0)
      }
      pop()
    }
  }

  frame() {
    fill(color(255,255,255,0))
    stroke(0)
    rect(0, 0, width - 1, height - 1)
  }

  drawAxis() {
    stroke(0)
    line(this.x, 0, this.x + width, 0)
    line(0, this.y, 0, this.y + height)
  }

  late() {
    this.drawAxis()
    this.frame()
  }

  mouseisover() {
    if(mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
      return true
    }
    return false
  }
}