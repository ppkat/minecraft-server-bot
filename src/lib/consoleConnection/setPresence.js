module.exports = async function setPresence(client, stdout) {
    if (stdout.includes('Done (') && stdout.includes(')! For help, type "help"')) {
        const { currentServer } = require('../../config.json')
        await client.user.setPresence({ activities: [{ name: `Server on!! 0 players online (${currentServer})` }], status: 'online' })
    }

}