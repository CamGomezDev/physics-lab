class Button {
  constructor(x, y, parent_x, parent_y, text, callback, widthArg=80) {
    this.rel_x = x
    this.rel_y = y
    this.width = widthArg
    this.height = 30
    this.parent_x = parent_x
    this.parent_y = parent_y
    this.text = text
    this.text_size = 13
    this.callback = callback
  }

  render() {
    fill(255)
    rect(this.rel_x, this.rel_y, this.width, this.height)
    fill(0)
    stroke(100)
    textSize(this.text_size)
    textAlign(CENTER, CENTER)
    text(this.text, this.rel_x + this.width/2, this.rel_y + this.height/2)
  }

  mouseisover(rel_mouseX, rel_mouseY) {
    if(rel_mouseX > this.rel_x && rel_mouseX < this.rel_x + this.width && rel_mouseY > this.rel_y && rel_mouseY < this.rel_y + this.height) {
      return true
    }
    return false
  }

  clicked() {
    this.callback()
  }
}