const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
var upload = multer({ dest: 'public/images/slike' });
const Korisnik = require('../models/KorisnikModel');
const Igrac = require('../models/IgracModel');
const nodemailer = require("nodemailer");
let user;
var smtpTransport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    ignoreTLS: false,
    secure: false,
    auth: {
        user: 'geofighter1357@gmail.com',
        pass: 'Geofighter123'
    }
});
var rand, mailOptions, host, link;

router.get('/', function (req, res, next) {
    res.render('signup', {
        title: 'Sign up page',
        err: undefined

    });
});

router.get('/send', function (req, res) {
    rand = Math.floor((Math.random() * 100) + 54);
    host = req.get('host');
    link = "http://" + req.get('host') + "/signup/verify?id=" + rand;
    mailOptions = {
        to: req.session.user.email,
        subject: "Please confirm your Email account",
        html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log("Message sent!");
            res.end("sent");
        }
    });
});
router.get('/verify', async function (req, res) {
    console.log(req.protocol + ":/" + req.get('host'));
    if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
        console.log("Domain is matched. Information is from Authentic email");
        if (req.query.id == rand) {
            console.log("email is verified");
            console.log(user);
            await user.changeAktivan("1");
            req.session.user = user;
            res.end("<h1>Email " + mailOptions.to + " is been Successfully verified</h1> <br> <p>Go to <a href = '/igrac'>player page </a>.</p>");
        }
        else {
            console.log("email is not verified");
            res.end("<h1>Bad Request</h1>");
        }
    }
    else {
        res.end("<h1>Request is from unknown source");
    }
    res.redirect('/igrac');
});

router.post('/', upload.single('img'), async function (req, res, next) {

    user = await Korisnik.fetchByUsername(req.body.username);
    user1 = await Korisnik.fetchByEmail(req.body.email);
    //ako korisnik postoji, javi grešku
    if (user.idKorisnik !== undefined || user1.email !== undefined) {
        res.render('signup', {
            title: 'Sign up page',
            err: "Username or email already exists!"
        })
        return
    }
    let img = "" + req.file.filename + ".jpg";
    console.log(img);

    fs.rename('public/images/slike/' + req.file.filename, 'public/images/slike/' + img, (error) => {
        if (error) {

            // Show the error  
            console.log(error);
        }
    });
    user = new Igrac(req.body.username, req.body.email, req.body.password, img, "0", "900", "1");
    await user.persist();
    req.session.user = user;



    res.redirect('/signup/send');
});

module.exports = router;