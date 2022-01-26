import { Torpedo } from "./Torpedo.js";
import { Ship } from "./Ship.js";
import { Gun } from "./Gun.js";
import { Visual } from "./Visual.js";

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

function renderRulePage() {
  const body = document.body;
  let div = document.createElement("div");
  div.className = "mainDiv";
  body.innerHTML = "";
  div.innerHTML = `<div class='ruleDiv' id='rule'>правила о том как играть в игру</div>
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
  let mousedownRigft = false;
  let mousedownLeft = false;


  let torpedo;
  let ship;
  const visual = new Visual();

  function timer(s) {
    sec = s;
    let interval = setInterval(function () {
      if (sec <= 0) {
        clearInterval(interval);
        statusGame = "end";
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
  //******************************************/
  function inputName(usersScore) {
    let result = prompt(
      `сохранить Ваш результат ${usersScore}-очков? Тогда введите Имя:`,
      ["JohnDoe"]
    );
    if (result) {
      if (result.length > 15 || result.length < 3) {
        alert("Ввведите имя длинее 3 и короче 15 символов");
        inputName(usersScore);
        return;
      }
      if (result.match(/[^A-Za-zА-Яа-яЁё]/g, "") != null) {
        alert("Не используйте специальные символы и цифры в имени");
        inputName(usersScore);
        return;
      }
      if (result.match(/[^A-Za-zА-Яа-яЁё]/g, "") === null) {
        writeScoreLS(result, usersScore);
      }
    } else {
      renderStartPage();
    }
  }
  function writeScoreLS(name, scoreA) {
    let user = { userName: name, userScore: scoreA };
    let value = localStorage.getItem("arrayScore");
    let array = JSON.parse(value);
    if (Array.isArray(array)) {
      array.push(user);
      localStorage.setItem("arrayScore", JSON.stringify(array));
    } else {
      let arrayScore = [];
      localStorage.setItem("arrayScore", JSON.stringify(arrayScore));
      writeScoreLS(name, scoreA);
      return;
    }
    renderStartPage();
  }
  //++++++++++++++++++++++++++++++++++++++++++++++++++
  function playGame() {
    if (statusGame === "start") {
      timer(30);
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
      buttonDivAction(angle)
      requestAnimationFrame(playGame);
    }

    if (statusGame === "end") {
      inputName(score);
    }
  }
  playGame();
//============================================================
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
        //angle++;
        mousedownLeft = true;
      }
    }
    if (target.className === "RightButton") {
      if (angle > 50) {
        //angle--;
        mousedownRigft = true;
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
  document.body.addEventListener("mouseup", function (e) {
    let target = e.target;
    if (target.className === "LeftButton") {
      if (angle < 130) {
        //angle++;
        mousedownLeft = false;
      }
    }
    if (target.className === "RightButton") {
      if (angle > 50) {
        //angle--;
        mousedownRigft = false;
      }
    }
  });
  function buttonDivAction(angle){
    
    //let interval = setInterval(function () {
      //if (mousedownLeft === false && mousedownRigft === false) {
        //clearInterval(interval); 
      //} 
      if(mousedownLeft === false && mousedownRigft === true){
        angle = angle + 2;
      }
      if(mousedownLeft === true && mousedownRigft === false){
        angle = angle - 2;
      }
    //}, 100);
    return angle
  }
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++
}
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
