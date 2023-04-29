const { createServerProcess } = require('../lib/childProcess');
const { consoleConnection } = require("../lib/consoleConnection");

module.exports = (interaction) => {
    const user = interaction.client.user
    const { currentServer } = require('../config.json')

    const serverProcess = createServerProcess(interaction.client)
    serverProcess.stdout.on('data', (data) => consoleConnection(interaction.client, data.toString()))

    interaction.client.serverProcess = serverProcess

    await user.setPresence({ activities: [{ name: `Server startando (${currentServer})` }], status: 'idle' })
}