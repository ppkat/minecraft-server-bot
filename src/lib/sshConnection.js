const { NodeSSH } = require('node-ssh')
require('dotenv').config({
    path: __dirname + '/.env'
})

const sshminecraft = new NodeSSH()
const sshroot = new NodeSSH()

async function connectSshMinecraft(){

    const connectedSshminecraft = await sshminecraft.connect({
        host: process.env.SSH_HOST,
        username: 'minecraft',
        password: process.env.SSH_PASSWORD
    })
    console.log('connected to minecraft user on ssh')

    return connectedSshminecraft
}

async function connectSshRoot(){
    const connectedSshroot = await sshroot.connect({
        host: process.env.SSH_HOST,
        username: 'root',
        password: process.env.SSH_PASSWORD
    })
    console.log('connected to root user on ssh')

    return connectedSshroot
}

const connectedSshminecraft = Promise()

    module.exports = {
        connectSshMinecraft,
        connectSshRoot
    }
