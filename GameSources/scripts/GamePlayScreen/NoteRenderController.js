/**
 * @class NoteRenderController
 * @description Only manage rendering notes (and other layout)
 */

import BGMDatabase from "../BGMDatabase";
import Debug from "../Common/Debug";
import DOMConatiners from "../Common/DOMConatiners"
import GamePlayController from "./GamePlayController";

const debug = new Debug({
    filename: `NoteRenderController`
})

export default class NoteRenderController {

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

    static NOTE_DROP_SPEED = 2;
    static NOTE_SHOWING_TIMESTAMP = this.NOTE_DROP_SPEED * 1000;

    static POINT_MATCHED_CLASS_NAME = `pointDisplay`
    static MUSIC_NOTE_CLASS_NAME = `MUSIC_NOTE`;
    static PRESSED_CLASS_NAME = `PRESSED_NOTE`;
    static MAX_NUM_OF_NOTES = 200;
    static KEYPRESS_FPS = 1000 / this.MAX_NUM_OF_NOTES;
    static currentRenderingNoteIndex = 0;
    static currentKeyPressNoteIndex = 0;
    static currentPointMatchedIndex = 0;

    // static NOTE_CHECK_DELAY_TIMESTAMP = parseInt(this.NOTE_SHOWING_TIMESTAMP + (370 / this.NOTE_SPEED)); // / 2;

    static noteList = [
        [],
        []
    ];
    static pointMatchedList = [];

    static StartTime = null;
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

    static NOTE_POSITION = {
        LEFT: 0,
        RIGHT: 1,
        BOTH: 2
    }

    static initialize() {
        if (this.isInitialized === false) {
            debug.log(`Initializing...`);
            this.createkeypressNotes();
            this.createPointMatchedElements();
        }
    }

    static getNotList() {
        return this.noteList;
    }

    static getKeyPressNoteByIndex(index) {
        return document.getElementById(`keypressNote_${index}`);
    }


    static getMusicNoteByIndex(index) {
        return document.getElementById(`musicNote_${index}`);
    }

    static getCurrentMusicNote() {
        return this.getMusicNoteByIndex(this.getCurrentRenderingNoteIndex());
    }

    static getCurrentKeyPressNote() {
        return this.getKeyPressNoteByIndex(this.getCurrentKeyPressNoteIndex());
    }

    static hideMusicNoteByIndex(index) {
        this.getMusicNoteByIndex(index).style.visibility = `hidden`;
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

    static initializeNotes(bgmTitle, Difficulty) {
        debug.log(`Set notes for title : [${Difficulty}][${bgmTitle}]...`);
        for (let idx = 0; idx < BGMDatabase.getDataByTitle(bgmTitle).data.noteList[Difficulty].length; idx++) {
            const note = BGMDatabase.getDataByTitle(bgmTitle).data.noteList[Difficulty][idx];
            note.status = GamePlayController.NOTE_STATUS.IDLE;

            // Both
            if (note.direction === this.NOTE_POSITION.BOTH) {
                const newLeftNote = structuredClone(note);
                const newRightNote = structuredClone(note);
                newLeftNote.direction = this.NOTE_POSITION.LEFT;
                newRightNote.direction = this.NOTE_POSITION.RIGHT;
                this.noteList[this.NOTE_POSITION.LEFT].push(newLeftNote);
                this.noteList[this.NOTE_POSITION.RIGHT].push(newRightNote);
            } else {
                this.noteList[note.direction].push(note);
            }
            // this.noteList[note.direction][idx].status = GamePlayController.NOTE_STATUS.IDLE;
        }
        this.currentDifficulty = Difficulty;
        const difficultyTextColor = this.DIFFICULTY_COLOR[Difficulty];
        document.getElementById(`Difficulty`).style.color = `${difficultyTextColor}`;
        document.getElementById(`Difficulty`).innerHTML = `${Difficulty}`;
        // document.getElementById(`Difficulty`).innerHTML = `Difficulty : ${Difficulty}`;
        debug.log(`Notes : `, this.noteList);
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
            const musicNote = this.getCurrentMusicNote();
            // debug.log(`Note      : [${key}] : Assigned to : ${this.currentRenderingNoteIndex}`);
            // musicNote.innerText = note;
            this.setNotePosition(musicNote);
            musicNote.style.backgroundColor = this.COLOR_BY_NOTE_KEY[note.key];
            // debug.log(`Render Music Note : [${key}]`, note);
            let classAttributes = [`showNote`];
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

    static renderNoteCheckerOnKeyPress(colorStatus, position) {
        debug.log(`####`, colorStatus, position);

        let borderColorHexValue = null;
        const checkerElement = DOMConatiners.Containers.GamePlayScreenContainer.keynoteCheckers[position]

        for (const colorIndex in colorStatus) {
            const colorIndexPosition = colorIndex[1];
            if ((colorStatus[colorIndex] === true) && (colorIndexPosition === `${position}`)) {
                const color = colorIndex[0];
                borderColorHexValue = this.COLOR_BY_NOTE_KEY[color];
                break;
            }
        }
        debug.log(`#### color, position :: `, borderColorHexValue, position);
        checkerElement.style.borderColor = `${borderColorHexValue}`;

        checkerElement.classList.remove(`keyPressAnimation`);
        checkerElement.classList.add(`keyPressAnimation`);

        // setTimeout(() => {
        //     checkerElement.classList.remove(`keyPressAnimation`);
        // }, 300);
    }

    static setNoteCheckerColorByPoint(key, point) {
        debug.log(`setNoteCheckerColorByPoint(${key}, ${point})`);
        const noteRenderInfo = this.getNoteRenderInfoByKeyCode(key);
        const pos = noteRenderInfo.position;
        debug.log(`setNoteCheckerColorByPoint : `, noteRenderInfo)
        const checkerElement = DOMConatiners.Containers.GamePlayScreenContainer.keynoteCheckers[pos];
        // debug.log(`Checking element : `, checkerEl);
        switch (point) {
            case `Perfect`:
            case `Good`:
            case `Bad`:
            case `Miss`:
                checkerElement.classList.add(`NoteScoreAnimation_${point}`);
                this.showPointMatched(point, pos);
                break;
        }
        setTimeout(() => {
            checkerElement.classList.remove(`NoteScoreAnimation_${point}`);
        }, 1000);
    }
}