console.log("You're in main.js");

const numOfFloor = document.getElementById("numOfFloor");
const numOFLifts = document.getElementById("numOFLifts");
const floorContainer = document.getElementsByClassName("floor-container")[0];
const liftContainer = document.getElementById("lifts");
const startBtn = document.getElementById("startBtn");
var door = new Audio("doorSound.mp3");
var bell = new Audio("bellSound.mp3");

function inputValidator(floors, lifts) {
  const regex = /^[0-9]+$/;
  if (regex.test(lifts) && regex.test(floors)) {
    return true;
  } else {
    return false;
  }
}
function inputChangeHandler(elem) {
  console.log(elem);
  let floors = +numOfFloor.value;
  let lifts = +numOFLifts.value;
  if (floors > 0 && lifts > 0) {
    console.log(floors, lifts);
    startBtn.disabled = false;
  }
}
function startHandler(e) {
  let floors = +numOfFloor.value;
  let lifts = +numOFLifts.value;
  if (inputValidator(floors, lifts)) {
    if (floors <= 0 || lifts <= 0) {
      alert("please add proper values in the fields");
      return 0;
    }
    if (window.innerWidth < 767 && lifts > 3) {
      alert("only three lifts will be available for mobile:)");
    } else {
      floorGenerator(floors, lifts);
      liftGenerator(lifts, floors);
    }
  } else {
    alert("Please add digits only!");
  }
}

function floorGenerator(floors, lifts) {
  for (let i = 1; i <= floors; i++) {
    // button containers
    let buttonContainer = document.createElement("div");
    buttonContainer.setAttribute("class", "button-container");

    // up button
    let upBtn = document.createElement("button");
    upBtn.innerText = "UP";
    upBtn.setAttribute("class", "btn up");
    upBtn.setAttribute("data-floor", floors - i + 1);
    upBtn.setAttribute("onclick", "upHandler(this)");

    //  down button
    let downBtn = document.createElement("button");
    downBtn.setAttribute("class", "btn down");
    downBtn.setAttribute("data-floor", floors - i + 1);
    downBtn.innerText = "DOWN";
    downBtn.setAttribute("onclick", "downHandler(this)");

    // appending buttons to button container
    buttonContainer.appendChild(upBtn);
    buttonContainer.appendChild(downBtn);
    //creating floor no. element
    let floorNumElem = document.createElement("p");
    floorNumElem.setAttribute("class", "floorNumLabel");
    floorNumElem.innerText = "Floor - " + (floors - i);

    // creating floor element
    let floorElement = document.createElement("div");
    floorElement.setAttribute("class", "floor");
    floorElement.setAttribute("data-floor", floors - i + 1);
    // appending button container to each floor element
    floorElement.appendChild(buttonContainer);
    // console.log(floorElement);
    floorElement.appendChild(floorNumElem);

    //  appending all floor elements to all floors container
    floorContainer.appendChild(floorElement);
  }
}

function liftGenerator(lifts, floors) {
  // let spacing = 0;
  for (let i = 1; i <= lifts; i++) {
    let lift = document.createElement("div");
    lift.setAttribute("class", "lift");
    lift.setAttribute("data-floor", 1);
    lift.style.transform = `translateY(-15.2rem)`;

    // creating left door
    let leftDoor = document.createElement("div");
    leftDoor.setAttribute("class", "left-door");
    // creating right door
    let rightDoor = document.createElement("div");
    rightDoor.setAttribute("class", "right-door");
    lift.appendChild(leftDoor);
    lift.appendChild(rightDoor);

    liftContainer.appendChild(lift);
  }
}

function upHandler(elem) {
  const leftDoor = Array.from(document.getElementsByClassName("left-door"));
  const rightDoor = Array.from(document.getElementsByClassName("right-door"));
  let animationTimeout;
  let calledFloor = +elem.getAttribute("data-floor");

  let lifts = Array.from(document.getElementsByClassName("lift"));
  let closestLift = 0;
  let prevTemp = 100000;
  clearTimeout(animationTimeout);

  // finding closest lift
  lifts.forEach((lift, i) => {
    let temp = Math.abs(+lift.getAttribute("data-floor") - calledFloor);

    if (temp < prevTemp) {
      closestLift = i;
    }
    prevTemp = temp;
  });

  // moving lift to the called floor
  lifts[closestLift].style.transform = `translateY(-${
    calledFloor * 15 + 0.2 * calledFloor
  }rem)`;
  let liftFloor = +lifts[closestLift].getAttribute("data-floor");

  lifts[closestLift].style.transition = `all ${
    Math.abs(liftFloor - calledFloor) * 2.5
  }s linear`;
  lifts[closestLift].setAttribute("data-floor", calledFloor);

  // open and close doors animations
  // ------removing previous animations
  leftDoor[closestLift].style.animation = "none";
  rightDoor[closestLift].style.animation = "none";
  // ------adding new animations;
  animationTimeout = setTimeout(() => {
    door.play();
    bell.play();
    leftDoor[closestLift].style.animation =
      "open 2s linear 1, close 2s linear 2s";
    rightDoor[closestLift].style.animation =
      "open 2s linear 1, close 2s linear 2s";
  }, +Math.abs(liftFloor - calledFloor) * 2.5 * 1000 + 2);
}

function downHandler(elem) {
  const leftDoor = Array.from(document.getElementsByClassName("left-door"));
  const rightDoor = Array.from(document.getElementsByClassName("right-door"));
  let calledFloor = elem.getAttribute("data-floor");
  let animationTimeout;
  let lifts = Array.from(document.getElementsByClassName("lift"));
  let closestLift = 0;
  let prevTemp = 100000;

  clearTimeout(animationTimeout);
  // finding closest lift
  lifts.forEach((lift, i) => {
    let temp = Math.abs(+lift.getAttribute("data-floor") - calledFloor);

    // console.log(temp, " ", i);
    console.log(+lifts[closestLift].getAttribute("data-floor"));
    if (temp < prevTemp) {
      closestLift = i;
      // console.log(closestLift);
    }
    prevTemp = temp;
  });

  // moving lift to the called floor
  lifts[closestLift].style.transform = `translateY(-${
    calledFloor * 15 + 0.2 * calledFloor
  }rem)`;

  let liftFloor = +lifts[closestLift].getAttribute("data-floor");

  lifts[closestLift].style.transition = `all ${
    Math.abs(liftFloor - calledFloor) * 2.5
  }s linear`;
  lifts[closestLift].setAttribute("data-floor", calledFloor);

  // open and close doors animations
  // -----removing previous animations
  leftDoor[closestLift].style.animation = "none";
  rightDoor[closestLift].style.animation = "none";
  // ------adding new animations
  animationTimeout = setTimeout(() => {
    door.play();
    bell.play();
    leftDoor[closestLift].style.animation =
      "open 2s linear 1, close 2s linear 2s";
    rightDoor[closestLift].style.animation =
      "open 2s linear 1, close 2s linear 2s";
  }, +Math.abs(liftFloor - calledFloor) * 2.5 * 1000 + 2);
}
