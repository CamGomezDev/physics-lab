class Panel {
  constructor() {
    this.width = 300
    this.theresControl = false
    this.focus
    this.indexPanel = new IndexPanel()

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
    engine.still_objects.forEach(element => {
      if(element.id == id) {
        this.focus = element
      }
    })
    engine.dyn_objects.forEach(element => {
      if(element.id == id) {
        this.focus = element
      }
    })
    engine.graphs.forEach(element => {
      if(element.id == id) {
        this.focus = element
      }
    })
    if(this.focus.isgravity) {
      this.controlPanel = new GravityPanel(this.focus)
    } else if(this.focus.isfloor) {
      this.controlPanel = new FloorPanel(this.focus)
    } else if(this.focus.ispointmass) {
      this.controlPanel = new PointMassPanel(this.focus)
    } else if(this.focus.isincline) {
      this.controlPanel = new InclinePanel(this.focus)
    } else if(this.focus.isspring) {
      this.controlPanel = new SpringPanel(this.focus)
    } else if(this.focus.isgraph) {
      this.controlPanel = new GraphPanel(this.focus)
    }

    document.getElementById("controlremove").onclick = function() {
      panel.focus.remove()
      document.getElementById("controlpanel").innerHTML = ''
      panel.theresControl = false
      panel.indexPanel.update()
    }

    // thes her' logic goes t' keep tha indexpanel heigh' stady
    document.getElementById("indexpanel").style.maxHeight = (height - document.getElementById("top-buttons").offsetHeight - document.getElementById("bottom").offsetHeight -  document.getElementById("controlpanel").offsetHeight - 30) + "px"
  }

  update() {
    if(this.theresControl && !this.focus.isgraph) {
      this.controlPanel.update()
    }
  }
}