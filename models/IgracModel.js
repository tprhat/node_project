const db = require('../db');
const Korisnik = require('./KorisnikModel');
const Lokacija = require('./Lokacija');


module.exports = class Igrac extends Korisnik {

    constructor(username, email, password, photo, aktivan, elobodovi, iskustvo) {
        super(username, email, password, photo, aktivan, "igrac");
        this.elobodovi = elobodovi;
        this.iskustvo = iskustvo;
    }

    static async fetchByEmail(email) {

        let result = await dbGetIgracByEmail(email);
        let newUser = new Igrac();

        if (result.length > 0) {
            newUser = new Igrac(result[0].username, result[0].email, result[0].password, result[0].foto, result[0].aktivan,
                result[0].elobodovi, result[0].iskustvo);
            newUser.idKorisnik = result[0].idkorisnik;  
        }

        return newUser;
    }

    static async fetchByUsername(username) {

        let result = await dbGetIgracByUsername(username);
        let newUser = new Igrac();

        if (result.length > 0) {
            newUser = new Igrac(result[0].username, result[0].email, result[0].password, result[0].foto, result[0].aktivan,
                result[0].elobodovi, result[0].iskustvo);
            newUser.idKorisnik = result[0].idkorisnik;  
        }

        return newUser;
    }

    static async fetchByUserId(idKorisnik) {
       
        let result = await dbGetIgracById(idKorisnik)
        let newUser = new Igrac()

        if (result.length > 0) {
            newUser = new Igrac(result[0].username, result[0].email, result[0].password, result[0].foto, result[0].aktivan,
                result[0].elobodovi, result[0].iskustvo);
            newUser.idKorisnik = result[0].idkorisnik;  
        }

        return newUser;
    }

    static async fetchTop100() {
        try {
            let result = await dbGetTop100();

            let newIgrac;
            let ArrayIgraci = new Array(result.length);
            for (let i = 0; i < result.length; i++) {
                newIgrac = new Igrac(result[i].username, result[i].email, result[i].password, result[i].foto, result[i].aktivan,
                    result[i].elobodovi, result[i].iskustvo);
                newIgrac.idKorisnik = result[i].idkorisnik; 
                ArrayIgraci[i] = newIgrac;
            }
            return ArrayIgraci;
        } catch (error) {
            console.log(error)
            throw err
        }
    }

    //Ako je uvjet true vraca samo aktivne igrace, ako je uvjet false vraca sve igrace
    static async fetchAllIgraci(condition) {
        try {
            let result;
            if(condition == false) {
                result = await dbGetSveIgrace();
            }else {
                result = await dbGetAktivneIgrace();
            }

            let newIgrac;
            let ArrayIgraci = new Array(result.length);
            for (let i = 0; i < result.length; i++) {
                newIgrac = new Igrac(result[i].username, result[i].email, result[i].password, result[i].foto, result[i].aktivan,
                    result[i].elobodovi, result[i].iskustvo);
                newIgrac.idKorisnik = result[i].idkorisnik; 
                ArrayIgraci[i] = newIgrac;
            }
            return ArrayIgraci;
        } catch (error) {
            console.log(error)
            throw err
        }
    }

    static async setNewValues(newId, newEloBodovi, newIskustvo) {
        await dbUpdateIgrac(newId, newEloBodovi, newIskustvo);
    }

    async setElobodovi(newEloBodovi) {
        await dbUpdateIgrac(this.idKorisnik, newEloBodovi, this.iskustvo);
        this.elobodovi = newEloBodovi;
    }

    async setIskustvo(newIskustvo) {
        await dbUpdateIgrac(this.idKorisnik, this.elobodovi, newIskustvo);
        this.iskustvo = newIskustvo;
    }

    //Vraca array svih aktivnih karti igraca nad kojim je pozvana
    static async getOdabraneKarte(igracId) {
        let result = await dbGetOdabraneKarte(igracId);

        let newLokacija;
        let ArrayLokacije = new Array(result.length);
                for (let i = 0; i < result.length; i++) {
                    newLokacija = new Lokacija(result[i].koordinate, result[i].imelokacije, result[i].opis, 
                        result[i].snaga, result[i].foto, result[i].idkartograf);
                    newLokacija.makeCoordinates();
                    newLokacija.hp = result[i].hp;
                    newLokacija.aktivna = result[i].aktivna;
                    ArrayLokacije[i] = newLokacija;
                }
        return ArrayLokacije;
    }

    static async fetchByImeLokacije(igracId, imeLokacije) {
        let result = await dbGetKartaByImeLokacije(igracId, imeLokacije);
        let newLokacija = new Lokacija(result[0].koordinate, result[0].imelokacije, result[0].opis, 
                        result[0].snaga, result[0].foto, result[0].idkartograf);
                    newLokacija.makeCoordinates();
                    newLokacija.hp = result[0].hp;
                    newLokacija.aktivna = result[0].aktivna;
        return newLokacija;
    }

    //Vraca array svih karti igraca nad kojim je pozvana
    static async getSveKarte(igracId) {
        let result = await dbGetSveKarte(igracId);

        let newLokacija;
        let ArrayLokacije = new Array(result.length);
                for (let i = 0; i < result.length; i++) {
                    newLokacija = new Lokacija(result[i].koordinate, result[i].imelokacije, result[i].opis, 
                        result[i].snaga, result[i].foto, result[i].idkartograf);
                    newLokacija.makeCoordinates();
                    newLokacija.hp = result[i].hp;
                    newLokacija.aktivna = result[i].aktivna;
                    ArrayLokacije[i] = newLokacija;
                }
        return ArrayLokacije;
    }

    //Vraca sve karte igraca s kojima se moze boriti(imaju vise od 10 hp)
    static async getSveZiveKarte(igracId) {
        let result = await dbGetSveZiveKarte(igracId);

        let newLokacija;
        let ArrayLokacije = new Array(result.length);
                for (let i = 0; i < result.length; i++) {
                    newLokacija = new Lokacija(result[i].koordinate, result[i].imelokacije, result[i].opis, 
                        result[i].snaga, result[i].foto, result[i].idkartograf);
                    newLokacija.makeCoordinates();
                    newLokacija.hp = result[i].hp;
                    newLokacija.aktivna = result[i].aktivna;
                    ArrayLokacije[i] = newLokacija;
                }
        return ArrayLokacije;
    }

    //Dodaje zadanu kartu igracu nad kojim je pozvana funkcija
    static async dodajKartu(igracId, lokacija) {
        await dbDodajKartu(igracId, lokacija);
    }

    //Aktivira zadanu kartu igracu nad kojim je pozvana funkcija
    static async aktivirajKartu(igracId, lokacija) {
        await dbAktivirajKartu(igracId, lokacija);
        lokacija.aktivna = 1;
    }

    static async deaktivirajKartu(igracId, lokacija) {
        await dbDeaktivirajKartu(igracId, lokacija);
        lokacija.aktivna = 0;
    }

    static async updateKartu(igracID, lokacija, newHp, newAktivna) {
        await dbUpdateKartu(igracID, lokacija, newHp, newAktivna);
    }



    isPersisted(){
        return this.idKorisnik;
    }
    checkPassword(password){
        return this.password ? this.password == password : false
    }

    async persist() {
        try {
            let userID = await dbNewIgrac(this)
            this.idKorisnik = userID
        } catch(err) {
            console.log("ERROR persisting user data: " + JSON.stringify(this))
            throw err
        }
    }


}

//dohvat igraca iz baze podataka na osnovu email-a(stupac email)
dbGetIgracByEmail = async (email) => {
    try {
        const result = await db.query(`SELECT idkorisnik, username, email, password, foto, aktivan, role, elobodovi, iskustvo
        FROM korisnik NATURAL JOIN igrac WHERE email = $1`, [email]);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

//dohvat igraca iz baze podataka na osnovu username-a(stupac username)
dbGetIgracByUsername = async (username) => {
    try {
        const result = await db.query(`SELECT idkorisnik, username, email, password, foto, aktivan, role, elobodovi, iskustvo
        FROM korisnik NATURAL JOIN igrac WHERE username = $1`, [username]);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

dbGetSveIgrace = async() => {
    try {
        const result = await db.query(`SELECT idkorisnik, username, email, password, foto, aktivan, role, elobodovi, iskustvo
        FROM korisnik NATURAL JOIN igrac ORDER BY idkorisnik`, []);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbGetAktivneIgrace = async() => {
    try {
        const result = await db.query(`SELECT idkorisnik, username, email, password, foto, aktivan, role, elobodovi, iskustvo
        FROM korisnik NATURAL JOIN igrac WHERE aktivan = 1 ORDER BY idkorisnik`, []);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbGetTop100 = async() => {
    try {
        const result = await db.query(`SELECT idkorisnik, username, email, password, foto, aktivan, role, elobodovi, iskustvo
        FROM korisnik NATURAL JOIN igrac
        WHERE aktivan = 1
        ORDER BY elobodovi DESC
        LIMIT 100`, []);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};


//dohvat svih karti zadanog igraca
dbGetSveKarte = async (igracId) => {
    try {
        const result = await db.query(`SELECT koordinate, imelokacije, opis, snaga, foto, idkartograf, hp, aktivna 
        FROM igrackarta NATURAL JOIN lokacija NATURAL JOIN karta
        WHERE idigrac = $1`, [igracId]);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

dbGetSveZiveKarte = async (igracId) => {
    try {
        const result = await db.query(`SELECT koordinate, imelokacije, opis, snaga, foto, idkartograf, hp, aktivna 
        FROM igrackarta NATURAL JOIN lokacija NATURAL JOIN karta
        WHERE idigrac = $1 AND hp >= 10`, [igracId]);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

dbGetKartaByImeLokacije = async (igracId, imeLokacije) => {
    try {
        const result = await db.query(`SELECT koordinate, imelokacije, opis, snaga, foto, idkartograf, hp, aktivna 
        FROM igrackarta NATURAL JOIN lokacija NATURAL JOIN karta
        WHERE idigrac = $1 AND imelokacije = $2`, [igracId, imeLokacije]);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

//dohvat svih aktiviranih karti zadanog igraca
dbGetOdabraneKarte = async (igracId) => {
    try {
        const result = await db.query(`SELECT koordinate, imelokacije, opis, snaga, foto, idkartograf, hp, aktivna 
        FROM igrackarta NATURAL JOIN lokacija NATURAL JOIN karta
        WHERE idigrac = $1 AND aktivna = 1`, [igracId]);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

//dodavanje zadane karte zadanom igracu
dbDodajKartu = async(igracId, lokacija) => {
    try {
        const result = await db.query(`INSERT INTO igrackarta (idigrac, koordinate, hp, aktivna) VALUES (
            $1, $2, 100, 0)`, [igracId, lokacija.koordinate]);

        return result.rows;
    } catch (err) {
        await db.query(`UPDATE igrackarta SET hp = 100 WHERE idigrac = $1 AND koordinate = $2`, [igracId, lokacija.koordinate]);

        console.log("Igrac vec ima kartu!\n Obnovljen hp!");
    }
}

//aktiviranje zadane karte zadanog igraca
dbAktivirajKartu = async(igracId, lokacija) => {
    try {
        const result = await db.query(`UPDATE igrackarta
        SET aktivna = 1 
        WHERE idigrac = $1 AND koordinate = $2`, [igracId, lokacija.koordinate]);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

//deaktiviranje zadane karte zadanog igraca
dbDeaktivirajKartu = async(igracId, lokacija) => {
    try {
        const result = await db.query(`UPDATE igrackarta
        SET aktivna = 0 
        WHERE idigrac = $1 AND koordinate = $2`, [igracId, lokacija.koordinate]);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

//dohvat igraca iz baze podataka na osnovu id korisnika (stupac idKorisnik)
dbGetIgracById = async (idKorisnik) => {
    try {
        const result = await db.query(`SELECT idkorisnik, username, email, password, foto, aktivan, role, elobodovi, iskustvo
        FROM korisnik NATURAL JOIN igrac WHERE idkorisnik = $1`, [idKorisnik]);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

//umetanje zapisa o igracu u bazu podataka
dbNewIgrac = async (igrac) => {
    try {
        const result = await db.query(`INSERT INTO Korisnik (username, email, password, foto, aktivan, role) VALUES
        ($1, $2, $3, $4, $5, $6) RETURNING idkorisnik`,
         [igrac.username, igrac.email, igrac.password, igrac.foto, igrac.aktivan, igrac.role]);

        await db.query(`INSERT INTO igrac (idkorisnik, elobodovi, iskustvo) VALUES ($1, $2, $3)`,
         [result.rows[0].idkorisnik, igrac.elobodovi, igrac.iskustvo]);

        return result.rows[0].idkorisnik;
    } catch (err) {
        console.log(err);
        throw err
    }
}

//Update Igraca
dbUpdateIgrac = async(changeId, newEloBodovi, newIskustvo) => {
    try {
        await db.query(`UPDATE igrac SET (elobodovi, iskustvo) = ($1, $2) WHERE idKorisnik = $3;`, 
        [newEloBodovi, newIskustvo, changeId]);

    }catch (err) {
        console.log(err);
        throw err
    }
}

dbUpdateKartu = async(changeId, changeLokacija, newHp, newAktivna) => {
    try {
        await db.query(`UPDATE igrackarta SET (hp, aktivna) = ($1, $2) WHERE idigrac = $3 AND koordinate = $4;`,
        [newHp, newAktivna, changeId, changeLokacija.koordinate]);

    }catch (err) {
        console.log(err);
        throw err
    }
}
