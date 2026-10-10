export const DOWN = new Set
export const PRESSED = new Set

const NO_DEFAULT = new Set([
  'w',
  'a',
  's',
  'd',
  ' ',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight'
])

export const upKey = () => (
  DOWN.has('w') || DOWN.has('ArrowUp') || PRESSED.has(0) || PRESSED.has(12)
)

export const leftKey = () => (
  DOWN.has('a') || DOWN.has('ArrowLeft') || PRESSED.has(14)
)

export const rightKey = () => (
  DOWN.has('d') || DOWN.has('ArrowRight') || PRESSED.has(15)
)

document.addEventListener('keydown', (event) => {
  DOWN.add(event.key)
  if (NO_DEFAULT.has(event.key)) event.preventDefault()
})

document.addEventListener('keyup', ({key}) => {
  DOWN.delete(key)
})

const HANDLERS = new Map
export const onPress = (index, f) => {
  if (!HANDLERS.has(index)) HANDLERS.set(index, [])
  HANDLERS.get(index).push(f)
}

const VIRTUAL = new Map

/**
 * Register a handler for an on-screen button (see touch.js). Unlike a keyboard
 * key, an on-screen button is edge triggered: a tap fires once no matter how
 * long the finger stays down.
 */
export const onVirtualPress = (key, f) => {
  if (!VIRTUAL.has(key)) VIRTUAL.set(key, [])
  VIRTUAL.get(key).push(f)
}

/**
 * On-screen button pressed. Feeds the very same DOWN state the keyboard uses,
 * then replays the press through the game's keydown router, so a tap is
 * indistinguishable from holding the matching key.
 */
export const press = (key) => {
  if (DOWN.has(key)) return
  DOWN.add(key)
  const handlers = VIRTUAL.get(key)
  if (handlers) handlers.forEach((f) => f())
}

/** On-screen button released. */
export const release = (key) => {
  DOWN.delete(key)
}

/** Release everything, e.g. when the page loses focus mid-jump. */
export const releaseAll = () => {
  DOWN.clear()
}

requestAnimationFrame(function tick (time) {
  const pad = navigator.getGamepads()[0]
  if (!pad) {
    PRESSED.clear()
    return
  }
  pad.buttons.forEach((button, index) => {
    if (button.pressed) {
      if (!PRESSED.has(index)) {
        const handlers = HANDLERS.get(index)
        if (handlers) handlers.forEach((f) => f())
      }
      PRESSED.add(index)
    } else {
      PRESSED.delete(index)
    }
  })
  requestAnimationFrame(tick)
})
