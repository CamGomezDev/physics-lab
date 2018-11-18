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