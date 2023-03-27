module.exports = {
    chatAdaption: async function (client, stdout) {
        const minecraftChatChannelID = '1050881742262767616'
        const minecraftConsoleChannelID = '1051244371875483748'

        async function serverStartActivities() {
            await client.user.setPresence({ activities: [{ name: 'Server on' }], status: 'online' })
        }

        const serverConsoleChatIDString = '[minecraft/DedicatedServer]: '

        if (stdout.includes('Done (') && stdout.includes(')! For help, type "help"')) {
            serverStartActivities()
        }

        const isChatText = (
            stdout.includes(serverConsoleChatIDString)
            && !stdout.includes('[?2004h>')
            && !stdout.includes('Unknown or incomplete command, see below for error')
            && !stdout.includes('<--[HERE]')
            && stdout.includes('[Server thread/INFO]')
            && !stdout.includes('Preparing level "world"')
        ) ? true : false

        const minecraftChatChannel = await client.channels.fetch(minecraftChatChannelID)
        const minecraftConsoleChannel = await client.channels.fetch(minecraftConsoleChannelID)

        async function sendChatChannelMessages() {
            if (!isChatText) return
            const removedConsoleInfoText = stdout.replaceAll(' [Server thread/INFO] ' + serverConsoleChatIDString, '')
            const pureText = removedConsoleInfoText.slice(10) // removing the time
            const formattedText = pureText.startsWith('[') ? '*' + pureText.replace(']', ']*')
                : pureText.startsWith('<') ? '**' + pureText.replace('>', '>**')
                    : pureText

            const alreadySendedInDiscordChannel = pureText.startsWith('[Server] <')
            if (alreadySendedInDiscordChannel) return

            await minecraftChatChannel.send(formattedText)
        }

        async function sendConsoleChannelMessages() {
            if (!stdout || stdout === '\n') return

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

        sendChatChannelMessages()
        sendConsoleChannelMessages()
    }
} 