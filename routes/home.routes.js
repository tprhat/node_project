const express = require('express')
const router = express.Router()
const Obavijest = require('../models/Obavijest');
const Igrac = require('../models/IgracModel');

router.get('/', function (req, res, next) {
    res.render('home', {
        title: 'Home'
       
    });
});

router.get('/pregledObavijesti', async function(req, res, next) {
    obavijesti = await Obavijest.getAllObavijesti();
    res.render('pregledObavijesti', {
        title: 'Obavijesti',
        obavijesti: obavijesti,
        err: undefined
    });
});

router.get('/eloTop100', async function(req, res, next) {
    igraci = await Igrac.fetchTop100();

    res.render('eloTop100', {
        title: 'TOP 100',
        igraci: igraci
    })
});


//prebacit u igrac

router.get('/ListaPrijatelja', function (req, res, next) {
    res.render('ListaPrijatelja', {
        title: 'ListaPrijatelja'

    });
});

//prebacit u igrac

router.get('/Dodajprijatelje', function (req, res, next) {
    res.render('Dodajprijatelje', {
        title: 'Dodajprijatelje'

    });
});

//prebacit u igrac

router.get('/Prihavtiprijatelje', function (req, res, next) {
    res.render('Prihavtiprijatelje', {
        title: 'Prihavtiprijatelje'

    });
});

//todo
// router.post('/', function (req, res, next) {


// });

module.exports = router;