const stopServer = require("../../serverActions/stopServer")

module.exports = (client, stdout) => {
    const [playersOnline] = stdout.match(/There are (\d+) of a max (\d+) players online:/)[1];

    if (playersOnline == '0') {
        const timeToClose = 1 * 60 * 1000
        const timeoutId = setTimeout(() => stopServer(client), timeToClose)
    }

}