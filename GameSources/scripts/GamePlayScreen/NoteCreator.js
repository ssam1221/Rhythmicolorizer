// TODO : 노트 생성/판정 및 게임 점수 등 코드 분리

import BGMDatabase from "../BGMDatabase";
import Debug from "../Common/Debug";
import DOMConatiners from "../Common/DOMConatiners"
import BGMPlayer from "./BGMPlayer";
import ScoreController from "./ScoreController";
import SFXPlayer from "../Common/SFXPlayer";

const debug = new Debug({
    filename: `NoteCreator`
})

export default class NoteCreator {

    static KEYPRESS_STATUS = {
        r0: false,
        g0: false,
        b0: false,
        r1: false,
        g1: false,
        b1: false,
    }

    static KEYPRESS_COLOR_STATUS = {
        r0: false,
        g0: false,
        b0: false,
        c0: false,
        m0: false,
        y0: false,
        w0: false,
        r1: false,
        g1: false,
        b1: false,
        c1: false,
        m1: false,
        y1: false,
        w1: false,
    }

    static isInitialized = false;

    static Difficulty = {
        EASY: `EASY`,
        NORMAL: `NORMAL`,
        HARD: `HARD`,
        XTREME: `XTREME`,
    }

    static DIFFICULTY_COLOR = {
        EASY: `green`,
        NORMAL: `blue`,
        HARD: `yellow`,
        XTREME: `red`,
    }

    static NoteColor = {
        r: `#FF0000`, // Yellow
        g: `#00FF00`, // Green
        b: `#0000FF`, // Blue
        c: `#00FFFF`, // Cyan
        m: `#FF00FF`, // Magenta
        y: `#FFFF00`, // Yellow
        w: `#FFFFFF`, // White
    }

    static currentDifficulty = ``;

    static POINT_MATCHED_CLASS_NAME = `pointDisplay`
    static MUSIC_NOTE_CLASS_NAME = `MUSIC_NOTE`;
    static PRESSED_CLASS_NAME = `PRESSED_NOTE`;
    static MAX_NUM_OF_NOTES = 200;
    static KEYPRESS_FPS = 1000 / this.MAX_NUM_OF_NOTES;
    static currentRenderingNoteIndex = 0;
    static currentKeyPressNoteIndex = 0;
    static currentPointMatchedIndex = 0;

    static NOTE_SPEED = 2;
    static NOTE_PRESS_DIFF = 100;
    static NOTE_ACTIVATING_TIMESTAMP = 1300;
    static NOTE_SHOWING_TIMESTAMP = this.NOTE_SPEED * 1000;
    // static NOTE_CHECK_DELAY_TIMESTAMP = 200; // / 2;
    static NOTE_CHECK_DELAY_TIMESTAMP = 1500;
    // static NOTE_CHECK_DELAY_TIMESTAMP = parseInt(this.NOTE_SHOWING_TIMESTAMP + (370 / this.NOTE_SPEED)); // / 2;

    static keypressDivInterval;

    static isPaused = false;
    static currentCheckingNoteIndex = {
        0: 0, // Left
        1: 0 // Right
    };
    static noteList = [
        [],
        []
    ];
    static pointMatchedList = [];
    static musicNoteList = [];
    static keypressNotes = [];
    static timeoutFunctionList = [];

    static activateNoteList = [];

    static StartTime = null;
    static NOTE_STATUS = {
        IDLE: `Idle`,
        SHOWING: `Showing`,
        ACTIVATING: `Activating`,
        CATCHED: `Catched`,
        MISSED: `Missed`
    }
    static NOTE_SIZE = {
        HEIGHT: `128px`
    }

    static COLOR_BY_NOTE_KEY = {
        r: `#FF0000`, // Red
        g: `#00FF00`, // Green
        b: `#0000FF`, // Blue
        y: `#FFFF00`, // Yellow
        m: `#FF00FF`, // Magenta
        c: `#00FFFF`, // Cyan
        w: `#FFFFFF` // White
    }

    static POSITION_BY_KEYCODE = {
        "asd": 0,
        "l;\'": 1
    }

    // static NOTE_POSITION = {
    //     '`1234567890-=\\~!@#$%^&*()_+|': 0,
    //     'qwertyuiop[]QWERTYUIOP{}': 1,
    //     'asdfghjkl;\'ASDFGHJKL:"': 2,
    //     'zxcvbnm,./ZXCVBNM<>?': 3,
    // }

    // static SHIFT_USED_NOTE = [
    //     '~!@#$%^&*()_+|',
    //     'QWERTYUIOP{}',
    //     'ASDFGHJKL:"',
    //     'ZXCVBNM<>?'
    // ]

    static PointCheck = {
        Perfect: 15,
        Good: 30,
        Bad: 50,
        Miss: 99999
    }

    static initialize() {
        if (this.isInitialized === false) {
            debug.log(`Initializing...`);
            this.createkeypressNotes();
            this.createPointMatchedElements();
        }
    }

    static getCurrentRenderingNoteIndex() {
        this.currentRenderingNoteIndex = (++this.currentRenderingNoteIndex) % this.MAX_NUM_OF_NOTES;
        return this.currentRenderingNoteIndex;
    }
    static getCurrentKeyPressNoteIndex() {
        this.currentKeyPressNoteIndex = (++this.currentKeyPressNoteIndex) % this.MAX_NUM_OF_NOTES;
        return this.currentKeyPressNoteIndex;
    }
    static getCurrentDifficulty() {
        return this.currentDifficulty;
    }

    static setNotes(bgmTitle, Difficulty) {
        debug.log(`Set notes for title : [${Difficulty}][${bgmTitle}]...`);
        for (let idx = 0; idx < BGMDatabase.getDataByTitle(bgmTitle).data.noteList[Difficulty].length; idx++) {
            const note = BGMDatabase.getDataByTitle(bgmTitle).data.noteList[Difficulty][idx];
            note.status = this.NOTE_STATUS.IDLE;
            this.noteList[note.direction].push(note);
            // this.noteList[note.direction][idx].status = this.NOTE_STATUS.IDLE;
        }
        this.currentDifficulty = Difficulty;
        const difficultyTextColor = this.DIFFICULTY_COLOR[Difficulty];
        document.getElementById(`Difficulty`).style.color = `${difficultyTextColor}`;
        document.getElementById(`Difficulty`).innerHTML = `${Difficulty}`;
        // document.getElementById(`Difficulty`).innerHTML = `Difficulty : ${Difficulty}`;
        debug.log(`Notes : `, this.noteList);
    }

    static setKeynoteCheckerPosition() {
        if (this.currentDifficulty === this.Difficulty.EASY) {

        } else {

        }
    }

    static createkeypressNotes() {
        for (let i = 0; i < this.MAX_NUM_OF_NOTES; i++) {
            const musicNoteDiv = document.createElement(`div`);
            musicNoteDiv.id = `musicNote_${i}`;
            musicNoteDiv.classList.add(this.MUSIC_NOTE_CLASS_NAME);
            DOMConatiners.get().GamePlayScreenContainer.keynotesContainerContainer.appendChild(musicNoteDiv);

            const pressedNotediv = document.createElement(`div`);
            pressedNotediv.id = `keypressNote_${i}`;
            pressedNotediv.classList.add(this.PRESSED_CLASS_NAME);
            DOMConatiners.get().GamePlayScreenContainer.pressedkeynotesContainer.appendChild(pressedNotediv);
        }
    }

    static createPointMatchedElements() {
        for (let i = 0; i < this.MAX_NUM_OF_NOTES; i++) {
            const pointMatchedElements = document.createElement(`div`);
            pointMatchedElements.id = `pointMatched_${i}`;
            pointMatchedElements.classList.add(this.POINT_MATCHED_CLASS_NAME);
            this.pointMatchedList.push(pointMatchedElements);
            DOMConatiners.get().GamePlayScreenContainer.pointDisplayContainer.appendChild(pointMatchedElements);
        }
    }

    static add({
        what,
        timestamp
    }) {

    }

    static read() {

    }

    // Render
    static create() {

    }

    // If typed
    static pop() {
        const timestamp = this.StartTime.getTime() - new Date().getTime();
    }

    static async start(title, difficulty) {
        const self = this;
        debug.log(`Start to create notes...`);
        debug.log(`Note create delay : ${self.NOTE_CHECK_DELAY_TIMESTAMP}`);
        // Temp
        this.setNotes(title, difficulty);
        // Temp
        ScoreController.initialize(this.noteList);
        for (const idx of [0, 1]) {
            for (const _note of this.noteList[idx]) {
                ((note) => {
                    // debug.log(`Note show timestamp : ${note.timestamp} - ${self.NOTE_CHECK_DELAY_TIMESTAMP}`);
                    this.timeoutFunctionList.push(

                        // Render each notes from note data
                        setTimeout(() => {
                            this.renderMusicNote(note);

                            // debug.log(`Showing note : ${note.key}`);
                            note.status = self.NOTE_STATUS.SHOWING;
                            setTimeout(() => {
                                // debug.log(`Activate note : ${note.key} / ${self.NOTE_ACTIVATING_TIMESTAMP}`);
                                note.status = self.NOTE_STATUS.ACTIVATING;
                                // self.activateNoteList.push(note);
                            }, self.NOTE_ACTIVATING_TIMESTAMP);

                            // Check the note is miss or not
                            setTimeout(() => {
                                // debug.log(`Used note : ${note.key}`);
                                if (note.status === self.NOTE_STATUS.ACTIVATING) {
                                    const MISS = `Miss`;
                                    note.status = self.NOTE_STATUS.MISSED;
                                    // self.showPointMatchedByPointAndPosition(MISS, self.getNotePositionByKey(note.key));
                                    self.showPointMatched(MISS, note.direction);
                                    ScoreController.addScore(MISS);
                                }
                            }, self.NOTE_SHOWING_TIMESTAMP);
                        }, note.timestamp - self.NOTE_CHECK_DELAY_TIMESTAMP)
                    )
                })(_note);
            }
        }
        this.StartTime = new Date();
    }

    static stop() {
        this.noteList = [
            [],
            []
        ];
        for (const timeoutFunc of this.timeoutFunctionList) {
            clearTimeout(timeoutFunc);
        }
    }

    static isShiftedUsedKey(key) {
        // Not used

        // for (const rule in this.NOTE_POSITION) {
        //     if (this.SHIFT_USED_NOTE[this.NOTE_POSITION[rule]].indexOf(key) !== -1) {
        //         return true;
        //     }
        // }
        return false;
    }

    static setNotePosition(note) {
        const key = note.innerText;
        for (const rule in this.POSITION_BY_KEYCODE) {
            if (rule.indexOf(key) > -1) {
                const leftPosition = (60 * this.POSITION_BY_KEYCODE[rule]);
                note.setAttribute(`position`, this.POSITION_BY_KEYCODE[rule]);
                note.style.left = `${leftPosition}%`;
                break;
            }
        }
    }

    static getNoteRenderInfoByColorValue(key, position) {
        return {
            color: key,
            position: position
        };
    }

    static getNoteRenderInfoByKeyCode(key) {
        const keyList = `asdl;'`;
        const colorList = 'rgb';

        const color = colorList[keyList.indexOf(key) % 3];
        const position = parseInt(keyList.indexOf(key) / 3);
        // debug.log(`getNoteRenderInfoByKeyCode(${key}) : param : `, key);
        // debug.log(`getNoteRenderInfoByKeyCode(${key}) : keyIndex = ${keyList.indexOf(key)}`);
        // debug.log(`getNoteRenderInfoByKeyCode(${key}) : color = ${color}, position = ${position}`);
        return {
            color: color,
            position: position
        };
    }

    static getNotePositionByKey(key) {
        // for (const rule in this.NOTE_POSITION) {
        //     if (rule.indexOf(key) > -1) {
        //         return this.NOTE_POSITION[rule];
        //     }
        // }
        for (const rule in this.POSITION_BY_KEYCODE) {
            // debug.log(`rule : `, rule)
            if (rule.indexOf(key) > -1) {
                return this.POSITION_BY_KEYCODE[rule];
            }
        }
    }
    static renderMusicNote(_note) {
        const self = this;
        ((note) => {
            debug.log(`_note : `, note)
            const musicNote = document.getElementById(`musicNote_${this.getCurrentRenderingNoteIndex()}`);
            // debug.log(`Note      : [${key}] : Assigned to : ${this.currentRenderingNoteIndex}`);
            // musicNote.innerText = note;
            this.setNotePosition(musicNote);
            musicNote.style.backgroundColor = this.COLOR_BY_NOTE_KEY[note.key];
            // debug.log(`Render Music Note : [${key}]`, note);
            let classAttributes = [`showNote`];
            // if (true === this.isShiftedUsedKey(note)) {
            //     classAttributes += ` shiftedKey`
            // }
            if (note.direction === 0) {
                musicNote.style.left = `0%`;
            } else if (note.direction === 1) {
                musicNote.style.left = `60%`;
            }

            musicNote.classList.add(`${classAttributes}`);
            setTimeout(() => {
                // debug.log(`Render Music Note : [${key}]`, note);
                musicNote.classList.remove(`${classAttributes}`);
                musicNote.style.visibility = `hidden`;
            }, self.NOTE_SHOWING_TIMESTAMP)
        })(_note);
    }

    static keypressNote(_key) {
        SFXPlayer.play(`GamePlayScreen/NotePressed.mp3`);
        ((key) => {
            const keypressedNote = document.getElementById(`keypressNote_${this.getCurrentKeyPressNoteIndex()}`);
            // debug.log(`keypressNote : [${key}] : Assigned to : ${this.currentKeyPressNoteIndex}`);
            keypressedNote.innerText = key;
            this.setNotePosition(keypressedNote);

            keypressedNote.classList.add([`${this.PRESSED_CLASS_NAME}`, `showNote`]);
            this.checkPressedKeyCorrected(key);
            setTimeout(() => {
                keypressedNote.classList.remove([`${this.PRESSED_CLASS_NAME}`, `showNote`]);
                keypressedNote.innerText = ``;
            }, 1000)

        })(_key);
    }

    // static updateCurrentCheckingNoteIndex({ pressedColor, position}) {

    static updateCurrentCheckingNoteIndex(direction) {
        let tmpIdx = this.currentCheckingNoteIndex[direction];
        debug.log(`updateCurrentCheckingNoteIndex key: ${tmpIdx < this.noteList[direction].length}`)
        while (true) {
            if (tmpIdx >= this.noteList[direction].length) {
                return;
            }
            // debug.log(`CHECKING   NOTE : `, this.noteList[tmpIdx]);
            if (this.noteList[direction][tmpIdx].status === this.NOTE_STATUS.IDLE) {
                break;
            }
            if (this.noteList[direction][tmpIdx].status === this.NOTE_STATUS.ACTIVATING) {
                // const notePosition = this.getNoteRenderInfoByKeyCode(this.noteList[tmpIdx].key).key;
                // debug.log(`ACTIVATING NOTE : `, this.noteList[tmpIdx] , `with position : ${notePosition}`);
                // debug.log(`this.currentKeyPressNoteIndex : ${this.currentKeyPressNoteIndex}`);
                this.currentCheckingNoteIndex[direction] = tmpIdx;
                break;
            }
            tmpIdx++;
        }
    }

    static showPointMatched(point, position) {
        const _pointMatchedEl = this.pointMatchedList[this.currentPointMatchedIndex];
        // debug.log(`showPointMatched() : `, _pointMatchedEl);
        ((pointMatchedEl) => {
            pointMatchedEl.innerText = point;
            pointMatchedEl.classList.add(`pointDisplay_${point}`, `pointDisplay_${position}`);
            this.currentPointMatchedIndex = ++this.currentPointMatchedIndex % this.MAX_NUM_OF_NOTES;
            setTimeout(() => {
                pointMatchedEl.classList.remove(`pointDisplay_${point}`, `pointDisplay_${position}`);
                pointMatchedEl.innerText = ``;
            }, 500);
        })(_pointMatchedEl);
    }

    static calculatePoint(noteTimestamp, keypressTimestamp) {
        debug.log(`calculatePoint() : ${keypressTimestamp} - ${noteTimestamp}`);
        const diff = Math.abs(Math.abs(keypressTimestamp - noteTimestamp) - this.NOTE_PRESS_DIFF);
        debug.log(`calculatePoint() diff = : ${diff},  this.NOTE_PRESS_DIFF : ${this.NOTE_PRESS_DIFF}`);
        for (const point in this.PointCheck) {
            if (diff < this.PointCheck[point]) {
                // console.log(`CHECKED ::: ${point}`);
                return point;
            }
        }
    }

    static setNoteCheckerColorByPoint(key, point) {
        debug.log(`setNoteCheckerColorByPoint(${key}, ${point})`);
        const noteRenderInfo = this.getNoteRenderInfoByKeyCode(key);
        const pos = noteRenderInfo.position;
        debug.log(`setNoteCheckerColorByPoint : `, noteRenderInfo)
        const checkerEl = DOMConatiners.Containers.GamePlayScreenContainer.keynoteCheckers[pos];
        // debug.log(`Checking element : `, checkerEl);
        switch (point) {
            case `Perfect`:
            case `Good`:
            case `Bad`:
            case `Miss`:
                checkerEl.classList.add(`NoteScoreAnimation_${point}`);
                this.showPointMatched(point, pos);
                break;
        }
        setTimeout(() => {
            checkerEl.classList.remove(`NoteScoreAnimation_${point}`);
        }, 1000);
    }


    static convertPressedKeyToColor() {
        for (const idx in [0, 1]) {
            // Only 1 key is pressed, RGB works
            this.KEYPRESS_COLOR_STATUS[`r${idx}`] = (this.KEYPRESS_STATUS[`r${idx}`] && !this.KEYPRESS_STATUS[`g${idx}`] && !this.KEYPRESS_STATUS[`b${idx}`]);
            this.KEYPRESS_COLOR_STATUS[`g${idx}`] = (!this.KEYPRESS_STATUS[`r${idx}`] && this.KEYPRESS_STATUS[`g${idx}`] && !this.KEYPRESS_STATUS[`b${idx}`]);
            this.KEYPRESS_COLOR_STATUS[`b${idx}`] = (!this.KEYPRESS_STATUS[`r${idx}`] && !this.KEYPRESS_STATUS[`g${idx}`] && this.KEYPRESS_STATUS[`b${idx}`]);
            
            // Only 2 keys are exactly pressed, Yellow/Magenta/Cyan works
            this.KEYPRESS_COLOR_STATUS[`y${idx}`] = (this.KEYPRESS_STATUS[`r${idx}`] && this.KEYPRESS_STATUS[`g${idx}`] && !this.KEYPRESS_STATUS[`b${idx}`]);
            this.KEYPRESS_COLOR_STATUS[`m${idx}`] = (this.KEYPRESS_STATUS[`r${idx}`] && !this.KEYPRESS_STATUS[`g${idx}`] && this.KEYPRESS_STATUS[`b${idx}`]);
            this.KEYPRESS_COLOR_STATUS[`c${idx}`] = (!this.KEYPRESS_STATUS[`r${idx}`] && this.KEYPRESS_STATUS[`g${idx}`] && this.KEYPRESS_STATUS[`b${idx}`]);

            // All 3 keys are pressed, White works
            this.KEYPRESS_COLOR_STATUS[`w${idx}`] = (this.KEYPRESS_STATUS[`r${idx}`] && this.KEYPRESS_STATUS[`g${idx}`] && this.KEYPRESS_STATUS[`b${idx}`]);
      }
    }

    static setCurrentPressedKey({
        keyCode,
        value
    }) {
        const self = this;
        const info = this.getNoteRenderInfoByKeyCode(keyCode);

        this.KEYPRESS_STATUS[`${info.color}${info.position}`] = value;
        this.convertPressedKeyToColor();

        // Just for debugging functions
        function k(cp) {
            return self.KEYPRESS_STATUS[`${cp}`] === true ? `O` : `_`;
        }

        function c(cp) {
            return self.KEYPRESS_COLOR_STATUS[`${cp}`] === true ? `O` : `_`;
        }
        debug.log(`setCurrentPressedKey : R G B | R G B`);
        debug.log(`setCurrentPressedKey : ${k('r0')} ${k('g0')} ${k('b0')} | ${k('r1')} ${k('g1')} ${k('b1')}`);
        debug.log(`setCurrentPressedKey : Y M C W | Y M C W`);
        debug.log(`setCurrentPressedKey : ${c('y0')} ${c('m0')} ${c('c0')} ${c('w0')} | ${c('y1')} ${c('m1')} ${c('c1')} ${c('w1')}`);
        
    }

    static checkPressedKeyCorrected(keyCode) {
        const position = this.getNoteRenderInfoByKeyCode(keyCode).position;
        const keypressTimestamp = new Date().getTime() - this.StartTime;
        // debug.log(`checkPressedKeyCorrected() ::: Compare (keyCode, key) : (${keyCode}, ${info.color})`)
        // debug.log(`checkPressedKeyCorrected() ::: Compare (direction, position) : (${this.noteList[this.currentCheckingNoteIndex].direction}, ${info.position})`)
        debug.log(`checkPressedKeyCorrected() ::: this.currentCheckingNoteIndex${position} = `, this.currentCheckingNoteIndex[position]);
        // debug.log(`checkPressedKeyCorrected() ::: this.noteList[this.currentCheckingNoteIndex].key = `, this.noteList[this.currentCheckingNoteIndex].key)
        debug.log(`checkPressedKeyCorrected() ::: keypressTimestamp = `, keypressTimestamp)
        // debug.log(`Key pressed ${key} (Position : ${this.getNotePositionByKey(key)}) with timestamp : ${keypressTimestamp}`);
        this.updateCurrentCheckingNoteIndex(position);
        // if ((this.noteList[this.currentCheckingNoteIndex].key === info.color) &&
        //     (this.noteList[this.currentCheckingNoteIndex].direction === info.position)) {
        const targetNote = this.noteList[position][this.currentCheckingNoteIndex[position]];
        if ((this.KEYPRESS_COLOR_STATUS[`${targetNote.key}${targetNote.direction}`] === true)) {
            targetNote.status = this.NOTE_STATUS.CATCHED;
            const point = this.calculatePoint(targetNote.timestamp, keypressTimestamp);
            ScoreController.addScore(point);
            this.setNoteCheckerColorByPoint(keyCode, point);
            debug.log(`Check currentCheckingNoteIndex[${position}] : `, this.currentCheckingNoteIndex[position]);
            document.getElementById(`musicNote_${this.getCurrentRenderingNoteIndex() % 100}`).style.visibility = `hidden`;
            // setTimeout(() => {
            //     document.getElementById(`musicNote_${this.currentCheckingNoteIndex % 100}`).style.visibility = `visible`;
            // }, 1000);
            // console.log(this.noteList[this.currentCheckingNoteIndex])
            // console.log(document.getElementById(`musicNote_${this.currentCheckingNoteIndex % 100}`))
        }
    }

    static isKeyValid(key) {
        return `asdl;'`.includes(key);
    }

    static onkeypress(e) {
        if (this.isKeyValid(e.key) === true) {
            this.setCurrentPressedKey({
                keyCode: e.key,
                value: true
            });
            if (true === BGMPlayer.isGameStart) {
                if (e.key.length === 1) {
                    this.keypressNote(e.key)
                }
            }
        }
    }

    static onkeyup(e) {
        if (this.isKeyValid(e.key) === true) {
            this.setCurrentPressedKey({
                keyCode: e.key,
                value: false
            });
            // if (true === BGMPlayer.isGameStart) {
            //     if (e.key.length === 1) {
            //         this.keypressNote(e.key)
            //     }
            // }
        }
    }
}