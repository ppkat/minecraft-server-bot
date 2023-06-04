const { spawn } = require('child_process')
const { readFileSync, readdirSync } = require('fs')
const path = require('path')

module.exports = {
    createServerProcess: function (client) {

        const configPath = path.join(__dirname, '..', 'config.json')
        const config = JSON.parse(readFileSync(configPath))
        const { currentServer } = config
        const directory = `/opt/minecraft/survival/${currentServer}`

        //verify if minecraft version is above 1.16, because the server structure is different and java version too
        function isMinecraftVersionAbove116() {
            const fileNames = readdirSync(directory)

            return fileNames.some(item => item.endsWith('.json'))
        }

        const jdk17Path = {
            JAVA_FANGIRL: '/opt/minecraft/survival/fangirl/jdk-17.0.7',
            PATH: process.env.PATH
        };

        const env = isMinecraftVersionAbove116() ? jdk17Path : process.env
        const serverProcess = spawn('bash', ['start.sh'], { cwd: directory, env })

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