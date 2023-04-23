const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = async function reloadCommands(c, stdout) {
    if (!stdout.includes('Server Backup started!')) return

    const backupCommand = require('../../commands/backup.js')

    const rest = new REST({ version: '9' }).setToken('seu_token_aqui');

    const guildId = process.env.PPJEG_ID;
    const applicationId = process.env.CLIENT_ID;
    const commandId = '1099400632919666698';

    // Reloading backup command on API
    rest.put(
        Routes.applicationGuildCommand(applicationId, guildId, commandId),
        backupCommand.data.toJSON()
    )
        .then(() => console.log(`Comando de Backup atualizado com sucesso!`))
        .catch(console.error);
}