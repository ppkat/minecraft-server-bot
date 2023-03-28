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
        console.log('starting command execution')
        const options = interaction.options
        const action = options.getString('ação')
        const user = interaction.client.user
        if (!interaction.deferred) await interaction.deferReply()

        async function start() {
            if (action !== 'start') return //don't ask me. For a really stranger reason, this function is ALWAYS called, although action isn't "start"
            if (interaction.client.serverProcess) return await interaction.editReply('Servidor já está on')

            const serverProcess = createServerProcess(interaction.client)
            serverProcess.stdout.on('data', (data) => consoleConnection(interaction.client, data.toString()))

            interaction.client.serverProcess = serverProcess

            await user.setPresence({ activities: [{ name: 'Server startando' }], status: 'idle' })
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
            await user.setPresence({ activities: [{ name: 'Server off' }], status: 'dnd' })
        }

        if (action === 'start') await start()
        else if (action === 'stop') await stop()
        else if (action === 'restart') await stop(); await start()

        if (interaction.replied) return
        const gerund = action + 'ando'
        await interaction.editReply(`servidor ${gerund}`)
    }
}