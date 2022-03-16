"use strict";
import {PippoAppsJSBase} from "./pippoapps/PippoAppsJSBase.js";


var FONT = "16px IQOSW02-Regular";
var FONT_SEL = "16px IQOSW02-Bold";
var TXT_X = 10;
var TXT_Y = 10;
var COLOR = "#77cdd5";
var TXT_COLOR = "#000000";
var TXT_COLOR_SELECTED = "#ffffff";


export class GameWord extends PippoAppsJSBase {
    constructor(txt, index, w, h) {
        super("Word_"+index+"_"+txt);
        this._txt = txt;
        this._index = index;
        this._selected;
        this._sprite = new createjs.Container();
        this._text = new createjs.Text(txt, FONT, TXT_COLOR);
        this._sprite.addChild(this._text);    
        this._shape = this.createShapeWithBounds(0, 0, w, h, new createjs.Graphics().beginFill(COLOR).drawRoundRect(0, 0, w, h, 5));
        this._shape.alpha = 0;
        this._sprite.addChild(this._shape);
        this._sprite.addChild(this._text);
        this.resizeToSprite(this._shape, 10, this._text);
        this.centerWord();
    }
    setSelected(sel) {
        this.log("Select: " + sel);
        this._selected = sel;
        if (sel) {
            this._shape.alpha = 0;
            this._text.color = TXT_COLOR_SELECTED;
            this._text.font = FONT_SEL;
            this.startTween();
            
        } else {
            this._shape.alpha = 0;
            this._text.color = TXT_COLOR;
            this._text.font = FONT;
            this.endTween();
            // this._text.text = "PIPPO";
        }
        this.update();
    }

    startTween() {
        this._animate = false;
        this._scaleMod = this._animate ? 0.1 : 0.3;
        this._scaleTime = this._animate ? 1000 : 3000;
        this._easeMode =  this._animate ? createjs.Ease.circInOut : createjs.Ease.quartInOut;
        // createjs.Tween.get(target).wait(500).to({alpha:0, visible:false}, 1000).call(handleComplete);
    // createjs.Tween.get(target, {override:true}).to({x:100});
    // this.logScream(this.selectedSprite)
    // this.selectedSprite.rotation = 40;
        this.scaleTo(this._text, this._scaleTime, 1 + this._scaleMod, this._onAnimTweenArrived.bind(this), this._easeMode).addEventListener("change", this.centerWord.bind(this));

    }
    _onAnimTweenArrived(sprite) {
        // this.log("ARRIVATO")
        // console.log(sprite, this.selectedSprite)
        const shrinking = this._text.scaleX > 1;
        if (this._animate) this.scaleTo(this._text, shrinking ? this._scaleTime/2 : this._scaleTime, shrinking ? 1 - this._scaleMod : 1 + this._scaleMod, this._onAnimTweenArrived.bind(this), this._easeMode).addEventListener("change", this.centerWord.bind(this));;
    }
    endTween() {
        this.scaleTo(this._text, this._scaleTime/2, 1).addEventListener("change", this.centerWord.bind(this))
    }
    centerWord() {
        // this.log("centro"+this._text.getBounds().width)
        this.positionSprite(-((this._text.getBounds().width*this._text.scaleX)/2), -((this._text.getBounds().height*this._text.scaleY)/2));
    }






    get sprite() {return this._sprite};

}






