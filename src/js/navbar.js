'use strict';

const navBox = document.getElementById("nav-box");
const navToggle = document.getElementById("nav-toggle");
// Open by default on browsers that don't enable JS so users can still use nav links
navBox.classList.remove("open");

navToggle.addEventListener("click", () => {
    const isOpen = navBox.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen);
})