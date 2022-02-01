import BGMSelector from "./BGMSelector";
import BGMDatabase from "./BGMDatabase";
import NoteCreator from "./NoteCreator";
import Debug from "./Debug";

const debug = new Debug({
    filename: `BGMPlayer`
});

export default class BGMPlayer {
    static currentBGM = ``;
    static isBGMStart = false;
    static player;

    static Containers = {
        Difficulty: null,
        GetReadyText: null,
        keynotesContainerBackground: null,
        keynoteChecker: null
    }

    static initialize() {
        this.Containers.Difficulty = document.getElementById(`Difficulty`);
        this.Containers.GetReadyText = document.getElementById(`getReadyText`);
        this.Containers.keynotesContainerBackground = document.getElementById(`keynotesContainerBackground`);
        this.Containers.keynoteChecker = document.getElementById(`keynoteChecker`);
    }

    static async setVideo(title) {
        const self = this;
        return new Promise((resolve, reject) => {

            debug.log(`SetVideo : [${title}]`);
            const selectedBGM = BGMDatabase.getDataByTitle(title);

            debug.log(selectedBGM);
            // debug.log(selectedBGM.data.youtube)

            self.player = new YT.Player(`youtubeVideoPlayer`, {
                height: `800`,
                width: `800`,
                videoId: selectedBGM.data.youtube,
                playerVars: {
                    'controls': 0,

                    // 'autoplay': 1,
                    // 'loop': 1,
                    // 'mute': 1 // N.B. here the mute settings.
                },
                events: {
                    onReady: onPlayerReady,
                    onStateChange: onPlayerStateChange
                }
            });


            // 4. The API will call this function when the video player is ready.
            function onPlayerReady(event) {
                // console.log(`onPlayerReady : `, event);
                self.player.playVideo();
            }

            // 5. The API calls this function when the player`s state changes.
            //    The function indicates that when playing a video (state=1),
            //    the player should play for six seconds and then stop.

            function countdown() {
                return new Promise((resolve, reject) => {
                    self.Containers.GetReadyText.innerHTML = `Get<br>Ready?`;
                    self.Containers.GetReadyText.setAttribute(`class`, `GetReadyAnimation`);
                    setTimeout(() => {
                        self.Containers.GetReadyText.setAttribute(`class`, ``);
                        self.Containers.GetReadyText.innerHTML = `3`;
                        setTimeout(() => {
                            self.Containers.GetReadyText.setAttribute(`class`, `GetReadyAnimation`);
                        });
                    }, 1000);
                    setTimeout(() => {
                        self.Containers.GetReadyText.setAttribute(`class`, ``);
                        self.Containers.GetReadyText.innerHTML = `2`;
                        setTimeout(() => {
                            self.Containers.GetReadyText.setAttribute(`class`, `GetReadyAnimation`);
                        });
                    }, 2000);
                    setTimeout(() => {
                        self.Containers.GetReadyText.setAttribute(`class`, ``);
                        self.Containers.GetReadyText.innerHTML = `1`;
                        setTimeout(() => {
                            self.Containers.GetReadyText.setAttribute(`class`, `GetReadyAnimation`);
                        });
                    }, 3000);
                    setTimeout(() => {
                        self.Containers.GetReadyText.setAttribute(`class`, ``);
                        self.Containers.GetReadyText.innerHTML = `Start!`;
                        setTimeout(() => {
                            self.Containers.GetReadyText.setAttribute(`class`, `GetReadyAnimation`);
                        });
                    }, 4000);
                    setTimeout(() => {
                        const prevClassOfkeynotesContainerBackground = self.Containers.keynotesContainerBackground.getAttribute(`class`),
                            prevClassOfkeynoteChecker = self.Containers.keynoteChecker.getAttribute(`class`);
                        self.Containers.keynotesContainerBackground.setAttribute(`class`, `${prevClassOfkeynotesContainerBackground} transparentFadeIn`);
                        self.Containers.keynoteChecker.setAttribute(`class`, `${prevClassOfkeynoteChecker} transparentFadeIn`);
                        self.Containers.Difficulty.style.opacity = 1;
                        setTimeout(() => {
                            self.Containers.keynotesContainerBackground.style.opacity = 0.2;
                            self.Containers.keynoteChecker.style.opacity = 0.2;
                        })
                        self.Containers.GetReadyText.setAttribute(`class`, ``);
                        self.Containers.GetReadyText.innerHTML = ``;
                        resolve();
                    }, 5000);
                    // }, 2000);
                })
            }

            async function onPlayerStateChange(event) {
                if (self.isBGMStart === false) {
                    debug.log(`self.isBGMStart `, self.isBGMStart);
                    self.isBGMStart = true;
                    self.player.stopVideo();
                    await countdown();
                    // NoteCreator.start();
                    // console.log(`onPlayerStateChange `, event)
                    // if (event.data === YT.PlayerState.PLAYING) {
                    // setTimeout(stopVideo, 6000);
                    resolve({
                        play: () => {
                            self.player.playVideo();
                        }
                    });
                    // }
                }
            }

            // function stopVideo() {
            //     player.stopVideo();
            // }
        });
    }

    static play() {
        this.player.playVideo();
    }
}