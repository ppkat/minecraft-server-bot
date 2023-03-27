const { spawn } = require('child_process')
const config = require('../config.json')

module.exports = {
    createServerProcess: function (client) {

        const { currentServer } = config
        const directory = `/opt/minecraft/survival/${currentServer}`

        const serverProcess = spawn('bash', ['start.sh'], { cwd: directory })
        serverProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

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