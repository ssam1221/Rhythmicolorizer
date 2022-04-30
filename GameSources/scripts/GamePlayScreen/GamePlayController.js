/**
 * @class GamePlayController
 * @description Controls game playing, not rendering
 */

import BGMPlayer from "./BGMPlayer";
import NoteRenderController from "./NoteRenderController";
import ScoreController from "./ScoreController";
import SFXPlayer from "../Common/SFXPlayer";
import Debug from "../Common/Debug";

const debug = new Debug({
    filename: `GamePlayController`
});

export default class GamePlayController {

    static NOTE_STATUS = {
        IDLE: `Idle`,
        SHOWING: `Showing`,
        ACTIVATING: `Activating`,
        CATCHED: `Catched`,
        MISSED: `Missed`
    }


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

    static currentCheckingNoteIndex = {
        0: 0, // Left
        1: 0 // Right
    };


    static timeoutFunctionList = [];

    static NOTE_PRESS_DIFF = 100;
    static NOTE_ACTIVATING_TIMESTAMP = 1300;
    // static NOTE_CHECK_DELAY_TIMESTAMP = 200; // / 2;
    static NOTE_CHECK_DELAY_TIMESTAMP = 1500;

    static isPaused = false;

    static getNoteInfoByKeyCode(key) {
        const keyList = `asdl;'`;
        const colorList = 'rgb';

        const color = colorList[keyList.indexOf(key) % 3];
        const position = parseInt(keyList.indexOf(key) / 3);
        // debug.log(`getNoteInfoByKeyCode(${key}) : param : `, key);
        // debug.log(`getNoteInfoByKeyCode(${key}) : keyIndex = ${keyList.indexOf(key)}`);
        // debug.log(`getNoteInfoByKeyCode(${key}) : color = ${color}, position = ${position}`);
        return {
            color: color,
            position: position
        };
    }

    static updateCurrentCheckingNoteIndex(direction) {
        let tmpIdx = this.currentCheckingNoteIndex[direction];
        debug.log(`updateCurrentCheckingNoteIndex key: ${tmpIdx < NoteRenderController.noteList[direction].length}`)
        while (true) {
            if (tmpIdx >= NoteRenderController.noteList[direction].length) {
                return;
            }
            // debug.log(`CHECKING   NOTE : `, NoteRenderController.noteList[tmpIdx]);
            if (NoteRenderController.noteList[direction][tmpIdx].status === GamePlayController.NOTE_STATUS.IDLE) {
                break;
            }
            if (NoteRenderController.noteList[direction][tmpIdx].status === GamePlayController.NOTE_STATUS.ACTIVATING) {
                // const notePosition = this.getNoteRenderInfoByKeyCode(NoteRenderController.noteList[tmpIdx].key).key;
                // debug.log(`ACTIVATING NOTE : `, NoteRenderController.noteList[tmpIdx] , `with position : ${notePosition}`);
                // debug.log(`this.currentKeyPressNoteIndex : ${this.currentKeyPressNoteIndex}`);
                this.currentCheckingNoteIndex[direction] = tmpIdx;
                break;
            }
            tmpIdx++;
        }
    }

    static checkPressedKeyCorrected(keyCode) {
        const position = this.getNoteInfoByKeyCode(keyCode).position;
        const keypressTimestamp = new Date().getTime() - this.StartTime;
        // debug.log(`checkPressedKeyCorrected() ::: Compare (keyCode, key) : (${keyCode}, ${info.color})`)
        // debug.log(`checkPressedKeyCorrected() ::: Compare (direction, position) : (${NoteRenderController.getNotList()[this.currentCheckingNoteIndex].direction}, ${info.position})`)
        debug.log(`checkPressedKeyCorrected() ::: this.currentCheckingNoteIndex${position} = `, this.currentCheckingNoteIndex[position]);
        // debug.log(`checkPressedKeyCorrected() ::: NoteRenderController.getNotList()[this.currentCheckingNoteIndex].key = `, NoteRenderController.getNotList()[this.currentCheckingNoteIndex].key)
        debug.log(`checkPressedKeyCorrected() ::: keypressTimestamp = `, keypressTimestamp)
        // debug.log(`Key pressed ${key} (Position : ${this.getNotePositionByKey(key)}) with timestamp : ${keypressTimestamp}`);
        this.updateCurrentCheckingNoteIndex(position);
        // if ((NoteRenderController.getNotList()[this.currentCheckingNoteIndex].key === info.color) &&
        //     (NoteRenderController.getNotList()[this.currentCheckingNoteIndex].direction === info.position)) {
        const targetNote = NoteRenderController.getNotList()[position][this.currentCheckingNoteIndex[position]];

        if ((this.KEYPRESS_COLOR_STATUS[`${targetNote.key}${targetNote.direction}`] === true)) {
            targetNote.status = this.NOTE_STATUS.CATCHED;
            const point = ScoreController.calculatePoint(targetNote.timestamp, keypressTimestamp);
            ScoreController.addScore(point);
            NoteRenderController.setNoteCheckerColorByPoint(keyCode, point);
            debug.log(`Check currentCheckingNoteIndex[${position}] : `, this.currentCheckingNoteIndex[position]);

            NoteRenderController.hideMusicNoteByIndex(`${NoteRenderController.getCurrentRenderingNoteIndex()}`)
            // setTimeout(() => {
            // }, 1000);
            // console.log(NoteRenderController.getNotList()[this.currentCheckingNoteIndex])
            // console.log(document.getElementById(`musicNote_${this.currentCheckingNoteIndex % 100}`))
        }
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
        const info = this.getNoteInfoByKeyCode(keyCode);

        this.KEYPRESS_STATUS[`${info.color}${info.position}`] = value;
        this.convertPressedKeyToColor();

        // Just for debugging functions
        function k(cp) {
            return self.KEYPRESS_STATUS[`${cp}`] === true ? `O` : `_`;
        }

        function c(cp) {
            return self.KEYPRESS_COLOR_STATUS[`${cp}`] === true ? `O` : `_`;
        }
        // debug.log(`setCurrentPressedKey : R G B | R G B`);
        // debug.log(`setCurrentPressedKey : ${k('r0')} ${k('g0')} ${k('b0')} | ${k('r1')} ${k('g1')} ${k('b1')}`);
        // debug.log(`setCurrentPressedKey : Y M C W | Y M C W`);
        // debug.log(`setCurrentPressedKey : ${c('y0')} ${c('m0')} ${c('c0')} ${c('w0')} | ${c('y1')} ${c('m1')} ${c('c1')} ${c('w1')}`);
    }

    static keypressNote(_key) {
        SFXPlayer.play(`GamePlayScreen/NotePressed.mp3`);
        const self = this;
        ((key) => {
            const info = this.getNoteInfoByKeyCode(_key);
            const keypressedNote = NoteRenderController.getCurrentKeyPressNote();
            // debug.log(`keypressNote : [${key}] : Assigned to : ${this.currentKeyPressNoteIndex}`);
            // keypressedNote.innerText = key;
            NoteRenderController.setNotePosition(keypressedNote);
            NoteRenderController.renderNoteCheckerOnKeyPress(self.KEYPRESS_COLOR_STATUS, info.position);
            keypressedNote.style.backgroundColor = ``;
            keypressedNote.classList.add([`PRESSED_NOTE`, `showNote`]);
            this.checkPressedKeyCorrected(key);
            setTimeout(() => {
                keypressedNote.classList.remove([`PRESSED_NOTE`, `showNote`]);
                // keypressedNote.innerText = ``;
            }, 10000)

        })(_key);
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
        }
    }

    static async start(title, difficulty) {
        const self = this;
        debug.log(`Start to create notes...`);
        debug.log(`Note create delay : ${self.NOTE_CHECK_DELAY_TIMESTAMP}`);
        // Temp
        NoteRenderController.initializeNotes(title, difficulty);
        // Temp
        ScoreController.initialize(NoteRenderController.getNotList());
        for (const idx of [0, 1]) {
            for (const _note of NoteRenderController.getNotList()[idx]) {
                ((note) => {
                    // debug.log(`Note show timestamp : ${note.timestamp} - ${self.NOTE_CHECK_DELAY_TIMESTAMP}`);
                    this.timeoutFunctionList.push(

                        // Render each notes from note data
                        setTimeout(() => {
                            NoteRenderController.renderMusicNote(note);

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
                                    NoteRenderController.showPointMatched(MISS, note.direction);
                                    ScoreController.addScore(MISS);
                                }
                            }, NoteRenderController.NOTE_SHOWING_TIMESTAMP);
                        }, note.timestamp - self.NOTE_CHECK_DELAY_TIMESTAMP)
                    )
                })(_note);
            }
        }
        this.StartTime = new Date();
    }

    static stop() {
        NoteRenderController.noteList = [
            [],
            []
        ];
        for (const timeoutFunc of this.timeoutFunctionList) {
            clearTimeout(timeoutFunc);
        }
    }

}