const stopServer = require("../../serverActions/stopServer")

let timeoutId;

module.exports = (client, stdout) => {
    const playersOnline = stdout.match(/There are (\d+) of a max (\d+) players online:/)[1];

    if (playersOnline == '0') {
        const timeToClose = 1 * 60 * 1000
        timeoutId = setTimeout(() => stopServer(client), timeToClose)
    } else {
        clearTimeout(timeoutId)
    }
}