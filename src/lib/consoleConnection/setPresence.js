module.exports = async function setPresence(client, stdout) {
    if (stdout.includes('Done (') && stdout.includes(')! For help, type "help"')) {
        await client.user.setPresence({ activities: [{ name: 'Server on' }], status: 'online' })
    }

}