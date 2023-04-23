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
        const user = interaction.client.user
        const { currentServer } = require('../config.json')

        if (!interaction.deferred) await interaction.deferReply()

        async function start() {
            console.log(interaction.client.serverProcess)
            if (interaction.client.serverProcess) return await interaction.editReply('Servidor já está aberto ou em processo de abertura!!')

            const serverProcess = createServerProcess(interaction.client)
            serverProcess.stdout.on('data', (data) => consoleConnection(interaction.client, data.toString()))

            interaction.client.serverProcess = serverProcess

            await user.setPresence({ activities: [{ name: `Server startando (${currentServer})` }], status: 'idle' })
        }

        async function stop() {
            if (!interaction.client.serverProcess) return await interaction.reply('Servidor já está fechado')
            const serverProcess = interaction.client.serverProcess

            serverProcess.stdin.write('say SERVIDOR FECHANDO EM 5 SEGUNDOS\n');

            await new Promise(resolve => {
                setTimeout(resolve, 5000) //server slows 5 seconds to stop
            })

            serverProcess.stdin.write('save-all\n');
            serverProcess.stdin.write('stop\n');

            interaction.client.serverProcess = null
            serverProcess.kill()
            await user.setPresence({ activities: [{ name: `Server off (${currentServer})` }], status: 'dnd' })
        }

        if (action === 'start') await start()
        else if (action === 'stop') await stop()
        else if (action === 'restart') {
            await stop()
            await start()
        }

        if (interaction.replied) return
        const gerund = action + 'ando'
        await interaction.editReply(`servidor ${gerund}`)
    }
}