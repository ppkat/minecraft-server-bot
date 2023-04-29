const { createServerProcess } = require('../childProcess');
const { consoleConnection } = require("../childProcess");

module.exports = async (client) => {
    const user = client.user
    const { currentServer } = require('../config.json')

    const serverProcess = createServerProcess(client)
    serverProcess.stdout.on('data', (data) => consoleConnection(client, data.toString()))

    client.serverProcess = serverProcess

    await user.setPresence({ activities: [{ name: `Server startando (${currentServer})` }], status: 'idle' })
}