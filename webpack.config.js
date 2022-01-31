const path = require("path");

module.exports = {
    mode: "production",
    entry: {
        main: "./GameSources/scripts/MainPlayer.js",
        
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, `./GameSources/scripts`),
    },
}