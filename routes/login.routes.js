const express = require('express');
const Kartograf = require('../models/KartografModel');
const router = express.Router();
const Korisnik = require('../models/KorisnikModel');

router.get('/', function (req, res, next) {
    res.render('login', {
        title: 'Login Page',
        err: undefined
    });
});

router.post('/', async function (req, res, next) {
        try {
            let user = await Korisnik.fetchByUsername(req.body.username);
            console.log(user);
            console.log(user.isPersisted() + " " + user.checkPassword(req.body.password))
            if (user.isPersisted() && user.checkPassword(req.body.password)) {
                //povezivanje usera sa sjednicom
                req.session.user = user

                if(user.role == 'igrac') 
                    res.redirect('/igrac');
                else if(user.role == 'kartograf') //dodati provjeru ako je kartograf potvrden od admina
                    res.redirect('/kartograf')
                else if(user.role == 'administrator')
                  res.redirect('/admin')
            }
            else {
                res.render('login', {
                    title: 'Login Page',
                    err: 'Invalid username or password'
                    //user: req.session.user
                })
            }
        } catch (err) {
            res.render('login', {
                title: 'Login Page',
                err: undefined
                //user: req.session.user
            })
        }
    
});

module.exports = router;