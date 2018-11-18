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