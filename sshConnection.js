const { NodeSSH } = require('node-ssh')
require('dotenv').config()

const sshminecraft = new NodeSSH()
const sshroot = new NodeSSH()

sshminecraft.connect({
    host: process.env.SSH_HOST,
    username: 'minecraft',
    password: process.env.SSH_PASSWORD
}).then(() => {
    exporting()
})

// sshroot.connect({
//     host: process.env.SSH_HOST,
//     username: 'root',
//     password: process.env.SSH_PASSWORD
// }).then(() => {
//     exporting()
// })

function exporting(){
    module.exports = {
        sshminecraft,
        sshroot
    }
}
