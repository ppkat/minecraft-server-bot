const stopServer = require("../../serverActions/stopServer");

module.exports = async (client, stdout) => {
    try {
        console.log(stdout); // Adicionando para entender o que realmente está vindo no stdout
        const match = stdout.match(/There are (\d+) of a max (\d+) players online:/);
        if (!match) {
            console.error("No players information found in stdout.");
            return; // Sai da função se não encontrar correspondência
        }

        const playersOnline = match[1];
        console.log(playersOnline);

        if (playersOnline === '0') {
            const timeToClose = 1 * 60 * 1000;
            client.timeoutToStop = setTimeout(() => stopServer(client), timeToClose);
        } else {
            clearTimeout(client.timeoutToStop);
        }
    } catch (err) {
        console.log(err);
    }
};
