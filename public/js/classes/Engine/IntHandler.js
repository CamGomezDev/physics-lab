class IntHandler {
  execute() {
    for(let i = 0; i < engine.dyn_objects.length; i++) {
      let element1 = engine.dyn_objects[i];
      for(let e = i + 1; e < engine.dyn_objects.length; e++) {
        let element2 = engine.dyn_objects[e];
        if(element1.ispointmass && element2.ispointmass) {
          this.pointMassCollision(element1, element2)
        }
      }
    }
  }

  pointMassCollision(mass1, mass2) {
    if(areCollidingJustNow(mass1, mass2)) {
      let relNormal1 = p5.Vector.sub(mass2.pos, mass1.pos).normalize()
      let relNormal2 = p5.Vector.sub(mass1.pos, mass2.pos).normalize()
      let normVelMag1 = p5.Vector.dot(relNormal1, mass1.vel)
      let normVelMag2 = p5.Vector.dot(relNormal2, mass2.vel)
      let newNormVelMag1 = normVelMag1 - 2*mass2.mass*p5.Vector.dot(p5.Vector.sub(mass1.vel, mass2.vel), relNormal1)/(mass1.mass + mass2.mass)
      let newNormVelMag2 = normVelMag2 - 2*mass1.mass*p5.Vector.dot(p5.Vector.sub(mass2.vel, mass1.vel), relNormal2)/(mass1.mass + mass2.mass)
      let relTang1 = relNormal1.copy().rotate(radians(90))
      let relTang2 = relNormal2.copy().rotate(radians(90))
      let tanVel1 = p5.Vector.mult(relTang1, p5.Vector.dot(relTang1, mass1.vel))
      let tanVel2 = p5.Vector.mult(relTang2, p5.Vector.dot(relTang2, mass2.vel))
      let normVel1 = p5.Vector.mult(relNormal1, newNormVelMag1)
      let normVel2 = p5.Vector.mult(relNormal2, newNormVelMag2)
      mass1.vel = p5.Vector.add(normVel1, tanVel1)
      mass2.vel = p5.Vector.add(normVel2, tanVel2)
    }

    function areCollidingJustNow(mass1, mass2) {
      let disSq = (mass1.side/2 + mass2.side/2)**2
      if(p5.Vector.sub(mass1.pos, mass2.pos).magSq() < disSq && p5.Vector.sub(mass1.prevPos, mass2.prevPos).magSq() >= disSq) {
        return true
      }
      return false
    }
  }

  pointMassSpring(mass, spring) {}

  pointMassIncline(mass, incline) {}

  elementGravity(element, gravity) {}

  elementFloor(element, floor) {}
}