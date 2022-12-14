const fs = require('fs')
const { exec } = require('child_process')

module.exports = {
    chatAddaption: function (client) {
        const filePath = '/opt/minecraft/survival/console.txt'
        const minecraftChatChannelID = '1050881742262767616'
        const minecraftConsoleChannelID = '1051244371875483748'

        fs.watchFile(filePath, async (curr, prev) => {
            const fileText = fs.readFile(filePath).then(data => {
                exec(`rm ${filePath}`)
                return data.toString()
            })

            const serverConsoleChatIDString = '[minecraft/DedicatedServer]: '
            const fileTextLines = fileText.split('[m>')
            const fileTextChatLines = fileTextLines.filter(item => item.includes(serverConsoleChatIDString) && !item.includes('Unknown or incomplete command, see below for error'))

            const fileTextArr = fileTextChatLines.map(item => {
                const removedConsoleInfoText = item.replaceAll(' [Server thread/INFO] ' + serverConsoleChatIDString, '')
                const rightToLeftPureText = removedConsoleInfoText.slice(20) // removing the time and "[K"
                const pureText = rightToLeftPureText.slice(0, -2) // removing the "^[[m>"
                const formatedText = pureText.startsWith('[') ? '*' + pureText + '*'
                    : pureText.startsWith('<') ? '**' + pureText.replace('>', '>**')
                        : pureText

                return formatedText
            })

            const filteredFileText = fileTextArr.join('')

            const minecraftChatChannel = await client.channels.fetch(minecraftChatChannelID)
            const minecraftConsoleChannel = await client.channels.fetch(minecraftConsoleChannelID)

            if (filteredFileText) {
                if (filteredFileText.length > 2000) await minecraftChatChannel.send(filteredFileText.slice(0, 2000))
                else await minecraftChatChannel.send(filteredFileText)
            }

            if (fileText) {
                if (fileText.length > 2000) await minecraftConsoleChannel.send(fileText.slice(0, 2000))
                else await minecraftConsoleChannel.send(fileText)
            }
        })
    }
} 