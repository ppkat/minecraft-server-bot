const fs = require('fs')

module.exports = {
    chatAddaption: function (client) {
        const filePath = '/opt/minecraft/survival/console.txt'
        const minecraftChatChannelID = '1050881742262767616'
        const minecraftConsoleChannelID = '1051244371875483748'

        async function serverStartActivities() {
            await client.user.setPresence({ activities: [{ name: 'Server on' }], status: 'online' })
        }

        function turnOnWatch() {

            const watcher = fs.watch(filePath)
            watcher.on('change', async () => {
                const fileText = fs.readFileSync(filePath).toString()
                if (fileText === '') return console.log('nothing inside console.txt')

                const serverConsoleChatIDString = '[minecraft/DedicatedServer]: '
                const fileTextLines = fileText.split('[m>')
                const consoleFileText = fileTextLines.join('')
                const fileTextChatLines = fileTextLines.filter(item => {
                    if (item.includes('Done (') && item.includes(')! For help, type "help"')) {
                        serverStartActivities()
                        return false
                    }
                    return item.includes(serverConsoleChatIDString)
                        && !item.includes('[?2004h>')
                        && !item.includes('Unknown or incomplete command, see below for error')
                        && !item.includes('<--[HERE]')
                        && item.includes('[Server thread/INFO]')
                        && !item.includes('Preparing level "world"')
                }
                )

                const fileTextArr = fileTextChatLines.map(item => {
                    const removedConsoleInfoText = item.replaceAll(' [Server thread/INFO] ' + serverConsoleChatIDString, '')
                    const rightToLeftPureText = removedConsoleInfoText.slice(19) // removing the time and "[K"
                    const pureText = rightToLeftPureText.startsWith(']') ? rightToLeftPureText.slice(1, -2) : rightToLeftPureText.slice(0, -2)// removing the "]^[[m>"
                    const formatedText = pureText.startsWith('[') ? '*' + pureText.replace(']', ']*')
                        : pureText.startsWith('<') ? '**' + pureText.replace('>', '>**')
                            : pureText

                    return formatedText
                })

                const chatFileText = fileTextArr.filter(item => !item.slice(9).startsWith('<')).join('')

                const minecraftChatChannel = await client.channels.fetch(minecraftChatChannelID)
                const minecraftConsoleChannel = await client.channels.fetch(minecraftConsoleChannelID)

                const messageLimit = 2000;
                if (chatFileText) {
                    let textPieces = []
                    for (let i = 0; i < chatFileText.length; i += messageLimit) {
                        textPieces.push(chatFileText.slice(i, i + messageLimit))
                    }

                    textPieces.reverse()
                    textPieces.forEach(async piece => await minecraftChatChannel.send(piece))
                }

                if (consoleFileText) {
                    let textPieces = []
                    for (let i = 0; i < chatFileText.length; i += messageLimit) {
                        textPieces.push(consoleFileText.slice(i, i + messageLimit))
                    }

                    textPieces.reverse()
                    textPieces.forEach(async piece => await minecraftConsoleChannel.send(piece))
                }

                turnOffWatch()
            })

            function turnOffWatch() {
                watcher.close()
                fs.writeFileSync(filePath, '')
                turnOnWatch()
            }
        }
        turnOnWatch()
    }
} 