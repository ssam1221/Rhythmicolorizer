import Debug from "./Debug";
import BGMDatabase from "./BGMDatabase";
import BGMPlayer from "./BGMPlayer";
import SFXPlayer from "./SFXPlayer";

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

    static MUSIC_NOTE_CLASS_NAME = `MUSIC_NOTE`;
    static PRESSED_CLASS_NAME = `PRESSED_NOTE`;
    static MAX_KEYPRESS_NOTES = 100;
    static KEYPRESS_FPS = 1000 / this.MAX_KEYPRESS_NOTES;
    static currentNoteIndex = 0;
    static currentKeyPressNoteIndex = 0;

    static NOTE_SPEED = 2;
    static NOTE_ACTIVATING_TIMESTAMP = 1300;
    static NOTE_SHOWING_TIMESTAMP = this.NOTE_SPEED * 1000;
    // static NOTE_CHECK_DELAY_TIMESTAMP = 200; // / 2;
    static NOTE_CHECK_DELAY_TIMESTAMP = 1200;
    // static NOTE_CHECK_DELAY_TIMESTAMP = parseInt(this.NOTE_SHOWING_TIMESTAMP + (370 / this.NOTE_SPEED)); // / 2;

    static keypressDivInterval;

    static isPaused = false;
    static noteList = [];
    static musicNoteList = [];
    static keypressNotes = [];
    static timeoutFunctionList = [];

    static activateNoteList = [];

    static keynotesContainer = null;
    static pressedkeynotesContainer = null;

    static StartTime = null;
    static NOTE_STATUS = {
        IDLE: `Idle`,
        SHOWING: `Showing`,
        ACTIVATING: `Activating`,
        USED: `Used`
    }
    static PointCheck = {
        Perfect: 0,
        Good: 0,
        Bad: 0,
        Miss: 0
    }

    static initialize() {
        debug.log(`Initializing...`);
        this.keynotesContainer = document.getElementById(`keynotesContainer`);
        this.pressedkeynotesContainer = document.getElementById(`keynotePressedContainer`);
        this.createkeypressNotes();
        // this.keypressDivInterval = setInterval(() => {
        //     this.currentKeyPressNoteIndex = (++this.currentKeyPressNoteIndex) % this.MAX_KEYPRESS_NOTES;
        // }, this.KEYPRESS_FPS);
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
            this.keynotesContainer.appendChild(musicNoteDiv);

            const pressedNotediv = document.createElement(`div`);
            pressedNotediv.id = `keypressNote_${i}`;
            pressedNotediv.setAttribute(`class`, this.PRESSED_CLASS_NAME);
            this.pressedkeynotesContainer.appendChild(pressedNotediv);
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

    static async start() {
        const self = this;
        debug.log(`Start to create notes...`);
        debug.log(`Note create delay : ${self.NOTE_CHECK_DELAY_TIMESTAMP}`);
        // Temp
        this.setNotes(`두근두근! 드디어!! 대모험 시작!!!`, this.Difficulty.NORMAL);
        // Temp

        for (const _note of this.noteList) {
            ((note) => {
                debug.log(`Note show timestamp : ${note.timestamp} - ${self.NOTE_CHECK_DELAY_TIMESTAMP}`);
                this.timeoutFunctionList.push(
                    setTimeout(() => {
                        this.renderMusicNote(note.key);
                        debug.log(`Showing note : ${note.key}`);
                        note.status = self.NOTE_STATUS.SHOWING;
                        setTimeout(() => {
                            debug.log(`Activate note : ${note.key} / ${self.NOTE_ACTIVATING_TIMESTAMP}`);
                            note.status = self.NOTE_STATUS.ACTIVATING;
                            // self.activateNoteList.push(note);
                        }, self.NOTE_ACTIVATING_TIMESTAMP);

                        setTimeout(() => {
                            debug.log(`Used note : ${note.key}`);
                            note.status = self.NOTE_STATUS.USED;
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

    static renderMusicNote(_key) {
        const self = this;
        ((key) => {
            const note = document.getElementById(`musicNote_${this.getCurrentNoteIndex()}`);
            // debug.log(`Note      : [${key}] : Assigned to : ${this.currentNoteIndex}`);
            note.innerText = key;
            // debug.log(`Render Music Note : [${key}]`, note);

            note.setAttribute(`class`, `${this.MUSIC_NOTE_CLASS_NAME} showNote`);

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

            keypressedNote.setAttribute(`class`, `${this.PRESSED_CLASS_NAME} showNote`);
            this.checkPressedKeyCorrected(key);
            setTimeout(() => {
                // keypressedNote.setAttribute(`class`, `hideNote`);
                keypressedNote.setAttribute(`class`, `${this.PRESSED_CLASS_NAME}`);
                keypressedNote.innerText = ``;
            }, 1000)

        })(_key);
    }

    static checkPressedKeyCorrected(key) {
        const diff = new Date().getTime() - this.StartTime;
        debug.log(`Key pressed ${key} with timestamp : ${diff}`);

        this.currentKeyPressNoteIndex;
    }

    static onkeypress(e) {
        if (true === BGMPlayer.isGameStart) {
            if (e.key.length === 1) {
                this.keypressNote(e.key)
            }
        }

    }
}