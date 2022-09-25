const db = require('../db');

module.exports = class Lokacija {

    //Ako jos nije odobrena predaje se null za idKartograf
    //Ako nema slike predaje se null za sliku
    constructor(koordinate, imeLokacije, opis, snaga, foto, idKartograf) {
        this.koordinate = koordinate;
        this.imeLokacije = imeLokacije;
        this.opis = opis;
        this.snaga = snaga;
        this.foto = foto;
        this.idKartograf = idKartograf;
    }

    //Losa pomocna funkcija koja se koristi za iscrtavanje lokacija na karti
    //Definitivno treba preraditi
    //Nije testirano
    makeCoordinates() {
        let temp = this.koordinate.split(", ");
        this.x = temp[0];
        this.y = temp[1];
    }

    static async fetchByKoordinate(koordinate) {
       
        let result = await dbGetLokacijaByKoordinate(koordinate)
        let newLokacija = new Lokacija()

        if (result.length > 0) {
            newLokacija = new Lokacija(result[0].koordinate, result[0].imelokacije, result[0].opis,
                result[0].snaga, result[0].foto, result[0].idkartograf);
        }

        newLokacija.makeCoordinates();

        return newLokacija;
    }

    static async fetchByImeLokacije(imeLokacije) {
        let result = await dbGetLokacijaByImeLokacije(imeLokacije)
        let newLokacija = new Lokacija()

        if (result.length > 0) {
            newLokacija = new Lokacija(result[0].koordinate, result[0].imelokacije, result[0].opis, 
                result[0].snaga, result[0].foto, result[0].idkartograf);
        }

        newLokacija.makeCoordinates();

        return newLokacija;
    }

    static async getAllLokacije() {
        let result = await dbGetLokacije();

        let newLokacija;
        let ArrayLokacije = new Array(result.length);
                for (let i = 0; i < result.length; i++) {
                    newLokacija = new Lokacija(result[i].koordinate, result[i].imelokacije, result[i].opis, 
                        result[i].snaga, result[i].foto, result[i].idkartograf);
                    newLokacija.makeCoordinates();
                    ArrayLokacije[i] = newLokacija;
                }
        return ArrayLokacije;
    }

    static async getPotvrdeneLokacije() {
        let result = await dbGetOdobreneLokacije();

        let newLokacija;
        let ArrayLokacije = new Array(result.length);
                for (let i = 0; i < result.length; i++) {
                    newLokacija = new Lokacija(result[i].koordinate, result[i].imelokacije, result[i].opis, 
                        result[i].snaga, result[i].foto, result[i].idkartograf);
                    newLokacija.makeCoordinates();
                    ArrayLokacije[i] = newLokacija;
                }
        return ArrayLokacije;
    }

    static async getAllNeodobreneLokacije() {
        let result = await dbGetNeodobreneLokacije();

        let newLokacija;
        let ArrayLokacije = new Array(result.length);
                for (let i = 0; i < result.length; i++) {
                    newLokacija = new Lokacija(result[i].koordinate, result[i].imelokacije, result[i].opis, 
                        result[i].snaga, result[i].foto, result[i].idkartograf);
                    newLokacija.makeCoordinates();
                    ArrayLokacije[i] = newLokacija;
                }
        return ArrayLokacije;
    }

    static async setNewValues(newKoordinate, newImeLokacije, newOpis, newSnaga, newFoto, newIdKartograf) {
        await dbUpdateLokacija(newKoordinate, newImeLokacije, newOpis, newSnaga, newFoto, newIdKartograf);
    }

    async persist() {
        try {
            await dbNewLokacija(this);
        } catch(err) {
            console.log("ERROR persisting user data: " + JSON.stringify(this))
            throw err
        }
    }

    

}

//dohvat lokacije iz baze podataka po koordinatama (stupac koordinate)
dbGetLokacijaByKoordinate = async (koordinate) => {
    try {
        const result = await db.query(`SELECT koordinate, imelokacije, opis, snaga, foto, idkartograf
        FROM lokacija NATURAL JOIN karta WHERE koordinate = $1`, [koordinate]);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbGetLokacije = async () => {
    try {
        const result = await db.query(`SELECT koordinate, imelokacije, opis, snaga, foto, idkartograf
        FROM lokacija NATURAL JOIN karta`, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbGetOdobreneLokacije = async () => {
    try {
        const result = await db.query(`SELECT koordinate, imelokacije, opis, snaga, foto, idkartograf
        FROM lokacija NATURAL JOIN karta WHERE idkartograf IS NOT NULL`, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbGetNeodobreneLokacije = async () => {
    try {
        const result = await db.query(`SELECT koordinate, imelokacije, opis, snaga, foto, idkartograf
        FROM lokacija NATURAL JOIN karta WHERE idkartograf IS NULL`, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

//dohvat lokacije iz baze podataka po imenu lokacije (stupac imeLokacije)
dbGetLokacijaByImeLokacije = async(imeLokacije) => {
    try {
        const result = await db.query(`SELECT koordinate, imelokacije, opis, snaga, foto, idkartograf
        FROM lokacija NATURAL JOIN karta WHERE imelokacije = $1`, [imeLokacije]);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

//umetanje zapisa o lokaciji u bazu podataka
dbNewLokacija = async (lokacija) => {
    try {
        const result = await db.query(`INSERT INTO Lokacija (koordinate, imelokacije, opis, foto, idkartograf) VALUES ($1, $2, $3, $4, $5) RETURNING koordinate`,
         [lokacija.koordinate, lokacija.imeLokacije, lokacija.opis, lokacija.foto, lokacija.idKartograf]);

        await db.query(`INSERT INTO karta (koordinate, snaga) VALUES ($1, $2)`, [lokacija.koordinate, lokacija.snaga]);

        return result.rows[0].koordinate;
    } catch (err) {
        console.log(err);
        throw err
    }
}

//Izmjena podataka o lokaciji u bazi podataka
dbUpdateLokacija = async(changeKoordinate, newimeLokacije, newOpis, newSnaga, newFoto, newIdKartograf) => {
    try {
        //Izmjena relacije Lokacija
        await db.query(`UPDATE lokacija SET (imelokacije, opis, foto, idkartograf) = ($1, $2, $3, $4)
        WHERE koordinate = $5`, 
        [newimeLokacije, newOpis, newFoto, newIdKartograf, changeKoordinate]);

        //izmjena snage u relaciji Karta
        await db.query(`UPDATE karta SET snaga = $1 
        WHERE koordinate = $2`, [newSnaga, changeKoordinate]);

    }catch (err) {
        console.log(err);
        throw err
    }
}