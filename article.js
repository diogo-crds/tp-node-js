// article.js

const { default: axios } = require("axios")


async function getArticleById(id) {
    const url = 'https://tpnodejs-415b.restdb.io/rest/node-tp-note-articles'
    const config = {
        params: {
            q: { _id: id }
        },
        headers: {
            'x-apikey': '3eb744d9147da0409a3c62912757a7fd56816'
        }
    }
    const response = await axios.get(url, config)
    return(response)
}

async function getArticles() {
    const url = 'https://tpnodejs-415b.restdb.io/rest/node-tp-note-articles'
    const config = {
        headers: {
            'x-apikey': '3eb744d9147da0409a3c62912757a7fd56816'
        }
    }
    const response = await axios.get(url, config)
    return(response)
}

async function addArticles(name) {
    const data = {
        article_name: name
    }
    const url = 'https://tpnodejs-415b.restdb.io/rest/node-tp-note-articles'
    const config = {
        headers: {
            'x-apikey': '3eb744d9147da0409a3c62912757a7fd56816'
        }
    }
    const response = await axios.post(url, data, config)
    return(response)
}

async function updateArticles(id, name) {
    const data = {
        article_name: name
    }
    const url = `https://tpnodejs-415b.restdb.io/rest/node-tp-note-articles/${id}`
    const config = {
        headers: {
            'x-apikey': '3eb744d9147da0409a3c62912757a7fd56816'
        }
    }
    const response = await axios.put(url, data, config)
    return(response)
}

async function deleteArticles(id) {
    const url = `https://tpnodejs-415b.restdb.io/rest/node-tp-note-articles/${id}`
    const config = {
        headers: {
            'x-apikey': '3eb744d9147da0409a3c62912757a7fd56816'
        }
    }
    const response = await axios.delete(url, config)
    return(response)
}

module.exports = {
    getArticleById: getArticleById,
    getArticles: getArticles,
    addArticles: addArticles,
    updateArticles: updateArticles,
    deleteArticles: deleteArticles
}