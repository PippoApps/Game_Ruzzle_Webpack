"use strict";
import {PippoAppsJSBase} from "./pippoapps/PippoAppsJSBase.js";
import {GameCountdown} from "./GameCountdown.js";
import {GameWordsHolder} from "./GameWordsHolder.js";
import {GameLettersGrid} from "./GameLettersGrid.js";



var MARGIN = 5;
var LETTERS_INNER_MARGIN = 4;
var VER = 0.3;
export class IQOSGame extends PippoAppsJSBase {
    constructor(par) {
        // INIT
        super(par.appId, par.canvasId);

        this._par = par;
        this.initAsMainApp();
        this.position(0, 0);
        this.log("IqosGame ver " + VER + " canvas id: "+par.canvasId+", size:",par.w, par.h);
        // window.alert("Dimensioni : " + par.w + " : " + par.h);
        // Game variables
        this._selectedLayoutNum;
        this._gameRunning = false;
        this._margin = MARGIN; // Compute margin. If x/y > 0.5, adjust margins
        const ratio = par.w/par.h;
        if (ratio > 0.83) this._margin = par.w * (ratio - 0.5)*0.2;
        // Visual elements
        this._countdown;
        this._wordsHolder;
        this._gameGrid;
        // Data holders
        this._renderedLayout = 0; // Starts with layout 0
        this._words = []; // Stores all words
        // Sprites
        this._area = new createjs.Shape();
        this._gridContainer = new createjs.Container();
        // Create assets
        this._innerW = this._par.w - (this._margin * 2);
        this._topPos = MARGIN;
        this.createAssets();
        // setTimeout(this.deferredInitialization.bind(this), 100);
    }

    createAssets() {
        // Create countdown
        this._countdown = new GameCountdown(this._innerW, 44);
        this._countdown.addListener(this);
        this._countdown.setText("HAI A DISPOSIZIONE [NUM] SECONDI");
        this._countdown.positionSprite(this._margin, this._topPos);
        // this._topPos = MARGIN + this._countdown.sprite.getBounds().height + this._margin;
        // Create gamegrid
        this._gameGrid = new GameLettersGrid(this._innerW);
        this._gameGrid.addListener(this);
        // Create words holder (after grid to retrieve height)
        this._wordsHolder = new GameWordsHolder(this._innerW, this._par.h - (this._topPos + this._gameGrid.getBounds().height + 4), LAYOUTS.map(layout => layout.word));
        this._wordsHolder.positionSprite(this._margin, this._topPos);
        this._wordsHolder.addListener(this);
        this._wordsHolder.sprite.alpha = 0;
        // Create BG
        this._area.graphics.beginFill("#21caca").drawRect(0, 0, this._par.w, this._par.h);
        // Add instances to stage
        this._stage.addChild(this._gameGrid.hitGrid);
        this._stage.addChild(this._area);
        this._gameGrid.addSpriteTo(this._stage);
        // this._stage.addChild(this._gameGrid.sprite);
        // this._stage.addChild(this._wordsHolder.sprite);
        // this._countdown.addSpriteTo(this._stage);
        this._wordsHolder.addSpriteTo(this._stage);
        this._gameGrid.hitGrid.alpha = 0.2;
        // this._stage.addChild(this._countdown.sprite);
        // this._stage.addEventListener("mousedown", this.onMousedown.bind(this));
        // this._stage.addEventListener("mousemove", this.onMousemove.bind(this));
        // this._stage.addEventListener("mouseup", this.onMouseup.bind(this));
        this._gameGrid.loadLetters(this.onLettersLoaded.bind(this));
    }
    onLettersLoaded() {
        // Position elements
        createjs.Touch.enable(this._stage);
        this.log("Positioning elements.", this._par.h, this._gridContainer.getBounds())
        this._gameGrid.positionSprite(this._margin, (this._par.h - this._gameGrid.sprite.getBounds().height) - MARGIN);
        this._gameGrid.hitGrid.x = this._margin + this._gameGrid.tileSize / 2;
        this._gameGrid.hitGrid.y = this._gameGrid.sprite.y + this._gameGrid.tileSize / 2;  
        this.fadeIn(this._wordsHolder.sprite, 150, this.onWordsHolderArrived.bind(this));
    }
    onWordsHolderArrived() {
        this.setupLayout(0);
        this.update();
    }
    setupLayout(num) {
        this._selectedLayoutNum = num;
        this.log("Setting layout for: " + LAYOUTS[num].word);
        this._gameGrid.setLayout(LAYOUTS[num], false);
        this._wordsHolder.selectWord(num);
    }

    // METHODS
    start() {
        this.log("Starting game  !")
        this._gameRunning = true;
    }
    // LISTENERS
    onSelectionSuccess() {
        this.log("Selection success.");
        // this.log("game complete : " ,this._par.callbackComplete())
        this._selectedLayoutNum++;
        if (this._selectedLayoutNum < LAYOUTS.length) this.setupLayout(this._selectedLayoutNum);
        else {
            // this.log("game complete : ", this._par.callbackComplete)
            this._par.callbackComplete();
        }
    }

    get hitAreaList() {return this._gameGrid.hitAreaList};
}


var LAYOUTS = [{
    word: "INNOVAZIONE",
    layout: [
'PHHCMI',
'ESFSDN',
'CNAVON',
'UOZPNL',
'IZIVON',
'ECONEF'
    ]
},
{
    word: "GUSTO",
    layout: [
'ACLQRM',
'HZNODB',
'RQTNGM',
'IUSFUD',
'GBVTSQ',
'PASOVE'
    ]
},
{
    word: "COMMUNITY",
    layout: [
        'ICOMHN',
        'DLLMQQ',
        'VINUMU',
        'LTCINP',
        'MYTPRH',
        'TDCEEU'
    ]
},
{
    word: "PROGRESSO",
    layout: [
        'ZPVEPR',
        'STPROF',
        'ATZLGR',
        'ZQMRDE',
        'SSEBQS',
        'ODZIOS'
    ]
},
{
    word: "DESIGN",
    layout: [
        'APVNHE',
        'PNUGMP',
        'NGVISZ',
        'CIAEEH',
        'EUSRDL',
        'TQVSFR'
    ]
},
{
    word: "CAMBIAMENTO",
    layout: [
        'AMENGG',
        'IDSTFA',
        'BMSOMD',
        'FABIAB',
        'ACOPMZ',
        'ZOUTNE'
    ]
},
]
var LAYOUTS_DIAGONALI = [{
    word: "INNOVAZIONE",
    layout: [
'PHHCMI',
'ESFSDT',
'CNUQIL',
'UOQPNL',
'IZCVON',
'ECAIEF'
    ]
},
{
    word: "GUSTO",
    layout: [
'ACLQRM',
'HZNODB',
'RQTNGM',
'IUSFMD',
'GBVZEQ',
'PASFVE'
    ]
},
{
    word: "COMMUNITY",
    layout: [
        'ICOPHN',
        'DLLMQQ',
        'VELGMU',
        'LRCINP',
        'MYTPRH',
        'TDCEEU'
    ]
},
{
    word: "PROGRESSO",
    layout: [
        'ZPVEPR',
        'STPROF',
        'ATZLGV',
        'ZQMRDZ',
        'SSEBQB',
        'ODZITG'
    ]
},
{
    word: "DESIGN",
    layout: [
        'APVIHE',
        'PNUSMP',
        'NGVZNZ',
        'CIAEOH',
        'EUSRDL',
        'TQVSFR'
    ]
},
{
    word: "CAMBIAMENTO",
    layout: [
        'CGLDGG',
        'ADSDFA',
        'BMSNMD',
        'FABIAB',
        'ACOPMZ',
        'ZOUTNE'
    ]
},
]
var LAYOUTS2 = [{
    word: "SENATI",
    layout: [
        "ABCDE",
        "ABCDE",
        "ABCSE",
        "ANEDO",
        "TBCDT",
        "AICNE",
        "AMEDE"
    ]
},
{
    word: "SENTI",
    layout: [
        "GFHNM",
        "ABCDE",
        "ABCSE",
        "ANEDO",
        "TBCDT",
        "AICNE",
        "AMEDE"
    ]
},
{
    word: "MENTO",
    layout: [
        "LSDHS",
        "ABCDE",
        "ABCSE",
        "ANEDO",
        "TBCDT",
        "AICNE",
        "AMEDE"
    ]
},
{
    word: "BAITA",
    layout: [
        "OTYPL",
        "ABCDE",
        "ABCSE",
        "ANEDO",
        "TBCDT",
        "AICNE",
        "AMEDE"
    ]
},
{
    word: "TIME",
    layout: [
        "ZUMLS",
        "ABCDE",
        "ABCSE",
        "ANEDO",
        "TBCDT",
        "AICNE",
        "AMEDE"
    ]
},
{
    word: "ENTI",
    layout: [
        "THSFG",
        "ABCDE",
        "ABCSE",
        "ANEDO",
        "TBCDT",
        "AICNE",
        "AMEDE"
    ]
},
]