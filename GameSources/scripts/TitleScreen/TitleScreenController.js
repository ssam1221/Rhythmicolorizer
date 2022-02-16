import BGMSelector from "../SelectBGMScreen/BGMSelector";
import DOMConatiners from "../Common/DOMConatiners"
import LoadingController from "../Common/LoadingController";


export default class TitleScreenController {


    static initialize() {

    }


    static onkeyEvent(evt) {
        if (evt) {
            LoadingController.showPlayLoading();
            setTimeout(() => {
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