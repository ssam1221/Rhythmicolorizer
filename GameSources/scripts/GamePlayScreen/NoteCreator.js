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

    static Difficulty = {
        EASY: `Easy`,
        NORMAL: `Normal`,
        HARD: `Hard`,
    }

    static currentDifficulty = ``;

    static POINT_MATCHED_CLASS_NAME = `pointDisplay`
    static MUSIC_NOTE_CLASS_NAME = `MUSIC_NOTE`;
    static PRESSED_CLASS_NAME = `PRESSED_NOTE`;
    static MAX_KEYPRESS_NOTES = 100;
    static KEYPRESS_FPS = 1000 / this.MAX_KEYPRESS_NOTES;
    static currentNoteIndex = 0;
    static currentKeyPressNoteIndex = 0;
    static currentPointMatchedIndex = 0;

    static NOTE_SPEED = 2;
    static NOTE_PRESS_DIFF = 0;
    static NOTE_ACTIVATING_TIMESTAMP = 1300;
    static NOTE_SHOWING_TIMESTAMP = this.NOTE_SPEED * 1000;
    // static NOTE_CHECK_DELAY_TIMESTAMP = 200; // / 2;
    static NOTE_CHECK_DELAY_TIMESTAMP = 1500;
    // static NOTE_CHECK_DELAY_TIMESTAMP = parseInt(this.NOTE_SHOWING_TIMESTAMP + (370 / this.NOTE_SPEED)); // / 2;

    static keypressDivInterval;

    static isPaused = false;
    static currentCheckingNoteIndex = 0;
    static noteList = [];
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

    static NOTE_POSITION = {
        '`1234567890-=\\~!@#$%^&*()_+|': 0,
        'qwertyuiop[]QWERTYUIOP{}': 1,
        'asdfghjkl;\'ASDFGHJKL:"': 2,
        'zxcvbnm,./ZXCVBNM<>?': 3,
    }

    static SHIFT_USED_NOTE = [
        '~!@#$%^&*()_+|',
        'QWERTYUIOP{}',
        'ASDFGHJKL:"',
        'ZXCVBNM<>?'
    ]

    static PointCheck = {
        Perfect: 50,
        Good: 100,
        Bad: 300,
        Miss: 99999
    }

    static initialize() {
        debug.log(`Initializing...`);
        this.createkeypressNotes();
        this.createPointMatchedElements();
    }

    static getCurrentNoteIndex() {
        this.currentNoteIndex = (++this.currentNoteIndex) % this.MAX_KEYPRESS_NOTES;
        return this.currentNoteIndex;
    }
    static getCurrentKeyPressNoteIndex() {
        this.currentKeyPressNoteIndex = (++this.currentKeyPressNoteIndex) % this.MAX_KEYPRESS_NOTES;
        return this.currentKeyPressNoteIndex;
    }
    static getCurrentDifficulty() {
        return this.currentDifficulty;
    }

    static setNotes(bgmTitle, Difficulty) {
        debug.log(`Set notes for title : [${Difficulty}][${bgmTitle}]...`);
        this.noteList = BGMDatabase.getDataByTitle(bgmTitle).data.noteList[Difficulty];
        for (let idx = 0; idx < this.noteList.length; idx++) {
            this.noteList[idx].status = this.NOTE_STATUS.IDLE;
        }
        this.currentDifficulty = Difficulty;
        document.getElementById(`Difficulty`).innerHTML = `Difficulty : ${Difficulty}`;
        debug.log(`Notes : `, this.noteList);
    }

    static createkeypressNotes() {
        for (let i = 0; i < this.MAX_KEYPRESS_NOTES; i++) {
            const musicNoteDiv = document.createElement(`div`);
            musicNoteDiv.id = `musicNote_${i}`;
            musicNoteDiv.setAttribute(`class`, this.MUSIC_NOTE_CLASS_NAME);
            DOMConatiners.get().keynotesContainerContainer.appendChild(musicNoteDiv);

            const pressedNotediv = document.createElement(`div`);
            pressedNotediv.id = `keypressNote_${i}`;
            pressedNotediv.setAttribute(`class`, this.PRESSED_CLASS_NAME);
            DOMConatiners.get().pressedkeynotesContainer.appendChild(pressedNotediv);
        }
    }

    static createPointMatchedElements() {
        for (let i = 0; i < this.MAX_KEYPRESS_NOTES; i++) {
            const pointMatchedElements = document.createElement(`div`);
            pointMatchedElements.id = `pointMatched_${i}`;
            pointMatchedElements.setAttribute(`class`, this.POINT_MATCHED_CLASS_NAME);
            this.pointMatchedList.push(pointMatchedElements);
            DOMConatiners.get().pointDisplayContainer.appendChild(pointMatchedElements);
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
        for (const _note of this.noteList) {
            ((note) => {
                // debug.log(`Note show timestamp : ${note.timestamp} - ${self.NOTE_CHECK_DELAY_TIMESTAMP}`);
                this.timeoutFunctionList.push(
                    setTimeout(() => {
                        this.renderMusicNote(note.key);

                        // debug.log(`Showing note : ${note.key}`);
                        note.status = self.NOTE_STATUS.SHOWING;
                        setTimeout(() => {
                            // debug.log(`Activate note : ${note.key} / ${self.NOTE_ACTIVATING_TIMESTAMP}`);
                            note.status = self.NOTE_STATUS.ACTIVATING;
                            // self.activateNoteList.push(note);
                        }, self.NOTE_ACTIVATING_TIMESTAMP);

                        setTimeout(() => {
                            // debug.log(`Used note : ${note.key}`);
                            if (note.status === self.NOTE_STATUS.ACTIVATING) {
                                const MISS = `Miss`;
                                note.status = self.NOTE_STATUS.MISSED;
                                self.showPointMatchedByPointAndPosition(MISS, self.getNotePositionByKey(note.key));
                                ScoreController.addScore(MISS);
                            }
                        }, self.NOTE_SHOWING_TIMESTAMP);
                    }, note.timestamp - self.NOTE_CHECK_DELAY_TIMESTAMP)
                )
            })(_note);
        }
        this.StartTime = new Date();
    }

    static stop() {
        this.noteList = [];
        for (const timeoutFunc of this.timeoutFunctionList) {
            clearTimeout(timeoutFunc);
        }
    }

    static isShiftedUsedKey(key) {
        for (const rule in this.NOTE_POSITION) {
            if (this.SHIFT_USED_NOTE[this.NOTE_POSITION[rule]].indexOf(key) !== -1) {
                return true;
            }
        }
        return false;
    }

    static setNotePosition(note) {
        const key = note.innerText;
        for (const rule in this.NOTE_POSITION) {
            if (rule.indexOf(key) > -1) {
                const topPosition = 160 * this.NOTE_POSITION[rule];
                note.setAttribute(`position`, this.NOTE_POSITION[rule]);
                note.style.top = `calc(50% - ${320 - topPosition}px`;
                break;
            }
        }
    }

    static getNotePositionByKey(key) {
        for (const rule in this.NOTE_POSITION) {
            if (rule.indexOf(key) > -1) {
                return this.NOTE_POSITION[rule];
            }
        }
    }
    static renderMusicNote(_key) {
        const self = this;
        ((key) => {
            const note = document.getElementById(`musicNote_${this.getCurrentNoteIndex()}`);
            // debug.log(`Note      : [${key}] : Assigned to : ${this.currentNoteIndex}`);
            note.innerText = key;
            this.setNotePosition(note);

            // debug.log(`Render Music Note : [${key}]`, note);
            let classAttributes = `showNote`;
            if (true === this.isShiftedUsedKey(key)) {
                classAttributes += ` shiftedKey`
            }

            note.setAttribute(`class`, `${this.MUSIC_NOTE_CLASS_NAME} ${classAttributes}`);
            console.log(note)
            setTimeout(() => {
                // keypressedNote.setAttribute(`class`, `hideNote`);
                // debug.log(`Render Music Note : [${key}]`, note);
                note.setAttribute(`class`, `${this.MUSIC_NOTE_CLASS_NAME}`);
                note.innerText = ``;
            }, self.NOTE_SHOWING_TIMESTAMP)
        })(_key);
    }

    static keypressNote(_key) {

        SFXPlayer.play(`./data/sfx/hat.mp3`);
        ((key) => {
            const keypressedNote = document.getElementById(`keypressNote_${this.getCurrentKeyPressNoteIndex()}`);
            // debug.log(`keypressNote : [${key}] : Assigned to : ${this.currentKeyPressNoteIndex}`);
            keypressedNote.innerText = key;
            this.setNotePosition(keypressedNote);

            keypressedNote.setAttribute(`class`, `${this.PRESSED_CLASS_NAME} showNote`);
            this.checkPressedKeyCorrected(key);
            setTimeout(() => {
                // keypressedNote.setAttribute(`class`, `hideNote`);
                keypressedNote.setAttribute(`class`, `${this.PRESSED_CLASS_NAME}`);
                keypressedNote.innerText = ``;
            }, 1000)

        })(_key);
    }

    static updateCurrentCheckingNoteIndex(key) {
        let tmpIdx = this.currentCheckingNoteIndex;
        const pressedNotePosition = this.getNotePositionByKey(key);
        debug.log(`updateCurrentCheckingNoteIndex key: ${tmpIdx < this.noteList.length}`)
        while (true) {
            if (tmpIdx >= this.noteList.length) {
                return;
            }
            // debug.log(`CHECKING   NOTE : `, this.noteList[tmpIdx]);
            if (this.noteList[tmpIdx].status === this.NOTE_STATUS.IDLE) {
                break;
            }
            if (this.noteList[tmpIdx].status === this.NOTE_STATUS.ACTIVATING) {
                const notePosition = this.getNotePositionByKey(this.noteList[tmpIdx].key);
                // debug.log(`ACTIVATING NOTE : `, this.noteList[tmpIdx] , `with position : ${notePosition}`);
                // debug.log(`this.currentKeyPressNoteIndex : ${this.currentKeyPressNoteIndex}`);
                this.currentCheckingNoteIndex = tmpIdx;
                break;
            }
            tmpIdx++;
        }
    }

    static showPointMatchedByPointAndPosition(point, position) {
        this.MAX_KEYPRESS_NOTES
        const _pointMatchedEl = this.pointMatchedList[this.currentPointMatchedIndex];
        ((pointMatchedEl) => {
            pointMatchedEl.innerText = point;
            const prevClass = pointMatchedEl.getAttribute(`class`);
            pointMatchedEl.setAttribute(`class`, `${prevClass} pointDisplay_${point} pointDisplay_${position}`);
            this.currentPointMatchedIndex = ++this.currentPointMatchedIndex % this.MAX_KEYPRESS_NOTES;
            console.log(pointMatchedEl)
            setTimeout(() => {
                pointMatchedEl.setAttribute(`class`, prevClass);
                pointMatchedEl.innerText = ``;
            }, 500);
        })(_pointMatchedEl);
    }

    static calculatePoint(noteTimestamp, keypressTimestamp) {
        debug.log(`calculatePoint : ${keypressTimestamp} - ${noteTimestamp}`);
        const diff = keypressTimestamp - noteTimestamp - this.NOTE_PRESS_DIFF;
        for (const point in this.PointCheck) {
            if (Math.abs(diff) < this.PointCheck[point]) {
                // console.log(`CHECKED ::: ${point}`);
                return point;
            }
        }
    }

    static setNoteCheckerColorByPoint(key, point) {
        debug.log(`setNoteCheckerColorByPoint(${key}, ${point})`);
        const pos = this.getNotePositionByKey(key);
        const checkerEl = DOMConatiners.Containers.keynoteCheckers[pos];
        const prevClassOfCheckerEl = checkerEl.getAttribute(`class`);
        switch (point) {
            case `Perfect`:
            case `Good`:
            case `Bad`:
            case `Miss`:
                checkerEl.setAttribute(`class`, `${prevClassOfCheckerEl} NoteScoreAnimation_${point}`);
                this.showPointMatchedByPointAndPosition(point, pos);
                break;
        }
        setTimeout(() => {
            checkerEl.setAttribute(`class`, prevClassOfCheckerEl);
        }, 1000);
    }

    static checkPressedKeyCorrected(key) {
        const keypressTimestamp = new Date().getTime() - this.StartTime;
        // debug.log(`Key pressed ${key} (Position : ${this.getNotePositionByKey(key)}) with timestamp : ${keypressTimestamp}`);
        this.updateCurrentCheckingNoteIndex(key);
        if (this.noteList[this.currentCheckingNoteIndex].key === key) {
            this.noteList[this.currentCheckingNoteIndex].status = this.NOTE_STATUS.CATCHED;
            const point = this.calculatePoint(this.noteList[this.currentCheckingNoteIndex].timestamp, keypressTimestamp);
            ScoreController.addScore(point);
            this.setNoteCheckerColorByPoint(key, point);
            debug.log(`Check currentCheckingNoteIndex : `, this.currentCheckingNoteIndex)
            document.getElementById(`musicNote_${this.currentCheckingNoteIndex % 100}`).style.visibility = `hidden`;
            setTimeout(() => {
                document.getElementById(`musicNote_${this.currentCheckingNoteIndex % 100}`).style.visibility = `visible`;
            }, 1000);
            // console.log(this.noteList[this.currentCheckingNoteIndex])
            // console.log(document.getElementById(`musicNote_${this.currentCheckingNoteIndex % 100}`))
        }
    }

    static onkeypress(e) {
        if (true === BGMPlayer.isGameStart) {
            if (e.key.length === 1) {
                this.keypressNote(e.key)
            }
        }

    }
}