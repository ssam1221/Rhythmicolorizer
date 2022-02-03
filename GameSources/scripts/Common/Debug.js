let debugMode = `debug`;

export default class Debug {

    constructor({
        filename
    }) {
        this.filename = filename;
    }

    static setDebugMode(_debugMode) {
        console.log(`Set debug mode to : ${_debugMode}`)
        debugMode = _debugMode;
    }

    getFormattedDate() {
        const now = new Date();
        return `[${now.getFullYear()}/${(`00` + (now.getMonth()+1)).substr(-2)}/${(`00` + now.getDate()).substr(-2)} ` +
            `${(`00` + (now.getHours()+1)).substr(-2)}:${(`00` + (now.getMinutes()+1)).substr(-2)}:${(`00` + (now.getSeconds()+1)).substr(-2)}]`;
    }

    info(...str) {
        const _filename = `                         ${this.filename}`.substr(-20);
        console.info(`[ INFO]${this.getFormattedDate()}[${_filename}] `, ...str)
    }

    warn(...str) {
        const _filename = `                         ${this.filename}`.substr(-20);
        console.warn(`[ WARN]${this.getFormattedDate()}[${_filename}] `, ...str)
    }

    error(...str) {
        const _filename = `                         ${this.filename}`.substr(-20);
        console.error(`[ERROR]${this.getFormattedDate()}[${_filename}] `, ...str)
    }

    log(...str) {
        const _filename = `                         ${this.filename}`.substr(-20);
        console.log(`[  LOG]${this.getFormattedDate()}[${_filename}] `, ...str)
    }
}