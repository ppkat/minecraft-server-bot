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

        // sshroot.execCommand(`sudo systemctl ${action} minecraft@survival`)

        exec(`sudo systemctl ${action} minecraft@survival`)

        const gerund = action + 'ando'
        await interaction.reply(`servidor ${gerund}`)
    }
}