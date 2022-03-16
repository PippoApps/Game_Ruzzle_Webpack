"use strict";
import {PippoAppsJSBase} from "./pippoapps/PippoAppsJSBase.js";


var FONT = "16px Arial";
var COLOR = "#000000";
var TXT_COLOR = "#ffffff";

export class GameCountdown extends PippoAppsJSBase {


    constructor(w, h) {
        super("Countdown");
        this._sprite = new createjs.Container();
        this._text = new createjs.Text("A", FONT, TXT_COLOR);
        this._shape = this.createShapeWithBounds(0, 0, w, h, new createjs.Graphics().beginFill(COLOR).drawRoundRect(0, 0, w, h, 20));
        this._sprite.addChild(this._shape);
        this._sprite.addChild(this._text);
        this.alignToCenter(this._text, this.sprite, 0, 0);
        // Game elements
        this._seconds = 600;
        this._running = false;
        this._timeout;
        this._baseText;
    }
    setText(t) {
        this._baseText = t;
        this._updateText();
    }
    resetCountdown(num) {
        this._seconds = num ? num : 15;
    }
    start() {
        this._running = true;
        this._shootNextTimeout();
    }
    stop() {
        this._clearTimeout();
        this._running = false;
    }
    _shootNextTimeout() {
        this._clearTimeout();
        this._timeout = setTimeout(this._onTimeout.bind(this), 1000);
    }
    _clearTimeout() {
        if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }
    }
    _onTimeout() {
        this._clearTimeout();
        if (this._seconds > 0) {
            this._seconds--;
        }
        this.log("Countdown: " + this._seconds);
        this._updateText();
        if (this._seconds > 0) {
            this._shootNextTimeout(); 
        } else this._onCountdownComplete();
    }
    _updateText() {
        this._text.text = this.replaceKeyword(this._baseText, "NUM", this._seconds);
        this.alignToCenter(this._text, this._shape, 0, 1);
        this.update();
    }
    _onCountdownComplete() {
        this.log("Countdown Complete.");
        this.broadcastEvent("onCountdownComplete");
    }
    get sprite() {return this._sprite};

}






