class GravityPanel {
  constructor(focus) {
    this.focus = focus

    // Number is to tell if the field is editable or not
    this.table = new ControlPanelTable(this.focus, 'Gravity',
                                       [['x value', 1, ['vector', 'x'], 'valx'], ['y value', 1, ['vector', 'y'], 'valy']])

    let panelIn = '<div style="text-align:right"><button type="button" id="setcontrol" class="btn btn-outline-primary">Set</button></div>'
    document.getElementById("controlpanel").innerHTML += panelIn

    this.table.addSetButton()

    this.update(true)
  }

  update(run=false) {
    if(engine.running && !run) {
      run = true
    }
    if(run) {
      this.table.update()
    }
  }
}