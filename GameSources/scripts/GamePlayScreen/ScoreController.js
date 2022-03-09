import Debug from "../Common/Debug";
import DOMConatiners from "../Common/DOMConatiners"
import GamePlayController from "./GamePlayController";

const debug = new Debug({
    filename: `ScoreController`
})


export default class ScoreController {

    static SCORE_OF_POINT = {
        Perfect: 1,
        Good: 0.8,
        Bad: 0.3,
        Miss: 0
    }

    static PointCheck = {
        Perfect: 15,
        Good: 30,
        Bad: 50,
        Miss: 99999
    }

    static ComboCount = 0;

    static PERFECT_SCORE = 1000000;
    static scorePerNote;
    static scoreSum = 0;

    static initialize(noteList) {
        debug.log(noteList)
        debug.log(noteList)
        debug.log(noteList)
        debug.log(noteList)
        this.scoreSum = 0;
        const totalNoteList = noteList[0].length + noteList[1].length
        this.scorePerNote = this.PERFECT_SCORE / totalNoteList;
        DOMConatiners.get().GamePlayScreenContainer.GameScore.innerText = this.getFormattedScore();
    }

    static getFormattedScore() {
        return (`0000000${this.scoreSum.toFixed(0)}`).substr(-7);
    }

    static calculatePoint(noteTimestamp, keypressTimestamp) {
        debug.log(`calculatePoint() : ${keypressTimestamp} - ${noteTimestamp}`);
        const diff = Math.abs(Math.abs(keypressTimestamp - noteTimestamp) - GamePlayController.NOTE_PRESS_DIFF);
        debug.log(`calculatePoint() diff = : ${diff},  this.NOTE_PRESS_DIFF : ${GamePlayController.NOTE_PRESS_DIFF}`);
        for (const point in this.PointCheck) {
            if (diff < this.PointCheck[point]) {
                // console.log(`CHECKED ::: ${point}`);
                return point;
            }
        }
    }

    static addScore(point) {
        this.scoreSum += this.scorePerNote * this.SCORE_OF_POINT[point];
        // debug.log(`Update Score :: ${this.getFormattedScore()}`);
        DOMConatiners.get().GamePlayScreenContainer.GameScore.innerText = this.getFormattedScore();
        if ((point === `Perfect`) || (point === `Good`)) {
            this.ComboCount++;
        } else {
            this.ComboCount = 0;
            DOMConatiners.get().GamePlayScreenContainer.ComboCount.innerText = ``
        }
        if (this.ComboCount > 1) {
            DOMConatiners.get().GamePlayScreenContainer.ComboCount.setAttribute(`class`, `ComboCountAnimation`);
            DOMConatiners.get().GamePlayScreenContainer.ComboCount.innerHTML = `${this.ComboCount}<br>Combo`
            setTimeout(() => {
                DOMConatiners.get().GamePlayScreenContainer.ComboCount.setAttribute(`class`, ``);
            }, 100);
        }
    }
}