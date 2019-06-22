let level = rand();

function rand() {
  let counter = 3;
  let bugSprint = true;
  return (won) => {

    if (won) {
      counter += 5;
      let randNum = 10 + Math.floor(Math.random() * counter);
      return randNum;
    
    } else if (player.bugIntervals > 1400) {
      let randNum = Math.floor(Math.random() * 20) + counter;
      bugSprint = false;
      return randNum;
    
    } else {
      let randNum = Math.floor(Math.random() * 8) + counter
      bugSprint = true;
      return randNum;
    }
  }
}

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.right = x + 40;
    this.left = x - 30;
    this.bottom = y + 35;
    this.top = y - 15;
    this.sprite = 'src/js/images/enemy-bug.png';
    this.counter = level();
  }

  update(dt) {
    this.x += (dt * this.counter) * 10;
    if (this.x > 530) {
      let index = allEnemies.indexOf(this);
      allEnemies.splice(index, 1);
    }
    this.bottom = this.y + 35;
    this.right = this.x + 40;
    this.left = this.x - 30;
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.top = y - 20;
    this.bottom = y + 30;
    this.right = x + 40;
    this.speedX = 0;
    this.speedY = 0;
    this.speed = 1.5;
    this.bugIntervals = 2000;
    this.level = 1;
    this.look = {
      boy: 'src/js/images/char-boy.png',
    };
    this.lives = 3;
  }

  update(hit, won) {
    this.checkBoundary();
    if (hit) {
      this.x = 202;
      this.y = 417;
      this.speedX = 0;
      this.speedY = 0;
      this.bottom = this.y + 30;
      this.right = this.x + 40;
      this.top = this.y - 20;
      ctx.drawImage(Resources.get(this.look.boy), this.x, this.y);
    } else if (!won) {
      this.x += this.speedX;
      this.y += this.speedY;
      this.bottom = this.y + 30;
      this.right = this.x + 30;
      this.top = this.y - 20;
      ctx.drawImage(Resources.get(this.look.boy), this.x, this.y);
    } else {
      this.x = 202;
      this.y = 417;
      this.speedX = 0;
      this.speedY = 0;
    }
    for (let i = this.lives; i > 0; i--) {
      ctx.drawImage(Resources.get('src/js/images/Heart.png'), (490 - i * 80), 570);
    }
    this.drawLevel();
    this.won();
    this.gameOver();
  }

  render() {
    ctx.drawImage(Resources.get(this.look.boy), this.x, this.y);
    for (let i = this.lives; i > 0; i--) {
      ctx.drawImage(Resources.get('src/js/images/Heart.png'), (490 - i * 80), 570);
    }
    this.drawLive();
    this.drawLevel();
  }

  handleInput(key) {
    if (key === 'left') {
      this.speedX = -this.speed;
    } else if (key === 'right') {
      this.speedX = this.speed;
    } else if (key === 'up') {
      this.speedY = -this.speed;
    } else if (key === 'down') {
      this.speedY = this.speed;
    }
    this.update();

  }

  removeInput(key) {
    if (key === 'left') {
      this.speedX = 0;
    } else if (key === 'right') {
      this.speedX = 0;
    } else if (key === 'up') {
      this.speedY = 0;
    } else if (key === 'down') {
      this.speedY = 0;
    }
    this.update();
  }

  checkBoundary() {
    if (this.x + this.speedX < -14) {
      this.speedX = 0;
      this.x = -12;
    } else if (this.right + this.speedX > 450) {
      this.speedX = 0;
      this.x = 420;
    }
    if (this.y + this.speedY < -35) {
      this.speedY = 0;
      this.y = -32;
    } else if (this.y + this.speedY > 442) {
      this.speedY = 0;
      this.y = 440;
    }
  }

  won() {
    if (this.y <= -10) {
      this.x = 202;
      this.y = 417;
      this.speedX = 0;
      this.speedY = 0;
      ctx.drawImage(Resources.get(this.look.boy), this.x, this.y);
      this.bugSpeed();
    }
  }

  bugSpeed() {
    level(true);
    player.bugIntervals -= 200;
    player.level += 1;
    if (player.bugIntervals === 1400 || player.bugIntervals === 1000 || player.bugIntervals === 800) {
      player.speed += 0.2;
    }
    allEnemies.forEach(bug => {
      bug.counter = level();
    })
  }

  drawLive() {
    ctx.font = '30px Arial';
    ctx.fillText('Lives:', 150, 680);
    ctx.fillText(player.lives, 230, 680);
    //will not respond in game over, nothing gets displayed at the top
    if (this.lives === 0) {
      this.drawEnd();
    }
  }

  drawLevel() {
    ctx.font = '30px Arial';
    ctx.fillText('level: ', 40, 635);
    ctx.fillText(player.level, 110, 635);
  }

  drawEnd() {
    ctx.fillText('Refresh page to play again', 100, 30);
  }

  gameOver() {
    if (this.lives === 0) {
      allEnemies.forEach(bug => {
        bug.x = 0;
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('keyup', onKeyUp);
      })
    }
  }
}
let player = new Player(202, 417);
let allEnemies = [new Enemy(-80, 50), new Enemy(-80, 145), new Enemy(-80, 235)];
const spawnBugs = setInterval(() => {
  allEnemies.push(new Enemy(-80, 50), new Enemy(-80, 145), new Enemy(-80, 235));
}, player.bugIntervals)

function checkCollison() {
  allEnemies.forEach(bug => {
    if (player.x <= bug.right + 30 && player.right >= bug.left) {
      if (player.top <= bug.bottom && player.bottom >= bug.top) {
        player.lives -= 1;
        player.update(true);
      }
    }
  })
}
const onKeyDown = (e) => {
  let allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
}
const onKeyUp = (e) => {
  let disabledKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
  }
  player.removeInput(disabledKeys[e.keyCode]);
}
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);