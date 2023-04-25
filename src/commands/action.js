const { SlashCommandBuilder } = require("discord.js");
const { createServerProcess } = require('../lib/childProcess');
const { consoleConnection } = require("../lib/consoleConnection");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ação')
        .setDescription('Liga/Desliga/Renicia o server selecionado atual')
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

        if (!interaction.deferred) await interaction.deferReply()

        if (action === 'start') await start()
        else if (action === 'stop') await stop()
        else if (action === 'restart') {
            await this.stop()
            await start()
        }

        if (interaction.replied) return
        const gerund = action + 'ando'
        await interaction.editReply(`servidor ${gerund}`)
    }
}