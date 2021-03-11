// index.js

const article = require('./article.js')
const user = require('./user.js')
const axios = require('axios')
const cors = require('cors')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const urlEncodedParser = bodyParser.urlencoded({ extended: false })
const PORT = process.env.PORT || 3000

const jwt = require('jsonwebtoken')
const passport = require('passport')
const passportJWT = require('passport-jwt')
const secret = 'thisismysecret'

app.use(cors())

async function confirmUser(email, pass) {
    const users = await user.checkIfUserExist(email, pass)

    const ExtractJwt = passportJWT.ExtractJwt
    const JwtStrategy = passportJWT.Strategy

    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secret
    }

    const jwtStrategy = new JwtStrategy(jwtOptions, function(payload, next) {
        const user = users.find(user => user.user_email === payload.user)
        
        if (user) {
            next(null, user)
          } else {
            next(null, false)
          }
    })

    passport.use(jwtStrategy)
}

// Route pour récupérer un article
app.get('/article/:id', async function(req, res) {
    const id = req.params.id
    const Article = await (await article.getArticleById(id)).data
    res.send(Article)
})

// Route pour réucpérer la liste des articles
app.get('/articles', async function(req, res) {
    const Articles = await (await article.getArticles()).data
    res.json(Articles)
})

// Route pour ajouter un article (personne connecté seulement)
app.post('/addarticle', urlEncodedParser, passport.authenticate('jwt', { session: false }), async function(req, res) {
    // on fait un formulaire pour écrire le nom de l'article:
    // on le récupère dans le body :
    const article_name = (req.body)['article_name']
    const NewArticle = await article.addArticles(article_name)
    res.send('article créer, renvoie sur la route de la liste d\'articles')
})

// Route pour modifier un article (personne connecté seulement et que le créateur)
app.put('/updatearticle/:id', urlEncodedParser, async function(req, res) {
    const id = req.params.id
    // on fait un formulaire pour modifier le nom de l'article:
    // on le récupère dans le body :
    const article_name = (req.body)['article_name']
    const updateArticle = await article.updateArticles(id, article_name)
    res.send('article modifié, revoie liste des articles')
})

// Route pour supprimé un article (personne connecté seulement et que le créateur)
app.delete('/deletearticle/:id', async function(req, res) {
    const id = req.params.id
    const deleteArticle = await article.deleteArticles(id)
    res.send('article supprimé, renvoie liste des articles')
})

// Route pour créer un compte
app.post('/createaccount', urlEncodedParser, async function(req, res) {
    // on fait un formulaire pour écrire le mail et le mot de passe de l'utilisateur:
    // on le récupère dans le body :
    const user_email = (req.body)['email']
    const user_pass = (req.body)['password']
    const NewUser = await user.addUser(user_email, user_pass)
    res.send('utilisateur créer')
})

// Route pour se connecter (avec un JWT)
app.post('/login', urlEncodedParser, async function(req, res) {
    const email = (req.body)['email']
    const pass = (req.body)['password']
    
    confirmUser(email, pass)

    if (!email || !pass) {
        res.status(401).json({ error: 'Email or password was not provided.' })
        return
    }

    const users = await user.checkIfUserExist(email, pass)

    const bd_email = users[0].user_email
    const bd_pass = users[0].user_pass

    if (!users || bd_pass !== pass) {
        res.status(401).json({ error: 'Email / password do not match.' })
        return
    }

    const userJwt = jwt.sign({ user: bd_email }, secret)

    res.json({ jwt: userJwt })
})



app.listen(PORT, function() {
    console.log('Serveur lancé')
})


