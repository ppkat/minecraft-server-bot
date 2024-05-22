const { spawn } = require('child_process')
const { readFileSync, readdirSync } = require('fs')
const path = require('path')

module.exports = {
    createServerProcess: function (client) {

        const configPath = path.join(__dirname, '..', 'config.json')
        const config = JSON.parse(readFileSync(configPath))
        const { currentServer, baseDirectory } = config
        const directory = `${baseDirectory}${currentServer}`

        const startFileName = fs.readdirSync(directory).filter(file => file.endsWith('.sh'))
        const serverProcess = spawn('bash', [startFileName], { cwd: directory })

        serverProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        serverProcess.on('close', (code) => {
            client.serverProcess = null
            serverProcess.stdout.destroy()
            serverProcess.stdin.destroy()
            serverProcess.kill()
            console.log(`child process exited with code ${code}`);
        });

        return serverProcess
    }
}