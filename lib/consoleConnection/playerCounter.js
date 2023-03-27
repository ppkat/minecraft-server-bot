module.exports = async function playerCouter(client, stdout) {
    if (!stdout.endsWith('joined the game')) return

    client.serverProcess.stdin.write('list\n')

    function responseListener(data) {
        const response = data.toString()
        if (response.startsWith('There are ')) {
            serverProcess.stdout.removeListener('data', responseListener);
            const [playersOnline, totalPlayers] = response.match(/There are (\d+) of a max (\d+) players online:/)[1];

            await client.user.setPresence({ activities: [{ name: `Server on!! ${playersOnline}/${totalPlayers} online` }], status: 'online' })
        }
    }

    serverProcess.stdout.on('data', responseListener)
}