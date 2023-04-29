module.exports = async (client, stdout) => {
    const [playersOnline, totalPlayers] = stdout.match(/There are (\d+) of a max (\d+) players online:/)[1];

    await client.user.setPresence({ activities: [{ name: `Server on!! ${playersOnline}/${totalPlayers} online` }], status: 'online' })
}