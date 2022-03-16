"use strict";
import {PippoAppsJSBase} from "./pippoapps/PippoAppsJSBase.js";
import {GameTile} from "./GameTile.js";
// import Bowser from "bowser";

var COLOR = "#ff0000";
var INNER_MARGIN = 3;

export class GameLettersGrid extends PippoAppsJSBase { 
    constructor(w, h) {
        super("GameLettersGrid");
        // Public constants
        this.EVT_SELECTIONSTART;
        this.EVT_SELECTIONABORT;
        this.EVT_SELECTIONSUCCES = "onSelectionSuccess";
        this._letters = ("ABCDEFGHIJKLMNOPQRSTUVWXYZ").split("");
        this._w = w;
        this._h = h;
        this._gridWidth = 6;
        this._gridHeight = 6;
        this._tilesList = []; // All tiles from 0 to last
        this._tilesRows = [];
        this._tilesColumns = [];
        this._tilesByHitAreaName = {};
        this._hitAreaList = [];
        this._hitAreaColumns = [];
        this._letterBitmaps = {}; // uppercase letter as
        this._tileSize; // Width and height of tile
        this._tileSizeStep; // tile size + margin
        this._layout; // Layout object
        this._hitGrid = new createjs.Container();
        this._useRandomLetters;
        // Detect device
        // const browser = Bowser.getParser(window.navigator.userAgent);
        // console.log(`The current browser name is "${browser.getOSName()}"`);

        if (window.iqos_plugin_Url) this.baseUrl = window.iqos_plugin_Url;
        this.logScream("IQOS url? " + window.iqos_plugin_Url)


        this.createTiles(((this._w - (INNER_MARGIN * (this._gridWidth - 1))) / this._gridWidth));
        this._hitGrid.addEventListener("mousedown", this.onMousedown.bind(this), true);
        this._hitGrid.addEventListener("pressmove", this.onMousemove.bind(this), true);
        this._hitGrid.addEventListener("pressup", this.onMouseup.bind(this), true);




        // SELECTION ACTION VARIABLES
        this._selecting = false; // If I am in the middle of a selection or not
        this._fadingIn; // Number of tile fading in
        this._selectList = []; // The sequence of selected tiles (to implement going back)


        // Setup hitArea
        // this._hitArea = this.createShapeWithBounds(0, 0, hitAreaRadius, hitAreaRadius, new createjs.Graphics().beginFill("#00ff00").drawCircle(0, 0, hitAreaRadius));
        // this._sprite.addEventListener("mouseup", this.onMouseup.bind(this));

        // function handleComplete() {
        //     createjs.Sound.play("sound");
        //     var image = queue.getResult("myImage");
        //     document.body.appendChild(image);
        // }


    }
    loadLetters(callback) {
        createjs.Sound.registerSound(this.baseUrl+"/assets/game_sounds/WORD_FOUND.mp3", "found");
        createjs.Sound.registerSound(this.baseUrl+"/assets/game_sounds/WORD_WRONG.mp3", "wrong");
        createjs.Sound.registerSound(this.baseUrl+"/assets/game_sounds/LETTER_SELECT.mp3", "select");



        this._loadLettersCallback = callback;
        this._queue = new createjs.LoadQueue();
        this._queue.installPlugin(createjs.Sound);
        this._queue.on("complete", this.onLettersLoadComplete.bind(this));
        // queue.loadFile({id:"sound", src:"http://path/to/sound.mp3"});
        const manifest = [];
        // const letters = ("ABCDEFGHIJKLMNOPQRSTUVWXYZ").split("");
        for (let i = 0; i < this._letters.length; i++) {
            const letter = this._letters[i];
            manifest.push({id: "bmp"+letter, src:this.baseUrl+"assets/game_fonts/"+letter+".png"});
        }
        this._queue.loadManifest(manifest);   
    }
    onLettersLoadComplete() { 
        // createjs.Sound.play("select"); 
        this.log("Loading letters complete.")
        this.log(this._queue)
        this.log("LEtter: " , this._queue.getResult("bmpA"))
        
        // var p = new createjs.Bitmap(this._queue.getResult("bmpA"));
        
        for (let i = 0; i < this._letters.length; i++) {
            const letter = this._letters[i];
            this._letterBitmaps[letter] = new createjs.Bitmap(this._queue.getResult("bmp"+letter));
            this.log("adding letter",letter)
            // this._stage.addChild(this._letterBitmaps[letter]);
        }
        this._loadLettersCallback();
        // GameTile.LETTER_BITMAPS = this._letterBitmaps;
    }


    getBitmap(letter) {
        return this._letterBitmaps[letter];
    }
    get sprite() {
        return this._sprite
    };
    createTiles(tileSize) {
        this.log("Creating " + (this._gridWidth * this._gridHeight) + " tiles.");
        let count = 0;
        let rowCount = 0;
        let colCount = 0;
        const margin = INNER_MARGIN;
        this._tileSize = tileSize;
        this.log("Tile Size is " + tileSize + "px.") 
        this._tileSizeStep = tileSize + margin;
        const hitAreaRadius = tileSize / 2.2;
        // const tileSize = ((w-(margin*(this._gridWidth-2))) / this._gridWidth);
        // this._gridContainer.x = margin / 2;
        let yPos = 0;
        for (rowCount = 0; rowCount < this._gridHeight; rowCount++) {
            this._tilesRows.push([]);
            let xPos = 0;
            for (colCount = 0; colCount < this._gridWidth; colCount++) {
                // this.log("Rendering " + rowCount + " : " + colCount)
                const tile = new GameTile(tileSize, tileSize, colCount, rowCount, count, this);
                const t = tile.sprite;
                this.sprite.addChild(t);
                t.x = xPos;
                t.y = yPos;
                (tileSize + margin) * rowCount;
                this._tilesList.push(tile);
                this._tilesRows[rowCount].push(tile);
                if (!this._tilesColumns[colCount]) this._tilesColumns[colCount] = [];
                this._tilesColumns[colCount].push(tile);
                // tile.setText("L")
                // Hit area
                const hitArea = this.createShapeWithBounds(0, 0, hitAreaRadius, hitAreaRadius, new createjs.Graphics().beginFill("#00ff00").drawCircle(0, 0, hitAreaRadius));
                hitArea.x = xPos;
                hitArea.y = yPos;
                hitArea.name = "HitArea_" + colCount + "_" + rowCount;
                if (!this._hitAreaColumns[colCount]) this._hitAreaColumns[colCount] = [];
                this._hitAreaList.push(hitArea);
                this._hitAreaColumns[colCount].push(hitArea);
                this._hitGrid.addChild(hitArea);
                this._tilesByHitAreaName[hitArea.name] = tile; //
                // Update position
                xPos += tileSize + margin; //(colCount > 0 ? margin : 0);
            }
            yPos += tileSize + margin; //(colCount > 0 ? margin : 0);
        }
    }
    setLayout(l, randomLetters) {
        // If randomLetters, tiles will be populated randomly (and word positioned randomly)
        this._active = true;
        this._layout = l;
        this._useRandomLetters = randomLetters;
        this.doSetLayout();
    }
    doSetLayout() {
        if (this._useRandomLetters) {
            this._layout.layout = this.generateLayout();
            if (!this._layout.layout) {
            this.logError("Over 10 attempts finding words. Trying again in one second.")
                setTimeout(this.doSetLayout.bind(this), 1000);
                return;
            }
        }    
        this.log("Set layout: " + this._layout.layout);
        let count = 0;
        for (let index = 0; index < this._layout.layout.length; index++) {
            const row = this._layout.layout[index];
            for (let letterIndex = 0; letterIndex < row.length; letterIndex++) {
                const element = row.charAt(letterIndex) 
                this._tilesList[count].setText(element);
                count++;
            }
        }
        this.fadeInAllTiles();
    }
    generateLayout() {
        // First of all generate base layout with random letters
        const layout = [];
        this._tilesList.forEach(element => {
            element.occupied = false;
        });
        for (let row = 0; row < this._gridHeight; row++) { // Row first
            layout[row] = "";
            for (let col = 0; col < this._gridWidth; col++) { // Column then
                layout[row] += this._letters.random();
            }
        }
        console.log("\'"+layout[0]+"\',")
        console.log("\'"+layout[1]+"\',")
        console.log("\'"+layout[2]+"\',")
        console.log("\'"+layout[3]+"\',")
        console.log("\'"+layout[4]+"\',")
        console.log("\'"+layout[5]+"\'")
        // Now the hard part, set the random word
        let securityCounter = 0;
        let wordFound;   
        while (!wordFound) {
            if (securityCounter>10) {
                return false;
            }
            this.log("Generating word, attempt # " + securityCounter++);
            wordFound = this._createWordPath(this._layout.word);
        }




        return layout;
    }
    _createWordPath(word) {
        // return true;
        const letterPosition = new Array(word.length);
        const pos = new createjs.Point(Math.floor(Math.random()*this._gridWidth), Math.floor(Math.random()*this._gridHeight)); // Create position 0
        letterPosition[0] = pos;
        this.log("First letter starts at " + letterPosition[0]);
        const adjacentPositionOffsets=[
            new createjs.Point(-1,-1),new createjs.Point(0,-1),new createjs.Point(1,-1),
            new createjs.Point(-1,0),new createjs.Point(-1,1),
            new createjs.Point(-1,1),new createjs.Point(0,1),new createjs.Point(1,1)  
        ];


        let foundLetterTile;
        for (let i = 1; i < word.length; i++) {
            // Find adjacent positions
            console.log("Lookinf for tiles adjacent to:",i,letterPosition[i-1],i,word.charAt(i))
            foundLetterTile = this._findAdjacentSlot(letterPosition[i-1], adjacentPositionOffsets);
            // If no tile is available or they are all occupied just break the word and start again
            if (!foundLetterTile) return false;
            else if (foundLetterTile.occupied) return false;



            foundLetterTile.occupied = true;
            foundLetterTile.setText(word.charAt(i));
            letterPosition[i] = foundLetterTile;
        }






        let attemptCount = 0; // Number of attempts to find letter - max 10
        let foundPosition;
        while (!foundPosition) {
            foundPosition = this._findAdjacentSlot();
        }


        return true;
    }
    _findAdjacentSlot(previousPos, adjacentPositionOffsets) { // Returns the most adjacent tile
        let foundTile;
        let positions = adjacentPositionOffsets.slice();
        positions.forEach(element => {
            element.x += previousPos.x;
            element.y += previousPos.y;
        });
         console.log("Find adjacent for",previousPos)
        while (positions.length) {
            let pos = positions.random(true);
            // let pos = new createjs.Point(previousPos.x+offset.x, previousPos.y+offset.y);
            // console.log("pos out",pos)
            // console.log("test")
            // console.log("pos out",pos,offset)
            if (pos.x < 0 || pos.y < 0 || pos.x >= this._gridWidth || pos.y > this._gridHeight) { // Do nothing, is out of boundaries
            } else {
                foundTile = this._tilesColumns[pos.y][pos.x];
                if (this._tilesColumns[pos.y][pos.x].occupied) {
                    foundTile = null;
                }// Do nothing, tile has already been used
                else {
                    foundTile = this._tilesColumns[pos.y][pos.x];
                    console.log("found tile:",previousPos,pos,foundTile,this._tilesColumns[pos.y])
                    return foundTile;
                }
            }

        }
        return null;
    }
    fadeInAllTiles() {
        const animateOut = [];  
        for (let i = 0; i < this._tilesList.length; i++) {
            const element = this._tilesList[i];
            animateOut.push(element.sprite);
        }
        this.log("Anim out: " + animateOut)
        this.fadeSequence(animateOut, 30, 60, 1, this._onFadeInAlltilesComplete.bind(this));
    }
    _onFadeInAlltilesComplete() {
        this._active = true;
    }
    // Interaction management
    onMousedown(event) {
        if (!this._active) return;
        const tile = this._onMouseCheckHitArea(event);
        if (tile) this.selectFirstTile(tile);
    }
    onMousemove(event) {
        if (!this._active) return;
        const tile = this._onMouseCheckHitArea(event);
        if (tile) this.selectFollowingTile(tile)
    }
    onMouseup(event) { // If we get here it means we didn't select a full word
        if (!this._active) return;
        createjs.Sound.play("wrong");
        this.completeSelection();
    }
    _onMouseCheckHitArea(event) { // Returns the tile hit by the hitarea. If null no tile has been hit.
        const hitCell = this._hitGrid.getObjectUnderPoint(event.localX, event.localY);
        // this.log(hitCell)
        if (hitCell && this._hitAreaList.indexOf(hitCell) != -1) {
            // this.log("trovata",hitCell.name,this._tilesByHitAreaName[hitCell.name])
            return this._tilesByHitAreaName[hitCell.name];
        }
    }

    // Selection management
    selectFirstTile(tile) { // This happens on mouse down
        if (this._selecting) this.resetSelection();
        this._selecting = true;
        this._selectList = [tile];
        tile.setSelected(true);
        this.update();
        return true;
    }
    selectFollowingTile(tile) { // This happens on mouse move
        let error;
        if (!this._selecting) error = "selection is not active.";
        else if (!this._selectList || this._selectList.length == 0) error = "select list is empty or non existant.";
        else if (tile.selected) {
            // this.log(this._selectList.length > 1, tile == this._selectList[this._selectList.length-1])
            if (this._selectList.length > 1 && tile == this._selectList[this._selectList.length - 2]) { // It is not the first tile
                this.log("Deselecting last selected tile.")
                this._selectList.pop().setSelected(false);
                this.update();
                return;
            } else error = "tile is already selected.";
        } else if (!this._areTilesAdjacent(this._selectList.last(), tile)) error = "tiles are not adjacent.";
        if (error) {
            // this.logError("Aborting subsequent tile selection because " + error);
            return false;
        }
        this._selectList.push(tile);
        tile.setSelected(true);
        this._checkForSelectionComplete();
        this.update();
    }
    _areTilesAdjacent(tile1, tile2) { // Check whether the 2 tiles are adjacent, horizontal vertical or diagonal
        const x1 = this._tilesList.indexOf(tile1) % this._gridWidth;
        const y1 = this._tilesColumns[x1].indexOf(tile1);
        const x2 = this._tilesList.indexOf(tile2) % this._gridWidth;
        const y2 = this._tilesColumns[x2].indexOf(tile2);
        const xDiff = Math.abs(x2 - x1);
        const yDiff = Math.abs(y2 - y1);
        if (xDiff == 1 && yDiff == 0 || xDiff == 0 && yDiff == 1 || xDiff == 1 && yDiff == 1) return true;
    }
    _checkForSelectionComplete() {
        if (this._selectList.length < this._layout.word.length) return; // Check selection complete only if length are the same
        for (let i = 0; i < this._selectList.length; i++) {
            // this.log(this._selectList[i].letter, this._layout.word.charAt(i))
            if (this._selectList[i].letter != this._layout.word.charAt(i)) return;
        }
        // Selection is complete!
        // createjs.Sound.play("found");
        this.log("WORD FOUND: " + this._layout.word);
        this._active = false;
        this._selecting = false;
        this._tilesList.forEach(tile => {
            if (this._selectList.indexOf(tile) != -1) tile.animateGrow();
            else tile.fadeOutTile();
        });
        this._selectList.last().animateGrow(this._onHighlightComplete.bind(this));
        setTimeout(function(){createjs.Sound.play("found");}, 50)
    }
    _onHighlightComplete() {
        this.log("Animating out.")
        const animateOut = [];
        for (let i = 0; i < this._selectList.length; i++) {
            const element = this._selectList[i];
            animateOut.push(element.sprite);
        }
        this.log("Anim out: " + animateOut)
        this.fadeSequence(animateOut, 100, 300, 0, this._onAnimateComplete.bind(this));
    }
    _onAnimateComplete() {
        this.resetSelection();
        this.broadcastEvent(this.EVT_SELECTIONSUCCES);
    }




    resetSelection() {
        this._selectList.forEach(element => {
            element.setSelected(false)
        });
        this._selecting = false;
        this._selectList = [];
        this.update();
    }
    completeSelection() {
        // User push mouse up
        this.resetSelection();
    }




    selectTile(x, y, firstSelect) {
        const tile = this.getTile(x, y);
        tile.setSelected(true);
        this.update();
    }
    getTile(x, y) {
        return this._tilesColumns[x][y];
    }
    get sprite() {
        return this._sprite
    }
    get hitGrid() {
        return this._hitGrid
    }
    get tileSize() {
        return this._tileSize
    }
    get hitAreaList() {
        return this._hitAreaColumns
    }
}