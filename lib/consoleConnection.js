const playerCounter = require('./consoleConnection/playerCounter')
const sendChatChannelMessages = require('./consoleConnection/sendChatMessages')
const sendConsoleChannelMessages = require('./consoleConnection/sendConsoleChannelMessages')
const setPresence = require('./consoleConnection/setPresence')

module.exports = {
    consoleConnection: async function (client, stdout) {
        setPresence(client, stdout)
        playerCounter(client, stdout)
        sendChatChannelMessages(stdout)
        sendConsoleChannelMessages(client, stdout)
    }
} 