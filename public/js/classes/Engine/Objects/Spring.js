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

  mouseisover() {
    return false
  }
}