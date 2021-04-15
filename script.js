"use strict";
const offices = document.querySelectorAll(".offices__item");
const animationWrapper = document.querySelector(".animation-wrapper");
const newRatingValue = animationWrapper.querySelector(".new-rating__number");
const newRatingOffice = animationWrapper.querySelector(".new-rating__office span");
const time = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--time')) * 1000;
const activeColor = getComputedStyle(document.documentElement).getPropertyValue('--active-color');
const color = getComputedStyle(document.documentElement).getPropertyValue('--color');
const duration = time / 1.5;
const delay = time / 2;
let newValue;
let count;
let officeNumber;
let currentValue;
const changeWinner = () => {
  const currentValues = document.querySelectorAll(".offices__value--current");
  offices.forEach(office => {
    office.classList.remove("offices__item--win");
  })
  const winnerOffice = Array.prototype.reduce.call(currentValues, (a, b) => {
    return (parseInt(a.textContent) > parseInt(b.textContent)) ? a : b; 
  })
  winnerOffice.closest(".offices__item").classList.add("offices__item--win");
}
const animation = () => {
  setTimeout(() => {
    officeNumber.animate({
      color: activeColor,
      transform: "scale(1.2)"
    }, {
      duration: duration,
      fill: "forwards"
    }).finished
      .then(() => {
        newValue.animate({
          transform: "translateY(0)"
        }, {
          duration: duration,
          fill: "forwards"
        })
        currentValue.animate({
          transform: "translateY(100%)"
        }, {
          duration: duration,
          fill: "forwards"
        }).finished
          .then(() => {
            officeNumber.animate({
              transform: "scale(1)",
              color: color
            }, {
              duration: duration,
              fill: "forwards"
            }).finished.then(() => {
              newValue.classList.remove("offices__value--new");
              currentValue.classList.remove("offices__value--current");
              newValue.classList.add("offices__value--current");
              currentValue.classList.add("offices__value--new");
              currentValue.textContent = "";
              changeWinner();
              animationWrapper.removeEventListener("animationend", animationNumber);
            })
          })
      });
  }, delay)
}
const animationNumber = (evt) => {
  if (evt.target == evt.currentTarget) {
    animationWrapper.classList.remove("start-animation");
    newValue.textContent = count;
    animation();
  }
}
const changeGrades = (data) => {
  Array.prototype.some.call(offices, (office, index) => {
    officeNumber = office.querySelector(".offices__number");
    currentValue = officeNumber.querySelector(".offices__value--current");
    newValue = officeNumber.querySelector(".offices__value--new");
    count = data.COUNTS[index + 1];
    const height = currentValue.clientHeight;
    officeNumber.style.height = height + "px";
    if (parseInt(currentValue.textContent) != count) {
      animationWrapper.classList.add("start-animation");
      newRatingValue.textContent = count - currentValue.textContent;
      newRatingOffice.textContent = index + 1;
      animationWrapper.addEventListener("animationend", animationNumber);
      return true;
    }
  })
}
setInterval(() => {
  $.getJSON('https://bitrix.1dogma.ru/local/rest/tablo/get.php', (data) => {
    // changeGrades(data);
  });
}, 10000)
