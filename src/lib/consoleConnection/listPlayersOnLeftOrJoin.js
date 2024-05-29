const autoServerStop = require('./listPlayersRelatedFunctions/autoServerStop');
const playerRegistering = require('./listPlayersRelatedFunctions/playerRegistering');

module.exports = (client, stdout) => {
    if (stdout.includes('joined the game') || stdout.includes('left the game')) {
        client.serverProcess.stdin.write('list\n');
        return;
    }
    if (!stdout.includes('There are ')) return;

    try {
        autoServerStop(client, stdout);
        playerRegistering(client, stdout);
    }
    catch (err) {
        console.log(err);
    }
};
