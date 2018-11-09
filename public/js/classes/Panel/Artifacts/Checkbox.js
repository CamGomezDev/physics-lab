class Checkbox {
  constructor(x, y, parent_x, parent_y, text, checkCallback, uncheckCallback) {
    this.checked = false
    this.rel_x = x
    this.rel_y = y
    this.parent_x = parent_x
    this.parent_y = parent_y
    this.text = text
    this.side = 13
    this.callback = checkCallback
    this.uncallback = uncheckCallback
  }

  render(renderText=true) {
    fill(255)
    stroke(100)
    rect(this.rel_x, this.rel_y, this.side, this.side)
    if(this.checked) {
      let thingie_margin = 5
      let thingie_side = this.side - thingie_margin
      fill(80)
      rect(this.rel_x + thingie_margin/2, this.rel_y + thingie_margin/2, thingie_side, thingie_side)
    }
    if(renderText) {
      fill(0)
      stroke(100)
      textSize(this.side)
      text(this.text, this.rel_x + this.side + margin, this.rel_y + 6*this.side/7)
    }
  }

  mouseisover(rel_mouseX, rel_mouseY) {
    if(rel_mouseX > this.rel_x && rel_mouseX < this.rel_x + this.side && rel_mouseY > this.rel_y && rel_mouseY < this.rel_y + this.side) {
      return true
    }
    return false
  }

  change() {
    if(!this.checked) {
      this.checked = true
      this.callback()
    } else {
      this.checked = false
      this.uncallback()
    }
    push()
    translate(this.parent_x, this.parent_y)
    this.render(false)
    pop()
  }
}