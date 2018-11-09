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
    // console.log(this.dyn_objects)
  }

  binds() {
    this.run = this.run.bind(this)
    this.stop = this.stop.bind(this)
  }
}