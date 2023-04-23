const playerCounter = require('./consoleConnection/playerCounter')
const reloadCommands = require('./consoleConnection/reloadCommands')
const sendChatChannelMessages = require('./consoleConnection/sendChatMessages')
const sendConsoleChannelMessages = require('./consoleConnection/sendConsoleChannelMessages')
const setPresence = require('./consoleConnection/setPresence')

module.exports = {
    consoleConnection: async function (client, stdout) {
        setPresence(client, stdout)
        playerCounter(client, stdout)
        sendChatChannelMessages(client, stdout)
        sendConsoleChannelMessages(client, stdout)
        reloadCommands(client, stdout)
    }
} 