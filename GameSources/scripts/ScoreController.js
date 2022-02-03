import Debug from "./Debug";
import DOMConatiners from "./DOMConatiners"

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

    static PERFECT_SCORE = 1000000;
    static scorePerNote;
    static scoreSum = 0;

    static initialize(noteList) {
        this.scoreSum = 0;
        this.scorePerNote = this.PERFECT_SCORE / noteList.length;
        DOMConatiners.get().GameScore.innerText = this.getFormattedScore();
    }

    static getFormattedScore() {
        return (`0000000${this.scoreSum.toFixed(0)}`).substr(-7);
    }

    static addScore(point) {
        this.scoreSum += this.scorePerNote * this.SCORE_OF_POINT[point];
        debug.log(`Update Score :: ${this.getFormattedScore()}`)
        DOMConatiners.get().GameScore.innerText = this.getFormattedScore();
    }
}