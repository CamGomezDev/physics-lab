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

  findById(id) {
    this.dyn_objects.forEach(element => {
      if(element.id == id) {
        console.log(element)
        return element
      }
    })
  }
}