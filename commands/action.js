const { SlashCommandBuilder } = require("discord.js");
const { exec } = require('child_process')
//const config = require('../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ação')
        .setDescription('Liga/Desliga/Renicia o server')
        .addStringOption(option =>
            option
                .setName('ação')
                .setDescription('A ação a ser executada')
                .addChoices(
                    { name: 'Ligar', value: 'start' },
                    { name: 'Desligar', value: 'stop' },
                    { name: 'Reniciar', value: 'restart' }
                )
        ),

    async execute(interaction) {
        const options = interaction.options
        const action = options.getString('ação')
        await interaction.deferReply()

        // sshroot.execCommand(`sudo systemctl ${action} minecraft@survival`)

        exec(`sudo systemctl ${action} minecraft@survival`)

        const gerund = action + 'ando'
        await interaction.editReply(`servidor ${gerund}`)

        if (action === 'start' || action === 'restart') {
            await interaction.client.user.setPresence({ activities: [{ name: 'Server startando' }], status: 'idle' })
        }

        else if (action === 'stop') {
            await new Promise(resolve => {
                setTimeout(resolve, 5000) //server slows 5 seconds to stop
            })
            await interaction.client.user.setPresence({ activities: [{ name: 'Server off' }], status: 'dnd' })
        }

    }
}