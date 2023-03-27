module.exports = {
    name: 'messageCreate',
    once: false,
    listen: async (client, message) => {
        if (message.author.bot) return

        const serverProcess = client.serverProcess
        if (!serverProcess) return

        const consoleChannel = '1051244371875483748'
        const chatChannel = '1050881742262767616'

        if (message.channelId === chatChannel) {
            const text = message.content
            serverProcess.stdin.write(`say <${message.author.username}> ${text}`)
        }

        else if (message.channelId === consoleChannel) {
            const command = message.content
            serverProcess.stdin.write(command)
        }
    }
}