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
    }

    static initialize() {
        debug.log(`Initialize...`);
        this.Containers.GameScore = document.getElementById(`GameScore`);
        this.Containers.Difficulty = document.getElementById(`Difficulty`);
        this.Containers.GetReadyText = document.getElementById(`getReadyText`);
        this.Containers.keynotesContainerBackground = document.getElementById(`keynotesContainerBackground`);
        this.Containers.pressedkeynotesContainer = document.getElementById(`keynotePressedContainer`);
        this.Containers.keynotesContainerContainer = document.getElementById(`keynotesContainer`);
        this.Containers.keynotesContainers = document.getElementsByClassName(`keynotesContainer`);
        this.Containers.keynoteCheckerContainer = document.getElementById(`keynoteChecker`);
        this.Containers.keynoteCheckers = document.getElementsByClassName(`keynoteChecker`);
        this.Containers.pointDisplayContainer = document.getElementById(`pointDisplay`);
    }


    static get() {
        return this.Containers;
    }
}