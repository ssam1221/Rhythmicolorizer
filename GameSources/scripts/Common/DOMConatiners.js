/**
 * @class DOMContainers
 * @description All DOM div elements are initialized from this code
 */

import Debug from "./Debug";

const debug = new Debug({
    filename: `DOMConatinerController`
})

export default class DOMConatiners {

    static Containers = {
        Main: {
            GamePlayScreen: null,
            SelectMusicScreen: null,
        },
        GamePlayScreenContainer: {
            ComboCount: null,
            GameScore: null,
            Difficulty: null,
            GetReadyText: null,
            keynotesContainerBackground: null,
            pressedkeynotesContainer: null,
            keynotesContainerContainer: null,
            keynotesContainers: null,
            keynoteCheckerContainer: null,
            keynoteCheckers: null,
            pointDisplayContainer: null
        },
        SelectMusicScreenContainer: {
            CoverImageContainer: null,
            CoverImages: null,
            SelectedMusicInfoContainer: null,
            SelectMusicScreen_SelectedMusicInfo: null
        }
    }

    static initialize() {
        debug.log(`Initialize...`);
        this.Containers.Main.GamePlayScreen = document.getElementById(`GamePlayScreen`);
        this.Containers.Main.SelectMusicScreen = document.getElementById(`SelectMusicScreen`);

        this.Containers.GamePlayScreenContainer.ComboCount = document.getElementById(`ComboCount`);
        this.Containers.GamePlayScreenContainer.GameScore = document.getElementById(`GameScore`);
        this.Containers.GamePlayScreenContainer.Difficulty = document.getElementById(`Difficulty`);
        this.Containers.GamePlayScreenContainer.GetReadyText = document.getElementById(`getReadyText`);
        this.Containers.GamePlayScreenContainer.keynotesContainerBackground = document.getElementById(`keynotesContainerBackground`);
        this.Containers.GamePlayScreenContainer.pressedkeynotesContainer = document.getElementById(`keynotePressedContainer`);
        this.Containers.GamePlayScreenContainer.keynotesContainerContainer = document.getElementById(`keynotesContainer`);
        this.Containers.GamePlayScreenContainer.keynotesContainers = document.getElementsByClassName(`keynotesContainer`);
        this.Containers.GamePlayScreenContainer.keynoteCheckerContainer = document.getElementById(`keynoteChecker`);
        this.Containers.GamePlayScreenContainer.keynoteCheckers = document.getElementsByClassName(`keynoteChecker`);
        this.Containers.GamePlayScreenContainer.pointDisplayContainer = document.getElementById(`pointDisplay`);

        this.Containers.SelectMusicScreenContainer.CoverImageContainer = document.getElementById(`SelectMusicScreen_CoverImageContainer`);
        this.Containers.SelectMusicScreenContainer.SelectedMusicInfoContainer = document.getElementById(`SelectMusicScreen_SelectedMusicInfo`);
    }


    static get() {
        return this.Containers;
    }
}