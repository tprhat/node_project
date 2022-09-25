const express = require('express');
const router = express.Router();
const dateTime = require('node-datetime');
const User = require('../models/KorisnikModel');
const Kartograf = require('../models/KartografModel');
const Igrac = require('../models/IgracModel');
const Korisnik = require('../models/KorisnikModel')
const Obavijest = require('../models/Obavijest');


router.get('/', async function (req, res, next) {
    if (req.session.user !== undefined) {
        if (req.session.user.role == "administrator") {

            res.render('adminMain', {
                title: 'Admin Page',
                err: undefined
            });
        } else {
            res.status(403).send("You don't have permission to access this site. <br> Go back to <a href='/'> Homepage </a>")
        }
    } else {
        res.status(403).send("You don't have permission to access this site. Please <a href='/login'>login</a> or <a href='/signup'>signup</a> first")
    }
});

router.get('/listaKartografa', async function (req, res, next) {
    if (req.session.user !== undefined) {
        if (req.session.user.role == "administrator") {

            try {
                const kartografi = await Kartograf.fetchKartografs()

                res.render('adminListaKartografa', {
                    title: 'Admin Page, Kartografi',
                    kartografi: kartografi,
                    err: undefined
                });
            } catch (err) {
                console.log(err)
            }
        } else {
            res.status(403).send("You don't have permission to access this site. <br> Go back to <a href='/'> Homepage </a>")
        }
    } else {
        res.status(403).send("You don't have permission to access this site. Please <a href='/login'>login</a> or <a href='/signup'>signup</a> first")
    }
});


//izmijeniti kartografa u bazi podataka i napraviti redirect na listu kartografa
router.post('/listaKartografa', async function (req, res, next) {
    try{
        let idAdmin
        if(req.body.idAdministrator == "NE") {
            idAdmin = null
        } else {
            idAdmin = req.session.user.idKorisnik
        }

        await Kartograf.setNewValues(req.body.idKorisnik, idAdmin, req.body.IBAN, req.body.fotoOsobne)
        await Korisnik.setNewValues(req.body.idKorisnik, req.body.email, req.body.username, req.body.password, req.body.foto, req.body.aktivan)
        
    }catch(err){
        console.log(err)
    }
    res.redirect('/admin/listaKartografa')
});


//Prikazi obrazac za postavljanje obavijesti
router.get('/postaviObavijest', async function(req, res, next) {
    if (req.session.user !== undefined) {
        if (req.session.user.role == "administrator") {
            res.render('postavljanjeObavijesti', {
                title: 'Postavi Obavijest',
                err: undefined
            });
        } else {
            res.status(403).send("You don't have permission to access this site. <br> Go back to <a href='/'> Homepage </a>")
        }
    } else {
        res.status(403).send("You don't have permission to access this site. Please <a href='/login'>login</a> or <a href='/signup'>signup</a> first")
    } 
});

//Napravi novu obavijest i preusmjeri na listu obavijesti
router.post('/postaviObavijest', async function(req, res, next) {
    try {
        console.log(req.body.tekst);

        var dt = dateTime.create();
        var vrijeme = dt.format('Y-m-d H:M:S');

        console.log(vrijeme);

        o = new Obavijest(req.body.tekst, vrijeme);

        await o.persist();

        console.log("Uspjesno postavljena obavijest");

        res.redirect('/pregledObavijesti');
    }catch(err) {
        console.log(err);
    }
});


router.get('/listaIgraca', async function (req, res, next) {
    if (req.session.user !== undefined) {
        if (req.session.user.role == "administrator") {
    
            try{
                const igraci = await Igrac.fetchAllIgraci(false)
    
                res.render('adminListaIgraca', {
                    title: 'Admin Page, Igraci',
                    igraci: igraci,
                    err: undefined
                });
            }catch(err){
                console.log(err)
            }

        } else {
            res.status(403).send("You don't have permission to access this site. <br> Go back to <a href='/'> Homepage </a>")
        }
    } else {
        res.status(403).send("You don't have permission to access this site. Please <a href='/login'>login</a> or <a href='/signup'>signup</a> first")
    }
});


//izmijeniti igraca u bazi podataka i napraviti redirect na listu igraca
router.post('/listaIgraca', async function (req, res, next) {

    try{
        await Igrac.setNewValues(req.body.idKorisnik, req.body.elobodovi, req.body.iskustvo)
        await Korisnik.setNewValues(req.body.idKorisnik, req.body.email, req.body.username, req.body.password, req.body.foto, req.body.aktivan)
    } catch(err){
        console.log(err)
    }
    res.redirect('/admin/listaIgraca')
});



module.exports = router;