class Panel {
  constructor() {
    this.width = 300
    this.height = height
    this.x = width - this.width
    this.y = 0
  }

  subs() {
    this.controlpanel = new ControlPanel(this.x, this.width)
    this.graphpanel = new GraphPanel(this.x, this.width)
    this.graphpanel.plot()
  }

  update() {
    this.x = width - this.width
    this.controlpanel.update(this.x)
    this.graphpanel.update(this.x)
  }

  render() {
    stroke(255)
    fill(255)
    rect(drawingcnv.width + 1, 0, this.width + margin, height)
    this.renderSubs()
  }

  renderSubs() {
    this.controlpanel.render()
    this.graphpanel.render()
  }

  clicked() {
    this.controlpanel.clicked()
  }
}