const fs = require('fs')
const path = require('path')

module.exports = (client, stdout) => {
    if (stdout.includes('joined the game') || stdout.includes('left the game')) return client.serverProcess.stdin.write('list\n') //first loop
    if (!stdout.includes('There are ')) return //second loop

    const listPlayersRelatedFunctionsDir = path.join(__dirname, 'listPlayersRelatedFunctions')
    const listPlayersRelatedFunctions = fs.readdirSync(listPlayersRelatedFunctionsDir)

    console.log('arquivos', listPlayersRelatedFunctions)

    listPlayersRelatedFunctions.forEach(item => {
        const listPlayerRelatedFunction = require(`${listPlayersRelatedFunctionsDir}/${item}`)
        listPlayerRelatedFunction(client, stdout)
    })
}