module.exports = async function sendChatChannelMessages(client, stdout) {
    const minecraftChatChannelID = '1050881742262767616'
    const minecraftChatChannel = await client.channels.fetch(minecraftChatChannelID)

    const serverConsoleChatIDString = '[minecraft/DedicatedServer]: '

    const isChatText = (
        stdout.includes(serverConsoleChatIDString)
        && !stdout.includes('[?2004h>')
        && !stdout.includes('Unknown or incomplete command, see below for error')
        && !stdout.includes('<--[HERE]')
        && stdout.includes('[Server thread/INFO]')
        && !stdout.includes('Preparing level "world"')
        && !stdout.includes('Starting Minecraft server on *:25565')
        && !(stdout.includes('There are') && stdout.includes('players online:'))
    ) ? true : false

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