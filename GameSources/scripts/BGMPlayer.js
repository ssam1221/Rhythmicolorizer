import BGMSelector from "./BGMSelector";
import BGMDatabase from "./BGMDatabase";
import NoteCreator from "./NoteCreator";
import SFXPlayer from "./SFXPlayer";
import Debug from "./Debug";

const debug = new Debug({
    filename: `BGMPlayer`
});

export default class BGMPlayer {
    static currentBGM = ``;
    static isBGMStart = false;
    static isGameStart = false;
    static player;

    static Containers = {
        Difficulty: null,
        GetReadyText: null,
        keynotesContainers: null,
        keynotesContainerBackground: null,
        keynoteChecker: null
    }

    static initialize() {
        this.Containers.Difficulty = document.getElementById(`Difficulty`);
        this.Containers.GetReadyText = document.getElementById(`getReadyText`);
        this.Containers.keynotesContainerBackground = document.getElementById(`keynotesContainerBackground`);
        this.Containers.keynoteChecker = document.getElementById(`keynoteChecker`);
        this.Containers.keynotesContainers = document.getElementsByClassName(`keynotesContainer`);
    }

    // Refer : https://developers.google.com/youtube/iframe_api_reference?hl=ko#loadVideoById
    static setVideo(title, callback) {
        const self = this;

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
                SFXPlayer.play(`data/sfx/voice/get_ready.wav`);
                self.Containers.GetReadyText.setAttribute(`class`, `GetReadyAnimation`);
                setTimeout(() => {
                    self.Containers.GetReadyText.setAttribute(`class`, ``);
                    SFXPlayer.play(`data/sfx/voice/three.wav`);
                    self.Containers.GetReadyText.innerHTML = `3`;
                    setTimeout(() => {
                        self.Containers.GetReadyText.setAttribute(`class`, `GetReadyAnimation`);
                    });
                }, 1000);
                setTimeout(() => {
                    self.Containers.GetReadyText.setAttribute(`class`, ``);
                    SFXPlayer.play(`data/sfx/voice/two.wav`);
                    self.Containers.GetReadyText.innerHTML = `2`;
                    setTimeout(() => {
                        self.Containers.GetReadyText.setAttribute(`class`, `GetReadyAnimation`);
                    });
                }, 2000);
                setTimeout(() => {
                    self.Containers.GetReadyText.setAttribute(`class`, ``);
                    SFXPlayer.play(`data/sfx/voice/one.wav`);
                    self.Containers.GetReadyText.innerHTML = `1`;
                    setTimeout(() => {
                        self.Containers.GetReadyText.setAttribute(`class`, `GetReadyAnimation`);
                    });
                }, 3000);
                setTimeout(() => {
                    self.Containers.GetReadyText.setAttribute(`class`, ``);
                    SFXPlayer.play(`data/sfx/voice/start.wav`);
                    self.Containers.GetReadyText.innerHTML = `Start!`;
                    setTimeout(() => {
                        self.Containers.GetReadyText.setAttribute(`class`, `GetReadyAnimation`);
                    });
                }, 4000);
                setTimeout(() => {
                    const prevClassOfkeynotesContainerBackground = self.Containers.keynotesContainerBackground.getAttribute(`class`),
                        prevClassOfkeynoteChecker = self.Containers.keynoteChecker.getAttribute(`class`),
                        prevClassOfkeynotesContainers = self.Containers.keynotesContainers[0].getAttribute(`class`);
                    self.Containers.keynoteChecker.setAttribute(`class`, `${prevClassOfkeynoteChecker} transparentFadeIn`);
                    self.Containers.Difficulty.style.opacity = 1;
                    self.Containers.keynotesContainerBackground.setAttribute(`class`, `${prevClassOfkeynotesContainerBackground} transparentFadeIn`);
                    for (const el of self.Containers.keynotesContainers) {
                        el.setAttribute(`class`, `${prevClassOfkeynotesContainers} transparentFadeIn`);
                    }
                    setTimeout(() => {
                        self.Containers.keynotesContainerBackground.style.opacity = 0.2;
                        self.Containers.keynoteChecker.style.opacity = 0.2;
                        for (const el of self.Containers.keynotesContainers) {
                            el.style.opacity = 0.2;
                        }
                    })
                    self.Containers.GetReadyText.setAttribute(`class`, ``);
                    self.Containers.GetReadyText.innerHTML = ``;
                    resolve();
                }, 5000);
                // }, 2000);
            })
        }

        // UNSTARTED: -1
        // ENDED: 0
        // PLAYING: 1
        // PAUSED: 2
        // BUFFERING: 3
        // CUED: 5

        async function onPlayerStateChange(event) {
            if (self.isBGMStart === false) {
                self.isBGMStart = true;
                self.player.stopVideo();
                await countdown();
                debug.log(`self.isBGMStart `, self.isBGMStart);
                self.isGameStart = true;
                // NoteCreator.start();
                // console.log(`onPlayerStateChange `, event)
                // if (event.data === YT.PlayerState.PLAYING) {
                // setTimeout(stopVideo, 6000);
                console.log(YT.PlayerState)
                callback({
                    status: `GameReady`,
                    payload: {
                        play: () => {
                            self.player.playVideo();
                        }
                    }
                })

            }
            if (self.isBGMStart === true) {
                if (event.data === YT.PlayerState.ENDED) {
                    callback({
                        status: `GameCompleted`,
                        payload: {}
                    })
                }
            }
        }

        // function stopVideo() {
        //     player.stopVideo();
        // }
    }

    static play() {
        this.player.playVideo();
    }
}