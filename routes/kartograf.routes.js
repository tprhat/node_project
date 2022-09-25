const express = require('express');
const Kartograf = require('../models/KartografModel');
const Lokacija = require('../models/Lokacija');
const router = express.Router();

router.get('/', async function (req, res, next) {
    if (req.session.user !== undefined) {
        if (req.session.user.role == "kartograf") {
            let user = await Kartograf.fetchByEmail(req.session.user.email);
            console.log(user);
            if (user.idAdministrator > 0) {
                res.render('kartografMain', {
                    title: 'Kartograf',
                    err: undefined
                });
            }
            else {
                res.status(403).send("Please wait until the administrator accepts your request.");
            }
        } else {
            res.status(403).send("You don't have permission to access this site. <br> Go back to <a href='/'> Homepage </a>")
        }
    } else {
        res.status(403).send("You don't have permission to access this site. Please <a href='/login'>login</a> or <a href='/signup'>signup</a> first")
    }

});

//Prikazuje neodobrene karte
router.get('/listaKarti', async function (req, res, next) {
    if (req.session.user !== undefined) {
        if (req.session.user.role == "kartograf") {
            let user = await Kartograf.fetchByEmail(req.session.user.email);
            console.log(user);
            if (user.idAdministrator > 0) {
                let neodobreneKarte = await Lokacija.getAllLokacije();
                res.render('kartografKarte', {
                    title: 'Kartograf',
                    karte: neodobreneKarte,
                    err: undefined
                });
            }
            else {
                res.status(403).send("Please wait until the administrator accepts your request.");
            }
        } else {
            res.status(403).send("You don't have permission to access this site. <br> Go back to <a href='/'> Homepage </a>")
        }
    } else {
        res.status(403).send("You don't have permission to access this site. Please <a href='/login'>login</a> or <a href='/signup'>signup</a> first")
    }
});


router.post('/listaKarti', async function (req, res, next) {
    try{
        let idKartograf
        if(req.body.idKartograf == "NE") {
            idKartograf = null
        } else {
            idKartograf = req.session.user.idKorisnik
        }
        //(newKoordinate, newImeLokacije, newOpis, newSnaga, newFoto, newIdKartograf)
        await Lokacija.setNewValues(req.body.koordinate, req.body.imelokacije, req.body.opis, req.body.snaga, req.body.foto, idKartograf)
        
    }catch(err){
        console.log(err)
    }
    res.redirect('/kartograf/listaKarti');
});

router.get('/listaNeodobrenihKarti', async function (req, res, next) {
    if (req.session.user !== undefined) {
        if (req.session.user.role == "kartograf") {
            let user = await Kartograf.fetchByEmail(req.session.user.email);
            console.log(user);
            if (user.idAdministrator > 0) {
                let neodobreneKarte = await Lokacija.getAllNeodobreneLokacije();
                res.render('kartografKarte', {
                    title: 'Kartograf',
                    karte: neodobreneKarte,
                    err: undefined
                });
            }
            else {
                res.status(403).send("Please wait until the administrator accepts your request.");
            }
        } else {
            res.status(403).send("You don't have permission to access this site. <br> Go back to <a href='/'> Homepage </a>")
        }
    } else {
        res.status(403).send("You don't have permission to access this site. Please <a href='/login'>login</a> or <a href='/signup'>signup</a> first")
    }
});

module.exports = router;