class GraphPanel {
  constructor(x, widthArg) {
    this.width = widthArg - 2
    this.height = height - panel.controlpanel.height - margin - 2
    this.x = x
    this.y = 0
    this.transqueue = createVector(0,0)
  }

  plot() {
    this.plt = new Plot()
  }

  update(x) {
    this.x = x
    this.height = height - panel.controlpanel.height - margin - 2
    this.plt.update()
  }

  render() {
    push()
    translate(this.x, this.y)
    stroke(0)

    push()
    scale(1, -1)
    translate(- this.plt.x, - this.height - this.plt.y)
    translate(this.transqueue.x, this.transqueue.y)
    this.plt.x = this.plt.x - this.transqueue.x
    this.plt.y = this.plt.y - this.transqueue.y
    this.transqueue.x = 0
    this.transqueue.y = 0

    this.grid()
    this.plt.render()
    this.plt.drawAxis()
    pop()

    stroke(0)
    fill(color(255,255,255,0))
    rect(0, 0, this.width, this.height)
    pop()
  }

  grid() {
    fill(255)
    stroke(255)
    rect(this.plt.x + 1, this.plt.y, this.width - 2, this.height - 2)
    
    stroke(230)
    let xx
    if(this.plt.x <= 0) {
      xx = abs(this.plt.x)%sclp
    } else {
      xx = sclp - this.plt.x%sclp
    }
    let xy
    if(this.plt.y <= 0) {
      xy = abs(this.plt.y)%sclp
    } else {
      xy = sclp - this.plt.y%sclp
    }

    let lastx = floor(this.width/sclp)
    if(this.width - lastx*sclp < xx) {
      lastx = lastx - 1
    }
    let lasty = floor(this.width/sclp)
    if(this.width - lasty*sclp < xy) {
      lasty = lasty - 1
    }

    for(let i = 0; i < lastx + 1; i++) {
      line(xx + this.plt.x + sclp*i, this.plt.y, xx + this.plt.x + sclp*i, this.plt.y + this.height - 2)
    }
    for(let i = 0; i < lasty + 1; i++) {
      line(this.plt.x, xy + this.plt.y + sclp*i, this.plt.x + this.width, xy + this.plt.y + sclp*i)
    }
  }

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

  mouseisover() {
    if(mouseX > this.x && mouseX < this.x + this.width && mouseY > 0 && mouseY < this.height) {
      return true
    }
    return false
  }
}