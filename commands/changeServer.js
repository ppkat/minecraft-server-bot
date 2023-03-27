const { SlashCommandBuilder } = require("discord.js");
const { readFileSync, writeFileSync } = require('fs')

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
                    { name: 'Era do Futurismo', value: 'eradofuturismo' }
                )
        ),

    async execute(interaction) {
        const options = interaction.options
        const newCurrentServer = options.getString('servidor')
        await interaction.deferReply()

        const config = await JSON.parse(readFileSync('./config.json'))
        config.currentServer = newCurrentServer
        const newConfig = JSON.stringify(config)
        writeFileSync('./config.json', newConfig)

        await interaction.editReply(`Servidor atual mudado para ${newCurrentServer}`)
    }
}