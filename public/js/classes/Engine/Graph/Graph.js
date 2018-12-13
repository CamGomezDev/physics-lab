class Graph {
  constructor() {
    this.id = uuidv4()
    this.located = false
    this.side = 300
    this.isgraph = true
    this.mousepressed = false
    this.innerDragged = false
    this.outerDragged = false
    this.horElement = {set: false}
    this.verElement = {set: false}
    this.plotSet = false
    this.plot = new Plot(this.side - 30 - 2, this.side - 30 - 2)
  }

  setParamsForPlot(axis, id, param) {
    if(axis == 1) {
      if(id == "0000") {
        this.horElement.id = id
        this.horElement.name = "World"
        this.horElement.paramName = "Time"
      } else {
        let i = -1
        engine.dyn_objects.forEach(element => {
          i = i + 1
          if(element.id == id) {
            this.horElement.name = "Point Mass " + element.place
            let a; if(param==0){a="X Position"}else if(param==1){a="Y Position"}else if(param==2){a="X velocity"}else if(param==3){a="Y velocity"}else if(param==4){a="X acceleration"}else if(param==5){a="Y acceleration"}
            this.horElement.paramName = a
            this.horElement.index = i
            this.horElement.param = param
          }
        })
      }
      this.horElement.set = true
    }

    if(axis == 2) {
      if(id == "0000") {
        this.verElement.id = id
        this.verElement.name = "World"
        this.verElement.paramName = "Time"
      } else {
        let i = -1
        engine.dyn_objects.forEach(element => {
          i = i + 1
          if(element.id == id) {
            this.verElement.name = "Point Mass " + element.place
            let a; if(param==0){a="X Position"}else if(param==1){a="Y Position"}else if(param==2){a="X velocity"}else if(param==3){a="Y velocity"}else if(param==4){a="X acceleration"}else if(param==5){a="Y acceleration"}
            this.verElement.paramName = a
            this.verElement.index = i
            this.verElement.param = param
          }
        })
      }
      this.verElement.set = true
    }

    if(this.verElement.set && this.horElement.set) {
      this.plotSet = true
    }
  }

  update() {
    // Sadly had to do this logic here for lack of pointers in JS
    // Otherwise would have been done in the setParamsForPlot method
    // for performance
    if(this.plotSet) {
      if(this.horElement.id == "0000") {
        this.plot.x_arr.push(engine.time)
      } else {
        switch(this.horElement.param) {
          case 0:
            this.plot.x_arr.push(engine.dyn_objects[this.horElement.index].pos.x)
            break;
          case 1:
            this.plot.x_arr.push(engine.dyn_objects[this.horElement.index].pos.y)
            break;
          case 2:
            this.plot.x_arr.push(engine.dyn_objects[this.horElement.index].vel.x)
            break;
          case 3:
            this.plot.x_arr.push(engine.dyn_objects[this.horElement.index].vel.y)
            break;
          case 4:
            this.plot.x_arr.push(engine.dyn_objects[this.horElement.index].acc.x)
            break;
          case 5:
            this.plot.x_arr.push(engine.dyn_objects[this.horElement.index].acc.y)
            break;
          default:
            break;
        }
      }

      if(this.verElement.id == "0000") {
        this.plot.y_arr.push(engine.time)
      } else {
        switch(this.verElement.param) {
          case 0:
            this.plot.y_arr.push(engine.dyn_objects[this.verElement.index].pos.x)
            break;
          case 1:
            this.plot.y_arr.push(engine.dyn_objects[this.verElement.index].pos.y)
            break;
          case 2:
            this.plot.y_arr.push(engine.dyn_objects[this.verElement.index].vel.x)
            break;
          case 3:
            this.plot.y_arr.push(engine.dyn_objects[this.verElement.index].vel.y)
            break;
          case 4:
            this.plot.y_arr.push(engine.dyn_objects[this.verElement.index].acc.x)
            break;
          case 5:
            this.plot.y_arr.push(engine.dyn_objects[this.verElement.index].acc.y)
            break;
          default:
            break;
        }
      }

      this.plot.cam.x = this.plot.x_arr[this.plot.x_arr.length - 1]*this.plot.horscl - this.plot.width/2
      this.plot.cam.y = this.plot.y_arr[this.plot.y_arr.length - 1]*this.plot.verscl - this.plot.height/2
    }
  }
  
  render() {
    rectMode(CENTER)
    if(this.mouseisover() && !this.mouseoverinner()) {
      stroke(color(100,100,255))
      rect(this.x, this.y, this.side + 2, this.side + 2)
    }
    fill(255)
    stroke(0)
    rect(this.x, this.y, this.side, this.side)
    if(this.mouseoverinner()) {
      stroke(color(255,100,100))
      rect(this.x, this.y, this.side - 30 + 2, this.side - 30 + 2)
    }
    rect(this.x, this.y, this.side - 30, this.side - 30)
    rectMode(CORNER)
    push()
    translate(this.x - (this.side - 30)/2 + 1, this.y + (this.side - 30)/2)
    scale(1, -1)
    this.plot.render()
    pop()
  }

  locate() {
    this.x = mouseX
    this.y = mouseY
    this.located = true
  }

  pressed() {
    if(this.outerDragged) {
      this.prevmouse = createVector(mouseX, mouseY)
    } else {
      this.plot.pressed()
    }
  }

  dragged() {
    if(this.outerDragged) {
      let mouseMove = createVector(mouseX - this.prevmouse.x, mouseY - this.prevmouse.y)
      //already checked mouseisover in mouse.js
      this.x = this.x + mouseMove.x
      this.y = this.y + mouseMove.y
      this.prevmouse = createVector(mouseX, mouseY)
    } else {
      this.plot.dragged()
    }
  }

  released() {
    this.plot.released()
    this.outerDragged = false
    this.innerDragged = false
  }

  openControl() {
    panel.openControl(this.id)
  }

  mouseisover() {
    if(mouseX > this.x - this.side/2 && mouseX < this.x + this.side/2 && mouseY > this.y - this.side/2 && mouseY < this.y + this.side/2) {
      return true
    }
    return false
  }

  mouseoverinner() {
    if(mouseX > this.x - (this.side - 30)/2 && mouseX < this.x + (this.side - 30)/2 && mouseY > this.y - (this.side - 30)/2 && mouseY < this.y + (this.side - 30)/2) {
      return true
    }
    return false
  }

  remove() {
    if(this.located) {
      engine.graphs.splice(engine.graphs.indexOf(this), 1)
    }
    engine.dyn_objects_dis.splice(engine.dyn_objects_dis.indexOf(this), 1)
  }
}