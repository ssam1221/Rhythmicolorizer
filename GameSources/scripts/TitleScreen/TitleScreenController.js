import BGMSelector from "../SelectBGMScreen/BGMSelector";
import DOMConatiners from "../Common/DOMConatiners"
import LoadingController from "../Common/LoadingController";
import Debug from "../Common/Debug";

const debug = new Debug({
    filename: `TitleScreenController`
})

export default class TitleScreenController {

    static YoutubePlayer;

    static initialize() {
        const self = this;
        this.YoutubePlayer = new YT.Player(`TitleScreenYoutubeVideoPlayer`, {
            height: `800`,
            width: `800`,
            videoId: `fIH7p8nEhWg`,
            playerVars: {
                'controls': 0,
                'autoplay': 1,
                // 'loop': 1,
                // 'mute': 1 // N.B. here the mute settings.
            },
            events: {
                onReady: onPlayerReady,
                // onStateChange: onPlayerStateChange
            }
        });

        // 4. The API will call this function when the video player is ready.
        function onPlayerReady(event) {
            // console.log(`onPlayerReady : `, event);
            self.YoutubePlayer.playVideo();
        }
    }


    static onkeyEvent(evt) {
        if (evt) {
            let youtubeVolume = 100;
            const volumeInterval = setInterval(() => {
                this.YoutubePlayer.setVolume(youtubeVolume--);
                if (youtubeVolume <= 0) {
                    const youtubePlayerContainer = DOMConatiners.get().TitleScreenContainer.YoutubePlayerContainer;
                    while (youtubePlayerContainer.firstChild) {
                        youtubePlayerContainer.removeChild(youtubePlayerContainer.firstChild);
                    }
                    clearInterval(volumeInterval);
                }
            }, 10);

            LoadingController.showPlayLoading();
            setTimeout(() => {
                this.YoutubePlayer.stopVideo();
                DOMConatiners.hideAll();
            }, 1000);
            setTimeout(() => {
                DOMConatiners.showMainContainer(DOMConatiners.MainContainer.SelectMusicScreen);
                BGMSelector.playBGMPreview();
                LoadingController.hidePlayLoading();
            }, 2000);

        }
    }
}