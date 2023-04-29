module.exports = async (client, stdout) => {
    const playersOnline = stdout.match(/There are (\d+) of a max (\d+) players online:/)[1];
    const { currentServer } = require('../../../config.json')

    await client.user.setPresence({ activities: [{ name: `Server on!! ${playersOnline} online (${currentServer})` }], status: 'online' })
}