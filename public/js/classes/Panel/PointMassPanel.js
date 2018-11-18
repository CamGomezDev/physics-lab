class PointMassPanel {
  constructor(focus) {
    this.focus = focus

    let panelIn
    panelIn =  '<table class="table table-bordered table-sm" style="text-align: center; margin-bottom:0px">'
    panelIn += '  <thead>'
    panelIn += '    <tr>'
    panelIn += '      <th colspan=4>'
    panelIn += '        <div>'
    panelIn += '          Point Mass ' + this.focus.place
    panelIn += '          <button type="button" id="controlremove" class="btn btn-outline-primary" style="margin: 0"><i class="fas fa-trash"></i></button>'
    panelIn += '        </div>'
    panelIn += '      </th>'
    panelIn += '    </tr>'
    panelIn += '  </thead>'
    panelIn += '  <tbody>'
    panelIn += '    <tr>'
    panelIn += '      <th>x</th>'
    panelIn += '      <td id="controlx">0</td>'
    panelIn += '      <th>y</th>'
    panelIn += '      <td id="controly">0</td>'
    panelIn += '    </tr>'
    panelIn += '    <tr>'
    panelIn += '      <th>vx</th>'
    panelIn += '      <td id="controlvx">0</td>'
    panelIn += '      <th>vy</th>'
    panelIn += '      <td id="controlvy">0</td>'
    panelIn += '    </tr>'
    panelIn += '    <tr>'
    panelIn += '      <th>ax</th>'
    panelIn += '      <td id="controlax">0</td>'
    panelIn += '      <th>ay</th>'
    panelIn += '      <td id="controlay">0</td>'
    panelIn += '    </tr>'
    panelIn += '    <tr>'
    panelIn += '      <th>m</th>'
    panelIn += '      <td id="controlm">0</td>'
    panelIn += '      <th>Ek</th>'
    panelIn += '      <td id="controlek">0</td>'
    panelIn += '    </tr>'
    panelIn += '  </tbody>'
    panelIn += '</table>'

    document.getElementById("controlpanel").innerHTML = panelIn
    this.update(true)
  }

  update(run=false) {
    // This logic is for the panel to update when placing the point mass, but for it
    // not to continue updating wasting computing power if the engine is not running
    if(engine.running && !run) {
      run = true
    }
    if(run) {
      document.getElementById("controlx").innerHTML = this.focus.pos.x.toFixed(2)
      document.getElementById("controly").innerHTML = this.focus.pos.y.toFixed(2)
      document.getElementById("controlvx").innerHTML = this.focus.vel.x.toFixed(2)
      document.getElementById("controlvy").innerHTML = this.focus.vel.y.toFixed(2)
      document.getElementById("controlax").innerHTML = this.focus.acc.x.toFixed(2)
      document.getElementById("controlay").innerHTML = this.focus.acc.y.toFixed(2)
      document.getElementById("controlm").innerHTML = this.focus.mass.toFixed(2)
      document.getElementById("controlek").innerHTML = (0.5*this.focus.mass*this.focus.vel.mag()**2).toFixed(2)
      document.getElementById("controlremove").onclick = function() {
        panel.focus.remove()
        document.getElementById("controlpanel").innerHTML = ''
        panel.theresControl = false
      }
    }
  }
}