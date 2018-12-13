class Plot {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.horscl = 60
    this.verscl = 60
    this.cam = createVector(- this.horscl, - floor(height/2))
    this.transqueue = createVector(0,0)
    this.x_arr = []
    this.y_arr = []
    this.mousepressed = false
  }

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

  // update() {
  // }

  render() {
    translate(- this.cam.x, - this.cam.y)
    translate(this.transqueue.x, this.transqueue.y)
    this.cam.x = this.cam.x - this.transqueue.x
    this.cam.y = this.cam.y - this.transqueue.y
    this.transqueue.x = 0
    this.transqueue.y = 0

    this.grid()

    this.renderCurve()
  }

  grid() {
    let xx
    if(this.cam.x <= 0) {
      xx = abs(this.cam.x)%this.horscl
    } else {
      xx = this.horscl - this.cam.x%this.horscl
    }
    let xy
    if(this.cam.y <= 0) {
      xy = abs(this.cam.y)%this.verscl
    } else {
      xy = this.verscl - this.cam.y%this.verscl
    }

    let lastX = floor(this.width/this.horscl)
    if(this.width - lastX*this.horscl < xx) {
      lastX = lastX - 1
    }
    let lastY = floor(this.height/this.verscl)
    if(this.height - lastY*this.verscl < xy) {
      lastY = lastY - 1
    }

    stroke(230)
    textAlign(CENTER, CENTER)
    textFont('Calibri')
    fill(0)
    textSize(12)
    for(let i = 0; i < lastX + 1; i++) {
      line(xx + this.cam.x + this.horscl*i, this.cam.y, xx + this.cam.x + this.horscl*i, this.cam.y + this.height)
      if(abs(xx + this.cam.x + this.horscl*i) > 1) {
        push()
        if(this.cam.y > -18) {
          translate(xx + this.cam.x + this.horscl*i, this.cam.y + 20)
        } else if (this.cam.y < -this.height) {
          translate(xx + this.cam.x + this.horscl*i, this.cam.y + this.height)
        } else {
          translate(xx + this.cam.x + this.horscl*i, 0)
        }
        scale(1, -1)
        text(((xx + this.cam.x + this.horscl*i)/this.horscl).toFixed(0), 0, 10)
        pop()
      } 
    }
    for(let i = 0; i < lastY + 1; i++) {
      line(this.cam.x, xy + this.cam.y + this.verscl*i, this.cam.x + this.width, xy + this.cam.y + this.verscl*i)
      push()
      if(this.cam.x > -22) {
        translate(this.cam.x + 22, xy + this.cam.y + this.verscl*i)
      } else if (this.cam.x < -this.width) {
        translate(this.cam.x + this.width, xy + this.cam.y + this.verscl*i)
      } else {
        translate(0, xy + this.cam.y + this.verscl*i)
      }
      scale(1, -1)
      if(abs(xy + this.cam.y + this.verscl*i) > 1) {
        text(((xy + this.cam.y + this.verscl*i)/this.verscl).toFixed(0), -10, 0)
      }
      pop()
    }

    stroke(100)
    if(this.cam.y < 0 && this.cam.y > - this.height) {
      line(this.cam.x, 0, this.cam.x + this.width, 0)
    }
    if(this.cam.x < 0 && this.cam.x > - this.width) {
      line(0, this.cam.y, 0, this.cam.y + this.height)
    }
  }

  renderCurve() {
    noFill()
    strokeWeight(4)
    stroke(color(200, 100, 100))
    let lastOnGrid = false
    let shapeBegun = false
    for(let i = 0; i < this.x_arr.length; i++) {
      if(this.isOnGrid(this.x_arr[i]*this.horscl, this.y_arr[i]*this.verscl) && this.isOnGrid(this.x_arr[i]*this.horscl, this.y_arr[i]*this.verscl) != lastOnGrid) {
        beginShape()
        vertex(this.x_arr[i]*this.horscl, this.y_arr[i]*this.verscl)
        shapeBegun = true
        lastOnGrid = true
      } else if(this.isOnGrid(this.x_arr[i]*this.horscl, this.y_arr[i]*this.verscl) && lastOnGrid) {
        vertex(this.x_arr[i]*this.horscl, this.y_arr[i]*this.verscl)
        lastOnGrid = true
      } else if(!this.isOnGrid(this.x_arr[i]*this.horscl, this.y_arr[i]*this.verscl) && lastOnGrid) {
        vertex(this.x_arr[i]*this.horscl, this.y_arr[i]*this.verscl)
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

  isOnGrid(x, y) {
    if(x > this.cam.x && x < this.cam.x + this.width && y > this.cam.y && y < this.cam.y + this.height) {
      return true
    }
    return false
  }
}