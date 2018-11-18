class Engine {
  constructor() {
    this.unit     = 20 //pixels per unit (unit may be meter, cm, etc)
    this.fps      = 60
    this.timestep = 0
    this.time     = 0
    this.objectonhold  = false
    this.env_interacts     = []
    this.dyn_objects_dis   = []
    this.still_objects_dis = []
    this.dyn_objects       = []
    this.still_objects     = []
    this.graphs            = []
    this.running = false
    this.jointpanel = new JointPanel()
    this.lastPointMass = -1
    this.justAdded = false
  }

  run() {
    this.running = true
    this.timestep = 1/this.fps
  }

  stop() {
    this.running = false
  }

  update() {
    this.time = this.time + this.timestep
    this.dyn_objects.forEach(element => {
      element.update()
    })
    this.graphs.forEach(element => {
      element.update()
    })
  }

  renderObjects() {
    this.still_objects.forEach(element => {
      element.render()
    })
    this.dyn_objects.forEach(element => {
      element.render()
    })
  }
  
  renderGraphs() {
    this.graphs.forEach(element => {
      element.render()
    })
  }

  clicked() {
    if(drawingcnv.mouseisover()) {
      if(this.objectonhold) {
        this.dyn_objects_dis[this.dyn_objects_dis.length - 1].locate()
        if(this.dyn_objects_dis[this.dyn_objects_dis.length - 1].located) {
          this.orderObjects()
          this.objectonhold = false
          this.dyn_objects_dis[this.dyn_objects_dis.length - 1].openControl()
        }
      } else {
        this.dyn_objects.forEach(element => {
          if(element.mouseisover()) {
            element.openControl()
          }
        })
        this.graphs.forEach(element => {
          if(element.mouseisover()) {
            element.openControl()
          }
        })
      }
    } else {
      if(this.objectonhold && !this.justAdded) {
        this.dyn_objects_dis[this.dyn_objects_dis.length - 1].remove()
        this.objectonhold = false
      }
    }
    this.justAdded = false
  }

  orderObjects() {
    this.dyn_objects = []
    this.graphs = []
    this.lastPointMass = -1
    this.dyn_objects_dis.forEach(element => {
      if(!element.located) {
        element.remove()
      }
      if(element.isgraph) {
        this.graphs.push(element)
      }
    })
    this.dyn_objects_dis.forEach(element => {
      if(element.ispointmass) {
        this.dyn_objects.push(element)
        this.lastPointMass = this.lastPointMass + 1
        element.place = this.lastPointMass + 1
      }
    })
    this.dyn_objects_dis.forEach(element => {
      if(element.isspring) {
        this.dyn_objects.push(element)
      }
    })
    this.dyn_objects_dis.forEach(element => {
      if(element.isincline) {
        this.dyn_objects.push(element)
      }
    })
  }
}
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

      this.plot.cam.x = this.plot.x_arr[this.plot.x_arr.length - 1]*sclp - this.plot.width/2
      this.plot.cam.y = this.plot.y_arr[this.plot.y_arr.length - 1]*sclp - this.plot.height/2
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
}
class Plot {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.cam = createVector(- sclp, - floor(height/2))
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
      xx = abs(this.cam.x)%sclp
    } else {
      xx = sclp - this.cam.x%sclp
    }
    let xy
    if(this.cam.y <= 0) {
      xy = abs(this.cam.y)%sclp
    } else {
      xy = sclp - this.cam.y%sclp
    }

    let lastX = floor(this.width/sclp)
    if(this.width - lastX*sclp < xx) {
      lastX = lastX - 1
    }
    let lastY = floor(this.height/sclp)
    if(this.height - lastY*sclp < xy) {
      lastY = lastY - 1
    }

    stroke(230)
    textAlign(CENTER, CENTER)
    textFont('Calibri')
    fill(0)
    textSize(12)
    for(let i = 0; i < lastX + 1; i++) {
      line(xx + this.cam.x + sclp*i, this.cam.y, xx + this.cam.x + sclp*i, this.cam.y + this.height)
      if(abs(xx + this.cam.x + sclp*i) > 1) {
        push()
        if(this.cam.y > -18) {
          translate(xx + this.cam.x + sclp*i, this.cam.y + 20)
        } else if (this.cam.y < -this.height) {
          translate(xx + this.cam.x + sclp*i, this.cam.y + this.height)
        } else {
          translate(xx + this.cam.x + sclp*i, 0)
        }
        scale(1, -1)
        text((xx + this.cam.x + sclp*i)/sclp, 0, 10)
        pop()
      } 
    }
    for(let i = 0; i < lastY + 1; i++) {
      line(this.cam.x, xy + this.cam.y + sclp*i, this.cam.x + this.width, xy + this.cam.y + sclp*i)
      push()
      if(this.cam.x > -22) {
        translate(this.cam.x + 22, xy + this.cam.y + sclp*i)
      } else if (this.cam.x < -this.width) {
        translate(this.cam.x + this.width, xy + this.cam.y + sclp*i)
      } else {
        translate(0, xy + this.cam.y + sclp*i)
      }
      scale(1, -1)
      if(abs(xy + this.cam.y + sclp*i) > 1) {
        text((xy + this.cam.y + sclp*i)/sclp, -10, 0)
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

  isOnGrid(x, y) {
    if(x > this.cam.x && x < this.cam.x + this.width && y > this.cam.y && y < this.cam.y + this.height) {
      return true
    }
    return false
  }
}
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
class Incline {
  constructor() {
    this.id = uuidv4()
    this.located = false
    this.height = 1.5
    this.width = 3
    this.sidangle = atan(this.height/this.width) // radians
    this.mass = 2
    this.isincline = true
    this.pos = createVector(0,0)
    this.vel = createVector(0,0)
    this.acc = createVector(0,0)
    this.topedge = createVector(0,0)
    this.botedge = createVector(0,0)
    this.sidedge = createVector(0,0)
    this.forces = createVector(0,0)
  }

  locate() {
    this.pos.x = rmouseX
    this.pos.y = rmouseY
    this.updateEdges()
    this.located = true
    this.render()
  }

  updateEdges() {
    this.topedge.x = this.pos.x - this.width/2
    this.topedge.y = this.pos.y + this.height/2
    this.botedge.x = this.pos.x - this.width/2
    this.botedge.y = this.pos.y - this.height/2
    this.sidedge.x = this.pos.x + this.width/2
    this.sidedge.y = this.pos.y - this.height/2
  }

  checkForces() {
    engine.env_interacts.forEach(element => {
      this.forces.y += this.mass*element.vector.y
    })
    engine.still_objects.forEach(element => {
      if(this.pos.y - this.height/2 <= element.y + px) {
        this.pos.y = element.y + this.height/2 + px
        this.vel.y = 0
        if(this.forces.y <= 0) {
          this.forces.y = 0
        }
      }
    })
  }

  update() {
    this.forces.y = 0
    this.forces.x = 0
    this.checkForces()
    this.acc = p5.Vector.div(this.forces, this.mass)
    this.vel.add(p5.Vector.mult(this.acc, engine.timestep))
    this.pos.add(p5.Vector.mult(this.vel, engine.timestep))   
    this.updateEdges()
  }
  
  render() {
    stroke(100)
    fill(color(130, 200, 130))
    triangle(this.topedge.x*scl, this.topedge.y*scl, this.botedge.x*scl, this.botedge.y*scl, this.sidedge.x*scl, this.sidedge.y*scl)
  }

  closestEdges(x, y) {
    if(x > this.topedge.x && y >= this.sidedge.y) {
      return [this.topedge, this.sidedge, 1]
    } else if(x < this.topedge.x) {
      return [this.topedge, this.botedge, 2]
    } else if(x > this.topedge.x && y < this.sidedge.y) {
      return [this.botedge, this.sidedge, 3]
    }
  }

  normalPoint(x, y, edg1, edg2) {
    let edgvec = createVector(edg2.x - edg1.x, edg2.y - edg1.y)
    let edgline = {
      m: edgvec.y/edgvec.x,
    }
    edgline.b = - edgline.m*edg2.x + edg2.y
    let norpt = createVector(0,0)
    norpt.x = (edgvec.x*x + edgvec.y*(y - edgline.b))/(edgvec.x + edgvec.y*edgline.m)
    norpt.y = (edgvec.x*(x - norpt.x) + edgvec.y*y)/edgvec.y
    let dist = ((x - norpt.x)**2 + (y - norpt.y)**2)**0.5

    return [dist, norpt]
  }

  openControl() {
    PerformanceObserverEntryList
  }

  mouseisover() {
    return false
  }
}
class PointMass {
  constructor() {
    this.located = false
    this.ispointmass = true
    this.place = 0
    this.id = uuidv4()
    this.side = 0.3
    this.mass = 1
    this.pos = createVector(0,0)
    this.prev_pos = createVector(0,0)
    this.forces = createVector(0,0)
    this.normal = createVector(0,0)
    this.normangle = 0
    this.acc = createVector(0,0)
    this.vel = createVector(0,0)

    this.remove = this.remove.bind(this)
  }

  checkForces() {
    engine.env_interacts.forEach(element => {
      this.forces.y += this.mass*element.vector.y
    })
    engine.dyn_objects.forEach(element => {
      if(element.isspring) {
        if(element.end1.objid == this.id || element.end2.objid == this.id) {
          let spring_force
          if(element.end1.objid == this.id) {
            spring_force = p5.Vector.sub(element.end2.pos, element.end1.pos).normalize()
          } else {
            spring_force = p5.Vector.sub(element.end1.pos, element.end2.pos).normalize()
          }
          spring_force.mult(element.elong)
          spring_force.mult(element.k)
          this.forces.add(spring_force)
        }
      }
      if(element.isincline) {
        let closest_edges = element.closestEdges(this.pos.x, this.pos.y)
        let casey = closest_edges[2]
        if(casey == 1) {
          let blah = element.normalPoint(this.pos.x, this.pos.y, closest_edges[0], closest_edges[1])
          let dist = blah[0]
          let norpt = blah[1]
          if(dist <= this.side/2 + 1*px) {
            let rel_pos = createVector(0, this.side/2)
            rel_pos.rotate(- element.sidangle)
            this.pos.x = rel_pos.x + norpt.x
            this.pos.y = rel_pos.y + norpt.y
            if(element.normalPoint(this.prev_pos.x, this.prev_pos.y, closest_edges[0], closest_edges[1])[0] > this.side/2 + 1*px) {
              console.log("A block hit an incline")
              let rel_vel_x = this.vel.mag()*sin(element.sidangle)
              if(this.vel.y > 0) {
                this.vel.y = rel_vel_x*sin(element.sidangle)
              } else {
                this.vel.y = - rel_vel_x*sin(element.sidangle)
              }
              if(this.vel.x >= 0) {
                this.vel.x = rel_vel_x*cos(element.sidangle)
              } else {
                this.vel.x = - rel_vel_x*cos(element.sidangle)
              }
            }
            let rel_normal = createVector(0,0)
            let force_in_nor = this.forces.y*cos(element.sidangle) + this.forces.x*sin(element.sidangle)
            if(force_in_nor < 0) {
              rel_normal.y = - force_in_nor
            }
            this.forces.add(rel_normal.rotate(- element.sidangle))
            this.angle = element.sidangle
          }
        }
      }
    })
    engine.still_objects.forEach(element => {
      if(this.pos.y - this.side/2 <= element.y) {
        this.pos.y = element.y + this.side/2
        this.vel.y = 0
        if(this.forces.y <= 0) {
          this.forces.y = 0
        }
      }
    })
  }

  locate() {
    this.initial_pos = createVector(rmouseX, rmouseY)
    this.pos = this.initial_pos.copy()
    this.render()
    this.located = true
  }

  update() {
    this.angle = 0
    this.forces.y = 0
    this.forces.x = 0
    this.checkForces()
    this.acc = p5.Vector.div(this.forces, this.mass)
    this.vel.add(p5.Vector.mult(this.acc, engine.timestep))
    this.prev_pos = this.pos.copy()
    this.pos.add(p5.Vector.mult(this.vel, engine.timestep))
  }

  render() {
    stroke(100)
    push()
    translate(this.pos.x*scl, this.pos.y*scl)
    rotate(- this.angle)
    rectMode(CENTER)
    if(this.mouseisover()) {
      stroke(color(100,100,255))
      rect(0, 0, this.side*scl + 2, this.side*scl + 2)
    }
    fill(color(255,150,150))
    rect(0, 0, this.side*scl, this.side*scl)
    rectMode(CORNER)
    pop()
  }
  
  mouseisover() {
    if(rmouseX > this.pos.x - this.side/2 && rmouseX < this.pos.x + this.side/2 && rmouseY > this.pos.y - this.side/2 && rmouseY < this.pos.y + this.side/2) {
      return true
    }
    return false
  }

  openControl() {
    panel.openControl(this.id)
  }

  remove() {
    if(this.located) {
      engine.dyn_objects.splice(engine.dyn_objects.indexOf(this), 1)
    }
    engine.dyn_objects_dis.splice(engine.dyn_objects_dis.indexOf(this), 1)
  }
}
class Spring {
  constructor() {
    this.located = false
    this.id = uuidv4()
    this.length = 1
    this.k = 10  // N/m
    this.isspring = true
    this.elong = 0
    this.end1 = {
      located: false,
      ispivot: true,
      objid: 0,
      pos: createVector(0,0)
    }
    this.end2 = {
      located: false,
      ispivot: true,
      obj: 0,
      pos: createVector(0,0)
    }
  }

  locate() {
    let didthefirst = false
    if(!this.end1.located) {
      engine.dyn_objects.forEach(element => {
        if(element.mouseisover() && this.end1.ispivot) {
          this.end1.pos = element.pos
          this.end1.objid = element.id
          this.end1.ispivot = false
        }
      })
      if(this.end1.ispivot) {
        this.end1.pos = createVector(rmouseX, rmouseY)
      }
      this.end1.located = true
      didthefirst = true
    }
    if(this.end1.located && !didthefirst) {
      engine.dyn_objects.forEach(element => {
        if(element.mouseisover() && this.end2.ispivot) {
          this.end2.pos = element.pos
          this.end2.objid = element.id
          this.end2.ispivot = false
        }
      })
      if(this.end2.ispivot) {
        this.end2.pos = createVector(rmouseX, rmouseY)
      }
      this.end2.located = true
      this.located = true
    }
    if(this.end1.located && this.end2.located) {
      this.update()
      this.render()
    }
  }

  update() {
    this.elong = ((this.end1.pos.x - this.end2.pos.x)**2 + (this.end1.pos.y - this.end2.pos.y)**2)**0.5 - this.length
  }

  render() {
    stroke(75)
    fill(175)

    let dir = createVector((this.end2.pos.x - this.end1.pos.x)*scl, (this.end2.pos.y - this.end1.pos.y)*scl)
    let angle = dir.heading()
    if(this.end1.ispivot) {
      rectMode(CENTER)
      rect(this.end1.pos.x*scl, this.end1.pos.y*scl, 0.1*scl, 0.1*scl)
      rectMode(CORNER)
    }
    if(this.end2.ispivot) {
      rectMode(CENTER)
      rect(this.end2.pos.x*scl, this.end2.pos.y*scl, 0.1*scl, 0.1*scl)
      rectMode(CORNER)
    }
    push()
    let savescl = scl
    translate(this.end1.pos.x*scl, this.end1.pos.y*scl)
    scl = scl*(this.elong + this.length)/this.length
    rotate(angle)
    line(0, 0, 0.1*scl, 0)
    for(let i = 0; i < 4; i++) {
      line((0.1 + i*0.2)*scl, 0, (0.1 + i*0.2 + 0.05)*scl, 0.1*savescl)
      line((0.1 + i*0.2 + 0.05)*scl, 0.1*savescl, (0.1 + i*0.2 + 0.15)*scl, - 0.1*savescl)
      line((0.1 + i*0.2 + 0.15)*scl, - 0.1*savescl, (0.1 + (i + 1)*0.2)*scl, 0)
    }
    line(0.9*scl, 0, 1*scl, 0)
    pop()
    scl = savescl
  }

  openControl() {}

  mouseisover() {
    return false
  }

  remove() {
    if(this.located) {
      engine.dyn_objects.splice(engine.dyn_objects.indexOf(this), 1)
    }
    engine.dyn_objects_dis.splice(engine.dyn_objects_dis.indexOf(this), 1)
  }
}
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
class GraphPanel {
  constructor(focus) {
    this.focus = focus
    // Generates the group options in the left with the parameters in the right
    this.group = [{
      name: 'World',
      id:'0000',
      params: [new Param('Time', '0000', 0, this.focus)]}
    ]
    // Fill the group with each point mass in the engine
    engine.dyn_objects.forEach(element => {
      if(element.ispointmass) {
        this.group.push({
          name: 'Point Mass ' + element.place,
          id: element.id,
          params:[
            new Param('X position', element.id, 0, this.focus),
            new Param('Y position', element.id, 1, this.focus),
            new Param('X velocity', element.id, 2, this.focus),
            new Param('Y velocity', element.id, 3, this.focus),
            new Param('X acceleration', element.id, 4, this.focus),
            new Param('Y acceleration', element.id, 5, this.focus)]
        })
      }
    })

    let panelIn
    panelIn =  '<div style="text-align:center;font-size:16px;font-weight:700">Graph</div>'
    panelIn += '<div>Horizontal axis:</div>'
    panelIn += '<div class="btn-group" style="margin-bottom:10px">'
    panelIn += '  <button id="hor-drop-obj" type="button" class="btn btn-outline-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
    if(this.focus.plotSet) {
      panelIn += this.focus.horElement.name
    } else {
      panelIn += '  Object'
    }
    panelIn += '  </button>'
    panelIn += '  <div class="dropdown-menu">'
    // Horizontal left drop
    this.group.forEach(element => {
      panelIn += '  <a class="dropdown-item" id="' + element.id +  'hor" href="#">' + element.name + '</a>'
    })
    panelIn += '  </div>'        
    panelIn += '</div>'
    panelIn += '<div class="btn-group" style="margin-bottom:10px">'
    panelIn += '  <button id="hor-drop-params" type="button" class="btn btn-outline-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
    if(this.focus.plotSet) {
      panelIn += this.focus.horElement.paramName
    } else {
      panelIn += '    Parameter'
    }
    panelIn += '  </button>'
    // Horizontal right drop
    panelIn += '  <div id="control-hor-params" class="dropdown-menu"></div>'
    panelIn += '</div>'
    panelIn += '<div>Vertical axis:</div>'
    panelIn += '<div class="btn-group" style="margin-bottom:10px">'
    panelIn += '  <button id="ver-drop-obj" type="button" class="btn btn-outline-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
    if(this.focus.plotSet) {
      panelIn += this.focus.verElement.name
    } else {
      panelIn += '  Object'
    }
    panelIn += '  </button>'
    panelIn += '  <div class="dropdown-menu">'
    // Vertical left drop
    this.group.forEach(element => {
      panelIn += '  <a class="dropdown-item" id="' + element.id +  'ver" href="#">' + element.name + '</a>'
    })
    panelIn += '  </div>'        
    panelIn += '</div>'
    panelIn += '<div class="btn-group" style="margin-bottom:10px">'
    panelIn += '  <button id="ver-drop-params" type="button" class="btn btn-outline-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
    if(this.focus.plotSet) {
      panelIn += this.focus.verElement.paramName
    } else {
      panelIn += '  Parameter'
    }
    panelIn += '  </button>'
    // Vertical right drop
    panelIn += '  <div id="control-ver-params" class="dropdown-menu">'
    panelIn += '  </div>'        
    panelIn += '</div>'

    document.getElementById("controlpanel").innerHTML = panelIn
    this.group.forEach(element1 => {
      let element1Id = this.group.findIndex(thing => thing == element1)

      // When clicking the horizontal left drop...
      document.getElementById(element1.id + 'hor').onclick = () => {
        document.getElementById("hor-drop-obj").innerHTML = element1.name
        let params = ''
        // Add the corresponding params to the right drop...
        element1.params.forEach(element2 => {
          let element2Id = this.group[element1Id].params.findIndex(thing => thing == element2)
          // So it executes the execute function in them when clicking (which is on the Param class)
          params += '<a class="dropdown-item" onclick="panel.interior.group[' + element1Id + '].params[' + element2Id + '].execute(1)" href="#">' + element2.name + '</a>'
        })
        document.getElementById("control-hor-params").innerHTML = params
        // And fill with text 'parameter' every time a left selection changes
        document.getElementById("hor-drop-params").innerHTML = "Parameter"
      }

      // When clicking the vertical left drop...
      document.getElementById(element1.id + 'ver').onclick = () => {
        document.getElementById("ver-drop-obj").innerHTML = element1.name
        let params = ''
        // Add the corresponding params to the right drop...
        element1.params.forEach(element2 => {
          let element2Id = this.group[element1Id].params.findIndex(thing => thing == element2)
          // So it executes the execute function in them when clicking (which is on the Param class)
          params += '<a class="dropdown-item" onclick="panel.interior.group[' + element1Id + '].params[' + element2Id + '].execute(2)" href="#">' + element2.name + '</a>'
        })
        document.getElementById("control-ver-params").innerHTML = params
        // And fill with text 'parameter' every time a left selection changes
        document.getElementById("ver-drop-params").innerHTML = "Parameter"
      }
    })
  }
}
class Param {
  constructor(name, parentId, index, focus) {
    this.focus = focus
    this.index = index
    this.parentId = parentId
    this.name = name
    this.execute = this.execute.bind(this)
  }
  execute(axis) {
    if(axis == 1) {
      document.getElementById("hor-drop-params").innerHTML = this.name
      this.focus.setParamsForPlot(axis, this.parentId, this.index)
    } else if(axis == 2) {
      document.getElementById("ver-drop-params").innerHTML = this.name
      this.focus.setParamsForPlot(axis, this.parentId, this.index)
    }
  }
}
class Panel {
  constructor() {
    this.width = 300
    this.theresControl = false
    this.controlFocusId
    this.focus

    document.getElementById("floor-toggle").onchange = function() {
      if(this.checked) {
        engine.jointpanel.placeFloor()
      } else {
        engine.jointpanel.removeFloor()
      }
    }
    document.getElementById("gravity-toggle").onchange = function() {
      if(this.checked) {
        engine.jointpanel.placeGravity()
      } else {
        engine.jointpanel.removeGravity()
      }
    }

    document.getElementById("point-mass").onclick = function() {
      engine.jointpanel.createPointMass()
    }
    document.getElementById("spring").onclick = function() {
      engine.jointpanel.createSpring()
    }
    document.getElementById("incline").onclick = function() {
      engine.jointpanel.createIncline()
    }
    document.getElementById("graph").onclick = function() {
      engine.jointpanel.createGraph()
    }

    document.getElementById("zoomin").onclick = function() {
      drawingcnv.zoomin()
    }
    document.getElementById("zoomout").onclick = function() {
      drawingcnv.zoomout()
    }

    document.getElementById("run").onclick = function() {
      if(!this.classList.contains("active")) {
        this.classList.add("active")
      }
      if(document.getElementById("stop").classList.contains("active")) {
        document.getElementById("stop").classList.remove("active")
      }
      engine.run()
    }
    document.getElementById("stop").onclick = function() {
      if(!this.classList.contains("active")) {
        this.classList.add("active")
      }
      if(document.getElementById("run").classList.contains("active")) {
        document.getElementById("run").classList.remove("active")
      }
      engine.stop()
    }
  }

  openControl(id) {
    this.theresControl = true
    this.controlFocusId = id
    engine.dyn_objects.forEach(element => {
      if(element.id == this.controlFocusId) {
        this.focus = element
      }
    })
    engine.graphs.forEach(element => {
      if(element.id == this.controlFocusId) {
        this.focus = element
      }
    })
    if(this.focus.ispointmass) {
      this.interior = new PointMassPanel(this.focus)
    } else if(this.focus.isgraph) {
      this.interior = new GraphPanel(this.focus)
    }
  }

  update() {
    if(this.theresControl) {
      if(this.focus.ispointmass) {
        this.interior.update()
      }
    }
  }
}
class PointMassPanel {
  constructor(focus) {
    this.focus = focus

    let panelIn
    panelIn =  '<table class="table table-bordered table-sm" style="text-align: center; margin-bottom:0px">'
    panelIn += '  <thead>'
    panelIn += '    <tr>'
    panelIn += '      <th colspan=4>'
    panelIn += '        <div>'
    panelIn += '          Point Mass ' + this.focus.place
    panelIn += '          <button type="button" id="controlremove" class="btn btn-outline-primary" style="margin: 0"><i class="fas fa-trash"></i></button>'
    panelIn += '        </div>'
    panelIn += '      </th>'
    panelIn += '    </tr>'
    panelIn += '  </thead>'
    panelIn += '  <tbody>'
    panelIn += '    <tr>'
    panelIn += '      <th>x</th>'
    panelIn += '      <td id="controlx">0</td>'
    panelIn += '      <th>y</th>'
    panelIn += '      <td id="controly">0</td>'
    panelIn += '    </tr>'
    panelIn += '    <tr>'
    panelIn += '      <th>vx</th>'
    panelIn += '      <td id="controlvx">0</td>'
    panelIn += '      <th>vy</th>'
    panelIn += '      <td id="controlvy">0</td>'
    panelIn += '    </tr>'
    panelIn += '    <tr>'
    panelIn += '      <th>ax</th>'
    panelIn += '      <td id="controlax">0</td>'
    panelIn += '      <th>ay</th>'
    panelIn += '      <td id="controlay">0</td>'
    panelIn += '    </tr>'
    panelIn += '    <tr>'
    panelIn += '      <th>m</th>'
    panelIn += '      <td id="controlm">0</td>'
    panelIn += '      <th>Ek</th>'
    panelIn += '      <td id="controlek">0</td>'
    panelIn += '    </tr>'
    panelIn += '  </tbody>'
    panelIn += '</table>'

    document.getElementById("controlpanel").innerHTML = panelIn
    this.update(true)
  }

  update(run=false) {
    // This logic is for the panel to update when placing the point mass, but for it
    // not to continue updating wasting computing power if the engine is not running
    if(engine.running && !run) {
      run = true
    }
    if(run) {
      document.getElementById("controlx").innerHTML = this.focus.pos.x.toFixed(2)
      document.getElementById("controly").innerHTML = this.focus.pos.y.toFixed(2)
      document.getElementById("controlvx").innerHTML = this.focus.vel.x.toFixed(2)
      document.getElementById("controlvy").innerHTML = this.focus.vel.y.toFixed(2)
      document.getElementById("controlax").innerHTML = this.focus.acc.x.toFixed(2)
      document.getElementById("controlay").innerHTML = this.focus.acc.y.toFixed(2)
      document.getElementById("controlm").innerHTML = this.focus.mass.toFixed(2)
      document.getElementById("controlek").innerHTML = (0.5*this.focus.mass*this.focus.vel.mag()**2).toFixed(2)
      document.getElementById("controlremove").onclick = function() {
        panel.focus.remove()
        document.getElementById("controlpanel").innerHTML = ''
        panel.theresControl = false
      }
    }
  }
}
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

    let lastx = floor(this.width/scl)
    if(this.width - lastx*scl < xx) {
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
      line(this.x, xy + this.y + scl*i, this.x + this.width, xy + this.y + scl*i)
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
    if(mouseX > 0 && mouseX < this.width && mouseY > 0 && mouseY < height) {
      return true
    }
    return false
  }
}
function mouseClicked() {
  engine.clicked()
}

let movingGraph = false
let graphIndex = 0
function mousePressed() {
  //Most of this is logic for moving the graph
  if(drawingcnv.mouseisover()) {
    engine.graphs.forEach(element => {
      if(element.mouseisover()) {
        graphIndex = engine.graphs.findIndex(thing => thing == element)
        if(!element.mouseoverinner()) {
          element.outerDragged = true
          element.innerDragged = false
        } else {
          element.outerDragged = false
          element.innerDragged = true
        }
        element.pressed()
        movingGraph = true
      }
    })
    //Until here
    if(!movingGraph) {
      drawingcnv.pressed()
      
    }
  }
}
 
function mouseDragged() {
  if(drawingcnv.mouseisover()) {
    if(movingGraph) {
      engine.graphs[graphIndex].dragged()
    } else {
      drawingcnv.dragged()
    }
  }
}

function mouseReleased() {
  if(movingGraph) {
    movingGraph = false
    engine.graphs[graphIndex].released()
  }
  drawingcnv.released()
}

// Init GUI Components
let canvasDiv = document.getElementById("canvas")
let panelDiv  = document.getElementById("panel")

let scl = 100, sclp = 60, margin = 8, tot_margin = 2*margin
let cnv, panel, drawingcnv, engine
let rmouseX, rmouseY, px
let running = false

function setup() {
  engine = new Engine()
  panel = new Panel()
  setFillerCanvas()
  cnv = createCanvas(windowWidth - panel.width - margin*3, windowHeight - tot_margin)
  centerCanvas()
  drawingcnv = new DrawingCanvas(width)
  drawingcnv.update()
  drawingcnv.grid()
}

let i = 0
let fpsText
function draw() {
  background(255)
  push()
  rmouseX = (mouseX + drawingcnv.x)/scl
  rmouseY = (height - mouseY + drawingcnv.y)/scl
  frameRate(engine.fps)
  drawingcnv.update()
  if(engine.running) {
    engine.update()
  }
  engine.renderObjects()
  drawingcnv.grid()
  drawingcnv.drawAxis()
  pop()
  engine.renderGraphs()
  drawingcnv.frame()
  panel.update()
  //FPS stuff
  i = i + 1
  if(i%20 == 0) {
    fpsText = "FPS = " + frameRate().toFixed(2)
  }
  textAlign(LEFT, LEFT)
  fill(color(150,150,0))
  textSize(18)
  text(fpsText, drawingcnv.width - 100, 20)
  //there
}

// function renderCanvas() {
//   drawingcnv.grid()
//   engine.renderObjects()
//   drawingcnv.late()
// }


function windowResized() {
  setFillerCanvas()
  resizeCanvas(windowWidth - panel.width - margin*3, windowHeight - tot_margin);
  drawingcnv.width = width
  centerCanvas()
  background(255)
  // panel.update()
}

function setFillerCanvas() {
  canvasDiv.width = windowWidth - panel.width - margin*3;
  canvasDiv.height = windowHeight - tot_margin;
  panelDiv.setAttribute("style", "height:" + canvasDiv.height + "px");
  canvasDiv.setAttribute("style", "background:blue")
}

function centerCanvas() {
  let x = floor((windowWidth - panel.width - margin - width)/2)
  let y = floor((windowHeight - height)/2)
  cnv.position(x, y)
}