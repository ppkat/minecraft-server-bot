const { maxDailyPlayerTime } = require('../../../config.json');
const path = require('node:path');

function updatePlayerStatus(client, playersOnline) {
    client.players.forEach(player => {
        if (!player.time) player.time = maxDailyPlayerTime;

        player.status = playersOnline.some(pl => pl.name === player.name) ? 'online' : 'offline';

        if (player.status === 'offline') {
            if (player.intervalID) clearInterval(player.intervalID);
        } else {
            if (!player.intervalID) {
                player.intervalID = setInterval(() => managePlayerTime(client, player), 1000 * 60);
            }
        }
    });
}

function managePlayerTime(client, player) {
    const playersOnline = client.players.filter(pl => pl.status === 'online');

    if (player.time <= 0) {
        clearInterval(player.intervalID);
        player.intervalID = null;

        const serverProcess = client.serverProcess;
        if (playersOnline.length < 2) {
            serverProcess.stdin.write(`kick ${player.name} Seu tempo no servidor se esgotou por hoje! Espere alguém logar para que você possa entrar novamente\n`);
        }
    } else {
        if (playersOnline.length < 2) {
            player.time -= 1000 * 60;
        }
    }
}

module.exports = updatePlayerStatus