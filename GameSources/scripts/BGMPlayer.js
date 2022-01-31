import BGMSelector from "./BGMSelector";
import Debug from "./Debug";

const debug = new Debug({
    filename: `BGMPlayer`
});

export default class BGMPlayer {


    static currentBGM = ``;

    static player;

    static initialize() {}

    static async setVideo(title) {
        const self = this;
        return new Promise((resolve, reject) => {

            debug.log(`SetVideo : [${title}]`);
            const selectedBGM = (() => {
                for (const bgm of BGMSelector.getBGMListInfo()) {
                    if (bgm.title === title) {
                        return bgm;
                    }
                }
            })();

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
                console.log(`onPlayerReady : `, event);
                event.target.playVideo();
            }

            // 5. The API calls this function when the player`s state changes.
            //    The function indicates that when playing a video (state=1),
            //    the player should play for six seconds and then stop.

            function onPlayerStateChange(event) {
                console.log(`onPlayerStateChange `, event)
                if (event.data === YT.PlayerState.PLAYING) {
                    // setTimeout(stopVideo, 6000);
                    resolve({
                        play: () => {
                            event.target.playVideo();
                        }
                    });
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