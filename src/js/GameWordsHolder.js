"use strict";
import {PippoAppsJSBase} from "./pippoapps/PippoAppsJSBase.js";
import {GameWord} from "./GameWord.js";
// import { create } from "enhanced-resolve";
var COL = 2;
var ROW = 3;
var COLOR = "#ff0000";
var INNER_MARGIN = 4;

export class GameWordsHolder extends PippoAppsJSBase {  


    constructor(w, h, words) {
        super("WordsHolder");
        this._words = words; // [] - List of words received by instantiator 
        this._index = 0; // word showing
        this._wordsContainer = new createjs.Container();
        this._wordSprites = [];
        this._wordInstances = [];
        this._wordContainers = []; // Center positioned word container to allow smooth enlarging
        this._wordW = w/COL;
        this._wordH = h/ROW;
        this._sprite = new createjs.Container();
        this._selectedIndex;
        this._selectedWord;
        // this._text = new createjs.Text("A", FONT, TXT_COLOR);
        this._shape = this.createShapeWithBounds(0, 0, w, h, new createjs.Graphics().beginFill(COLOR).drawRect(0, 0, w, h));
        this._shape.alpha = 0;
        this._sprite.addChild(this._shape);
        // this._shape = this.createShapeWithBounds(0, 0, w, h, new createjs.Graphics().drawRect())
        // this._sprite.addChild(this._text);
        // this.alignToCenter(this._text, this.sprite, 0, 0);
        // Game elements
        // this._seconds = 15; 
        // this._running = false;
        // this._timeout;
        // this._baseText;
        this.createWords(words);
    }
    get sprite() {return this._sprite};
    createWords(words) {
        this.log("Rendering words: " + words);
        let count = 0;
        for (let rowIndex = 0; rowIndex < ROW; rowIndex++) {
            for (let colIndex = 0; colIndex < COL; colIndex++) {
                const txt = words[count];
                this.log("Rendering word: " + txt + " : " + count);
                this.log(txt)
                const word = new GameWord(txt, count, this._wordW, this._wordH);
                this._wordInstances.push(word);
                this._wordSprites.push(word.sprite);
                // word.positionSprite(this._wordW*colIndex, this._wordH*rowIndex);


                const cont = new createjs.Container();
                cont.x = this._wordW*colIndex + this._wordW/2;
                cont.y = this._wordH*rowIndex + this._wordH/2;
                this._wordContainers.push(cont); 
                this._sprite.addChild(cont); 
                // cont.addSpriteTo(this._sprite);
                word.addSpriteTo(cont);
                // word.positionSprite(this._wordW/2, this._wordH/2);

                count++;
            }

            
        }
        // for (const key in words) {
        //     if (Object.hasOwnProperty.call(words, key)) {
        //     }
        // }
    }
    // Methods
    selectWord(index) {

        if (this._selectedWord) {
            // Deselect previous word
            this._selectedWord.setSelected(false);
            // this.endTween();
        }
        this._selectedIndex = index;
        this._selectedWord = this._wordInstances[index];
        // this._selectedSprite = this._wordSprites[index];
        this._selectedWord.setSelected(true);
        // this.startTween();



    }

    
    startTween() {
        this._easeMode =  createjs.Ease.circInOut;
        this._scaleMod = 0.02;
        this._scaleTime = 1000;
        // createjs.Tween.get(target).wait(500).to({alpha:0, visible:false}, 1000).call(handleComplete);
    // createjs.Tween.get(target, {override:true}).to({x:100});
    // this.logScream(this.selectedSprite)
    // this.selectedSprite.rotation = 40;
        this.scaleTo(this.selectedSprite, this._scaleTime, 1 + this._scaleMod, this._onAnimTweenArrived.bind(this), this._easeMode, [this.selectedSprite]);

    }
    _onAnimTweenArrived(sprite) {
        // console.log(sprite, this.selectedSprite)
        if (sprite == this.selectedSprite) this.scaleTo(sprite, this._scaleTime, sprite.scaleX > 1 ? 1 - this._scaleMod : 1 + this._scaleMod, this._onAnimTweenArrived.bind(this), this._easeMode, [sprite]);
    }
    endTween() {
        this.scaleTo(this.selectedSprite, 200, 1)
    }


    get selectedSprite() {return this._wordSprites[this._selectedIndex]}


}






