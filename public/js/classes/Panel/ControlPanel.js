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