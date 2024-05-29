const { maxDailyPlayerTime } = require('../../../config.json');

module.exports = async (client, playersOnline) => {
    // client.players.forEach(player => {
    //     if (!player.time) player.time = maxDailyPlayerTime; // Inicializa o tempo do jogador se ainda não estiver definido

    //     const intervalID = setInterval(() => {
    //         if (player.time <= 0) {
    //             clearInterval(intervalID); // Clareia o intervalo assim que o tempo do jogador acaba

    //             const serverProcess = client.serverProcess;
    //             if (playersOnline.length < 2) {
    //                 serverProcess.stdin.write(`kick ${player.name} Seu tempo no servidor se esgotou por hoje! Espere alguém logar para que você possa entrar novamente\n`);
    //             }
    //         } else {
    //             player.time -= 1000 * 60; // Subtrai um minuto do tempo do jogador
    //         }
    //     }, 1000 * 60);
    // });
};
