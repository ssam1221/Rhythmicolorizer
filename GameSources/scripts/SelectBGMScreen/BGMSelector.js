import Debug from "../Common/Debug";
import BGMDatabase from "../BGMDatabase";
import DOMConatiners from "../Common/DOMConatiners";
import GamePlayScreenController from "../GamePlayScreenController"
import LoadingController from "../Common/LoadingController";
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

    static isBGMSelected = false;

    static BGM_COVERIMAGE_ROTATE_DEGREE;

    static currentRotation = 0;

    // Visualizer
    static VisualizerAudioContext;

    // Rotate ref : https://www.youtube.com/watch?v=j1-Ak3WWV_g
    static async initialize() {
        debug.log(`Initializing...`);

        this.initializeVisualizer();

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
            const div = document.createElement(`div`);
            div.id = `coverImage_${idx}`
            div.setAttribute(`class`, `coverImage`);
            // debug.log(`Rotate to : `, rotatedDegree);
            div.style.transform = `rotateY(${rotatedDegree}deg) translateZ(600px)`;

            const imgTag = document.createElement(`img`);
            imgTag.setAttribute(`class`, `coverImage_imgTag`);
            imgTag.id = `coverImageImgTag_${idx}`
            imgTag.src = coverImage;
            imgTag.style.overflow = `visible`;
            div.appendChild(imgTag)
            // console.log(`rotateY(${idx * this.BGM_COVERIMAGE_ROTATE_DEGREE}deg);`);

            DOMConatiners.get().SelectMusicScreenContainer.CoverImageContainer.appendChild(div);
        }

        this.setTitleAndDifficultyText();
        this.onBGMSelectChanged({
            isInitial: true
        });
        this.resetAudioPreviewPlayer();
        // this.playBGMPreview(this.BGMData[0].title);
    }

    static onArrowKeyPressed({
        type,
        direction
    }) {
        document.getElementById(`Select${type}Arrow${direction}`).setAttribute(`class`, `SelectMusicScreen ${type}SelectArrow`);
        document.getElementById(`Select${type}Arrow${direction}`).setAttribute(`class`, `SelectMusicScreen ${type}SelectArrow ArrowPressed`);
        setTimeout(() => {
            document.getElementById(`Select${type}Arrow${direction}`).setAttribute(`class`, `SelectMusicScreen ${type}SelectArrow`);
        }, 500);
    }

    static onBGMSelectChanged({
        isInitial,
        arrowDirection
    }) {
        debug.log(`Selected title : [${this.selectedMusicIdx}] ${this.BGMData[this.selectedMusicIdx].title}`);
        this.currentRotation = this.BGM_COVERIMAGE_ROTATE_DEGREE * -this.selectedMusicRotationIdx;
        DOMConatiners.get().SelectMusicScreenContainer.CoverImageContainer.style.transform = `translateZ(-500px) perspective(1000px) rotateY(${this.currentRotation}deg)`;

        DOMConatiners.get().SelectMusicScreenContainer.BGMSelected.style.backgroundImage = `url('${this.BGMData[this.selectedMusicIdx].coverImage}')`;
        console.log(DOMConatiners.get().SelectMusicScreenContainer.BGMSelected.style.backgroundImage)
        if (true !== isInitial) {
            this.playBGMPreview(this.BGMData[this.selectedMusicIdx].title);
        };
        if (arrowDirection) {
            SFXPlayer.play(`SelectMusicScreen/onBGMSelected.mp3`);
            this.onArrowKeyPressed({
                type: `Music`,
                direction: arrowDirection
            });
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

    static onDifficultyChanged({
        arrowDirection = null
    }) {
        this.currrentDifficulty = this.getCurrentDifficulty();
        const textStrokeColor = this.DIFFICULTY_COLOR[this.currrentDifficulty];
        debug.log(`Difficulty change to : [${this.currrentDifficulty}], stroke : [${textStrokeColor}]`);
        DOMConatiners.get().SelectMusicScreenContainer.SelectedMusicInfoContainer.style.webkitTextStroke = `1px ${textStrokeColor}`

        if (arrowDirection) {
            SFXPlayer.play(`SelectMusicScreen/onBGMSelected.mp3`);
            this.onArrowKeyPressed({
                type: `Difficulty`,
                direction: arrowDirection
            });
        }
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

    static onBGMSelected() {
        const self = this;

        SFXPlayer.play(`SelectMusicScreen/bgmSelected.mp3`);
        const player = DOMConatiners.get().SelectMusicScreenContainer.BGMPreviewPlayer;

        // Fade out current preview sound
        clearTimeout(self.BGM_PREVIEW_FADEOUT_TIMEOUT_HANDLER);
        clearInterval(self.BGM_PREVIEW_FADE_INTERVAL_HANDLER.IN);
        clearInterval(self.BGM_PREVIEW_FADE_INTERVAL_HANDLER.OUT);
        self.BGM_PREVIEW_FADE_INTERVAL_HANDLER.OUT = setInterval(() => {
            if (player.volume > this.BGM_PREVIEW_FADE_DIFF) {
                player.volume -= this.BGM_PREVIEW_FADE_DIFF;
            } else {
                clearInterval(self.BGM_PREVIEW_FADE_INTERVAL_HANDLER.OUT);
            }
        }, 100);
        const selectedContainer = DOMConatiners.get().SelectMusicScreenContainer.BGMSelected;
        const prevClass = selectedContainer.getAttribute(`class`);
        selectedContainer.setAttribute(`class`, `${prevClass} onSelected`);
        LoadingController.showPlayLoading();
        setTimeout(() => {
            DOMConatiners.hideAll();
        }, 1000);
        setTimeout(() => {
            selectedContainer.setAttribute(`class`, `${prevClass}`);
            self.resetAudioPreviewPlayer();
            DOMConatiners.showMainContainer(DOMConatiners.MainContainer.GamePlayScreen);
            GamePlayScreenController.startGameByTitle(self.BGMData[self.selectedMusicIdx].title, this.getCurrentDifficulty());
            LoadingController.hidePlayLoading();
            this.isBGMSelected = false;
        }, 2000);
    }

    static onBGMSelectorKeyPressed(e) {
        // debug.log(e)

        const BGMData = this.BGMData;
        // Select BGM
        if (e.key === `ArrowLeft`) {
            this.selectedMusicIdx = (BGMData.length + this.selectedMusicIdx - 1) % BGMData.length;
            this.selectedMusicRotationIdx--;
            this.onBGMSelectChanged({
                arrowDirection: `Left`
            });

        } else if (e.key === `ArrowRight`) {
            this.selectedMusicIdx = (this.selectedMusicIdx + 1) % BGMData.length;
            this.selectedMusicRotationIdx++;
            this.onBGMSelectChanged({
                arrowDirection: `Right`
            });
            debug.log(`Selected title : [${this.selectedMusicIdx}] ${BGMData[this.selectedMusicIdx].title}`);
        }
        // Select difficulty
        if (e.key === `ArrowUp`) {
            this.selectedDifficultyIdx = (this.DIFFICULTY.length + this.selectedDifficultyIdx - 1) % this.DIFFICULTY.length;
            this.onDifficultyChanged({
                arrowDirection: `Up`
            });
        }
        if (e.key === `ArrowDown`) {
            this.selectedDifficultyIdx = (this.selectedDifficultyIdx + 1) % this.DIFFICULTY.length;
            this.onDifficultyChanged({
                arrowDirection: `Down`
            });
        } else if ((e.key === `Enter`) || (e.key === ` `)) {
            if (this.isBGMSelected === false) {
                this.isBGMSelected = true;
                debug.log(`Selected`);
                this.onBGMSelected();
            }
        }
        this.setTitleAndDifficultyText();
    }

    static initializeVisualizer() {
        this.VisualizerAudioContext = new AudioContext();
        const audioTag = DOMConatiners.get().SelectMusicScreenContainer.BGMPreviewPlayer;
        const audioSource = this.VisualizerAudioContext.createMediaElementSource(audioTag);
        const analayzer = this.VisualizerAudioContext.createAnalyser();
        audioSource.connect(analayzer);
        audioSource.connect(this.VisualizerAudioContext.destination);
        const frequencyData = new Uint8Array(analayzer.frequencyBinCount);
        // }

        const avg = (arr) => {
            let sum = 0;
            for (const el of arr) {
                sum += el;
            }
            return parseInt(sum / arr.length);
        }

        // static renderFrame() {
        const renderFrame = () => {
            for (let idx = 0; idx < this.BGMData.length; idx++) {
                // Remove scale up
                document.getElementById(`coverImage_${idx}`).style.transform =
                    document.getElementById(`coverImage_${idx}`).style.transform.split(`scale`)[0];
            }

            analayzer.getByteFrequencyData(frequencyData);
            // const scaleValue = (1 + (avg(frequencyData)) / 500);
            const scaleValue = (1 + (frequencyData[128]) / 500);
            const target = document.getElementById(`coverImage_${this.selectedMusicIdx}`);
            if (target) {
                const prevTransform = target.style.transform.split(`scale`)[0];
                target.style.transform = `${prevTransform} scale(${scaleValue})`;
            }
            window.requestAnimationFrame(renderFrame);
        }

        window.requestAnimationFrame(renderFrame);
    }

    static startVisualizer() {
        window.requestAnimationFrame(this.renderFrame);
    }
}