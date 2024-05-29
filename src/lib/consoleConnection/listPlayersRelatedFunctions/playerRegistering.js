const playerTimer = require('./playerTimer');
const { writeFileSync, readFileSync } = require('fs');
const path = require('path'); // Usar o módulo 'path' para manipulação de caminhos de arquivos
const { baseDirectory } = require('../../../config.json');

module.exports = async (client, stdout) => {
    const { currentServer } = require('../../../config.json');
    const playersOnlineHook = stdout.match(/players online: (.+)/);
    if (!playersOnlineHook) {
        console.error("Error parsing players online data");
        return;
    }

    const playersOnline = playersOnlineHook[1].replaceAll(' ', '').split(',');

    const configPath = path.join(__dirname, '../../../config.json');
    const configFile = JSON.parse(readFileSync(configPath, 'utf-8'));

    if (!client.players) client.players = configFile.players;

    playersOnline.forEach(player => {
        if (!client.players.some(pl => pl.name === player)) {
            client.players.push({ name: player });
        }
    });

    configFile.players = client.players;
    writeFileSync(configPath, JSON.stringify(configFile, null, 4));

    const playersOnlineCount = playersOnline.length;
    await client.user.setPresence({ activities: [{ name: `Server on!! ${playersOnlineCount} players online (${currentServer})` }], status: 'online' });

    playerTimer(client, playersOnline); // Chamar o timer com a lista de players online
};
