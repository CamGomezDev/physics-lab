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