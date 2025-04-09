"use strict";

let pet = {
    name: "Rocky 2",
    image: "/images/rocky.png",
    foodOptions: ["an apple", "a fish taco", "a slice of cheese"],
    playOptions: ["fetch", "hide and seek", "a dance-off"],
    speakOptions: ["...", "....", "... ..."]
};

function savePet() {
    localStorage.setItem("pet", JSON.stringify(pet));
}

function loadPet() {
    let newPet = localStorage.getItem("pet");
    if(newPet) {
        pet = JSON.parse(newPet);
    } else {
        // TODO: Randomly build a pet from parts in /json/moonpet.json
    }
}

let petState = {
    happiness: 75,
    food: 75,
    energy: 75,
    isBusy: false
};

function saveState() {
    localStorage.setItem("petState", JSON.stringify(petState));
}

function loadState() {
    let state = localStorage.getItem("petState");
    if(state) {
        petState = JSON.parse(state);
    }
    petState.isBusy = false;
}

const petElements = {
    name: document.getElementById("petName"),
    image: document.getElementById("petImage"),
    happinessMeter: document.getElementById("petHappiness"),
    foodMeter: document.getElementById("petFood"),
    energyMeter: document.getElementById("petEnergy"),
    feedButton: document.getElementById("petFeedButton"),
    playButton: document.getElementById("petPlayButton"),
    speakButton: document.getElementById("petSpeakButton"),
    text: document.getElementById("petTextBox")
}

function clamp(value, min = 0, max = 100) {
    return Math.min(Math.max(value, min), max);
}

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomInt(max) {
    return Math.floor(Math.random() * max);
}

function initialize() {
    loadPet();
    loadState();

    petElements.name.innerText = pet.name;
    petElements.image.setAttribute("src", pet.image);

    updateMeters();
    setStatus();
    unlockButtons();
}

function lockButtons() {
    petElements.feedButton.setAttribute("disabled", "1");
    petElements.playButton.setAttribute("disabled", "1");
    petElements.speakButton.setAttribute("disabled", "1");
}

function unlockButtons() {
    petElements.feedButton.removeAttribute("disabled");
    petElements.playButton.removeAttribute("disabled");
    petElements.speakButton.removeAttribute("disabled");
}

function setText(text) {
    petElements.text.innerText = text;
}

function getStatusMessage() {
    // Negative
    if(petState.food < 30) { return "hungry..."; }
    if(petState.energy < 30) { return "tired..."; }
    if(petState.happiness < 30) { return "bored..."; }

    // All positive
    if(petState.food > 90 && petState.happiness > 90 && petState.energy > 90) {
        return "thriving!";
    }

    // Very positive
    if(petState.happiness > 90) { return "unreasonably happy."; }
    if(petState.energy > 90) { return "bouncing off the walls."; }
    if(petState.food > 90) { return "well fed."; }

    // Pretty positive
    if(petState.happiness > 70) { return "content."; }
    if(petState.energy > 70) { return "awake."; }
    if(petState.food > 70) { return "satiated."; }

    // Eh
    return "fine.";
}

function setStatus() {
    setText(`${pet.name} is ${getStatusMessage()}`);
}

function updateMeters() {
    petElements.happinessMeter.setAttribute("value", petState.happiness);
    petElements.happinessMeter.innerText = petState.happiness;
    petElements.foodMeter.setAttribute("value", petState.food);
    petElements.foodMeter.innerText = petState.food;
    petElements.energyMeter.setAttribute("value", petState.energy);
    petElements.energyMeter.innerText = petState.energy;
}

function performAction(action) {
    if(petState.isBusy) { return; }

    switch(action) {
        case "feed": {
            if(petState.food === 100) {
                setText(`${pet.name} isn't hungry right now.`);
            } else {
                const food = randomChoice(pet.foodOptions);
                setText(`You fed ${pet.name} ${food}.`);
                petState.food = clamp(petState.food + 15);
                petState.energy = clamp(petState.energy + 5);
            }
            break;
        }

        case "play": {
            if(petState.energy === 0) {
                setText(`${pet.name} is sleepy.`);
            } else {
                const game = randomChoice(pet.playOptions);
                setText(`You played ${game} with ${pet.name}`);
                petState.happiness = clamp(petState.happiness + 15);
                petState.energy = clamp(petState.energy - 10);
            }
            break;
        }

        case "speak": {
            const phrase = randomChoice(pet.speakOptions);
            setText(`${pet.name} says "${phrase}"`);
            break;
        }

        default: {
            console.error(`moonpet.js::performAction - invalid action, ${action}`);
        }
    }

    updateMeters();
    lockButtons();
    savePet();
    saveState();

    setTimeout(() => {
        unlockButtons();
        setStatus();
    }, 5000);
}

function tick() {
    if(petState.isBusy) { return; }

    petState.happiness = clamp(petState.happiness - randomInt(4));
    petState.food = clamp(petState.food - randomInt(4));
    petState.energy = clamp(petState.energy + randomInt(4));

    updateMeters();
    setStatus();
    savePet();
    saveState();
}

initialize();
petElements.feedButton.addEventListener("click", () => { performAction("feed") });
petElements.playButton.addEventListener("click", () => { performAction("play") });
petElements.speakButton.addEventListener("click", () => {performAction("speak") });

setInterval(tick, 60000);