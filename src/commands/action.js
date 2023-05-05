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

        const client = interaction.client
        if (action === 'start') {
            if (client.serverProcess) return await interaction.editReply('Servidor já está aberto ou em processo de abertura!!')
            await startServer(client)
        }
        else if (action === 'stop') {
            if (!client.serverProcess) return await interaction.editReply('Servidor já está fechado')
            await stopServer(client)
        }
        else if (action === 'restart') {
            if (!client.serverProcess) return await startServer(client)
            await this.stopServer(client)
            await startServer(client)
        }

        if (interaction.replied) return
        const gerund = action + 'ando'
        await interaction.editReply(`servidor ${gerund}`)
    }
}