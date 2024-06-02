const { maxDailyPlayerTime } = require('../config.json');
const path = require('node:path');
const { readFileSync, writeFileSync } = require('node:fs');

// Função para resetar o tempo dos jogadores
function resetPlayerTime(client) {
    client.players.forEach(player => {
        player.time = maxDailyPlayerTime;
    });

    const configPath = path.join(__dirname, '../config.json');
    const configFile = readFileSync(configPath);
    const config = JSON.parse(configFile);

    config.players = client.players;
    writeFileSync(configPath, JSON.stringify(config, null, 4));
}

// Função para calcular o tempo até meia-noite em milliseconds
function millisUntilMidnight() {
    const now = new Date();
    const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0, 0
    );
    return midnight.getTime() - now.getTime();
}

// Configuração do agendador para resetar à meia-noite
function scheduleDailyReset(client) {
    const timeUntilMidnight = millisUntilMidnight();
    setTimeout(() => {
        resetPlayerTime(client);

        // Agendar para o próximo dia
        setInterval(() => resetPlayerTime(client), 24 * 60 * 60 * 1000);

    }, timeUntilMidnight);
}

module.exports = scheduleDailyReset
