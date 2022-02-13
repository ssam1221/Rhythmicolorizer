import BGMDatabase from "../BGMDatabase";
import DOMConatiners from "../Common/DOMConatiners"
import NoteCreator from "./NoteCreator";
import SFXPlayer from "../Common/SFXPlayer";
import Debug from "../Common/Debug";

const debug = new Debug({
    filename: `BGMPlayer`
});

export default class BGMPlayer {
    static currentBGM = ``;
    static isBGMStart = false;
    static isGameStart = false;
    static player;

    static initialize() {}

    static getBGMDuration() {
        // Seconds
        return self.player.getDuration();
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
                DOMConatiners.get().GamePlayScreenContainer.GetReadyText.innerHTML = `Get<br>Ready?`;
                SFXPlayer.play(`data/sfx/voice/get_ready.wav`);
                DOMConatiners.get().GamePlayScreenContainer.GetReadyText.setAttribute(`class`, `GetReadyAnimation`);
                setTimeout(() => {
                    DOMConatiners.get().GamePlayScreenContainer.GetReadyText.setAttribute(`class`, ``);
                    SFXPlayer.play(`data/sfx/voice/three.wav`);
                    DOMConatiners.get().GamePlayScreenContainer.GetReadyText.innerHTML = `3`;
                    setTimeout(() => {
                        DOMConatiners.get().GamePlayScreenContainer.GetReadyText.setAttribute(`class`, `GetReadyAnimation`);
                    });
                }, 1000);
                setTimeout(() => {
                    DOMConatiners.get().GamePlayScreenContainer.GetReadyText.setAttribute(`class`, ``);
                    SFXPlayer.play(`data/sfx/voice/two.wav`);
                    DOMConatiners.get().GamePlayScreenContainer.GetReadyText.innerHTML = `2`;
                    setTimeout(() => {
                        DOMConatiners.get().GamePlayScreenContainer.GetReadyText.setAttribute(`class`, `GetReadyAnimation`);
                    });
                }, 2000);
                setTimeout(() => {
                    DOMConatiners.get().GamePlayScreenContainer.GetReadyText.setAttribute(`class`, ``);
                    SFXPlayer.play(`data/sfx/voice/one.wav`);
                    DOMConatiners.get().GamePlayScreenContainer.GetReadyText.innerHTML = `1`;
                    setTimeout(() => {
                        DOMConatiners.get().GamePlayScreenContainer.GetReadyText.setAttribute(`class`, `GetReadyAnimation`);
                    });
                }, 3000);
                setTimeout(() => {
                    DOMConatiners.get().GamePlayScreenContainer.GetReadyText.setAttribute(`class`, ``);
                    SFXPlayer.play(`data/sfx/voice/start.wav`);
                    DOMConatiners.get().GamePlayScreenContainer.GetReadyText.innerHTML = `Start!`;
                    setTimeout(() => {
                        DOMConatiners.get().GamePlayScreenContainer.GetReadyText.setAttribute(`class`, `GetReadyAnimation`);
                    });
                }, 4000);
                setTimeout(() => {
                    const prevClassOfkeynotesContainerBackground = DOMConatiners.get().GamePlayScreenContainer.keynotesContainerBackground.getAttribute(`class`),
                        prevClassOfkeynoteChecker = DOMConatiners.get().GamePlayScreenContainer.keynoteCheckerContainer.getAttribute(`class`),
                        prevClassOfkeynotesContainers = DOMConatiners.get().GamePlayScreenContainer.keynotesContainers[0].getAttribute(`class`);
                    DOMConatiners.get().GamePlayScreenContainer.keynoteCheckerContainer.setAttribute(`class`, `${prevClassOfkeynoteChecker} transparentFadeIn`);
                    DOMConatiners.get().GamePlayScreenContainer.Difficulty.style.opacity = 1;
                    DOMConatiners.get().GamePlayScreenContainer.keynotesContainerBackground.setAttribute(`class`, `${prevClassOfkeynotesContainerBackground} transparentFadeIn`);
                    for (const el of DOMConatiners.get().GamePlayScreenContainer.keynotesContainers) {
                        el.setAttribute(`class`, `${prevClassOfkeynotesContainers} transparentFadeIn`);
                    }
                    setTimeout(() => {
                        DOMConatiners.get().GamePlayScreenContainer.keynotesContainerBackground.style.opacity = 0.2;
                        DOMConatiners.get().GamePlayScreenContainer.keynoteCheckerContainer.style.opacity = 0.2;
                        for (const el of DOMConatiners.get().GamePlayScreenContainer.keynotesContainers) {
                            el.style.opacity = 0.2;
                        }
                    })
                    DOMConatiners.get().GamePlayScreenContainer.GetReadyText.setAttribute(`class`, ``);
                    DOMConatiners.get().GamePlayScreenContainer.GetReadyText.innerHTML = ``;
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
            console.log(event)
            if (self.isBGMStart === false) {
                self.isBGMStart = true;
                self.player.pauseVideo();
                await countdown();
                debug.log(`self.isBGMStart `, self.isBGMStart);
                self.isGameStart = true;
                // NoteCreator.start();
                // console.log(`onPlayerStateChange `, event)
                // if (event.data === YT.PlayerState.PLAYING) {
                // setTimeout(stopVideo, 6000);
                // console.log(YT.PlayerState)
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