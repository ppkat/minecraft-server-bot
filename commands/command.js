const { SlashCommandBuilder } = require("discord.js");
const { exec } = require('child_process')
//const { sshminecraft } = require('../sshConnection')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('comando')
        .setDescription('DEPRECATED.'.split('').map(char => char + '\u0336').join('') + ` Use o canal #server-console em vez disso`)
        .addStringOption(option =>
            option
                .setName('comando')
                .setDescription('o comando a ser executado no server, sem "/"')
                .setRequired(true)
        ),

    async execute(interaction) {
        const options = interaction.options
        const command = options.getString('comando')

        //sshminecraft.execCommand(`screen -S mc-survival -X stuff '${command}\\n'`)

        exec(`runuser -l  mc-survival -c "screen -S mc-survival -X stuff '${command}\\n'"`)

        interaction.reply('Comando executado')
    }
}