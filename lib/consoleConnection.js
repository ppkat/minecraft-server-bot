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

        if (isChatText) {
            const removedConsoleInfoText = stdout.replaceAll(' [Server thread/INFO] ' + serverConsoleChatIDString, '')
            const pureText = removedConsoleInfoText.slice(10) // removing the time and "[K"
            const formattedText = pureText.startsWith('[') ? '*' + pureText.replace(']', ']*')
                : pureText.startsWith('<') ? '**' + pureText.replace('>', '>**')
                    : pureText

            await minecraftChatChannel.send(formattedText)
        }

        // const messageLimit = 2000;
        // if (stdout) {
        //     let textPieces = []
        //     for (let i = 0; i < stdout.length; i += messageLimit) {
        //         textPieces.push(stdout.slice(i, i + messageLimit))
        //     }

        //     textPieces.reverse()
        //     textPieces.forEach(async piece => await minecraftConsoleChannel.send(piece))
        // }
    }
} 