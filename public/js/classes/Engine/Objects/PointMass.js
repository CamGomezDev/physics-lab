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