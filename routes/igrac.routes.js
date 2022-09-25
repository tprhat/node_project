const express = require('express')
const router = express.Router();
const dateTime = require('node-datetime');
const Igrac = require('../models/IgracModel');
const Lokacija = require('../models/Lokacija');
const TijekBorbe = require('../models/TijekBorbe');
const Borba = require('../models/Borba');
const { fetchByUserId } = require('../models/IgracModel');
const fs = require('fs');
const multer = require('multer');
var upload = multer({ dest: 'public/images/slike' });

router.get('/', async function (req, res, next) {
    if (req.session.user !== undefined) {
        if (req.session.user.role == "igrac") {
            if (req.session.user.aktivan == "1") {

                console.log(req.session.user);
                igrac = await fetchByUserId(req.session.user.idKorisnik);
                lokacije = await Igrac.getSveKarte(req.session.user.idKorisnik);
                strongCard = lokacije.sort((a,b)=>b.snaga - a.snaga)[0];
                res.render('igracMain', {
                    title: 'Main',
                    igrac: igrac, 
                    strongCard: strongCard

                });
            } else {
                res.status(403).send("You have to verify your email first! Then come back here");
            }
        }
        else if (req.session.user.role == "kartograf") {
            res.redirect('/kartograf');
        }
        else if (req.session.user.role == "administrator") {
            res.redirect('/admin');
        }
    }
    else {
        res.status(403).send("You don't have permission to access this site. Please <a href='/login'>login</a> or <a href='/signup'>signup</a> first")
    }
});

router.get('/map', async function (req, res, next) {
    if (req.session.user !== undefined) {
        if (req.session.user.role == "igrac") {
            if (req.session.user.aktivan == "1") {

                try{
                    const kartice = await Igrac.getSveKarte(req.session.user.idKorisnik)
                    const lokacije = await Lokacija.getPotvrdeneLokacije()
                    const igrac = await Igrac.fetchByUserId(req.session.user.idKorisnik)
                    res.render('igracMap', {
                        title: 'Map',
                        lokacije: lokacije,
                        kartice: kartice,
                        igrac: igrac,
                        err: undefined
                    });
                } catch(err){
                    console.log(err)
                }
            } else {
                res.status(403).send("You have to verify your email first! Then come back here");
            }
        }
        else if (req.session.user.role == "kartograf") {
            res.redirect('/kartograf');
        }
        else if (req.session.user.role == "administrator") {
            res.redirect('/admin');
        }
    }
    else {
        res.status(403).send("You don't have permission to access this site. Please <a href='/login'>login</a> or <a href='/signup'>signup</a> first")
    }
});

router.post('/map', async function (req, res, next) {
    

    try{
        const nova = req.body.nova == "DA" ? true: false
        const lokacija = await Lokacija.fetchByKoordinate(req.body.koordinate)
        const igrac = await Igrac.fetchByUserId(req.session.user.idKorisnik)

        if(nova == true){
            await Igrac.dodajKartu(req.session.user.idKorisnik, lokacija)
            let novoIskustvo = igrac.iskustvo + 1
            await igrac.setIskustvo(novoIskustvo)
        } else {
            await Igrac.updateKartu(req.session.user.idKorisnik, lokacija, 100, 0)
        }
        

        res.render('novaKartica', {
            title: 'Kartica',
            lokacija: lokacija,
            igrac: igrac,
            nova: nova,
            err: undefined
        });
    }catch(err){
        console.log(err)
    }
});

router.post('/predloziNovuLokaciju', async function (req, res, next) {
        res.render('predlozakZaNovuLokaciju', {
            title: 'Predlozite Novu Lokaciju',
            koordinate: req.body.koordinate,
            err: undefined
        });
});


router.post('/predlozakZaNovuLokaciju',  upload.single('img'), async function (req, res, next) {
    
    try{

        let img = "" + req.file.filename + ".jpg";    
        console.log(img);
        

        fs.rename('public/images/slike/' + req.file.filename, 'public/images/slike/' + img, (error) => {
            if (error) {
    
                // Show the error  
                console.log(error);
            }
        });


        lokacija =  new Lokacija(req.body.koordinate, req.body.imeLok, req.body.opisLok, req.body.snagaLok, req.file.filename, null);
        await lokacija.persist()

    } catch(err){
        console.log(err)
    }
    
    
    res.redirect('/igrac');
});

//VRLO UPITNO
router.get('/upravljanjeKartama', async function (req, res, next) {
    if (req.session.user !== undefined) {
        if (req.session.user.role == "igrac") {
            if (req.session.user.aktivan == "1") {
                //pitanje kako doci do 
                console.log(req.session.user);
                lokacije = await Igrac.getSveKarte(req.session.user.idKorisnik);
                res.render('igracUpravljanjeKartama', {
                    title: 'Upravljanje Kartama',
                    lokacije: lokacije
                });
            } else {
                res.status(403).send("You have to verify your email first! Then come back here");
            }
        }
        else if (req.session.user.role == "kartograf") {
            res.redirect('/kartograf');
        }
        else if (req.session.user.role == "administrator") {
            res.redirect('/admin');
        }
    }
    else {
        res.status(403).send("You don't have permission to access this site. Please <a href='/login'>login</a> or <a href='/signup'>signup</a> first")
    }
});

router.get('/borba', async function (req, res, next) {
    if (req.session.user !== undefined) {
        if (req.session.user.role == "igrac") {
            if (req.session.user.aktivan == "1") {
                igraci = await Igrac.fetchAllIgraci(true);
                karte = await Igrac.getSveZiveKarte(req.session.user.idKorisnik);
                aktivniIgrac = await Igrac.fetchByUserId(req.session.user.idKorisnik);
                borbe = await Borba.fetchByidKorisnik(req.session.user.idKorisnik);
                izazvan = await TijekBorbe.fetchByIdIzazvan(req.session.user.idKorisnik);
                izazivac = await TijekBorbe.fetchByIdIzazivac(req.session.user.idKorisnik);
                dovrseni = await TijekBorbe.fetchDovrseni(req.session.user.idKorisnik);
                if(karte.length >= 1) {
                    res.render('borba2', {
                        title: 'Borba',
                        igraci: igraci,
                        karte: karte,
                        izazvan: izazvan,
                        izazivac: izazivac,
                        dovrseni: dovrseni,
                        aktivniIgrac: aktivniIgrac,
                        borbe: borbe
    
                    });
    
                    if(dovrseni) {
                        for(let tmp of dovrseni) {
                            tmp.deleteFromDB();
                        }
                    }
                }else {
                    res.status(403).send("You don't have enough cards to play! <br> <a href='/igrac'>back</a>");
                }
                
            } else {
                res.status(403).send("You have to verify your email first! Then come back here");
            }
        }
        else if (req.session.user.role == "kartograf") {
            res.redirect('/kartograf');
        }
        else if (req.session.user.role == "administrator") {
            res.redirect('/admin');
        }
    }
    else {
        res.status(403).send("You don't have permission to access this site. Please <a href='/login'>login</a> or <a href='/signup'>signup</a> first")
    }
});

router.get('/borba/zahtjev', async function (req, res, next) {
    if (req.session.user !== undefined) {
        if (req.session.user.role == "igrac") {
            if (req.session.user.aktivan == "1") {
                igraci = await Igrac.fetchAllIgraci(true);
                karte = await Igrac.getSveZiveKarte(req.session.user.idKorisnik);
                res.render('dvoboj', {
                    title: 'Izazov',
                    igraci: igraci,
                    username: req.session.user.username,
                    karte: karte,

                });
            } else {
                res.status(403).send("You have to verify your email first! Then come back here");
            }
        }
        else if (req.session.user.role == "kartograf") {
            res.redirect('/kartograf');
        }
        else if (req.session.user.role == "administrator") {
            res.redirect('/admin');
        }
    }
    else {
        res.status(403).send("You don't have permission to access this site. Please <a href='/login'>login</a> or <a href='/signup'>signup</a> first")
    }
});

//Postavljanje izazova
router.post('/borba/zahtjev', async function (req, res, next) {
    let ukSnaga = 0;
    let karta;
    let error = 0;

    if(req.body.karta1 == req.body.karta2 && req.body.karta2 == req.body.karta3) {
        karta = await Igrac.fetchByImeLokacije(req.session.user.idKorisnik, req.body.karta1);
        if(karta.hp < 30) {
            res.status(403).send(`Not enough hp! <br> Tip: Don't use the
             same card in multiple card slots <br> <a href='/igrac/borba'>back</a>`);
             error = 1;
        }
    }else if(req.body.karta1 == req.body.karta2 || req.body.karta1 == req.body.karta3) {
        karta = await Igrac.fetchByImeLokacije(req.session.user.idKorisnik, req.body.karta1);
        if(karta.hp < 20) {
            res.status(403).send(`Not enough hp! <br> Tip: Don't use the
            same card in multiple card slots <br> <a href='/igrac/borba'>back</a>`);
            error = 1;
        }
    }else if(req.body.karta2 == req.body.karta3) {
        karta = await Igrac.fetchByImeLokacije(req.session.user.idKorisnik, req.body.karta2);
        if(karta.hp < 20) {
            res.status(403).send(`Not enough hp! <br> Tip: Don't use the
            same card in multiple card slots <br> <a href='/igrac/borba'>back</a>`);
            error = 1;
        }
    }


    if(error == 0) {
        karta = await Igrac.fetchByImeLokacije(req.session.user.idKorisnik, req.body.karta1);
        ukSnaga += karta.snaga;
        await Igrac.updateKartu(req.session.user.idKorisnik, karta, karta.hp - 10, karta.aktivna)
        karta = await Igrac.fetchByImeLokacije(req.session.user.idKorisnik, req.body.karta2);
        ukSnaga += karta.snaga;
        await Igrac.updateKartu(req.session.user.idKorisnik, karta, karta.hp - 10, karta.aktivna)
        karta = await Igrac.fetchByImeLokacije(req.session.user.idKorisnik, req.body.karta3);
        ukSnaga += karta.snaga;
        await Igrac.updateKartu(req.session.user.idKorisnik, karta, karta.hp - 10, karta.aktivna)

        protivnik = await Igrac.fetchByUsername(req.body.protivnik);

        borba = new TijekBorbe(req.session.user.idKorisnik, protivnik.idKorisnik, ukSnaga, null);
        try {
            await borba.persist();
        } catch (error) {
            res.redirect('/igrac/borba/zahtjev');
        }
        res.redirect('/igrac');
    }

});

//Odgovor na izazov
router.post('/borba', async function (req, res, next) {
    let ukSnaga = 0;
    let karta;
    let error = 0;

    if(req.body.karta1 == req.body.karta2 && req.body.karta2 == req.body.karta3) {
        karta = await Igrac.fetchByImeLokacije(req.session.user.idKorisnik, req.body.karta1);
        if(karta.hp < 30) {
            res.status(403).send(`Not enough hp! <br> Tip: Don't use the
             same card in multiple card slots <br> <a href='/igrac/borba'>back</a>`);
             error = 1;
        }
    }else if(req.body.karta1 == req.body.karta2 || req.body.karta1 == req.body.karta3) {
        karta = await Igrac.fetchByImeLokacije(req.session.user.idKorisnik, req.body.karta1);
        if(karta.hp < 20) {
            res.status(403).send(`Not enough hp! <br> Tip: Don't use the
            same card in multiple card slots <br> <a href='/igrac/borba'>back</a>`);
            error = 1;
        }
    }else if(req.body.karta2 == req.body.karta3) {
        karta = await Igrac.fetchByImeLokacije(req.session.user.idKorisnik, req.body.karta2);
        if(karta.hp < 20) {
            res.status(403).send(`Not enough hp! <br> Tip: Don't use the
            same card in multiple card slots <br> <a href='/igrac/borba'>back</a>`);
            error = 1;
        }
    }


    if(error == 0) {
        karta = await Igrac.fetchByImeLokacije(req.session.user.idKorisnik, req.body.karta1);
        ukSnaga += karta.snaga;
        await Igrac.updateKartu(req.session.user.idKorisnik, karta, karta.hp - 10, karta.aktivna)
        karta = await Igrac.fetchByImeLokacije(req.session.user.idKorisnik, req.body.karta2);
        ukSnaga += karta.snaga;
        await Igrac.updateKartu(req.session.user.idKorisnik, karta, karta.hp - 10, karta.aktivna)
        karta = await Igrac.fetchByImeLokacije(req.session.user.idKorisnik, req.body.karta3);
        ukSnaga += karta.snaga;
        await Igrac.updateKartu(req.session.user.idKorisnik, karta, karta.hp - 10, karta.aktivna)


        izazivac = await Igrac.fetchByUserId(req.body.protivnik);
        borbe = await TijekBorbe.fetchByIdIzazvan(req.session.user.idKorisnik);
        let aktivnaBorba;
        for(b of borbe) {
            if(b.idIzazivac == izazivac.idKorisnik)
                snagaIzazivac = b.ukupnaSnaga;
                aktivnaBorba = b;
        }
        let idPobjednik;
        let idGubitnik;
        let rezultat;
        if(snagaIzazivac >= ukSnaga){
            idPobjednik = izazivac.idKorisnik;
            idGubitnik = req.session.user.idKorisnik;
            console.log("Nazalost, izgubili ste u dvoboju")
            rezultat = 0;
        }
        else{
            idGubitnik = izazivac.idKorisnik;
            idPobjednik = req.session.user.idKorisnik;
            console.log("Cestitamo pobijedili ste u dvoboju")
            rezultat = 1;
        }

        var dt = dateTime.create();
        var vrijeme = dt.format('Y-m-d H:M:S');

        winlose = new Borba(idPobjednik, idGubitnik, vrijeme);
        try {
            await winlose.persist();
            await TijekBorbe.setIdBorba(aktivnaBorba.idDvoboj, winlose.idBorba);
        } catch (error) {
            res.session.idPobjednik = idPobjednik;
            res.session.idGubitnik = idGubitnik;
            res.redirect('/igrac/borba');
        }

        //Racunanje Elo bodova
        igrac = await Igrac.fetchByUserId(req.session.user.idKorisnik);

        P1 = (1.0 / (1.0 + Math.pow(10, ((igrac.elobodovi - izazivac.elobodovi) / 400))));

        P2 = (1.0 / (1.0 + Math.pow(10, ((izazivac.elobodovi - igrac.elobodovi) / 400))));

        k = 38;

        let bodoviIgrac = k*(rezultat - P1);
        bodoviIzazivac = k*((1 - rezultat) - P2);

        console.log("igrac stari elobodovi = " + igrac.elobodovi);
        console.log("igrac novi elobodovi = " + Number(igrac.elobodovi + bodoviIgrac));

        console.log("izazivac stari elobodovi = " + izazivac.elobodovi);
        console.log("izazivac novi elobodovi = " + Number(izazivac.elobodovi + bodoviIzazivac));

        igrac.elobodovi = Math.floor(igrac.elobodovi + bodoviIgrac);

        await Igrac.setNewValues(igrac.idKorisnik, igrac.elobodovi, igrac.iskustvo);

        izazivac.elobodovi = Math.floor(izazivac.elobodovi + bodoviIzazivac);

        await Igrac.setNewValues(izazivac.idKorisnik, izazivac.elobodovi, izazivac.iskustvo);

        
        if(rezultat == 1) {
            res.redirect('/igrac/pobjeda');
        }else {
            res.redirect('/igrac/poraz')
        }
    }

});


router.get('/pobjeda', async function (req, res, next) {
    if (req.session.user !== undefined) {
        if (req.session.user.role == "igrac") {
            if (req.session.user.aktivan == "1") {
                res.render('igracPobjeda', {
                    title: 'POBJEDA'
                });
            } else {
                res.status(403).send("You have to verify your email first! Then come back here");
            }
        }
        else if (req.session.user.role == "kartograf") {
            res.redirect('/kartograf');
        }
        else if (req.session.user.role == "administrator") {
            res.redirect('/admin');
        }
    }
    else {
        res.status(403).send("You don't have permission to access this site. Please <a href='/login'>login</a> or <a href='/signup'>signup</a> first")
    }
});

router.get('/poraz', async function (req, res, next) {
    if (req.session.user !== undefined) {
        if (req.session.user.role == "igrac") {
            if (req.session.user.aktivan == "1") {
                res.render('igracPoraz', {
                    title: 'PORAZ'
                });
            } else {
                res.status(403).send("You have to verify your email first! Then come back here");
            }
        }
        else if (req.session.user.role == "kartograf") {
            res.redirect('/kartograf');
        }
        else if (req.session.user.role == "administrator") {
            res.redirect('/admin');
        }
    }
    else {
        res.status(403).send("You don't have permission to access this site. Please <a href='/login'>login</a> or <a href='/signup'>signup</a> first")
    }
});


router.get('/borba/statistika', async function (req, res, next) {
    if (req.session.user !== undefined) {
        if (req.session.user.role == "igrac") {
            if (req.session.user.aktivan == "1") {

                res.render('igracStatistika', {
                    title: 'Izazov'
                });
            } else {
                res.status(403).send("You have to verify your email first! Then come back here");
            }
        }
        else if (req.session.user.role == "kartograf") {
            res.redirect('/kartograf');
        }
        else if (req.session.user.role == "administrator") {
            res.redirect('/admin');
        }
    }
    else {
        res.status(403).send("You don't have permission to access this site. Please <a href='/login'>login</a> or <a href='/signup'>signup</a> first")
    }
});


router.get('/:userID', function (req, res, next) {
    let user = Igrac.fetchByUserId(req.params.userID);
    //user.setAktivan();
    res.redirect('/igrac');
});

module.exports = router;