import BGMPlayer from "./GamePlayScreen/BGMPlayer";
import NoteCreator from "./GamePlayScreen/NoteCreator";

export default class GamePlayScreenController {

    static startGameByTitle(title) {
        BGMPlayer.setVideo(title, ({
            status,
            payload
        }) => {
            if (status === `GameReady`) {
                NoteCreator.start();
                payload.play();
            } else if (status === `GameCompleted`) {}
        });
    }
}