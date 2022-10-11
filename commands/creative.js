//import { CommandInteraction } from "discord.js";

const { SlashCommandBuilder } = require("discord.js")
const { sshminecraft } = require('../sshConnection')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gamemode')
        .setDescription('atualiza o modo de jogo de um jogador')
        .addStringOption(option => 
            option
                .setName('player')
                .setDescription('O jogador que terá o modo de jogo atualizado')
                .setRequired(true)
            )
        .addStringOption(option =>
            option
                .setName('modo')
                .setDescription('O modo de jogo a ser atribuido ao jogador')
                .setRequired(true)
                .setChoices(
                    {name: 'criativo', value: 'creative'}, 
                    {name: 'sobrevivência', value: 'survival'}, 
                    {name: 'aventura', value: 'adventure'} 
                )
            ),

            async execute(interaction){                
                const options = interaction.options
                const playerName = options.getString('player')
                const gamemode = options.getString('modo')

                sshminecraft.execCommand(`screen -S mc-survival -X stuff 'gamemode ${gamemode} ${playerName}\\n'`)

                interaction.reply(`Modo de jogo de ${playerName} atualizado para ${gamemode}`)
            }
}