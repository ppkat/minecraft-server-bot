const { Client } = require('discord.js')
const { readdirSync } = require('fs')
const config = require('./config.json')

if (config.ssh) require('./sshConnection.js')

require('dotenv').config({
    path: __dirname + '/.env'
})

//discord client instance
const client = new Client({ intents: [131071] })

//event handling
const eventFiles = readdirSync('./events').filter(file => file.endsWith('.js'))

for (let file of eventFiles) {
    const event = require(`./events/${file}`)
    if (event.once) {
        client.once(event.name, (...args) => event.listen(client, ...args))
    } else {
        client.on(event.name, (...args) => event.listen(client, ...args))
    }
}

//start log
client.once('ready', c => {
    await user.setPresence({ activities: [{ name: 'Server off' }], status: 'dnd' })
    console.log(`Bot on diretamente do ${c.user.id}`)
})

client.login(process.env.BOT_TOKEN)