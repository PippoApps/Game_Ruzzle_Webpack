// const $ = require('jquery');
// const createjs = require('createjs');
import IQOSGame from "./js/IQOSGame.js";
// var _iqosGame;
window.prepareIqosGame = function(canvasId, w, h) {
    window._iqosGame = new IQOSGame({appId:"IQOSGame", canvasId:canvasId, w:w, h:h, callbackComplete:window.iqosGameComplete.bind(this), callbackTimeout:window.iqosGameTimeout.bind(this)}); 
}
window.startIqosGame = function() {
    window._iqosGame.start();  
    console.log("start")
}


// window.prepareIqosGame("game_canvas", 300, 600);
// window.startIqosGame();



window.iqosGameComplete = function() {
    console.log("GAME COMPLETE");
    if (window["onIqosGamecomplete"]) window["onIqosGamecomplete"]();
    else console.log("Errore: la funzione onIqosGamecomplete() non è stata trovata.");
}
window.iqosGameTimeout = function() {
    console.log("GAME TIMEOUT");
    if (window["onIqosGameTimeout"]) window["onIqosGameTimeout"]();
    else console.log("Errore: la funzione onIqosGameTimeout() non è stata trovata.");
}