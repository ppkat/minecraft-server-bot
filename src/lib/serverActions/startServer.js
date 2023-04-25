module.exports = (interaction) => {
    if (interaction.client.serverProcess) return await interaction.editReply('Servidor já está aberto ou em processo de abertura!!')

    const user = interaction.client.user
    const { currentServer } = require('../config.json')

    const serverProcess = createServerProcess(interaction.client)
    serverProcess.stdout.on('data', (data) => consoleConnection(interaction.client, data.toString()))

    interaction.client.serverProcess = serverProcess

    await user.setPresence({ activities: [{ name: `Server startando (${currentServer})` }], status: 'idle' })
}