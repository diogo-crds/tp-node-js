// user.js

const { default: axios } = require("axios")

async function getUser(email) {
    const url = "https://tpnodejs-415b.restdb.io/rest/node-tp-note-users"
    const config = {
        params : {
            q: {user_email : email}
        },
        headers: {
            'x-apikey': '3eb744d9147da0409a3c62912757a7fd56816'
        }
    }
    const response = await axios.get(url, config)
    return(response)
}

async function addUser(email, password) {
    const data = {
        user_email: email,
        user_pass: password
    }
    const url = 'https://tpnodejs-415b.restdb.io/rest/node-tp-note-users'
    const config = {
        headers: {
            'x-apikey': '3eb744d9147da0409a3c62912757a7fd56816'
        }
    }
    const response = await axios.post(url, data, config)
    return(response)
}

async function checkIfUserExist(email, password) {
    if(!email || !password) {
        return ({error: "L'email ou le mot de passe n'est pas renseigné"})
    } 
      
    const user = await (await getUser(email)).data

    return user
}

module.exports = {
    addUser: addUser,
    checkIfUserExist: checkIfUserExist
}