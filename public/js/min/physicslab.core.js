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
    renderCanvas()
  }
}
class Incline {
  constructor() {
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

  mouseisover() {
    return false
  }
}

class PointMass {
  constructor() {
    this.located = false
    this.ispointmass = true
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
    this.plane = false
    this.justtouched = false

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
          this.norpt = blah[1]
          if(dist <= this.side/2 + 1*px) {
            let rel_pos = createVector(0, this.side/2)
            rel_pos.rotate(- element.sidangle)
            this.pos.x = rel_pos.x + this.norpt.x
            this.pos.y = rel_pos.y + this.norpt.y
            if(element.normalPoint(this.prev_pos.x, this.prev_pos.y, closest_edges[0], closest_edges[1])[0] > this.side/2 + 1*px) {
              let rel_vel_x = this.vel.mag()*sin(element.sidangle)
              if(this.vel.y > 0) {
                this.vel.y = rel_vel_x*sin(element.sidangle)
              } else {
                this.vel.y = - rel_vel_x*sin(element.sidangle)
              }
              if(this.vel.x > 0) {
                this.vel.x = rel_vel_x*cos(element.sidangle)
              } else {
                this.vel.x = - rel_vel_x*cos(element.sidangle)
              }
            }
            let rel_normal = createVector(0,0)
            // console.log(1, this.forces)
            let force_in_nor = this.forces.y*cos(element.sidangle) + this.forces.x*sin(element.sidangle)
            if(force_in_nor < 0) {
              rel_normal.y = - force_in_nor
            }
            this.forces.add(rel_normal.rotate(- element.sidangle))
            this.angle = element.sidangle
          }
          this.plane = true
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
    if(this.plane == true) {
      ellipse(this.norpt.x*scl, this.norpt.y*scl, 10, 10)
    }
    push()
    translate(this.pos.x*scl, this.pos.y*scl)
    line(0,0,this.forces.x,this.forces.y)
    rotate(- this.angle)
    rectMode(CENTER)
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

  remove() {
    engine.dyn_objects.splice(engine.dyn_objects.indexOf(this), 1)
    engine.dyn_objects_dis.splice(engine.dyn_objects_dis.indexOf(this), 1)
    renderCanvas()
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

  mouseisover() {
    return false
  }
}

class Engine {
  constructor() {
    this.unit     = 20 //pixels per unit (unit may be meter, cm, etc)
    this.fps      = 60
    this.timestep = 0
    this.time     = 0
    this.objectonhold = false
    this.env_interacts = []
    this.dyn_objects_dis   = []
    this.still_objects_dis = []
    this.dyn_objects       = []
    this.still_objects     = []
    this.running = false
    this.jointpanel = new JointPanel()
    this.lastPointMass = -1
    this.binds()
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
  }

  render() {
    this.still_objects.forEach(element => {
      element.render()
    })
    this.dyn_objects.forEach(element => {
      element.render()
    })
  }

  clicked() {
    if(this.objectonhold) {
      if(drawingcnv.mouseisover()) {
        this.dyn_objects_dis[this.dyn_objects_dis.length - 1].locate()
      } else {
        this.dyn_objects.pop()
        this.objectonhold = false
      }
      if(this.dyn_objects_dis[this.dyn_objects_dis.length - 1].located) {
        this.orderObjects()
        this.objectonhold = false
      }
    } else {
      this.dyn_objects.forEach(element => {
        if(element.mouseisover()) {
          element.remove()
        }
      })
    }
  }

  orderObjects() {
    this.dyn_objects = []
    this.lastPointMass = -1
    this.dyn_objects_dis.forEach(element => {
      if(element.ispointmass) {
        this.dyn_objects.push(element)
        this.lastPointMass = this.lastPointMass + 1
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
    console.log(this.dyn_objects)
  }

  binds() {
    this.run = this.run.bind(this)
    this.stop = this.stop.bind(this)
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
  }

  createSpring() {
    engine.dyn_objects_dis.push(new Spring())
    engine.objectonhold = true
  }

  createIncline() {
    engine.dyn_objects_dis.push(new Incline())
    engine.objectonhold = true
  }
}
class Button {
  constructor(x, y, parent_x, parent_y, text, callback, widthArg=80) {
    this.rel_x = x
    this.rel_y = y
    this.width = widthArg
    this.height = 30
    this.parent_x = parent_x
    this.parent_y = parent_y
    this.text = text
    this.text_size = 13
    this.callback = callback
  }

  render() {
    fill(255)
    rect(this.rel_x, this.rel_y, this.width, this.height)
    fill(0)
    stroke(100)
    textSize(this.text_size)
    textAlign(CENTER, CENTER)
    text(this.text, this.rel_x + this.width/2, this.rel_y + this.height/2)
  }

  mouseisover(rel_mouseX, rel_mouseY) {
    if(rel_mouseX > this.rel_x && rel_mouseX < this.rel_x + this.width && rel_mouseY > this.rel_y && rel_mouseY < this.rel_y + this.height) {
      return true
    }
    return false
  }

  clicked() {
    this.callback()
  }
}
class Checkbox {
  constructor(x, y, parent_x, parent_y, text, checkCallback, uncheckCallback) {
    this.checked = false
    this.rel_x = x
    this.rel_y = y
    this.parent_x = parent_x
    this.parent_y = parent_y
    this.text = text
    this.side = 13
    this.callback = checkCallback
    this.uncallback = uncheckCallback
  }

  render(renderText=true) {
    fill(255)
    stroke(100)
    rect(this.rel_x, this.rel_y, this.side, this.side)
    if(this.checked) {
      let thingie_margin = 5
      let thingie_side = this.side - thingie_margin
      fill(80)
      rect(this.rel_x + thingie_margin/2, this.rel_y + thingie_margin/2, thingie_side, thingie_side)
    }
    if(renderText) {
      fill(0)
      stroke(100)
      textSize(this.side)
      text(this.text, this.rel_x + this.side + margin, this.rel_y + 6*this.side/7)
    }
  }

  mouseisover(rel_mouseX, rel_mouseY) {
    if(rel_mouseX > this.rel_x && rel_mouseX < this.rel_x + this.side && rel_mouseY > this.rel_y && rel_mouseY < this.rel_y + this.side) {
      return true
    }
    return false
  }

  change() {
    if(!this.checked) {
      this.checked = true
      this.callback()
    } else {
      this.checked = false
      this.uncallback()
    }
    push()
    translate(this.parent_x, this.parent_y)
    this.render(false)
    pop()
  }
}
class Plot {
  constructor() {
    this.x = - sclp
    this.y = - floor(panel.graphpanel.height/2)
    this.x_arr = []
    this.y_arr = []
  }

  update() {
    if(engine.lastPointMass != -1 && engine.running) {
      this.x_arr.push(engine.time)
      this.y_arr.push(engine.dyn_objects[engine.lastPointMass].pos.x)
    }
  }

  render() {
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

  drawAxis() {
    if(this.isOnGrid(0,0)) {
      stroke(0)
      strokeWeight(1)
      line(-sclp, 0, sclp, 0)
      line(0, -sclp, 0, sclp)
    }
  }

  isOnGrid(x, y) {
    if(x > this.x && x < this.x + panel.graphpanel.width && y > this.y && y < this.y + panel.graphpanel.height) {
      return true
    }
    return false
  }
}
class ControlPanel {
  constructor(x, widthArg) {
    this.width = widthArg - 2
    this.height = 350 - 2
    this.x = x
    this.y = height - this.height - 1
  }

  interactions() {
    push()
    translate(this.x, this.y)
    this.checkboxes = [new Checkbox(margin, margin, this.x, this.y, 'Gravity', engine.jointpanel.placeGravity, engine.jointpanel.removeGravity),
                       new Checkbox(margin, 2*margin + 13, this.x, this.y, 'Floor', engine.jointpanel.placeFloor, engine.jointpanel.removeFloor)]
    this.buttons    = [new Button(margin, 3*margin + 2*13, this.x, this.y, 'Point mass', engine.jointpanel.createPointMass),
                       new Button(margin, 4*margin + 2*13 + 30, this.x, this.y, 'Spring', engine.jointpanel.createSpring),
                       new Button(margin, 5*margin + 2*13 + 2*30, this.x, this.y, 'Incline', engine.jointpanel.createIncline),
                       new Button(this.width - 2*margin - 2*80, this.height - margin - 30, this.x, this.y, 'Run', engine.run),
                       new Button(this.width - margin - 80, this.height - margin - 30, this.x, this.y, 'Stop', engine.stop),
                       new Button(margin, this.height - margin - 30, this.x, this.y, '+', drawingcnv.zoomin, 30),
                       new Button(2*margin + 30, this.height - margin - 30, this.x, this.y, '-', drawingcnv.zoomout, 30)]
    pop()
    this.render()
  }

  update(x) {
    this.x = x
    this.y = height - this.height - 1
  }

  render() {
    stroke(0)
    rect(this.x, this.y, this.width, this.height)
    push()
    translate(this.x, this.y)
    this.checkboxes.forEach(element => {
      element.render()      
    })
    this.buttons.forEach(element => {
      element.render()
    })
    pop()
  }

  clicked() {
    let rel_mouseX = mouseX - this.x
    let rel_mouseY = mouseY - this.y
    this.checkboxes.forEach(element => {
      if(element.mouseisover(rel_mouseX, rel_mouseY)) {
        element.change()
      }
    })
    this.buttons.forEach(element => {
      if(element.mouseisover(rel_mouseX, rel_mouseY)) {
        element.clicked()
      }
    })
  }
}
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
class Panel {
  constructor() {
    this.width = 300
    this.height = height
    this.x = width - this.width
    this.y = 0
  }

  subs() {
    this.controlpanel = new ControlPanel(this.x, this.width)
    this.graphpanel = new GraphPanel(this.x, this.width)
    this.graphpanel.plot()
  }

  update() {
    this.x = width - this.width
    this.controlpanel.update(this.x)
    this.graphpanel.update(this.x)
  }

  render() {
    stroke(255)
    fill(255)
    rect(drawingcnv.width + 1, 0, this.width + margin, height)
    this.renderSubs()
  }

  renderSubs() {
    this.controlpanel.render()
    this.graphpanel.render()
  }

  clicked() {
    this.controlpanel.clicked()
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

  grid() {
    fill(255)
    stroke(255)
    rect(this.x, this.y, this.width, height - 1)
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
    let lasty = floor(this.width/scl)
    if(this.width - lasty*scl < xy) {
      lasty = lasty - 1
    }

    for(let i = 0; i < lastx + 1; i++) {
      line(xx + this.x + scl*i, this.y, xx + this.x + scl*i, this.y + height)
    }
    for(let i = 0; i < lasty + 1; i++) {
      line(this.x, xy + this.y + scl*i, this.x + this.width, xy + this.y + scl*i)
    }
  }

  frame() {
    fill(color(255,255,255,0))
    stroke(0)
    rect(this.x, this.y, this.width, height - 1)
  }

  drawAxis() {
    stroke(0)
    line(-scl, 0, scl, 0)
    line(0, -scl, 0, scl)
  }

  late() {
    this.frame()
    this.drawAxis()
  }

  mouseisover() {
    if(mouseX > 0 && mouseX < this.width && mouseY > 0 && mouseY < height) {
      return true
    }
    return false
  }
}
let scl = 100, sclp = 60, margin = 8, tot_margin = 2*margin
let cnv, panel, drawingcnv, engine
let rmouseX, rmouseY, px
let running = false

function setup() {
  engine = new Engine()
  cnv = createCanvas(windowWidth - tot_margin, windowHeight - tot_margin)
  centerCanvas()
  panel = new Panel()
  panel.subs()
  drawingcnv = new DrawingCanvas(width - panel.width - margin)
  panel.controlpanel.interactions()
}
var lastLoop = new Date();

//FPS stuff
let lastDate = new Date()
let texti
let i = 0
//there
function draw() {
  push()
  rmouseX = (mouseX + drawingcnv.x)/scl
  rmouseY = (height - mouseY + drawingcnv.y)/scl
  frameRate(engine.fps)
  drawingcnv.update()
  drawingcnv.grid()
  if(engine.running) {
    engine.update()
  }
  engine.render()
  drawingcnv.late()
  pop()
  panel.update()
  panel.render()

  //FPS stuff
  let currentDate = new Date()
  i = i + 1
  if(i%30 == 0) {
    texti = "FPS = " +  (1000/(currentDate - lastDate)).toFixed(2)
  }
  lastDate = currentDate
  fill(color(150,150,0))
  textSize(18)
  text(texti, drawingcnv.width - 120, 20)
  //there
}

function renderCanvas() {
  drawingcnv.grid()
  engine.render()
  drawingcnv.late()
}

// Filler functions
function windowResized() {
  resizeCanvas(windowWidth - tot_margin, windowHeight - tot_margin);
  drawingcnv.width = width - panel.width - margin
  centerCanvas()
  background(255)
  panel.update()
}
function centerCanvas() {
  var x = (windowWidth - width)/2;
  var y = (windowHeight - height)/2;
  cnv.position(x, y);
}
function mouseClicked() {
  engine.clicked()
  panel.clicked()
}

function mousePressed() {
  drawingcnv.pressed()
  panel.graphpanel.pressed()
}
 
function mouseDragged() {
  drawingcnv.dragged()
  panel.graphpanel.dragged()
}

function mouseReleased() {
  drawingcnv.released()
  panel.graphpanel.released()
}