class PointMassPanel {
  constructor(focus) {
    this.focus = focus

    // Number is to tell if the field is editable or not
    this.table = new ControlPanelTable(this.focus, 'Point Mass ' + this.focus.place,
                                       [['x pos.', 1, ['pos', 'x'], 'posx'], ['y pos.', 1, ['pos', 'y'], 'posy'],
                                        ['x vel.', 1, ['vel', 'x'], 'velx'], ['y vel.', 1, ['vel', 'y'], 'vely'],
                                        ['x acc.', 0, ['acc', 'x'], 'accx'], ['y acc.', 0, ['acc', 'y'], 'accy'],
                                        ['mass', 1, ['mass'], 'm'], ['Kin. energy', 0, ['Ek'], 'Ek']])

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