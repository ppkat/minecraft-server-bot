const { SlashCommandBuilder } = require("discord.js");
const { sshminecraft } = require('../sshConnection')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('comando')
        .setDescription('Executa exatamente o comando digitado no server')
        .addStringOption(option =>
            option
                .setName('comando')
                .setDescription('o comando a ser executado no server, sem "/"')
                .setRequired(true)
        ),

    async execute(interaction){
        const options = interaction.options
        const command = options.getString('comando')

        sshminecraft.execCommand(`screen -S mc-survival -X stuff '${command}\\n'`)
        interaction.reply('Comando executado')
    }
}