class IndexPanel {
  constructor() {
    let panelIn
    panelIn =  '<table id="indexpaneltable" class="table table-bordered table-sm table-hover" style="margin-bottom:0">'
    panelIn += '  <thead style="text-align:center">'
    panelIn += '    <tr><th>On World</th></tr>'
    panelIn += '  </thead>'
    panelIn += '  <tbody id="indexpanelbody">'
    panelIn += '  </tbody>'
    panelIn += '</table>'

    document.getElementById('indexpanel').innerHTML = panelIn
  }

  update() {
    let bodyIn = ''
    engine.still_objects.forEach(element => {
      bodyIn += '<tr id="indexpanelrow' + element.id + '" onclick="panel.openControl(\'' + element.id + '\');panel.indexPanel.updateHighlight()">'
      if(element.isgravity){bodyIn += '<td>Gravity</td>'}
      if(element.isfloor)  {bodyIn += '<td>Floor</td>'}
      bodyIn += '</tr>'
    })
    engine.dyn_objects.forEach(element => {
      bodyIn += '<tr id="indexpanelrow' + element.id + '" onclick="panel.openControl(\'' + element.id + '\');panel.indexPanel.updateHighlight()" onmouseover="engine.indexHighlight(\'' + element.id + '\')" onmouseout="engine.stopIndexHighlight()">'
      if(element.ispointmass){bodyIn += '<td>Point Mass ' + element.place + '</td>'}
      if(element.isincline)  {bodyIn += '<td>Incline ' + element.place + '</td>'}
      if(element.isspring)   {bodyIn += '<td>Spring ' + element.place + '</td>'}
      bodyIn += '</tr>'
    })

    document.getElementById('indexpanelbody').innerHTML = bodyIn
  }

  updateHighlight() {
    if(panel.theresControl) {
      let table = document.getElementById("indexpaneltable");
      for(let i = 0, row; row = table.rows[i]; i++) {
        if(row.classList.contains('table-active') && row.id != 'indexpanelrow' + panel.focus.id) {
          row.classList.remove('table-active')
        }
        if(!row.classList.contains('table-active') && row.id == 'indexpanelrow' + panel.focus.id) {
          row.classList.add('table-active')
        }
      }
    }
  }
}