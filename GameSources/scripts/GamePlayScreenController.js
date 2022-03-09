import BGMPlayer from "./GamePlayScreen/BGMPlayer";
import GamePlayController from "./GamePlayScreen/GamePlayController";
import NoteRenderController from "./GamePlayScreen/NoteRenderController";

export default class GamePlayScreenController {

    static startGameByTitle(title, difficulty) {
        BGMPlayer.setVideo(title, ({
            status,
            payload
        }) => {
            if (status === `GameReady`) {
                GamePlayController.start(title, difficulty);
                payload.play();
            } else if (status === `GameCompleted`) {}
        });
    }
}