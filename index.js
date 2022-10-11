const { Client } = require('discord.js')
const { readdirSync } = require('fs')
require('./sshConnection.js')
require('dotenv').config()

//discord client instance
const client = new Client( {intents: [32767] })

//event handling
const eventFiles = readdirSync('./events').filter(file => file.endsWith('.js'))

for(let file of eventFiles){
    const event = require(`./events/${file}`)
    if(event.once){
        client.once(event.name, (...args) => event.listen(client, ...args))
    } else {
        client.on(event.name, (...args) => event.listen(client, ...args))
    }
}

//start log
client.once('ready', c => {
    console.log(`Bot on diretamente do ${c.user.id}`)
})

client.login(process.env.BOT_TOKEN)