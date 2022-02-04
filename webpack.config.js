const path = require("path");

module.exports = {
    mode: "development",
    entry: {
        main: path.resolve(__dirname, `./GameSources/scripts/MainPlayer.js`),
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, `./GameSources/scripts`),
    },
}