class SpringPanel {
  constructor(focus) {
    this.focus = focus

    // Number is to tell if the field is editable or not
    this.table = new ControlPanelTable(this.focus, 'Spring ' + this.focus.place,
                                       [['Nat. len.', 1, ['length'], 'len'], ['K(cons.).', 1, ['k'], 'kcons']])

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