module.exports = async (client) => {
    const { currentServer } = require('../../config.json')
    const serverProcess = interaction.client.serverProcess

    serverProcess.stdin.write('say SERVIDOR FECHANDO EM 5 SEGUNDOS\n');

    await new Promise(resolve => {
        setTimeout(resolve, 5000) //server slows 5 seconds to stop
    })

    serverProcess.stdin.write('save-all\n');
    serverProcess.stdin.write('stop\n');

    interaction.client.serverProcess = null
    serverProcess.kill()
    await user.setPresence({ activities: [{ name: `Server off (${currentServer})` }], status: 'dnd' })
}