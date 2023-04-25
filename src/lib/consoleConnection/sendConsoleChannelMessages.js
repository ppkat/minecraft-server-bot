module.exports = async function sendConsoleChannelMessages(client, stdout) {
    if (!stdout || stdout === '\n') return

    const minecraftConsoleChannelID = '1051244371875483748'
    const minecraftConsoleChannel = await client.channels.fetch(minecraftConsoleChannelID)

    const messageLimit = 2000;
    const maxMessagesPerSecond = 1
    const minTimeBetweenMessages = (1 / maxMessagesPerSecond) * 1000

    async function sendMessage(messageContent) {
        const message = await minecraftConsoleChannel.send(messageContent)
        message.sendedAt = new Date()
        client.user.lastMessage = message
        client.user.stackedMessages = []
    }

    if (!client.user.lastMessage) sendMessage(stdout)

    if (new Date() - client.user.lastMessage.sendedAt >= minTimeBetweenMessages) {
        client.user.stackedMessages.push(stdout)

        const messageContent = client.user.stackedMessages.join('\n')

        if (messageContent.length > messageLimit) {
            console.log('Needed split message')

            let textPieces = []
            for (let i = 0; i < messageContent.length; i += messageLimit) {
                textPieces.push(messageContent.slice(i, i + messageLimit))
            }

            textPieces.forEach(async (piece, i) => {
                if (i === 0) sendMessage(piece)
                else client.user.stackedMessages.push(piece)
            })
        } else sendMessage(messageContent)
    } else client.user.stackedMessages.push(stdout)
}