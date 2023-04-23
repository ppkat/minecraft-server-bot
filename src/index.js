const { Client } = require('discord.js')
const { readdirSync } = require('fs')
const config = require(`./config.json`)
const { registerCommands } = require('./commands')

if (config.ssh) require('./lib/sshConnection.js')

require('dotenv').config({
    path: __dirname + '/../.env'
})

//discord client instance
const client = new Client({ intents: [131071] })

//event handling
const eventFiles = readdirSync(`${__dirname}/events`).filter(file => file.endsWith('.js'))

for (let file of eventFiles) {
    const event = require(`${__dirname}/events/${file}`)
    if (event.once) {
        client.once(event.name, (...args) => event.listen(client, ...args))
    } else {
        client.on(event.name, (...args) => event.listen(client, ...args))
    }
}

//start log
client.once('ready', async c => {
    await client.user.setPresence({ activities: [{ name: `Server off (${config.currentServer})` }], status: 'dnd' })
    console.log(`Bot on diretamente do ${c.user.id}`)

    await registerCommands(c)
})

client.login(process.env.BOT_TOKEN)