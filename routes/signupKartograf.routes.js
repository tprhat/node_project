const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
var upload = multer({ dest: 'public/images/slike' });
const Korisnik = require('../models/KorisnikModel');
const Kartograf = require('../models/KartografModel');

router.get('/', function (req, res, next) {
    res.render('signupKartograf', {
        title: 'Sign up page',
        err: undefined
       
    });
});

router.post('/', upload.fields([{name: 'img', maxCount: 1}, {name: 'photoID', maxCount: 1}]) ,async function(req,res,next){
   
        let user = await Korisnik.fetchByUsername(req.body.username);
        let user1 = await Korisnik.fetchByEmail(req.body.email);
        //ako korisnik postoji, javi grešku
        if( user.idKorisnik !== undefined || user1.email !== undefined ) {
            res.render('signupKartograf', {
                title: 'Sign up page',
                err: "Username or email already exists!"
            })
            return
        }
        let pic = req.files['img'][0];
        console.log(pic);
        let pic1 = req.files['photoID'][0];
        console.log(pic1);
        let img = "" + pic.filename + ".jpg";
        let photoID = "" + pic1.filename + ".jpg";
        console.log(img);

    fs.rename('public/images/slike/' + pic.filename, 'public/images/slike/' + img, (error) => {
        if (error) {

            // Show the error  
            console.log(error);
        }
    });
    fs.rename('public/images/slike/' + pic1.filename, 'public/images/slike/' + photoID, (error) => {
        if (error) {

            // Show the error  
            console.log(error);
        }
    });
        //constructor(username, email, password, photo, aktivan, idAdministrator, iban, fotoOsobne)
        user = new Kartograf(req.body.username, req.body.email, req.body.password, img, 1, null, req.body.IBAN, photoID);
        console.log(user);
        await user.persist();

        req.session.user = user;
        res.redirect('./kartograf');
});

module.exports = router;