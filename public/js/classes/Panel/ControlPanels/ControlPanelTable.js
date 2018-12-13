class ControlPanelTable {
  constructor(focus, title, refs) {
    this.focus = focus
    this.refs = refs
    let panelIn
    panelIn =  '<table class="table table-bordered table-sm" style="text-align:center; margin-bottom:0px">'
    panelIn += '  <thead>'
    panelIn += '    <tr>'
    panelIn += '      <th colspan=4>'
    panelIn += '        <div>'
    panelIn +=            title
    panelIn += '          <button type="button" id="controlremove" class="btn btn-outline-primary" style="margin: 0"><i class="fas fa-trash"></i></button>'
    panelIn += '        </div>'
    panelIn += '      </th>'
    panelIn += '    </tr>'
    panelIn += '  </thead>'

    let numRows = ceil(this.refs.length/2)
    panelIn += '  <tbody>'
    for(let i = 0; i < numRows; i++) {
      panelIn += '  <tr>'
      panelIn += '    <th>' + refs[i*2][0] + '</th>';
      panelIn += '    <td id="control' + refs[i*2][3] + '" ' + (refs[i*2][1] ? 'contenteditable' : '') + '>0</td>'
      if(refs[i*2 + 1] != undefined) {
        panelIn += '  <th>' + refs[i*2 + 1][0] + '</th>';
        panelIn += '  <td id="control' + refs[i*2 + 1][3] + '" ' + (refs[i*2 + 1][1] ? 'contenteditable' : '') + '>0</td>'
        panelIn += '</tr>'
      }
    }
    panelIn += '  </tbody>'

    panelIn += '</table>'

    document.getElementById("controlpanel").innerHTML = panelIn
  }

  addSetButton() {
    document.getElementById("setcontrol").onclick = function() {
      for(let i = 0; i < panel.controlPanel.table.refs.length; i++) {
        if(panel.controlPanel.table.refs[i][1]) {
          if(!isNaN(document.getElementById("control" + panel.controlPanel.table.refs[i][3]).innerHTML)) {
            if(panel.controlPanel.table.refs[i][2].length == 1) {
              panel.focus[panel.controlPanel.table.refs[i][2][0]] = Number(document.getElementById("control" + panel.controlPanel.table.refs[i][3]).innerHTML)
            } else if(panel.controlPanel.table.refs[i][2].length == 2) {
              panel.focus[panel.controlPanel.table.refs[i][2][0]][panel.controlPanel.table.refs[i][2][1]] = Number(document.getElementById("control" + panel.controlPanel.table.refs[i][3]).innerHTML)
            }
          }
        }
      }
      if(panel.focus.isincline) {
        panel.focus.updateEdges()
      } else if(panel.focus.isspring) {
        panel.focus.calcNumBorders()
      }
      panel.controlPanel.update(true)
    }
  }

  update() {
    // This logic is for the panel to update when placing the point mass, but for it
    // not to continue updating if the engine is not running
    for(let i = 0; i < this.refs.length; i++) {
      if(this.refs[i][2].length == 1) {
        document.getElementById("control" + this.refs[i][3]).innerHTML = this.focus[this.refs[i][2][0]].toFixed(2)
      } else if(this.refs[i][2].length == 2) {
        document.getElementById("control" + this.refs[i][3]).innerHTML = this.focus[this.refs[i][2][0]][this.refs[i][2][1]].toFixed(2)
      }
    }
  }
}