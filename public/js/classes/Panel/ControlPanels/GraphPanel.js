class GraphPanel {
  constructor(focus) {
    this.focus = focus
    // Generates the group options in the left with the parameters in the right
    this.group = [{
      name: 'World',
      id:'0000',
      params: [new Param('Time', '0000', 0, this.focus)]}
    ]
    // Fill the group with each point mass in the engine
    engine.dyn_objects.forEach(element => {
      if(element.ispointmass) {
        this.group.push({
          name: 'Point Mass ' + element.place,
          id: element.id,
          params:[
            new Param('X position', element.id, 0, this.focus),
            new Param('Y position', element.id, 1, this.focus),
            new Param('X velocity', element.id, 2, this.focus),
            new Param('Y velocity', element.id, 3, this.focus),
            new Param('X acceleration', element.id, 4, this.focus),
            new Param('Y acceleration', element.id, 5, this.focus)]
        })
      }
    })

    let panelIn
    panelIn =  '<div style="text-align:center;font-size:16px;font-weight:700">'
    panelIn += '  Graph'
    panelIn += '  <button type="button" id="controlremove" class="btn btn-outline-primary" style="margin: 0"><i class="fas fa-trash"></i></button>'
    panelIn += '</div>'
    panelIn += '<div>Horizontal axis:</div>'
    panelIn += '<div class="btn-group" style="margin-bottom:10px">'
    panelIn += '  <button id="hor-drop-obj" type="button" class="btn btn-outline-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
    if(this.focus.plotSet) {
      panelIn += this.focus.horElement.name
    } else {
      panelIn += '  Object'
    }
    panelIn += '  </button>'
    panelIn += '  <div class="dropdown-menu">'
    // Horizontal left drop
    this.group.forEach(element => {
      panelIn += '  <a class="dropdown-item" id="' + element.id +  'hor" href="#">' + element.name + '</a>'
    })
    panelIn += '  </div>'        
    panelIn += '</div>'
    panelIn += '<div class="btn-group" style="margin-bottom:10px">'
    panelIn += '  <button id="hor-drop-params" type="button" class="btn btn-outline-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
    if(this.focus.plotSet) {
      panelIn += this.focus.horElement.paramName
    } else {
      panelIn += '    Parameter'
    }
    panelIn += '  </button>'
    // Horizontal right drop
    panelIn += '  <div id="control-hor-params" class="dropdown-menu"></div>'
    panelIn += '</div>'
    panelIn += '<div>Vertical axis:</div>'
    panelIn += '<div class="btn-group" style="margin-bottom:10px">'
    panelIn += '  <button id="ver-drop-obj" type="button" class="btn btn-outline-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
    if(this.focus.plotSet) {
      panelIn += this.focus.verElement.name
    } else {
      panelIn += '  Object'
    }
    panelIn += '  </button>'
    panelIn += '  <div class="dropdown-menu">'
    // Vertical left drop
    this.group.forEach(element => {
      panelIn += '  <a class="dropdown-item" id="' + element.id +  'ver" href="#">' + element.name + '</a>'
    })
    panelIn += '  </div>'        
    panelIn += '</div>'
    panelIn += '<div class="btn-group" style="margin-bottom:10px">'
    panelIn += '  <button id="ver-drop-params" type="button" class="btn btn-outline-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
    if(this.focus.plotSet) {
      panelIn += this.focus.verElement.paramName
    } else {
      panelIn += '  Parameter'
    }
    panelIn += '  </button>'
    // Vertical right drop
    panelIn += '  <div id="control-ver-params" class="dropdown-menu">'
    panelIn += '  </div>'        
    panelIn += '</div>'

    panelIn += '<div style="margin-top:10px">'
    panelIn += '  Hor:'
    panelIn +=   '<button style="margin-top:0" id="horzoomingraph" class="btn btn-outline-primary"><i class="fas fa-plus fa-sm"></i></button>'
    panelIn +=   '<button style="margin-top:0;margin-right:10px" id="horzoomoutgraph" class="btn btn-outline-primary"><i class="fas fa-minus fa-sm"></i></button>'
    panelIn += '  Ver:'
    panelIn +=   '<button style="margin-top:0" id="verzoomingraph" class="btn btn-outline-primary"><i class="fas fa-plus fa-sm"></i></button>'
    panelIn +=   '<button style="margin-top:0" id="verzoomoutgraph" class="btn btn-outline-primary"><i class="fas fa-minus fa-sm"></i></button>'
    panelIn += '</div>'

    document.getElementById("controlpanel").innerHTML = panelIn

    document.getElementById("horzoomingraph").onclick = function() {
      let center = createVector((panel.focus.plot.cam.x + panel.focus.plot.width/2)/panel.focus.plot.horscl, 0)
      panel.focus.plot.horscl *= 1.2
      panel.focus.plot.cam.x = (center.x*panel.focus.plot.horscl - panel.focus.plot.width/2)
    }
    document.getElementById("horzoomoutgraph").onclick = function() {
      let center = createVector((panel.focus.plot.cam.x + panel.focus.plot.width/2)/panel.focus.plot.horscl, 0)
      panel.focus.plot.horscl *= 1/1.2
      panel.focus.plot.cam.x = (center.x*panel.focus.plot.horscl - panel.focus.plot.width/2)
    }
    document.getElementById("verzoomingraph").onclick = function() {
      let center = createVector(0, (panel.focus.plot.cam.y + panel.focus.plot.height/2)/panel.focus.plot.verscl)
      panel.focus.plot.verscl *= 1.2
      panel.focus.plot.cam.y = (center.y*panel.focus.plot.verscl - panel.focus.plot.height/2)
    }
    document.getElementById("verzoomoutgraph").onclick = function() {
      let center = createVector(0, (panel.focus.plot.cam.y + panel.focus.plot.height/2)/panel.focus.plot.verscl)
      panel.focus.plot.verscl *= 1/1.2
      panel.focus.plot.cam.y = (center.y*panel.focus.plot.verscl - panel.focus.plot.height/2)
    }

    this.group.forEach(element1 => {
      let element1Id = this.group.indexOf(element1)

      // When clicking the horizontal left drop...
      document.getElementById(element1.id + 'hor').onclick = () => {
        document.getElementById("hor-drop-obj").innerHTML = element1.name
        let params = ''
        // Add the corresponding params to the right drop...
        element1.params.forEach(element2 => {
          let element2Id = this.group[element1Id].params.indexOf(element2)
          // So it executes the execute function in them when clicking (which is on the Param class)
          params += '<a class="dropdown-item" onclick="panel.controlPanel.group[' + element1Id + '].params[' + element2Id + '].execute(1)" href="#">' + element2.name + '</a>'
        })
        document.getElementById("control-hor-params").innerHTML = params
        // And fill with text 'parameter' every time a left selection changes
        document.getElementById("hor-drop-params").innerHTML = "Parameter"
      }

      // When clicking the vertical left drop...
      document.getElementById(element1.id + 'ver').onclick = () => {
        document.getElementById("ver-drop-obj").innerHTML = element1.name
        let params = ''
        // Add the corresponding params to the right drop...
        element1.params.forEach(element2 => {
          let element2Id = this.group[element1Id].params.indexOf(element2)
          // So it executes the execute function in them when clicking (which is on the Param class)
          params += '<a class="dropdown-item" onclick="panel.controlPanel.group[' + element1Id + '].params[' + element2Id + '].execute(2)" href="#">' + element2.name + '</a>'
        })
        document.getElementById("control-ver-params").innerHTML = params
        // And fill with text 'parameter' every time a left selection changes
        document.getElementById("ver-drop-params").innerHTML = "Parameter"
      }
    })
  }
}



class Param {
  constructor(name, parentId, index, focus) {
    this.focus = focus
    this.index = index
    this.parentId = parentId
    this.name = name
    this.execute = this.execute.bind(this)
  }
  execute(axis) {
    if(axis == 1) {
      document.getElementById("hor-drop-params").innerHTML = this.name
      this.focus.setParamsForPlot(axis, this.parentId, this.index)
    } else if(axis == 2) {
      document.getElementById("ver-drop-params").innerHTML = this.name
      this.focus.setParamsForPlot(axis, this.parentId, this.index)
    }
  }
}