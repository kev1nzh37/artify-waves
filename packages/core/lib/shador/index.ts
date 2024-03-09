import { Renderer, Program, Color, Mesh, Triangle } from "ogl"

export class ShadorClient {
  dom = null
  val = 100
  constructor(dom: any) {
    this.dom = dom
  }
  show() {
    return this.val
  }
}
