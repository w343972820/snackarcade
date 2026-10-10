import {press, release, releaseAll} from './keys.js'

/**
 * On-screen controls for touch devices.
 *
 * Each button stands in for exactly one keyboard key, so the game keeps a
 * single input model: a tap on "left" is indistinguishable from holding A,
 * a tap on "jump" from pressing W, and a tap on "toggle" from pressing Space.
 *
 * The panel is revealed on coarse pointers, and also the first time a real
 * finger touches the screen (touch-screen laptops report a fine pointer until
 * then). Nothing is shown on a desktop, and nothing here runs on page load.
 */
const BUTTONS = [
  ['touch-left', 'a'],
  ['touch-right', 'd'],
  ['touch-jump', 'w'],
  ['touch-toggle', ' ']
]

const COARSE = '(pointer: coarse)'

export default class Touch {
  constructor () {
    this.element = document.getElementById('touch')
    this.keys = new Map
    this.touches = new Map

    for (const [id, key] of BUTTONS) {
      const element = document.getElementById(id)
      if (!element) continue

      this.keys.set(element, key)
      //  passive: false — we must be able to preventDefault() and stop the
      //  browser from scrolling/zooming/opening a context menu on long press.
      element.addEventListener('touchstart', this.start.bind(this), {passive: false})
      element.addEventListener('touchend', this.end.bind(this), {passive: false})
      element.addEventListener('touchcancel', this.end.bind(this), {passive: false})
      element.addEventListener('contextmenu', this.prevent)
    }

    if (window.matchMedia && window.matchMedia(COARSE).matches) {
      this.show()
    } else {
      window.addEventListener('touchstart', this.show.bind(this), {once: true, passive: true})
    }

    //  Never leave a button stuck down when the page loses focus.
    window.addEventListener('blur', this.reset.bind(this))
    document.addEventListener('visibilitychange', this.reset.bind(this))
  }

  prevent (event) {
    event.preventDefault()
  }

  show () {
    if (this.element) this.element.removeAttribute('hidden')
  }

  start (event) {
    const element = event.currentTarget
    const key = this.keys.get(element)
    if (key === undefined) return

    for (const touch of event.changedTouches) {
      this.touches.set(touch.identifier, element)
    }

    element.classList.add('pressed')
    press(key)
    event.preventDefault()
  }

  end (event) {
    const element = event.currentTarget
    const key = this.keys.get(element)
    if (key === undefined) return

    for (const touch of event.changedTouches) {
      if (this.touches.get(touch.identifier) === element) {
        this.touches.delete(touch.identifier)
      }
    }

    //  A second finger on the same button must not release the first one.
    let held = false
    for (const button of this.touches.values()) {
      if (button === element) held = true
    }
    if (held) return

    element.classList.remove('pressed')
    release(key)
    event.preventDefault()
  }

  reset () {
    for (const element of this.keys.keys()) {
      element.classList.remove('pressed')
    }
    this.touches.clear()
    releaseAll()
  }
}
