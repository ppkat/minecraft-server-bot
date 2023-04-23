const { exec } = require('child_process')

module.exports = {
    execute: (i, backupsPath) => {
        const backupToRestore = i.options.getString('data')
        const unzipCommand = `unzip -o ${backupToRestore}`
        const restoreWorldUnzipped = `cp -r world ../`

        i.editReply('backup em processo de restauração...')
        exec(`${unzipCommand} && ${restoreWorldUnzipped}`, { cwd: backupsPath }, (err, stdout, stderr) => {
            if (err) return i.editReply(`houve um erro ao executar o comando no linux: ${err}`)
            i.editReply(`backup **${backupToRestore}** restaurado com sucesso`)
            console.log(stdout)
            console.error(stderr)
        })

    }
}