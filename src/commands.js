const fs = require('fs')
const { Collection } = require('discord.js')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
require('dotenv').config()

module.exports = {
    registerCommands: async function (client) {
        //command handling
        client.commands = new Collection()
        const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter(file => file.endsWith('.js'))

        const commands = []

        for (file of commandFiles) {
            const command = require(`${__dirname}/commands/${file}`)
            client.commands.set(command.data.name, command)
            commands.push(command.data.toJSON())
        }

        const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN)

        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.PPJEG_ID), { body: commands })
            .then(() => console.log('commands set'))
            .catch(err => console.log(err))
    }
}