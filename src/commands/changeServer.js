const { SlashCommandBuilder } = require("discord.js");
const { readFileSync, writeFileSync } = require('fs')
const path = require("path")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mudar_server')
        .setDescription('Muda o servidor atualmente selecionado')
        .addStringOption(option =>
            option
                .setName('servidor')
                .setDescription('o servidor no qual se tornará a seleção atual')
                .addChoices(
                    { name: 'Create Above and Beyond', value: 'create-above-and-beyond' },
                    { name: 'Era do Futurismo', value: 'eradofuturismo' },
                    { name: 'Fangirl', value: 'fangirl' }
                )
        ),

    async execute(interaction) {
        const options = interaction.options
        const newCurrentServer = options.getString('servidor')
        const configPath = path.join(__dirname, '..', 'config.json')
        await interaction.deferReply()

        const config = await JSON.parse(readFileSync(configPath))
        config.currentServer = newCurrentServer
        const newConfig = JSON.stringify(config)
        writeFileSync(configPath, newConfig)

        await interaction.client.user.setPresence({ activities: [{ name: `Server off (${config.currentServer})` }], status: 'dnd' })
        await interaction.editReply(`Servidor atual mudado para ${newCurrentServer}`)
    }
}