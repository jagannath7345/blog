const express = require("express");
const { signUp, login } = require("../controllers/userController");
const router = express.Router()

router.get('/login', (req, res)=>{
    return res.render("login")
})

router.get('/signup', (req, res)=>{
    return res.render("signup")
})

router.post('/signup', signUp)
router.post('/login', login)

router.get('/logout', (req, res)=>{
    res.clearCookie("token").redirect('/')
})

module.exports = router;