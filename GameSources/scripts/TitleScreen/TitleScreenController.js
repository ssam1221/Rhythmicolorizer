import Debug from "../Common/Debug";
import BGMSelector from "../SelectBGMScreen/BGMSelector";
import DOMConatiners from "../Common/DOMConatiners"
import LoadingController from "../Common/LoadingController";
import SFXPlayer from "../Common/SFXPlayer";

const debug = new Debug({
    filename: `TitleScreenController`
})

export default class TitleScreenController {

    static YoutubePlayer;
    static isVideoPlaying = false;
    static isGameStart = false;
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

        function onPlayerReady(event) {
            // console.log(`onPlayerReady : `, event);
            self.YoutubePlayer.playVideo();
            self.isVideoPlaying = true;
        }

        // TODO: If title bgm is ended, go to next
    }

    static onkeyEvent(evt) {
        if (evt) {
            if (this.isVideoPlaying === true && this.isGameStart === false) {
                this.isGameStart = true;
                SFXPlayer.play(`SelectMusicScreen/bgmSelected.mp3`);
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

                // LoadingController.showPlayLoading();
                LoadingController.showInitialLoading();
                setTimeout(() => {
                    this.YoutubePlayer.stopVideo();
                    // DOMConatiners.hideAll();
                    DOMConatiners.showMainContainer(`LoadingScreen`);
                }, 1000);
                setTimeout(() => {
                    // LoadingController.hidePlayLoading();
                    LoadingController.hideInitialLoading();
                    DOMConatiners.showMainContainer(DOMConatiners.MainContainer.SelectMusicScreen);
                    BGMSelector.playBGMPreview();
                }, 2000);
            }
        }
    }
}