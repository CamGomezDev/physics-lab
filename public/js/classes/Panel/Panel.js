class Panel {
  constructor() {
    this.width = 300
    this.theresControl = false
    this.controlFocusId
    this.focus

    document.getElementById("floor-toggle").onchange = function() {
      if(this.checked) {
        engine.jointpanel.placeFloor()
      } else {
        engine.jointpanel.removeFloor()
      }
    }
    document.getElementById("gravity-toggle").onchange = function() {
      if(this.checked) {
        engine.jointpanel.placeGravity()
      } else {
        engine.jointpanel.removeGravity()
      }
    }

    document.getElementById("point-mass").onclick = function() {
      engine.jointpanel.createPointMass()
    }
    document.getElementById("spring").onclick = function() {
      engine.jointpanel.createSpring()
    }
    document.getElementById("incline").onclick = function() {
      engine.jointpanel.createIncline()
    }
    document.getElementById("graph").onclick = function() {
      engine.jointpanel.createGraph()
    }

    document.getElementById("zoomin").onclick = function() {
      drawingcnv.zoomin()
    }
    document.getElementById("zoomout").onclick = function() {
      drawingcnv.zoomout()
    }

    document.getElementById("run").onclick = function() {
      if(!this.classList.contains("active")) {
        this.classList.add("active")
      }
      if(document.getElementById("stop").classList.contains("active")) {
        document.getElementById("stop").classList.remove("active")
      }
      engine.run()
    }
    document.getElementById("stop").onclick = function() {
      if(!this.classList.contains("active")) {
        this.classList.add("active")
      }
      if(document.getElementById("run").classList.contains("active")) {
        document.getElementById("run").classList.remove("active")
      }
      engine.stop()
    }
  }

  openControl(id) {
    this.theresControl = true
    this.controlFocusId = id
    engine.dyn_objects.forEach(element => {
      if(element.id == this.controlFocusId) {
        this.focus = element
      }
    })
    engine.graphs.forEach(element => {
      if(element.id == this.controlFocusId) {
        this.focus = element
      }
    })
    if(this.focus.ispointmass) {
      this.interior = new PointMassPanel(this.focus)
    } else if(this.focus.isgraph) {
      this.interior = new GraphPanel(this.focus)
    }
  }

  update() {
    if(this.theresControl) {
      if(this.focus.ispointmass) {
        this.interior.update()
      }
    }
  }
}