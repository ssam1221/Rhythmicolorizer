import Debug from "../Common/Debug";
import BGMDatabase from "../BGMDatabase";
import DOMConatiners from "../Common/DOMConatiners";

const debug = new Debug({
    filename: `BGMSelector`
})

export default class BGMSelector {

    static selectedIdx = 0;
    static BGMData = {};

    static BGM_COVERIMAGE_ROTATE_DEGREE;

    static currentRotation = 0;

    // Rotate ref : https://www.youtube.com/watch?v=j1-Ak3WWV_g
    static async initialize() {
        debug.log(`Initializing...`);

        this.BGM_COVERIMAGE_ROTATE_DEGREE = 360 / BGMDatabase.getAllData().length;
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
            imgTag.src = coverImage;
            span.appendChild(imgTag)
            console.log(span)
            // console.log(`rotateY(${idx * this.BGM_COVERIMAGE_ROTATE_DEGREE}deg);`);

            DOMConatiners.get().SelectMusicScreenContainer.CoverImageContainer.appendChild(span);
        }
    }

    static show() {
        debug.log(`show`)

    }

    static rotateCoverImageContainer() {
        debug.log(`rotateY(${this.currentRotation}deg)`)
        // DOMConatiners.get().SelectMusicScreenContainer.CoverImageContainer.style.transform = ` rotateY(${this.currentRotation}deg) perspective(1000px)`;
        DOMConatiners.get().SelectMusicScreenContainer.CoverImageContainer.style.transform = `translateZ(-500px) perspective(1000px) rotateY(${this.currentRotation}deg)`;
    }

    static onBGMSelected(e) {
        // debug.log(e)

        const BGMData = BGMDatabase.getAllData();
        if (e.key === `ArrowLeft`) {
            this.selectedIdx = (BGMData.length + this.selectedIdx - 1) % BGMData.length;
            this.currentRotation += this.BGM_COVERIMAGE_ROTATE_DEGREE;
            this.rotateCoverImageContainer();
            debug.log(`Selected title : [${this.selectedIdx}] ${BGMData[this.selectedIdx].title}`);
        } else if (e.key === `ArrowRight`) {
            this.selectedIdx = (this.selectedIdx + 1) % BGMData.length;
            this.currentRotation -= this.BGM_COVERIMAGE_ROTATE_DEGREE;
            this.rotateCoverImageContainer();
            debug.log(`Selected title : [${this.selectedIdx}] ${BGMData[this.selectedIdx].title}`);
        } else if ((e.key === `Enter`) || (e.key === ` `)) {
            debug.log(`Selected`);
        }
        DOMConatiners.get().SelectMusicScreenContainer.SelectedMusicInfoContainer.innerHTML = `${BGMData[this.selectedIdx].title}`;
    }
}