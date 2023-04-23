module.exports = {
    name: 'interactionCreate',
    once: false,
    listen: async (client, interaction) => {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName)
            try {
                await command.execute(interaction)
            }
            catch (err) {
                console.log(err)
            }
        }
    }
}