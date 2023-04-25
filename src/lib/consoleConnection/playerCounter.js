module.exports = async function playerCouter(client, stdout) {
    if (stdout.includes('joined the game')) return client.serverProcess.stdin.write('list\n') //first loop
    if (!stdout.startsWith('There are ')) return //second loop

    const [playersOnline, totalPlayers] = stdout.match(/There are (\d+) of a max (\d+) players online:/)[1];

    await client.user.setPresence({ activities: [{ name: `Server on!! ${playersOnline}/${totalPlayers} online` }], status: 'online' })

}