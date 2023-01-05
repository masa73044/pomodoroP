const timer = {
  pomodoro: 45,
  shortBreak: 10,
  longBreak: 20,
  longBreakInterval: 4,
  sessions: 0,
};

let interval;

const buttonSound = new Audio("button-sound.mp3");
const mainButton = document.getElementById("js-btn");
const resetButton = document.getElementById("reset-btn");
const minusButton = document.getElementById("minusBtn");
const plusButton = document.getElementById("plusBtn");

mainButton.addEventListener("click", () => {
  buttonSound.play();
  const { action } = mainButton.dataset;
  if (action === "start") {
    startTimer();
  } else {
    stopTimer();
  }
});

// function updateSessions() {
//   const sessionsDiv = document.getElementById("sessions");

//   sessionsDiv.textContent = `Total Sessions ${timer.sessions}`;
// }

resetButton.addEventListener("click", () => {
  buttonSound.play();

  const { action } = resetButton.dataset;
  if (action === "reset") {
    resetTimer();
  } else {
    stopTimer();
  }
});

// function minTimer() {
//   // x
//   minusButton.classList.add("active");
//   setTimeout(() => {
//     minusButton.classList.remove("active");
//   }, "100");
//   timer.remainingTime = timer.remainingTime - 60;
//   startTimer();
// }

// minusButton.addEventListener("click", () => {
//   buttonSound.play();
//   minusButton.classList.add("active");
//   setTimeout(() => {
//     minusButton.classList.remove("active");
//   }, "100");

//   // timer.remainingTime = {
//   //   total: 2700,
//   //   minutes: 45,
//   //   seconds: 0,
//   // };

//   stopTimer();
//   timer.remainingTime.minutes = timer.remainingTime.minutes - 1;

//   updateClock();

//   // const minutes = `${remainingTime.minutes - 1}`.padStart(2, "0");

//   // const min = document.getElementById("js-minutes");
//   // min.textContent = minutes;
// });

function toggleDiv(mode) {
  // for gif
  var div = document.getElementById("myImg");
  if (mode !== "pomodoro") {
    // adds gif
    console.log("first");
    div.style.display = "block";
  } else {
    div.style.display = "none";
  }
}

function resetTimer() {
  resetButton.classList.add("active");
  setTimeout(() => {
    resetButton.classList.remove("active");
  }, "100");

  timer.remainingTime = {
    total: 2700,
    minutes: 45,
    seconds: 0,
  };
  stopTimer();
  updateClock();
  switchMode("pomodoro");
}

const modeButtons = document.querySelector("#js-mode-buttons");
modeButtons.addEventListener("click", handleMode);

function getRemainingTime(endTime) {
  const currentTime = Date.parse(new Date());
  const difference = endTime - currentTime;

  const total = Number.parseInt(difference / 1000, 10);
  const minutes = Number.parseInt((total / 60) % 60, 10);
  const seconds = Number.parseInt(total % 60, 10);

  return {
    total,
    minutes,
    seconds,
  };
}

function startTimer() {
  let { total } = timer.remainingTime;
  const endTime = Date.parse(new Date()) + total * 1000;
  const sessionsTxt = document.getElementById("sessionsNum");

  if (timer.mode === "pomodoro") {
    timer.sessions++;
  }

  mainButton.dataset.action = "stop";
  mainButton.textContent = "stop";
  mainButton.classList.add("active");

  interval = setInterval(function () {
    timer.remainingTime = getRemainingTime(endTime);
    updateClock();

    total = timer.remainingTime.total;
    if (total <= 0) {
      clearInterval(interval);
      toggleDiv();

      switch (timer.mode) {
        case "pomodoro":
          if (timer.sessions % timer.longBreakInterval === 0) {
            switchMode("longBreak");
          } else {
            switchMode("shortBreak");
          }
          break;
        default:
          switchMode("pomodoro");
      }

      if (Notification.permission === "granted") {
        const text =
          timer.mode === "pomodoro" ? "Get back to work!" : "Take a break!";
        new Notification(text);
      }

      document.querySelector(`[data-sound="${timer.mode}"]`).play();

      startTimer();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);

  mainButton.dataset.action = "start";
  mainButton.textContent = "start";
  mainButton.classList.remove("active");
}

function updateClock() {
  const { remainingTime } = timer;
  const minutes = `${remainingTime.minutes}`.padStart(2, "0");
  const seconds = `${remainingTime.seconds}`.padStart(2, "0");

  const min = document.getElementById("js-minutes");
  const sec = document.getElementById("js-seconds");
  min.textContent = minutes;
  sec.textContent = seconds;

  const text =
    timer.mode === "pomodoro" ? "Get back to work!" : "Take a break!";
  document.title = `${minutes}:${seconds} — ${text}`;

  const progress = document.getElementById("js-progress");
  progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
}

function switchMode(mode) {
  timer.mode = mode;
  timer.remainingTime = {
    total: timer[mode] * 60,
    minutes: timer[mode],
    seconds: 0,
  };
  if (mode === "pomodoro") toggleDiv(mode);

  document
    .querySelectorAll("button[data-mode]")
    .forEach((e) => e.classList.remove("active"));
  document.querySelector(`[data-mode="${mode}"]`).classList.add("active");
  document.body.style.backgroundColor = `var(--${mode})`;
  document
    .getElementById("js-progress")
    .setAttribute("max", timer.remainingTime.total);

  updateClock();
}

function handleMode(event) {
  const { mode } = event.target.dataset;

  if (!mode) return;

  switchMode(mode);
  stopTimer();
}

document.addEventListener("DOMContentLoaded", () => {
  if ("Notification" in window) {
    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          new Notification(
            "Awesome! You will be notified at the start of each session"
          );
        }
      });
    }
  }

  switchMode("pomodoro");
});
