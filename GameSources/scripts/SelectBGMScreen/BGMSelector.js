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

    static BGMPreviewPlayerFade = `out`;

    static BGM_PREVIEW_FADE_DIFF = 0.05;
    static BGM_PREVIEW_FADEOUT_TIMEOUT_START_TIMESTAMP = 3500;

    static BGM_PREVIEW_FADE_INTERVAL_HANDLER = {
        IN: 0,
        OUT: 0
    }
    static BGM_PREVIEW_FADEOUT_TIMEOUT_HANDLER = 0;

    static selectedDifficultyIdx = 1;
    static currrentDifficulty = ``;

    static BGMData = null;
    static selectedMusicIdx;
    static selectedMusicRotationIdx;


    static BGM_COVERIMAGE_ROTATE_DEGREE;

    static currentRotation = 0;

    // Rotate ref : https://www.youtube.com/watch?v=j1-Ak3WWV_g
    static async initialize() {
        debug.log(`Initializing...`);

        this.BGMData = BGMDatabase.getAllData();
        this.selectedMusicIdx = parseInt(Math.random() * this.BGMData.length);
        this.selectedMusicRotationIdx = this.selectedMusicIdx;
        this.BGM_COVERIMAGE_ROTATE_DEGREE = 360 / this.BGMData.length;

        this.currrentDifficulty = this.DIFFICULTY[this.selectedDifficultyIdx];
        debug.log(`Music Info Rotate degree : ${this.BGM_COVERIMAGE_ROTATE_DEGREE}`);

        for (let idx = 0; idx < this.BGMData.length; idx++) {
            const rotatedDegree = idx * this.BGM_COVERIMAGE_ROTATE_DEGREE.toFixed(0);
            const bgmInfo = this.BGMData[idx];
            const title = bgmInfo.title;
            const coverImage = bgmInfo.coverImage;
            const span = document.createElement(`span`);
            span.id = `coverImage_${idx}`
            span.setAttribute(`class`, `coverImage`);
            // debug.log(`Rotate to : `, rotatedDegree);
            span.style.transform = `rotateY(${rotatedDegree}deg) translateZ(600px)`;

            const imgTag = document.createElement(`img`);
            imgTag.setAttribute(`class`, `coverImage_imgTag`);
            imgTag.src = coverImage;
            span.appendChild(imgTag)
            // console.log(`rotateY(${idx * this.BGM_COVERIMAGE_ROTATE_DEGREE}deg);`);

            DOMConatiners.get().SelectMusicScreenContainer.CoverImageContainer.appendChild(span);
        }

        this.setTitleAndDifficultyText();
        this.onBGMSelectChanged(true);
        this.resetAudioPreviewPlayer();
        // this.playBGMPreview(this.BGMData[0].title);
    }

    static onBGMSelectChanged(isInitial) {
        debug.log(`Selected title : [${this.selectedMusicIdx}] ${this.BGMData[this.selectedMusicIdx].title}`);
        this.currentRotation = this.BGM_COVERIMAGE_ROTATE_DEGREE * -this.selectedMusicRotationIdx;
        DOMConatiners.get().SelectMusicScreenContainer.CoverImageContainer.style.transform = `translateZ(-500px) perspective(1000px) rotateY(${this.currentRotation}deg)`;
        if (true !== isInitial) {
            SFXPlayer.play(`SelectMusicScreen/onBGMSelected.mp3`);
            this.playBGMPreview(this.BGMData[this.selectedMusicIdx].title);
        }
    }

    static setTitleAndDifficultyText() {
        DOMConatiners.get().SelectMusicScreenContainer.SelectedMusicInfoContainer.innerHTML =
            `${this.BGMData[this.selectedMusicIdx].title}<br>` +
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

    static resetAudioPreviewPlayer() {
        clearTimeout(this.BGM_PREVIEW_FADEOUT_TIMEOUT_HANDLER);
        clearInterval(this.BGM_PREVIEW_FADE_INTERVAL_HANDLER.IN);
        clearInterval(this.BGM_PREVIEW_FADE_INTERVAL_HANDLER.OUT);
        const player = DOMConatiners.get().SelectMusicScreenContainer.BGMPreviewPlayer;
        player.pause();
        player.currentTime = 0;
        player.volume = 0;
    }

    static playBGMPreview(title = this.BGMData[this.selectedMusicIdx].title) {
        const self = this;
        // debug.log(`playBGMPreview : [${title}}]`);
        this.resetAudioPreviewPlayer()
        const player = DOMConatiners.get().SelectMusicScreenContainer.BGMPreviewPlayer;
        player.src = `data/sampleBGM/${title}.mp3`;
        player.play();
        const fadeCount = {
            in: 0,
            out: 0
        }
        if (player.oncanplaythrough === null) {
            player.oncanplaythrough = () => {
                // Fade In
                // debug.log(`Sample BGM play : ${player.duration} seconds`);
                // debug.log(`Sample BGM Fade in start`);
                self.BGM_PREVIEW_FADE_INTERVAL_HANDLER.IN = setInterval(() => {
                    if (player.volume < 1 - this.BGM_PREVIEW_FADE_DIFF) {
                        player.volume += this.BGM_PREVIEW_FADE_DIFF;
                    } else {
                        clearInterval(self.BGM_PREVIEW_FADE_INTERVAL_HANDLER.IN);
                    }
                }, 100);

                // Fade out
                // debug.log(`Sample BGM Fade out time : ${((player.duration * 1000) - this.BGM_PREVIEW_FADEOUT_TIMEOUT_START_TIMESTAMP)/ 1000 }`);
                self.BGM_PREVIEW_FADEOUT_TIMEOUT_HANDLER = setTimeout(() => {
                    // debug.log(`Sample BGM Fade out start`);
                    self.BGM_PREVIEW_FADE_INTERVAL_HANDLER.OUT = setInterval(() => {
                        if (player.volume > this.BGM_PREVIEW_FADE_DIFF) {
                            player.volume -= this.BGM_PREVIEW_FADE_DIFF;
                        } else {
                            clearInterval(self.BGM_PREVIEW_FADE_INTERVAL_HANDLER.OUT);
                        }
                    }, 100);
                }, (player.duration * 1000) - this.BGM_PREVIEW_FADEOUT_TIMEOUT_START_TIMESTAMP);
            }
        }
    }

    static onBGMSelectorKeyPressed(e) {
        // debug.log(e)

        const BGMData = this.BGMData;
        // Select BGM
        if (e.key === `ArrowLeft`) {
            this.selectedMusicIdx = (BGMData.length + this.selectedMusicIdx - 1) % BGMData.length;
            this.selectedMusicRotationIdx--;
            this.onBGMSelectChanged();
        } else if (e.key === `ArrowRight`) {
            this.selectedMusicIdx = (this.selectedMusicIdx + 1) % BGMData.length;
            this.selectedMusicRotationIdx++;
            this.onBGMSelectChanged();
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
            this.resetAudioPreviewPlayer();
            DOMConatiners.showMainContainer(DOMConatiners.MainContainer.GamePlayScreen);
            GamePlayScreenController.startGameByTitle(BGMData[this.selectedMusicIdx].title, this.getCurrentDifficulty());
        }
        this.setTitleAndDifficultyText();
    }
}