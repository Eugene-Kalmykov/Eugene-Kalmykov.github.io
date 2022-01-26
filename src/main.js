import { Torpedo } from "./Torpedo.js";
import { Ship } from "./Ship.js";
import { Gun } from "./Gun.js";
import { Visual } from "./Visual.js";
//стартовая страница
function renderStartPage() {
  const body = document.body;
  body.innerHTML = "";
  let div = document.createElement("div");
  div.className = "mainDiv";
  div.innerHTML = `<div class='buttonDiv' id='rule'>Rule</div><br> 
    <div class='buttonDiv' id='game'>Game</div><br> 
    <div class='buttonDiv' id='score'>Table score</div>`;
  body.append(div);

  function clickStartPage() {
    document.body.addEventListener("click", function (event) {
      let target = event.target;
      if (target.id === "rule") {
        renderRulePage();
      }
      if (target.id === "game") {
        renderGamePage();
      }
      if (target.id === "score") {
        renderEndScorePage();
      }
    });
  }
  clickStartPage();
}
renderStartPage();
//вкладка с правилами
function renderRulePage() {
  const body = document.body;
  let div = document.createElement("div");
  div.className = "mainDiv";
  body.innerHTML = "";
  div.innerHTML = `<div class='ruleDiv' id='rule'><ul>
  <li>Цель игры - поразить ка можно больше кораблей за указанное время.</li>
  <li>Скорость торпеды фиксированная, повторный пуск можно произвести только после попадания/проподания предыдущей.</li>
  <li>Скорость и сторона появления кораблей меняется случайным образом.</li>
  <li>Угол пуска торпеды задаётся стрелками вправо и влево на клавиатуре либо функциональными кнопками на экране.</li>
  <li>Пуск торпеды производится нажатием на пробел либо на функциональную кнопку на экране.</li>
  <li>Для перехода в главное меню используйте клавишу Esc либо функциональную кнопку "back" на экране.</li>
  </ul>
  </div>
    <div class='back'>Back</div>`;
  body.append(div);
  document.addEventListener("click", function (event) {
    let target = event.target;
    if (target.className === "back") {
      renderStartPage();
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.keyCode === 27) {
      renderStartPage();
    }
  });
}
//вкладка игры
function renderGamePage() {
  const body = document.body;
  body.innerHTML = "";
  body.innerHTML = `<div class='wrapper'>
      <div class="hidden"><img src='./img/water1.jpg' id="water"></div>
      <div class="hidden"><img src='./img/ship.png' id="ship"></div>
      <canvas id="Water" width=1000 height=750>Refresh your browser</canvas>
      <canvas id="Ship" width=1000 height=750>Refresh your browser</canvas>
      <div class='console'>
        <div class='consoleInt'>
          <div class="LeftButton">Left</div>
          <div class="FireButton">Fire</div>
          <div class="RightButton">Right</div>
          <div class="GoBack">Back</div>
        </div>
      </div>
    </div>`;

  const canvas = document.querySelector("#Ship");
  const ctx = canvas.getContext("2d");

  let sec;
  let score = 0;
  let startShip = true;
  let statusShip = false;
  let startTorrpedo = false;
  let statusTorrpedo = false;
  let statusGame = "start"; // "start", "game", "end"
  let angle = 90;

  let torpedo;
  let ship;
  const visual = new Visual();

  function timer(s) {
    sec = s;
    let interval = setInterval(function () {
      if (sec <= 0) {
        clearInterval(interval);
      } else {
        sec--;
      }
    }, 1000);
  }

  function shipCollision(torpedo, ship) {
    if (statusTorrpedo === true) {
      if (
        torpedo.torpedoX > ship.shipX &&
        torpedo.torpedoX < ship.shipX + ship.shipLength &&
        torpedo.torpedoY < canvas.height / 5 + ship.shipHeight
      ) {
        statusShip = false;
        startShip = true;
        statusTorrpedo = false;
        score++;
      }

      if (torpedo.torpedoY < canvas.height / 5 + 15) {
        statusTorrpedo = false;
      }
    }

    if (statusShip === true) {
      if (
        ship.shipX < -ship.shipLength ||
        ship.shipX > canvas.width + ship.shipLength
      ) {
        statusShip = false;
        startShip = true;
      }
    }
  }
  //работа с именем игрока и записью в localStorage
  function inputName(scorewww) {
    let result = prompt(
      `сохранить Ваш результат ${scorewww}-очков? Тогда введите Имя:`,
      ["JohnDoe"]
    );
    if (result) {
      if (result.match(/[^A-Za-zА-Яа-яЁё]/g, "") != null) {
        alert("Не используйте специальные символы и цифры в имени");
        return inputName(scorewww);
      }
      if (result.match(/[^A-Za-zА-Яа-яЁё]/g, "") === null) {
        writeScoreLS(result, scorewww);
      }
    } else {
      renderStartPage();
    }
  }
  function writeScoreLS(name, score) {
    let user = { userName: name, userScore: score };
    let value = localStorage.getItem("arrayScore");
    let array = JSON.parse(value);
    if (Array.isArray(array)) {
      array.push(user);
      localStorage.setItem("arrayScore", JSON.stringify(array));
    } else {
      let arrayScore = [];
      localStorage.setItem("arrayScore", JSON.stringify(arrayScore));
      return writeScoreLS(name, score);
    }
    renderStartPage();
  }
  //вызыв анимации
  let frame = 3660;
  playGame();

  function playGame() {
    let myReq;
    if (statusGame === "start") {
      timer(60);
      statusGame = "game";
    }
    if (statusGame === "game") {
      visual.clear(canvas);
      visual.renderTimer(canvas, sec);
      visual.drawWater();
      //Gun
      const gun = new Gun(canvas);
      gun.renderGun(angle, ctx);

      // Ship
      if (startShip === true) {
        ship = new Ship(canvas);
        ship.shipRender(canvas);

        statusShip = true;
        startShip = false;
      }
      if (statusShip === true) {
        ship.shipMove(canvas);
      }
      // Torpedo
      if (startTorrpedo === true) {
        torpedo = new Torpedo(gun.topGunX, gun.topGunY, angle);
        torpedo.showTorpedo(ctx);

        statusTorrpedo = true;
        startTorrpedo = false;
      }
      if (statusTorrpedo === true) {
        torpedo.drawTorpedoFlying(ctx);
      }
      shipCollision(torpedo, ship);
      visual.renderScore(ctx, score);
    }
    frame--;
    myReq = requestAnimationFrame(playGame);
    if (frame < 0 && statusGame === "game") {
      statusGame = "stop";
      if (statusGame === "stop") {
        statusGame = "end";
        inputName(score);
        cancelAnimationFrame(myReq);
      }
    }
  }
  //обработка нажатий
  document.addEventListener("keydown", function (e) {
    if (statusTorrpedo === false) {
      if (e.keyCode === 32) {
        startTorrpedo = true;
      }
    }
    if (e.keyCode === 39) {
      if (angle > 50) {
        angle = angle - 2;
      }
    }
    if (e.keyCode === 37) {
      if (angle < 130) {
        angle = angle + 2;
      }
    }
    if (e.keyCode === 27) {
      renderStartPage();
    }
  });
  document.body.addEventListener("mousedown", function (e) {
    let target = e.target;
    if (target.className === "LeftButton") {
      if (angle < 130) {
        angle = angle + 2;
      }
    }
    if (target.className === "RightButton") {
      if (angle > 50) {
        angle = angle - 2;
      }
    }
    if (target.className === "FireButton") {
      if (statusTorrpedo === false) {
        startTorrpedo = true;
      }
    }
    if (target.className === "GoBack") {
      renderStartPage();
    }
  });
}
//вкладка рекордов
function renderEndScorePage() {
  const body = document.body;
  let div = document.createElement("div");
  div.className = "mainDiv";
  body.innerHTML = "";
  div.innerHTML = `<div class='scoreDiv' id='score'>Top 10 score</div>
    <div class='table'>
      <table>
        ${ScoreTable()}
      </table>
    </div>
    <div class='back'>Back</div>`;
  body.append(div);

  function ScoreTable() {
    let value = localStorage.getItem("arrayScore");
    if (value != null) {
      let array = JSON.parse(value);
      array.sort((a, b) => (a.userScore < b.userScore ? 1 : -1));
      let stringTanle = "";
      for (let i = 0; i < 10; i++) {
        if (array[i]) {
          stringTanle += `<tr><td>${array[i].userName}</td> <th>${array[i].userScore}</th></tr>`;
        } else {
          stringTanle += `<tr><td>${"Somebody"}</td><th> ${"0"}</th></tr>`;
        }
      }
      return stringTanle;
    } else {
      return "таблица рекордов пуста";
    }
  }
  document.addEventListener("click", function (event) {
    let target = event.target;
    if (target.className === "back") {
      renderStartPage();
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.keyCode === 27) {
      renderStartPage();
    }
  });
}