// const $ = require('jquery');
// const createjs = require('createjs');
import {IQOSGame} from "./js/IQOSGame.js"; 


// var _iqosGame;
const prepareIqosGame = function(canvasId, w, h) {
    console.log(IQOSGame)
    const _iqosGame = new IQOSGame({appId:"IQOSGame", canvasId:canvasId, w:w, h:h, callbackComplete:iqosGameComplete.bind(this), callbackTimeout:iqosGameTimeout.bind(this)}); 
}
const startIqosGame = function() {
    _iqosGame.start();  
    console.log("start")
}

const iqosGameComplete = function() {
    console.log("GAME COMPLETE");
    if (window["onIqosGamecomplete"]) window["onIqosGamecomplete"]();
    else console.log("Errore: la funzione onIqosGamecomplete() non è stata trovata.");
}
const iqosGameTimeout = function() {
    console.log("GAME TIMEOUT");
    if (window["onIqosGameTimeout"]) window["onIqosGameTimeout"]();
    else console.log("Errore: la funzione onIqosGameTimeout() non è stata trovata.");
}

console.log("Testiamo le funzioni")
// console.log(document.prepareIqosGame)
// import IQOSGame from "./js/game_bundle.js";
prepareIqosGame("game_canvas", 375, 390);
// startIqosGame();


// window.prepareIqosGame("game_canvas", 300, 600);
// window.startIqosGame();



