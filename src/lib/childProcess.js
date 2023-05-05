const { spawn } = require('child_process')
const { readFileSync } = require('fs')
const path = require('path')

module.exports = {
    createServerProcess: function (client) {

        const configPath = path.join(__dirname, '..', 'config.json')
        const config = JSON.parse(readFileSync(configPath))
        const { currentServer } = config
        const directory = `/opt/minecraft/survival/${currentServer}`

        const serverProcess = spawn('bash', ['start.sh'], { cwd: directory })

        serverProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        serverProcess.on('close', (code) => {
            client.serverProcess = null
            console.log(`child process exited with code ${code}`);
        });

        return serverProcess
    }
}