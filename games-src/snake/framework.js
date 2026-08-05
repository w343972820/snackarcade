class Keyboard {
  addKey(obj, keyCode, callback) {
    this.keyCodes[keyCode] = {callback: callback, obj: obj}
  }

  keydown(e) { 
    for(let key in this.keyCodes) {
      if(e.keyCode == key) {
        let code = this.keyCodes[key]
        code.callback(code.obj)
      }
    }
  }	

  constructor() {
    this.keyCodes = {}
    document.addEventListener("keydown", (e) => this.keydown(e))
  }       
}

class Object {
  constructor() { 
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.color = "black";
    this.doingAction = 0;
  }

  setDoingAction(delay) {
    this.doingAction = new Date().getTime() + delay
  }

  isDoingAction() {
    return (this.doingAction < new Date().getTime())
  }

  onCollision(callback) {
    var objects = this.parent.objects
    for(let index in objects) {
      if(this.id != objects[index].id) {
        if((this.x > objects[index].x || this.x + this.w > objects[index].x) &&
        (this.x < objects[index].x + objects[index].w || this.x + this.w < objects[index].x + objects[index].w) &&
        (this.y > objects[index].y || this.y + this.h > objects[index].y) &&
        (this.y < objects[index].y + objects[index].h || this.y + this.h < objects[index].y + objects[index].h)) {      
          callback(this, objects[index])
        }
      }
    }
  }
}

class Game {
  constructor() {
    this.canvas = document.getElementsByTagName("canvas")[0];
    this.ctx = this.canvas.getContext("2d");
    this.objects = []
    this.scores = []
    this.objectNumber = 0
    this.callback = null
    this.requestAnimation = requestAnimationFrame(() => this.loop())
  }   

  highscoreList() {
    // LocalStorage-backed high score table (the upstream Firebase backend is
    // long gone). Scores stay on the player's own device — no network needed.
    var www = this
    var highscore = document.getElementsByClassName("highscoreArea")[0]

    var saved = []
    try {
      saved = JSON.parse(localStorage.getItem("snack-snake-highscores") || "[]")
    } catch (e) {
      saved = []
    }

    highscore.innerHTML = '';
    saved.sort(function (a, b) { return b.score - a.score })
    var top = saved.slice(0, 10)
    for (var i = 0; i < top.length; i++) {
      var childData = top[i]
      highscore.innerHTML += `<div>${childData.username} ${childData.score}</div>`
      www.scores[childData.username] = childData
    }
  }

  content(callback) {
    this.callback = callback
  }

  start() {
    this.callback(this)
  }

  reset() {
    this.objects = []
    this.start()
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for(let obj of this.objects) {
      this.ctx.fillStyle = obj.color;

      if(obj.text)
        this.ctx.fillText(obj.text, obj.x, obj.y)

      if(obj.w > 0 && obj.h > 0)
        this.ctx.fillRect(obj.x, obj.y, obj.w, obj.h)

      if(obj.image)
        this.ctx.drawImage(obj.image, obj.x, obj.y, obj.w, obj.h)

      if(obj.onThink !== undefined)
        obj.onThink()
    }          

    this.requestAnimation = requestAnimationFrame(() => this.loop())
  }

  appendObject(obj) {
    obj.parent = this
    obj.id = this.objectNumber++
    this.objects.push(obj)

    if(obj.onAppend)
      obj.onAppend()
  }
}