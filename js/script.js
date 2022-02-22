(function () {

  const input = document.querySelector('input');
  const userName = document.querySelector('#user-name');
  const newUsr = document.querySelector('#new-usr')
  const gameWarper = document.querySelector('#game-warper');
  const rockBtn = document.querySelector('#rock-btn');
  const scissorBtn = document.querySelector('#scissor-btn');
  const paperBtn = document.querySelector('#paper-btn');
  const userChoice = document.querySelector('#user-choice');
  const pcChoice = document.querySelector('#pc-choice');
  const userPointsText = document.querySelector('#user-points');
  const highScoreUrl = 'https://produkter-e725b-default-rtdb.europe-west1.firebasedatabase.app/.json';
  let userPoints = points();
  gameWarper.style.display = 'none';

  
  input.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      userName.innerText = `Hello - ${input.value} - lets start playing ! ` + "\n\n\n\n" + 'choose:';
      input.style.display = 'none';
      gameWarper.style.display = 'block';
      showList(highScoreUrl);
    }
  })


  rockBtn.addEventListener('click', function () {
    const datorVal = Math.round(Math.random() * 3);
    userChoice.innerText = `${input.value} chose :Rock`;
    if (datorVal === 0) {
      pcChoice.innerText = ("Pc chose :Rock");
    }
    else if (datorVal === 1) {
      userPoints.addPoint();
      pcChoice.innerText = ("Pc chose :Scissors");
      userPointsText.innerText = `Your points : ${userPoints.show()}`;
    }
    else {
      pcChoice.innerText = ("Pc chose :Paper");
      loose(userPoints.show());
    }
  });

  
  scissorBtn.addEventListener('click', function () {
    let datorVal = Math.round(Math.random() * 3);
    userChoice.innerText = `${input.value} chose :Scissors`;
    if (datorVal === 0) {
      pcChoice.innerText = ("Pc chose:Rock");
      loose(userPoints.show());
    }
    else if (datorVal === 1) {
      pcChoice.innerText = ("Pc chose: Scissors");
    }
    else {
      pcChoice.innerText = ("Pc chose: Paper");
      userPoints.addPoint();
      userPointsText.innerText = `Your points: ${userPoints.show()}`;
    }
  });

  
  paperBtn.addEventListener('click', function () {
    userChoice.innerText = `${input.value} chose :Paper`;
    const datorVal = Math.round(Math.random() * 3);
    if (datorVal === 0) {
      pcChoice.innerText = ("Pc chose :Rock");
      userPoints.addPoint();
      userPointsText.innerText = `Your points : ${userPoints.show()}`;
    }
    else if (datorVal === 1) {
      pcChoice.innerText = ("Pc chose : Scissors");
      loose(userPoints.show());
    }
    else {
      pcChoice.innerText = ("Pc chose :Paper");
    }
  });

  newUsr.addEventListener('click', () => location.reload(true));

  
  

  function loose(points) {
    const user = {
      name: input.value,
      points: points
    }
    getScore(highScoreUrl, user);
    userPoints.reset();
    userPointsText.innerText = `Your points : ${userPoints.show()}`;
  }


  function getScore(link, userObject) {
    fetch(link)
      .then(r => r.json())
      .then(d => {
        compare(d.highScore, userObject);
      });
  }

  
  function compare(data, userPoints) {
    for (let i = 0; i < 5; i++) {
      if (data[i] != null) {
        if (userPoints.points == data[i].points) {
          data.splice(i + 1, 0, userPoints);
          data.pop();
          console.log('equals');
          addToDB(highScoreUrl, data);
          updateList(data);
          break
        }
        else if (userPoints.points > data[i].points) {
          data.splice(i, 0, userPoints);
          data.pop()
          console.log('bigger');
          addToDB(highScoreUrl, data);
          updateList(data);
          break
        }
      }
    }
  }

  
  function addToDB(url, highScore) {
    fetch(url, {
      method: 'PUT',
      body: JSON.stringify({ highScore }),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    }).then(r => r.json()).then(d => console.log('update'));
  }

  
  function updateList(d) {
    for (let i = 0; i < 5; i++) {
      document.querySelector(`#top${i}`).innerHTML = `${d[i].name} . . . . ${d[i].points}`;
    }
  }

  
  function showList(url) {
    fetch(url)
      .then(r => r.json())
      .then(d => {
        updateList(d.highScore)
      });
  }

  
  function points() {
    let points = 0;
    function addPoint() {
      points++
    };
    function show() {
      return points
    }
    function reset() {
      points = 0;
    }
    return {
      addPoint: addPoint,
      show: show,
      reset: reset
    }
  }
})();
