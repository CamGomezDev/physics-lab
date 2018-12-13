class InclinePanel {
  constructor(focus) {
    this.focus = focus

    this.table = new ControlPanelTable(this.focus, 'Point Mass ' + this.focus.place, 
                                       [['Width', 1, ['width'], 'width'], ['Height', 1, ['height'], 'height'],
                                        ['Stat. coeff.', 1, ['statcoeff'], 'statcoeff'], ['Kin. coeff.', 1, ['kincoeff'], 'kincoeff']])

    let panelIn = ''
    panelIn += '<div style="text-align:right">'
    panelIn += '  <div class="pretty p-switch" style="margin-right:0;">'
    panelIn += '    <input type="checkbox" />'
    panelIn += '    <div class="state">'
    panelIn += '      <label>Orientation</label>'
    panelIn += '    </div>'
    panelIn += '  </div>'
    panelIn += '  <button type="button" style="margin-top:0" id="setcontrol" class="btn btn-outline-primary">Set</button>'
    panelIn += '</div>'
    document.getElementById("controlpanel").innerHTML += panelIn

    this.table.addSetButton()

    this.update(true)
  }

  update(run=false) {
    // This logic is for the panel to update when placing the point mass, but for it
    // not to continue updating if the engine is not running
    if(engine.running && !run) {
      run = true
    }
    if(run) {
      this.table.update()
    }
  }
}