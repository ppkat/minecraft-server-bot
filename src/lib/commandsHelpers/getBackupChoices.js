const { readdirSync } = require('fs')
const path = require('path')

module.exports = getBackupChoices = () => {
    const config = require('../../config.json')

    const currentModpack = config.currentServer
    const backupsPath = path.join('/opt/minecraft/survival', currentModpack, 'backups')
    const backupsNames = readdirSync(backupsPath).filter(file => file.endsWith('.zip'))

    const backupsChoices = backupsNames.map(fileName => {
        const [Y, M, D, h, m] = fileName.split('-');

        const date = new Date(Y, M - 1, D, h - 3, m);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}: ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

        return { name: formattedDate, value: fileName }
    })

    return backupsChoices
}