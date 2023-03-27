module.exports = async function sendConsoleChannelMessages(client, stdout) {
    if (!stdout || stdout === '\n') return

    const minecraftConsoleChannelID = '1051244371875483748'
    const minecraftConsoleChannel = await client.channels.fetch(minecraftConsoleChannelID)

    const messageLimit = 2000;
    const maxMessagesPerSecond = 4 // api limit: 5 messages per second. Put 4 for safety
    const minTimeBetweenMessages = (1 / maxMessagesPerSecond) * 1000 //1 / 4 seconds

    if (!client.user.lastMessage) {
        const message = await minecraftConsoleChannel.send(stdout)
        message.sendedAt = new Date()
        client.user.lastMessage = message
        client.user.stackedMessages = []
    }

    async function sendMessage(messageContent) {
        const message = await minecraftConsoleChannel.send(messageContent)
        message.sendedAt = new Date()
        client.user.lastMessage = message
        client.user.stackedMessages = []
    }

    if (client.user.lastMessage.sendedAt - new Date() >= minTimeBetweenMessages) {
        client.user.stackedMessages.push(stdout)

        const messageContent = client.user.stackedMessages.join('\n')

        if (messageContent.length > messageLimit) {

            let textPieces = []
            for (let i = 0; i < messageContent.length; i += messageLimit) {
                textPieces.push(messageContent.slice(i, i + messageLimit))
            }

            textPieces.reverse()
            textPieces.forEach(async piece => {
                console.log('Needed split message')
                sendMessage(piece)
                await new Promise(resolve => setTimeout(resolve, minTimeBetweenMessages))
            })
        } else sendMessage(messageContent)
    } else client.user.stackedMessages.push(stdout)
}