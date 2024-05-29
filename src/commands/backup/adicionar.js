const { exec } = require('node:child_process')

module.exports = {
    async execute(i, backupsPath) {
        const date = new Date()
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const hour = date.getHours().toString().padStart(2, '0')
        const minute = date.getMinutes().toString().padStart(2, '0')

        const formattedDate = `${year}-${month}-${day}-${hour}-${minute}`;
        const createBackupCommand = `7z a ${formattedDate}.zip world/`

        exec(createBackupCommand, { cwd: backupsPath }, (err, stdout, stderr) => {
            if (err) return i.editReply(`houve um erro ao executar o comando no linux: ${err}`)
            i.editReply(`backup **${formattedDate}.zip** adicionado com sucesso`)
            console.log(stdout)
            console.error(stderr)
        })
    }
}