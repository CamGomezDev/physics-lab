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