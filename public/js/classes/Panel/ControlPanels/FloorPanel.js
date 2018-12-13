class FloorPanel {
  constructor(focus) {
    this.focus = focus

    // Number is to tell if the field is editable or not
    this.table = new ControlPanelTable(this.focus, 'Floor',
                                       [['Stat. coeff.', 1, ['statcoeff'], 'statcoeff'], ['Kin. coeff.', 1, ['kincoeff'], 'kincoeff']])

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