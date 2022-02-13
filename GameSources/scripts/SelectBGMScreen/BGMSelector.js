import Debug from "../Common/Debug";
import BGMDatabase from "../BGMDatabase";
import DOMConatiners from "../Common/DOMConatiners";
import GamePlayScreenController from "../GamePlayScreenController"
import SFXPlayer from "../Common/SFXPlayer";

const debug = new Debug({
    filename: `BGMSelector`
})

export default class BGMSelector {

    static DIFFICULTY_COLOR = {
        EASY: `green`,
        NORMAL: `blue`,
        HARD: `yellow`,
        XTREME: `red`,
    }

    static DIFFICULTY = [
        `EASY`, `NORMAL`, `HARD`, `XTREME`
    ]

    static selectedDifficultyIdx = 1;
    static currrentDifficulty = ``;

    static selectedMusicIdx = 0;
    static BGMData = {};

    static BGM_COVERIMAGE_ROTATE_DEGREE;

    static currentRotation = 0;

    // Rotate ref : https://www.youtube.com/watch?v=j1-Ak3WWV_g
    static async initialize() {
        debug.log(`Initializing...`);

        this.BGM_COVERIMAGE_ROTATE_DEGREE = 360 / BGMDatabase.getAllData().length;

        this.currrentDifficulty = this.DIFFICULTY[this.selectedDifficultyIdx];
        debug.log(`Music Info Rotate degree : ${this.BGM_COVERIMAGE_ROTATE_DEGREE}`);

        for (let idx = 0; idx < BGMDatabase.getAllData().length; idx++) {
            const rotatedDegree = idx * this.BGM_COVERIMAGE_ROTATE_DEGREE.toFixed(0);
            const bgmInfo = BGMDatabase.getAllData()[idx];
            const title = bgmInfo.title;
            const coverImage = bgmInfo.coverImage;
            const span = document.createElement(`span`);
            span.id = `coverImage_${idx}`
            span.setAttribute(`class`, `coverImage`);
            debug.log(`Rotate to : `, rotatedDegree)
            span.style.transform = `rotateY(${rotatedDegree}deg) translateZ(600px)`;

            const imgTag = document.createElement(`img`);
            imgTag.setAttribute(`class`, `coverImage_imgTag`);
            imgTag.src = coverImage;
            span.appendChild(imgTag)
            // console.log(`rotateY(${idx * this.BGM_COVERIMAGE_ROTATE_DEGREE}deg);`);

            DOMConatiners.get().SelectMusicScreenContainer.CoverImageContainer.appendChild(span);
        }
        this.setTitleAndDifficultyText();
    }

    static rotateCoverImageContainer() {
        // debug.log(`rotateY(${this.currentRotation}deg)`);
        // DOMConatiners.get().SelectMusicScreenContainer.CoverImageContainer.style.transform = ` rotateY(${this.currentRotation}deg) perspective(1000px)`;
        DOMConatiners.get().SelectMusicScreenContainer.CoverImageContainer.style.transform = `translateZ(-500px) perspective(1000px) rotateY(${this.currentRotation}deg)`;
        SFXPlayer.play(`SelectMusicScreen/onBGMSelected.mp3`)
    }

    static setTitleAndDifficultyText() {
        DOMConatiners.get().SelectMusicScreenContainer.SelectedMusicInfoContainer.innerHTML =
            `${BGMDatabase.getAllData()[this.selectedMusicIdx].title}<br>` +
            `${this.currrentDifficulty}`;

    }


    static getCurrentDifficulty() {
        return this.DIFFICULTY[this.selectedDifficultyIdx];
    }

    static onDifficultyChanged() {
        this.currrentDifficulty = this.getCurrentDifficulty();
        const textStrokeColor = this.DIFFICULTY_COLOR[this.currrentDifficulty];
        debug.log(`Difficulty change to : [${this.currrentDifficulty}], stroke : [${textStrokeColor}]`);
        DOMConatiners.get().SelectMusicScreenContainer.SelectedMusicInfoContainer.style.webkitTextStroke = `1px ${textStrokeColor}`
    }

    static onBGMSelected(e) {
        // debug.log(e)

        const BGMData = BGMDatabase.getAllData();
        // Select BGM
        if (e.key === `ArrowLeft`) {
            this.selectedMusicIdx = (BGMData.length + this.selectedMusicIdx - 1) % BGMData.length;
            this.currentRotation += this.BGM_COVERIMAGE_ROTATE_DEGREE;
            this.rotateCoverImageContainer();
            debug.log(`Selected title : [${this.selectedMusicIdx}] ${BGMData[this.selectedMusicIdx].title}`);
        } else if (e.key === `ArrowRight`) {
            this.selectedMusicIdx = (this.selectedMusicIdx + 1) % BGMData.length;
            this.currentRotation -= this.BGM_COVERIMAGE_ROTATE_DEGREE;
            this.rotateCoverImageContainer();
            debug.log(`Selected title : [${this.selectedMusicIdx}] ${BGMData[this.selectedMusicIdx].title}`);
        }
        // Select difficulty
        if (e.key === `ArrowUp`) {
            this.selectedDifficultyIdx = (this.DIFFICULTY.length + this.selectedDifficultyIdx - 1) % this.DIFFICULTY.length;
            this.onDifficultyChanged();
        }
        if (e.key === `ArrowDown`) {
            this.selectedDifficultyIdx = (this.selectedDifficultyIdx + 1) % this.DIFFICULTY.length;
            this.onDifficultyChanged();
        } else if ((e.key === `Enter`) || (e.key === ` `)) {
            debug.log(`Selected`);
            DOMConatiners.showMainContainer(DOMConatiners.MainContainer.GamePlayScreen);
            GamePlayScreenController.startGameByTitle(BGMData[this.selectedMusicIdx].title, this.getCurrentDifficulty());
        }
        this.setTitleAndDifficultyText();
    }
}