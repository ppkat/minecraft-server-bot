const { SlashCommandBuilder } = require("discord.js");
const startServer = require("../lib/serverActions/startServer");
const stopServer = require("../lib/serverActions/stopServer");

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

        if (action === 'start') {
            if (interaction.client.serverProcess) return await interaction.editReply('Servidor já está aberto ou em processo de abertura!!')
            await startServer()
        }
        else if (action === 'stop') {
            if (!interaction.client.serverProcess) return await interaction.reply('Servidor já está fechado')
            await stopServer()
        }
        else if (action === 'restart') {
            if (!interaction.client.serverProcess) return await startServer()
            await this.stopServer()
            await startServer()
        }

        if (interaction.replied) return
        const gerund = action + 'ando'
        await interaction.editReply(`servidor ${gerund}`)
    }
}