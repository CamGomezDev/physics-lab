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
class Incline {
  constructor() {
    this.id = uuidv4()
    this.place = 0
    this.located = false
    this.width = 3
    this.height = 1.5
    this.sidangle = atan(this.height/this.width) // radians
    this.mass = 2
    this.isincline = true
    this.isellastic = false
    this.frictionOn = true
    this.statcoeff = 0.3
    this.kincoeff = 0.3
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
    this.sidangle = atan(this.height/this.width) // radians
  }

  checkForces() {
    engine.still_objects.forEach(element => {
      if(element.isgravity) {
        this.forces.y += this.mass*element.vector.y
      }
    })
    engine.still_objects.forEach(element => {
      if(element.isfloor) {
        if(this.pos.y - this.height/2 <= element.y + px) {
          this.pos.y = element.y + this.height/2 + px
          this.vel.y = 0
          if(this.forces.y <= 0) {
            this.forces.y = 0
          }
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
  
  render(panelHighlight=false) {
    this.mouseOrIndexHighlight = false
    if(this.indexHighlightLoad || this.mouseisover()) {
      this.mouseOrIndexHighlight = true
    }
    stroke(100)
    fill(color(130, 200, 130))
    triangle(this.topedge.x*scl, this.topedge.y*scl, this.botedge.x*scl, this.botedge.y*scl, this.sidedge.x*scl, this.sidedge.y*scl)
    if(this.mouseOrIndexHighlight || panelHighlight) {
      stroke(color(100,100,255))
      triangle(this.topedge.x*scl - 2, this.topedge.y*scl + 2, this.botedge.x*scl - 2, this.botedge.y*scl - 2, this.sidedge.x*scl + 2, this.sidedge.y*scl - 2)
    }
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
    panel.openControl(this.id)
  }

  mouseisover() {
    if(rmouseX > this.botedge.x && rmouseX < this.sidedge.x && rmouseY > this.botedge.y) {
      let p1 = this.topedge
      let p2 = this.sidedge
      let m = (p2.y - p1.y)/(p2.x - p1.x)
      let b = p1.y - m*p1.x
      let topY = m*rmouseX + b
      if(rmouseY < topY) {
        return true
      }
    }
    return false
  }

  remove() {
    if(this.located) {
      engine.dyn_objects.splice(engine.dyn_objects.indexOf(this), 1)
    }
    engine.dyn_objects_dis.splice(engine.dyn_objects_dis.indexOf(this), 1)
    engine.renderOrder.splice(engine.renderOrder.indexOf(this), 1)
  }
}
class PointMass {
  constructor() {
    this.located = false
    this.ispointmass = true
    this.draggingVel = false
    this.place = 0
    this.id = uuidv4()
    this.side = 0.3
    this.mass = 1
    this.pos = createVector(0,0)
    this.prevPos = createVector(0,0)
    this.forces = createVector(0,0)
    this.normal = createVector(0,0)
    this.normangle = 0
    this.acc = createVector(0,0)
    this.vel = createVector(0,0)
    this.Ek = 0

    this.remove = this.remove.bind(this)
  }

  checkForces() {
    engine.still_objects.forEach(element => {
      if(element.isgravity) {
        this.forces.add(p5.Vector.mult(element.vector, this.mass))
      }
    })
    engine.dyn_objects.forEach(element => {
      if(element.isspring) {
        if(element.end1.objid == this.id || element.end2.objid == this.id) {
          let springForce
          if(element.end1.objid == this.id) {
            springForce = p5.Vector.sub(element.end2.pos, element.end1.pos).normalize()
          } else {
            springForce = p5.Vector.sub(element.end1.pos, element.end2.pos).normalize()
          }
          springForce.mult(element.elong)
          springForce.mult(element.k)
          this.forces.add(springForce)
        }
      }
      if(element.isincline) {
        let closestEdges = element.closestEdges(this.pos.x, this.pos.y)
        let casey = closestEdges[2]
        if(casey == 1) {
          let blah = element.normalPoint(this.pos.x, this.pos.y, closestEdges[0], closestEdges[1])
          let dist = blah[0]
          let norpt = blah[1]
          if(dist <= this.side/2 + 1*px) {
            let relPos = createVector(0, this.side/2)
            relPos.rotate(- element.sidangle)
            this.pos.x = relPos.x + norpt.x
            this.pos.y = relPos.y + norpt.y
            if(element.normalPoint(this.prevPos.x, this.prevPos.y, closestEdges[0], closestEdges[1])[0] > this.side/2 + 1*px) {
              let unitTang = createVector(1,0).rotate(- element.sidangle)
              console.log("A block hit an incline")
              let tangVel = p5.Vector.mult(unitTang.copy(), p5.Vector.dot(this.vel, unitTang))
              this.vel = tangVel
            }
            let relNormal = createVector(0,0)
            let forceInNor = this.forces.y*cos(element.sidangle) + this.forces.x*sin(element.sidangle)
            if(forceInNor < 0) {
              relNormal.y = - forceInNor
            }
            relNormal.rotate(- element.sidangle)
            let normal = relNormal
            // Friction calculations for incline
            if(element.frictionOn) {
              let normalMag = relNormal.mag()
              let unitTang = normal.copy()
              unitTang.rotate(- radians(90)).normalize()
              let tangVelMag = p5.Vector.dot(this.vel, unitTang)
              if(abs(tangVelMag) > 0.01) {
                // Object moving, kinetic friction
                let kinFricForce = unitTang.copy()
                if(tangVelMag > 0) {
                  kinFricForce.mult(- normalMag*element.kincoeff)
                } else {
                  kinFricForce.mult(normalMag*element.kincoeff)
                }
                if(abs(tangVelMag) < 0.1 && element.kincoeff != 0) {
                  this.vel.x = 0
                } else {
                  this.forces.add(kinFricForce)
                }
              } else {
                // Object not moving, static friction
                let maxStatFric = normalMag*element.statcoeff
                let tangForceMag = p5.Vector.dot(this.forces, unitTang)
                let statFricForce = unitTang.copy()
                if(abs(tangForceMag) > maxStatFric) {
                  statFricForce.mult(- maxStatFric)
                } else {
                  statFricForce.mult(- tangForceMag)
                }
                this.forces.add(statFricForce)
              }
            }
            this.forces.add(normal)
            this.angle = element.sidangle
          }
        }
      }
    })
    engine.still_objects.forEach(element => {
      if(element.isfloor) {
        if(this.pos.y - this.side/2 <= element.y) {
          this.pos.y = element.y + this.side/2
          if(this.vel.y < 0) {
            this.vel.y = 0
          }
  
          if(element.frictionOn && this.forces.y < 0) {
            let normalMag = - this.forces.y
            let tangVelMag = this.vel.x
            if(abs(tangVelMag) > 0) {
              // Object moving, kinetic friction
              let kinFricForce = createVector(1,0)
              if(tangVelMag > 0) {
                kinFricForce.mult(- normalMag*element.kincoeff)
              } else {
                kinFricForce.mult(normalMag*element.kincoeff)
              }
              if(abs(tangVelMag) < 0.1) {
                this.vel.x = 0
              } else {
                this.forces.add(kinFricForce)
              }
            } else {
              // Object not moving, static friction
              let maxStatFric = normalMag*element.statcoeff
              let tangForceMag = this.forces.x
              let statFricForce = createVector(1,0)
              if(abs(tangForceMag) > maxStatFric) {
                statFricForce.mult(- maxStatFric*tangForceMag/abs(tangForceMag))
              } else {
                statFricForce.mult(- tangForceMag)
              }
              this.forces.add(statFricForce)
            }
          }
  
          if(this.forces.y <= 0) {
            this.forces.y = 0
          }
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
    this.prevPos = this.pos.copy()
    this.pos.add(p5.Vector.mult(this.vel, engine.timestep))
    this.Ek = 0.5*this.mass*this.vel.mag()**2
  }

  render(panelHighlight=false) {
    this.mouseOrIndexHighlight = false
    if(this.indexHighlightLoad || this.mouseisover()) {
      this.mouseOrIndexHighlight = true
    }
    stroke(100)
    push()
    translate(this.pos.x*scl, this.pos.y*scl)
    rotate(- this.angle)
    rectMode(CENTER)
    if(this.mouseOrIndexHighlight || panelHighlight) {
      stroke(color(100,100,255))
      rect(0, 0, this.side*scl + 2, this.side*scl + 2)
    }
    fill(color(255,150,150))
    rect(0, 0, this.side*scl, this.side*scl)
    if(!this.draggingVel) {
      fill(100,100,100)
      stroke(100,100,100)
      rect(0, 0, scl*this.side/6, scl*this.side/6)
    } else {
      line(0, 0, (rmouseX - this.pos.x)*scl, (rmouseY - this.pos.y)*scl)
    }
    rectMode(CORNER)
    pop()
  }

  isOnVelSelector() {
    if(rmouseX > this.pos.x - (this.side/6)/2 && rmouseX < this.pos.x + (this.side/6)/2 && rmouseY > this.pos.y - (this.side/6)/2 && rmouseY < this.pos.y + (this.side/6)/2) {
      this.origvel = createVector(rmouseX, rmouseY)
      this.draggingVel = true
      this.openControl()
      return true
    }
    return false
  }

  dragVelSelector() {
    if(this.draggingVel && !engine.running) {
      this.vel = createVector(rmouseX, rmouseY).sub(this.origvel).mult(5)
      panel.controlPanel.update(true)
    }
  }

  releasedVelSelector() {
    if(this.draggingVel) {
      this.vel = createVector(rmouseX, rmouseY).sub(this.origvel).mult(5)
      this.draggingVel = false
      panel.controlPanel.update(true)
    }
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
    engine.renderOrder.splice(engine.renderOrder.indexOf(this), 1)
  }
}
class Spring {
  constructor() {
    this.id = uuidv4()
    this.located = false
    this.length = 1
    this.k = 10  // N/m
    this.isspring = true
    this.elong = 0
    this.place = 0
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
      this.calcNumBorders()
      this.update()
      this.render()
    }
  }

  calcNumBorders() {
    this.numBorders = floor(this.length*4)
    this.widthScl = scl*this.k/10
  }

  update() {
    this.edgDist = ((this.end1.pos.x - this.end2.pos.x)**2 + (this.end1.pos.y - this.end2.pos.y)**2)**0.5
    this.renLength = this.numBorders*0.25
    this.elong = this.edgDist - this.length
  }

  render(panelHighlight=false) {
    this.mouseOrIndexHighlight = false
    if(this.indexHighlightLoad || this.mouseisover()) {
      this.mouseOrIndexHighlight = true
    }

    this.calcNumBorders()
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
    scl = scl*this.edgDist
    rotate(angle)

    if(this.mouseOrIndexHighlight || panelHighlight) {
      strokeWeight(2);stroke(color(100,100,255))
      line(0, 0, 0.1*scl, 0)
      strokeWeight(1);stroke(100)
    }
    line(0, 0, 0.1*scl, 0)
  
    let savescl2 = scl
    scl = scl*4/this.numBorders
    for(let i = 0; i < this.numBorders; i++) {
      if(this.mouseOrIndexHighlight || panelHighlight) {
        strokeWeight(2);stroke(color(100,100,255))
        line(0.1*savescl2 + (i*0.2)*scl, 0, 0.1*savescl2 + (i*0.2 + 0.05)*scl, 0.13*this.widthScl)
        line(0.1*savescl2 + (i*0.2 + 0.05)*scl, 0.13*this.widthScl, 0.1*savescl2 + (i*0.2 + 0.15)*scl, - 0.13*this.widthScl)
        line(0.1*savescl2 + (i*0.2 + 0.15)*scl, - 0.13*this.widthScl, 0.1*savescl2 + ((i + 1)*0.2)*scl, 0)
        strokeWeight(1);stroke(100)
      }
      line(0.1*savescl2 + (i*0.2)*scl, 0, 0.1*savescl2 + (i*0.2 + 0.05)*scl, 0.13*this.widthScl)
      line(0.1*savescl2 + (i*0.2 + 0.05)*scl, 0.13*this.widthScl, 0.1*savescl2 + (i*0.2 + 0.15)*scl, - 0.13*this.widthScl)
      line(0.1*savescl2 + (i*0.2 + 0.15)*scl, - 0.13*this.widthScl, 0.1*savescl2 + ((i + 1)*0.2)*scl, 0)
    }
    scl = savescl2

    if(this.mouseOrIndexHighlight || panelHighlight) {
      strokeWeight(2);stroke(color(100,100,255))
      line(0.9*scl, 0, 1*scl, 0)
      strokeWeight(1);stroke(100)
    }
    line(0.9*scl, 0, 1*scl, 0)

    pop()
    scl = savescl

  }

  openControl() {
    panel.openControl(this.id)
  }

  mouseisover() {
    return false
  }

  remove() {
    if(this.located) {
      engine.dyn_objects.splice(engine.dyn_objects.indexOf(this), 1)
    }
    engine.dyn_objects_dis.splice(engine.dyn_objects_dis.indexOf(this), 1)
    engine.renderOrder.splice(engine.renderOrder.indexOf(this), 1)
  }
}
class Engine {
  constructor() {
    this.unit     = 20 //pixels per unit (unit may be meter, cm, etc)
    this.fps      = 60
    this.timestep = 0
    this.time     = 0
    this.objectonhold = false
    this.dyn_objects_dis   = []
    this.still_objects_dis = []
    this.dyn_objects       = []
    this.still_objects     = []
    this.graphs            = []
    this.renderOrder       = []
    this.running = false
    this.jointpanel = new JointPanel()
    this.intHandler = new IntHandler()
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
    this.intHandler.execute()
    this.dyn_objects.forEach(element => {
      element.update()
    })
    this.graphs.forEach(element => {
      element.update()
    })
  }

  renderObjects() {
    this.renderOrder.forEach(element => {
      if(panel.focus.id == element.id) {
        element.render(true)
      } else {
        element.render()
      }
    })
  }
  
  renderGraphs() {
    this.graphs.forEach(element => {
      element.render()
    })
  }

  indexHighlight(id) {
    this.dyn_objects.forEach(element => {
      if(element.id == id) {
        element.indexHighlightLoad = true
      } else {
        element.indexHighlightLoad = false
      }
    });
  }

  stopIndexHighlight() {
    this.dyn_objects.forEach(element => {
      element.indexHighlightLoad = false
    });
  }

  clicked() {
    if(drawingcnv.mouseisover()) {
      if(this.objectonhold) {
        this.dyn_objects_dis[this.dyn_objects_dis.length - 1].locate()
        if(this.dyn_objects_dis[this.dyn_objects_dis.length - 1].located) {
          this.orderObjects()
          this.objectonhold = false
          this.dyn_objects_dis[this.dyn_objects_dis.length - 1].openControl()
          panel.indexPanel.updateHighlight()
        }
      } else {
        this.dyn_objects.forEach(element => {
          if(element.mouseisover()) {
            element.openControl()
            panel.indexPanel.updateHighlight()
          }
        })
        this.graphs.forEach(element => {
          if(element.mouseisover()) {
            element.openControl()
            panel.indexPanel.updateHighlight()
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
    this.still_objects = []
    this.renderOrder = []
    this.graphs = []
    // Fills graphs array and removes unplaced element
    this.dyn_objects_dis.forEach(element => {
      if(!element.located) {
        element.remove()
      }
      if(element.isgraph) {
        this.graphs.push(element)
      }
    })
    // Fills dynamic objects array
    let pointMassPlace = 1
    this.dyn_objects_dis.forEach(element => {
      if(element.ispointmass) {
        this.dyn_objects.push(element)
        element.place = pointMassPlace
        pointMassPlace += 1
      }
    })
    let springPlace = 1
    this.dyn_objects_dis.forEach(element => {
      if(element.isspring) {
        this.dyn_objects.push(element)
        element.place = springPlace
        springPlace += 1
      }
    })
    let inclinePlace = 1
    this.dyn_objects_dis.forEach(element => {
      if(element.isincline) {
        this.dyn_objects.push(element)
        element.place = inclinePlace
        inclinePlace += 1
      }
    })
    // Fills still objects array
    this.still_objects_dis.forEach(element => {
      if(element.isgravity) {
        this.still_objects.push(element)
      }
    })
    this.still_objects_dis.forEach(element => {
      if(element.isfloor) {
        this.still_objects.push(element)
      }
    })
    // Fills rendering order array
    this.still_objects.forEach(element => {
      if(element.isfloor) {
        this.renderOrder.push(element)
      }
    })
    this.dyn_objects.forEach(element => {
      if(element.isincline) {
        this.renderOrder.push(element)
      }
    })
    this.dyn_objects.forEach(element => {
      if(element.ispointmass) {
        this.renderOrder.push(element)
      }
    })
    this.dyn_objects.forEach(element => {
      if(element.isspring) {
        this.renderOrder.push(element)
      }
    })

    panel.indexPanel.update()
  }

  findById(id) {
    this.dyn_objects.forEach(element => {
      if(element.id == id) {
        console.log(element)
        return element
      }
    })
  }
}
class IntHandler {
  execute() {
    for(let i = 0; i < engine.dyn_objects.length; i++) {
      let element1 = engine.dyn_objects[i];
      for(let e = i + 1; e < engine.dyn_objects.length; e++) {
        let element2 = engine.dyn_objects[e];
        if(element1.ispointmass && element2.ispointmass) {
          this.pointMassCollision(element1, element2)
        }
      }
    }
  }

  pointMassCollision(mass1, mass2) {
    if(areCollidingJustNow(mass1, mass2)) {
      let relNormal1 = p5.Vector.sub(mass2.pos, mass1.pos).normalize()
      let relNormal2 = p5.Vector.sub(mass1.pos, mass2.pos).normalize()
      let normVelMag1 = p5.Vector.dot(relNormal1, mass1.vel)
      let normVelMag2 = p5.Vector.dot(relNormal2, mass2.vel)
      let newNormVelMag1 = normVelMag1 - 2*mass2.mass*p5.Vector.dot(p5.Vector.sub(mass1.vel, mass2.vel), relNormal1)/(mass1.mass + mass2.mass)
      let newNormVelMag2 = normVelMag2 - 2*mass1.mass*p5.Vector.dot(p5.Vector.sub(mass2.vel, mass1.vel), relNormal2)/(mass1.mass + mass2.mass)
      let relTang1 = relNormal1.copy().rotate(radians(90))
      let relTang2 = relNormal2.copy().rotate(radians(90))
      let tanVel1 = p5.Vector.mult(relTang1, p5.Vector.dot(relTang1, mass1.vel))
      let tanVel2 = p5.Vector.mult(relTang2, p5.Vector.dot(relTang2, mass2.vel))
      let normVel1 = p5.Vector.mult(relNormal1, newNormVelMag1)
      let normVel2 = p5.Vector.mult(relNormal2, newNormVelMag2)
      mass1.vel = p5.Vector.add(normVel1, tanVel1)
      mass2.vel = p5.Vector.add(normVel2, tanVel2)
    }

    function areCollidingJustNow(mass1, mass2) {
      let disSq = (mass1.side/2 + mass2.side/2)**2
      if(p5.Vector.sub(mass1.pos, mass2.pos).magSq() < disSq && p5.Vector.sub(mass1.prevPos, mass2.prevPos).magSq() >= disSq) {
        return true
      }
      return false
    }
  }

  pointMassSpring(mass, spring) {}

  pointMassIncline(mass, incline) {}

  elementGravity(element, gravity) {}

  elementFloor(element, floor) {}
}
class JointPanel {
  placeGravity() {
    engine.still_objects_dis.push({vector: createVector(0, -9.8), isgravity: true, id: uuidv4()})
    this.gravity = engine.still_objects_dis[engine.still_objects_dis.length - 1]
    engine.orderObjects()
    panel.indexPanel.updateHighlight()
    panel.openControl(this.gravity.id)
  }

  removeGravity() {
    engine.still_objects_dis.splice(engine.still_objects_dis.indexOf(this.gravity), 1)
    engine.orderObjects()
    panel.indexPanel.updateHighlight()
  }

  placeFloor() {
    engine.still_objects_dis.push(new Floor())
    this.floor = engine.still_objects_dis[engine.still_objects_dis.length - 1]
    engine.orderObjects()
    panel.indexPanel.updateHighlight()
    panel.openControl(this.floor.id)
  }

  removeFloor() {
    engine.still_objects_dis.splice(engine.still_objects_dis.indexOf(this.floor), 1)
    engine.orderObjects()
    panel.indexPanel.updateHighlight()
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
class ControlPanelTable {
  constructor(focus, title, refs) {
    this.focus = focus
    this.refs = refs
    let panelIn
    panelIn =  '<table class="table table-bordered table-sm" style="text-align:center; margin-bottom:0px">'
    panelIn += '  <thead>'
    panelIn += '    <tr>'
    panelIn += '      <th colspan=4>'
    panelIn += '        <div>'
    panelIn +=            title
    panelIn += '          <button type="button" id="controlremove" class="btn btn-outline-primary" style="margin: 0"><i class="fas fa-trash"></i></button>'
    panelIn += '        </div>'
    panelIn += '      </th>'
    panelIn += '    </tr>'
    panelIn += '  </thead>'

    let numRows = ceil(this.refs.length/2)
    panelIn += '  <tbody>'
    for(let i = 0; i < numRows; i++) {
      panelIn += '  <tr>'
      panelIn += '    <th>' + refs[i*2][0] + '</th>';
      panelIn += '    <td id="control' + refs[i*2][3] + '" ' + (refs[i*2][1] ? 'contenteditable' : '') + '>0</td>'
      if(refs[i*2 + 1] != undefined) {
        panelIn += '  <th>' + refs[i*2 + 1][0] + '</th>';
        panelIn += '  <td id="control' + refs[i*2 + 1][3] + '" ' + (refs[i*2 + 1][1] ? 'contenteditable' : '') + '>0</td>'
        panelIn += '</tr>'
      }
    }
    panelIn += '  </tbody>'

    panelIn += '</table>'

    document.getElementById("controlpanel").innerHTML = panelIn
  }

  addSetButton() {
    document.getElementById("setcontrol").onclick = function() {
      for(let i = 0; i < panel.controlPanel.table.refs.length; i++) {
        if(panel.controlPanel.table.refs[i][1]) {
          if(!isNaN(document.getElementById("control" + panel.controlPanel.table.refs[i][3]).innerHTML)) {
            if(panel.controlPanel.table.refs[i][2].length == 1) {
              panel.focus[panel.controlPanel.table.refs[i][2][0]] = Number(document.getElementById("control" + panel.controlPanel.table.refs[i][3]).innerHTML)
            } else if(panel.controlPanel.table.refs[i][2].length == 2) {
              panel.focus[panel.controlPanel.table.refs[i][2][0]][panel.controlPanel.table.refs[i][2][1]] = Number(document.getElementById("control" + panel.controlPanel.table.refs[i][3]).innerHTML)
            }
          }
        }
      }
      if(panel.focus.isincline) {
        panel.focus.updateEdges()
      } else if(panel.focus.isspring) {
        panel.focus.calcNumBorders()
      }
      panel.controlPanel.update(true)
    }
  }

  update() {
    // This logic is for the panel to update when placing the point mass, but for it
    // not to continue updating if the engine is not running
    for(let i = 0; i < this.refs.length; i++) {
      if(this.refs[i][2].length == 1) {
        document.getElementById("control" + this.refs[i][3]).innerHTML = this.focus[this.refs[i][2][0]].toFixed(2)
      } else if(this.refs[i][2].length == 2) {
        document.getElementById("control" + this.refs[i][3]).innerHTML = this.focus[this.refs[i][2][0]][this.refs[i][2][1]].toFixed(2)
      }
    }
  }
}
class FloorPanel {
  constructor(focus) {
    this.focus = focus

    // Number is to tell if the field is editable or not
    this.table = new ControlPanelTable(this.focus, 'Floor',
                                       [['Stat. coeff.', 1, ['statcoeff'], 'statcoeff'], ['Kin. coeff.', 1, ['kincoeff'], 'kincoeff']])

    let panelIn = '<div style="text-align:right"><button type="button" id="setcontrol" class="btn btn-outline-primary">Set</button></div>'
    document.getElementById("controlpanel").innerHTML += panelIn

    this.table.addSetButton()

    this.update(true)
  }

  update(run=false) {
    if(engine.running && !run) {
      run = true
    }
    if(run) {
      this.table.update()
    }
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
    panelIn =  '<div style="text-align:center;font-size:16px;font-weight:700">'
    panelIn += '  Graph'
    panelIn += '  <button type="button" id="controlremove" class="btn btn-outline-primary" style="margin: 0"><i class="fas fa-trash"></i></button>'
    panelIn += '</div>'
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

    panelIn += '<div style="margin-top:10px">'
    panelIn += '  Hor:'
    panelIn +=   '<button style="margin-top:0" id="horzoomingraph" class="btn btn-outline-primary"><i class="fas fa-plus fa-sm"></i></button>'
    panelIn +=   '<button style="margin-top:0;margin-right:10px" id="horzoomoutgraph" class="btn btn-outline-primary"><i class="fas fa-minus fa-sm"></i></button>'
    panelIn += '  Ver:'
    panelIn +=   '<button style="margin-top:0" id="verzoomingraph" class="btn btn-outline-primary"><i class="fas fa-plus fa-sm"></i></button>'
    panelIn +=   '<button style="margin-top:0" id="verzoomoutgraph" class="btn btn-outline-primary"><i class="fas fa-minus fa-sm"></i></button>'
    panelIn += '</div>'

    document.getElementById("controlpanel").innerHTML = panelIn

    document.getElementById("horzoomingraph").onclick = function() {
      let center = createVector((panel.focus.plot.cam.x + panel.focus.plot.width/2)/panel.focus.plot.horscl, 0)
      panel.focus.plot.horscl *= 1.2
      panel.focus.plot.cam.x = (center.x*panel.focus.plot.horscl - panel.focus.plot.width/2)
    }
    document.getElementById("horzoomoutgraph").onclick = function() {
      let center = createVector((panel.focus.plot.cam.x + panel.focus.plot.width/2)/panel.focus.plot.horscl, 0)
      panel.focus.plot.horscl *= 1/1.2
      panel.focus.plot.cam.x = (center.x*panel.focus.plot.horscl - panel.focus.plot.width/2)
    }
    document.getElementById("verzoomingraph").onclick = function() {
      let center = createVector(0, (panel.focus.plot.cam.y + panel.focus.plot.height/2)/panel.focus.plot.verscl)
      panel.focus.plot.verscl *= 1.2
      panel.focus.plot.cam.y = (center.y*panel.focus.plot.verscl - panel.focus.plot.height/2)
    }
    document.getElementById("verzoomoutgraph").onclick = function() {
      let center = createVector(0, (panel.focus.plot.cam.y + panel.focus.plot.height/2)/panel.focus.plot.verscl)
      panel.focus.plot.verscl *= 1/1.2
      panel.focus.plot.cam.y = (center.y*panel.focus.plot.verscl - panel.focus.plot.height/2)
    }

    this.group.forEach(element1 => {
      let element1Id = this.group.indexOf(element1)

      // When clicking the horizontal left drop...
      document.getElementById(element1.id + 'hor').onclick = () => {
        document.getElementById("hor-drop-obj").innerHTML = element1.name
        let params = ''
        // Add the corresponding params to the right drop...
        element1.params.forEach(element2 => {
          let element2Id = this.group[element1Id].params.indexOf(element2)
          // So it executes the execute function in them when clicking (which is on the Param class)
          params += '<a class="dropdown-item" onclick="panel.controlPanel.group[' + element1Id + '].params[' + element2Id + '].execute(1)" href="#">' + element2.name + '</a>'
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
          let element2Id = this.group[element1Id].params.indexOf(element2)
          // So it executes the execute function in them when clicking (which is on the Param class)
          params += '<a class="dropdown-item" onclick="panel.controlPanel.group[' + element1Id + '].params[' + element2Id + '].execute(2)" href="#">' + element2.name + '</a>'
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
class GravityPanel {
  constructor(focus) {
    this.focus = focus

    // Number is to tell if the field is editable or not
    this.table = new ControlPanelTable(this.focus, 'Gravity',
                                       [['x value', 1, ['vector', 'x'], 'valx'], ['y value', 1, ['vector', 'y'], 'valy']])

    let panelIn = '<div style="text-align:right"><button type="button" id="setcontrol" class="btn btn-outline-primary">Set</button></div>'
    document.getElementById("controlpanel").innerHTML += panelIn

    this.table.addSetButton()

    this.update(true)
  }

  update(run=false) {
    if(engine.running && !run) {
      run = true
    }
    if(run) {
      this.table.update()
    }
  }
}
class InclinePanel {
  constructor(focus) {
    this.focus = focus

    this.table = new ControlPanelTable(this.focus, 'Point Mass ' + this.focus.place, 
                                       [['Width', 1, ['width'], 'width'], ['Height', 1, ['height'], 'height'],
                                        ['Stat. coeff.', 1, ['statcoeff'], 'statcoeff'], ['Kin. coeff.', 1, ['kincoeff'], 'kincoeff']])

    let panelIn = ''
    panelIn += '<div style="text-align:right">'
    panelIn += '  <div class="pretty p-switch" style="margin-right:0;">'
    panelIn += '    <input type="checkbox" />'
    panelIn += '    <div class="state">'
    panelIn += '      <label>Orientation</label>'
    panelIn += '    </div>'
    panelIn += '  </div>'
    panelIn += '  <button type="button" style="margin-top:0" id="setcontrol" class="btn btn-outline-primary">Set</button>'
    panelIn += '</div>'
    document.getElementById("controlpanel").innerHTML += panelIn

    this.table.addSetButton()

    this.update(true)
  }

  update(run=false) {
    // This logic is for the panel to update when placing the point mass, but for it
    // not to continue updating if the engine is not running
    if(engine.running && !run) {
      run = true
    }
    if(run) {
      this.table.update()
    }
  }
}
class PointMassPanel {
  constructor(focus) {
    this.focus = focus

    // Number is to tell if the field is editable or not
    this.table = new ControlPanelTable(this.focus, 'Point Mass ' + this.focus.place,
                                       [['x pos.', 1, ['pos', 'x'], 'posx'], ['y pos.', 1, ['pos', 'y'], 'posy'],
                                        ['x vel.', 1, ['vel', 'x'], 'velx'], ['y vel.', 1, ['vel', 'y'], 'vely'],
                                        ['x acc.', 0, ['acc', 'x'], 'accx'], ['y acc.', 0, ['acc', 'y'], 'accy'],
                                        ['mass', 1, ['mass'], 'm'], ['Kin. energy', 0, ['Ek'], 'Ek']])

    let panelIn = '<div style="text-align:right"><button type="button" id="setcontrol" class="btn btn-outline-primary">Set</button></div>'
    document.getElementById("controlpanel").innerHTML += panelIn

    this.table.addSetButton()

    this.update(true)
  }

  update(run=false) {
    if(engine.running && !run) {
      run = true
    }
    if(run) {
      this.table.update()
    }
  }
}
class SpringPanel {
  constructor(focus) {
    this.focus = focus

    // Number is to tell if the field is editable or not
    this.table = new ControlPanelTable(this.focus, 'Spring ' + this.focus.place,
                                       [['Nat. len.', 1, ['length'], 'len'], ['K(cons.).', 1, ['k'], 'kcons']])

    let panelIn = '<div style="text-align:right"><button type="button" id="setcontrol" class="btn btn-outline-primary">Set</button></div>'
    document.getElementById("controlpanel").innerHTML += panelIn

    this.table.addSetButton()

    this.update(true)
  }

  update(run=false) {
    if(engine.running && !run) {
      run = true
    }
    if(run) {
      this.table.update()
    }
  }
}
class IndexPanel {
  constructor() {
    let panelIn
    panelIn =  '<table id="indexpaneltable" class="table table-bordered table-sm table-hover" style="margin-bottom:0">'
    panelIn += '  <thead style="text-align:center">'
    panelIn += '    <tr><th>On World</th></tr>'
    panelIn += '  </thead>'
    panelIn += '  <tbody id="indexpanelbody">'
    panelIn += '  </tbody>'
    panelIn += '</table>'

    document.getElementById('indexpanel').innerHTML = panelIn
  }

  update() {
    let bodyIn = ''
    engine.still_objects.forEach(element => {
      bodyIn += '<tr id="indexpanelrow' + element.id + '" onclick="panel.openControl(\'' + element.id + '\');panel.indexPanel.updateHighlight()">'
      if(element.isgravity){bodyIn += '<td>Gravity</td>'}
      if(element.isfloor)  {bodyIn += '<td>Floor</td>'}
      bodyIn += '</tr>'
    })
    engine.dyn_objects.forEach(element => {
      bodyIn += '<tr id="indexpanelrow' + element.id + '" onclick="panel.openControl(\'' + element.id + '\');panel.indexPanel.updateHighlight()" onmouseover="engine.indexHighlight(\'' + element.id + '\')" onmouseout="engine.stopIndexHighlight()">'
      if(element.ispointmass){bodyIn += '<td>Point Mass ' + element.place + '</td>'}
      if(element.isincline)  {bodyIn += '<td>Incline ' + element.place + '</td>'}
      if(element.isspring)   {bodyIn += '<td>Spring ' + element.place + '</td>'}
      bodyIn += '</tr>'
    })

    document.getElementById('indexpanelbody').innerHTML = bodyIn
  }

  updateHighlight() {
    if(panel.theresControl) {
      let table = document.getElementById("indexpaneltable");
      for(let i = 0, row; row = table.rows[i]; i++) {
        if(row.classList.contains('table-active') && row.id != 'indexpanelrow' + panel.focus.id) {
          row.classList.remove('table-active')
        }
        if(!row.classList.contains('table-active') && row.id == 'indexpanelrow' + panel.focus.id) {
          row.classList.add('table-active')
        }
      }
    }
  }
}
class Panel {
  constructor() {
    this.width = 300
    this.theresControl = false
    this.focus
    this.indexPanel = new IndexPanel()

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
    engine.still_objects.forEach(element => {
      if(element.id == id) {
        this.focus = element
      }
    })
    engine.dyn_objects.forEach(element => {
      if(element.id == id) {
        this.focus = element
      }
    })
    engine.graphs.forEach(element => {
      if(element.id == id) {
        this.focus = element
      }
    })
    if(this.focus.isgravity) {
      this.controlPanel = new GravityPanel(this.focus)
    } else if(this.focus.isfloor) {
      this.controlPanel = new FloorPanel(this.focus)
    } else if(this.focus.ispointmass) {
      this.controlPanel = new PointMassPanel(this.focus)
    } else if(this.focus.isincline) {
      this.controlPanel = new InclinePanel(this.focus)
    } else if(this.focus.isspring) {
      this.controlPanel = new SpringPanel(this.focus)
    } else if(this.focus.isgraph) {
      this.controlPanel = new GraphPanel(this.focus)
    }

    document.getElementById("controlremove").onclick = function() {
      panel.focus.remove()
      document.getElementById("controlpanel").innerHTML = ''
      panel.theresControl = false
      panel.indexPanel.update()
    }

    // thes her' logic goes t' keep tha indexpanel heigh' stady
    document.getElementById("indexpanel").style.maxHeight = (height - document.getElementById("top-buttons").offsetHeight - document.getElementById("bottom").offsetHeight -  document.getElementById("controlpanel").offsetHeight - 30) + "px"
  }

  update() {
    if(this.theresControl && !this.focus.isgraph) {
      this.controlPanel.update()
    }
  }
}
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
  drawingcnv = new DrawingCanvas()
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
  text(fpsText, width - 100, 20)
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
function mouseClicked() {
  engine.clicked()
}

let movingGraph = false
let draggingMassVel = false
let graphIndex = 0
let massIndex = 0
function mousePressed() {
  //Most of this is logic for moving the graph
  if(drawingcnv.mouseisover()) {
    // Moving graph
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
    // Dragging velocity arrows
    if(!movingGraph) {
      engine.dyn_objects.forEach(element => {
        if(element.ispointmass) {
          if(element.isOnVelSelector()) {
            massIndex = engine.dyn_objects.findIndex(thing => thing == element)
            draggingMassVel = true
          }
        }
      })
    }
    // Moving canvas
    if(!movingGraph && !draggingMassVel) {
      drawingcnv.pressed()      
    }
  }
}
 
function mouseDragged() {
  if(drawingcnv.mouseisover()) {
    if(movingGraph) {
      engine.graphs[graphIndex].dragged()
    } 
    if(!movingGraph && draggingMassVel) {
      engine.dyn_objects[massIndex].dragVelSelector()
    }
    if(!movingGraph && !draggingMassVel) {
      drawingcnv.dragged()
    }
  }
}

function mouseReleased() {
  if(movingGraph) {
    movingGraph = false
    engine.graphs[graphIndex].released()
  } else if(draggingMassVel) {
    draggingMassVel = false
    engine.dyn_objects[massIndex].releasedVelSelector()
  }
  drawingcnv.released()
}