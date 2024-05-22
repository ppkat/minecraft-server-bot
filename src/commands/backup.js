const { SlashCommandBuilder } = require("discord.js");
const getBackupChoices = require('../lib/commandsHelpers/getBackupChoices')
const path = require("path")
const { baseDirectory } = require('../config.json')

const backupsChoices = getBackupChoices()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('backup')
        .setDescription('Controla os backups do server')
        .addSubcommand(subcommand =>
            subcommand
                .setName('restaurar')
                .setDescription('Restaura algum backup desejado para o servidor de minecraft')
                .addStringOption(option =>
                    option.setName('data')
                        .setDescription('Escolha o backup a ser restaurado')
                        .addChoices(...backupsChoices)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('adicionar')
                .setDescription('Cria um backup de acordo com o estado do mundo atual')
        ),

    async execute(interaction) {
        await interaction.deferReply()

        const { currentServer } = require('../config.json')
        const updatedBackupsPath = path.join(baseDirectory, currentServer, 'backups')

        //subCommands handling
        const subcommandName = interaction.options.getSubcommand()
        const subcommandFile = require(`${__dirname}/backup/${subcommandName}.js`)
        await subcommandFile.execute(interaction, updatedBackupsPath)
    }
}