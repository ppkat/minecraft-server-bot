const { exec } = require('child_process')

module.exports = {
    name: 'messageCreate',
    once: false,
    listen: async (client, message) => {
        if (message.author.bot) return

        const consoleChannel = '1051244371875483748'
        const chatChannel = '1050881742262767616'

        if (message.channelId === chatChannel) {
            const text = message.content
            exec(`runuser -l minecraft -c "screen -S mc-survival -X stuff 'say ${text}\\n'"`)
        }

        else if (message.channelId === consoleChannel) {
            const command = message.content
            console.log(command)
            exec(`runuser -l minecraft -c "screen -S mc-survival -X stuff '${command}\\n'"`)
        }
    }
}