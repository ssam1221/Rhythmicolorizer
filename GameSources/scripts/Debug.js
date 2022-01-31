export default class Debug {

    constructor({
        filename
    }) {
        this.filename = filename;
    }

    getFormattedDate() {
        const now = new Date();
        return `[${now.getFullYear()}/${(`00` + (now.getMonth()+1)).substr(-2)}/${(`00` + now.getDate()).substr(-2)} ` +
            `${(`00` + (now.getHours()+1)).substr(-2)}:${(`00` + (now.getMinutes()+1)).substr(-2)}:${(`00` + (now.getSeconds()+1)).substr(-2)}]`;
    }

    log(...str) {
        const _filename = `                         ${this.filename}`.substr(-20);
        console.log(`${this.getFormattedDate()}[${_filename}] `, ...str)
    }
}