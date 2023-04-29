const fs = require('fs')
const path = require('path')

module.exports = (client, stdout) => {
    if (stdout.includes('joined the game') || stdout.includes('left the game')) return client.serverProcess.stdin.write('list\n') //first loop
    if (!stdout.includes('There are ')) return //second loop

    const lisPlayersRelatedFunctionsDir = path.join(__dirname, 'listPlayersRelatedFunctions')
    const lisPlayersRelatedFunctions = fs.readdirSync(lisPlayersRelatedFunctionsDir)

    lisPlayersRelatedFunctions.forEach(item => {
        const listPlayerRelatedFunction = require(item)
        listPlayerRelatedFunction(client, stdout)
    })
}