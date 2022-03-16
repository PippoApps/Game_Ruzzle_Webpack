"use strict";
import {PippoAppsJSBase} from "./pippoapps/PippoAppsJSBase.js";


var FONT = "px IQOSW02-Regular";
var TXT_X = 10;
var TXT_Y = 10;
var COLOR = "#77cdd5";
var COLOR_SELECTED = "#35313E";
var TXT_COLOR = "#ffffff";
var TXT_COLOR_SELECTED = "#ff0000";

export class GameTile extends PippoAppsJSBase {


    constructor(w, h, xPos, yPos, index, lettersGrid) {
        // this._class = GameTile;
        super("Tile_"+xPos+"_"+yPos);
        // GameTile.LETTER_BITMAPS = letterBitmaps; // Injected once loaded by GameLettersGrid
        this._lettersGrid = lettersGrid;
        this._x = xPos;
        this._y = yPos;
        this._w = w;
        this._h = h;
        this._bitmap;
        this._index = index;
        this._selected;
        this._letter;
        this._sprite = new createjs.Container();
        this._bg = new createjs.Container();
        this._shape = this.createShapeWithBounds(0, 0, w, h, new createjs.Graphics().beginFill(COLOR).drawRoundRect(0, 0, w, h, 12));
        this._shapeSelected = this.createShapeWithBounds(0, 0, w, h, new createjs.Graphics().beginFill(COLOR_SELECTED).drawRoundRect(0, 0, w, h, 12));
        this._bg.x = w/2;
        this._bg.y = h/2;
        this._shape.x = this._shapeSelected.x = -(w/2);
        this._shape.y = this._shapeSelected.y = -(h/2);
        this._occupied; // If it has been set already with a letter from the word (used only in automatic layout generation)
        // this._hitArea.x = w/2;
        // this._hitArea.y = h/2;
        // this._hitGrid.addChild(this._hitArea);
        // this._shape = new createjs.Shape();
        // this._shape.graphics.beginFill(COLOR).drawRoundRect(0, 0, w, h, 12);
        // this._shape.setBounds(0, 0, w, h);
        // this._text = new createjs.Text("A", String(this._w*0.6)+FONT, TXT_COLOR);
        // this._text.setBounds(0, 0, this._w*0.6, this._w*0.6);
        // this._text.x = 0; this._text.y = 0;
        this._bg.addChild(this._shape);
        this._bg.addChild(this._shapeSelected);
        this._sprite.addChild(this._bg);
        // this._shape.cache();
        // this._sprite.addChild(this._text);    
        // this.sprite.addChild(this.hitArea);
        // this._sprite.addEventListener("mousedown", this.onMousedown.bind(this), true);
        // this._sprite.addEventListener("pressmove", this.onMousemove.bind(this), true);
        // this._sprite.addEventListener("mouseup", this.onMouseup.bind(this));
        this.setSelected(false);
        this.sprite.alpha = 0;
        
    }

    setText(t) {
        // this._text.text = t;
        // Center tile
        // let bounds = this._text.getBounds();
        // console.log(bounds)
        // this.alignToCenter(this._text, this._bg);
        // this._text.x = (this._w - bounds.width) / 2;
        // this._text.y = ((this._h - bounds.height) / 2);
        // Bitmap text
        this._letter = t;
        if (this._bitmap) {
            this.sprite.removeChild(this._bitmap);
            this._bitmap = null;
        }
        // this.log("BITMAPS " +t + " : " + GameTile.LETTER_BITMAPS[t])
        this._bitmap = this._lettersGrid.getBitmap(t).clone();
        this.sprite.addChild(this._bitmap);
        this.log("setText",this._bitmap.getBounds());
        var scale = (this._h / this._bitmap.getBounds().height) * 0.5;
        this.log("scale",this._bitmap.getBounds().height,this._h,scale)
        this._bitmap.scaleX = this._bitmap.scaleY = scale;
        this._bitmap.setBounds(0, 0, this._bitmap.getBounds().width*scale, this._bitmap.getBounds().height*scale)
        this.alignToCenter(this._bitmap, this._shape)
        this.log("setText",this._bitmap.getBounds());
        // this.resizeToSprite(this._bg, 10, this._bitmap)
        // this.resizeToSprite
        this.update();
    }
    setSelected(sel, instant) {
        if (this._selected == sel) return;
        const action = sel ? "ON" : "OFF";
        this._bg.scaleX = this._bg.scaleY = 1;
        this._shape.alpha = 1;
        if (sel) createjs.Sound.play("select");
        if (instant) this._shapeSelected.alpha = sel ? 1 : 0;
        else {
            if (sel) this.fadeIn(this._shapeSelected, 300);
            else this.fadeOut(this._shapeSelected, 200);
        }
        this._selected = sel;
    }
    animateGrow(callback) {
        // this.setSelected(true, true);
        // this._shape.alpha = 0;
        this._shapeSelected.alpha = 1;
        this.fadeOut(this._shapeSelected, 800, false, callback);
        this._bg.rotation = 0;
        createjs.Tween.get(this._bg, {override:true}).to({rotation:360}, 800, createjs.Ease.quadOut);
    }
    fadeOutTile() {
        this.fadeOut(this._sprite, 600);
    }
    fadeInTile(delay) {
        createjs.Tween.get(target).wait(500)
    .to({alpha:0, visible:false}, 1000)
    }


    get sprite() {return this._sprite};
    get selected() {return this._selected};
    get letter() {return this._letter};
    get occupied() {return this._occupied};
    set occupied(o) {this._occupied = o};

    // get hitArea() {return this._hitArea};

}






