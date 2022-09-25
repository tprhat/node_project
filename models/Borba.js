const db = require('../db');


module.exports = class Borba {

    constructor(idIgracPobjednik, idIgracGubitnik, vrijeme) {
        this.idIgracGubitnik = idIgracGubitnik;
        this.idIgracPobjednik = idIgracPobjednik;
        if(vrijeme != undefined) {
            this.vrijeme = vrijeme;
        }else {
            this.vrijeme = null;
        }
    }

    //Dohvaca borbu po id-u
    static async fetchByIdBorba(idBorba) {

        let result = await dbGetBorbaById(idBorba);
        let newBorba = new Borba();
        let tmp, vrijemeFormat;

        if (result.length > 0) {
            tmp = String(result[0].vrijeme);
            vrijemeFormat = tmp.substring(0, tmp.lastIndexOf("GMT") - 1);
            newBorba = new Borba(result[0].idigracpobjednik, result[0].idigracgubitnik, vrijemeFormat);
            newBorba.idBorba = result[0].idborba;  
        }

        return newBorba;
    }

    //Dohvaca sve borbe korisnika
    static async fetchByidKorisnik(idKorisnik) {
       
        let result = await dbGetBorbaByIdKorisnik(idKorisnik);

        if (result.length > 0) {
            let newBorba;
            let tmp, vrijemeFormat;
            let arrayBorbe = new Array(result.length);
                for (let i = 0; i < result.length; i++) {
                    tmp = String(result[i].vrijeme);
                    vrijemeFormat = tmp.substring(0, tmp.lastIndexOf("GMT") - 1);
                    newBorba = new Borba(result[i].idigracpobjednik, result[i].idigracgubitnik, vrijemeFormat);
                    newBorba.idBorba = result[i].idborba;
                    arrayBorbe[i] = newBorba;
                }
        return arrayBorbe;

        }else {
            return null
        }
    }

    //Dohvaca sve borbe u kojima je idKorisnik pobijedio
    static async fetchByIdPobjednik(idKorisnik) {
        let result = await dbGetBorbaByIdPobjednik(idKorisnik);
        let tmp, vrijemeFormat;
        if (result.length > 0) {
            let newBorba;
            let arrayBorbe = new Array(result.length);
                for (let i = 0; i < result.length; i++) {
                    tmp = String(result[i].vrijeme);
                    vrijemeFormat = tmp.substring(0, tmp.lastIndexOf("GMT") - 1);
                    newBorba = new Borba(result[i].idigracpobjednik, result[i].idigracgubitnik, vrijemeFormat);
                    newBorba.idBorba = result[i].idborba;
                    arrayBorbe[i] = newBorba;
                }
        return arrayBorbe;
        }
    }

    isPersisted(){
        return this.idBorba;
    }

    async persist() {
        try {
            let borbaID = await dbNewBorba(this)
            this.idBorba = borbaID;
        } catch(err) {
            console.log("ERROR persisting user data: " + JSON.stringify(this))
            throw err
        }
    }


}


//dohvat igraca iz baze podataka na osnovu id korisnika (stupac idKorisnik)
dbGetBorbaById = async (idBorba) => {
    try {
        const result = await db.query(`SELECT idborba, idigracpobjednik, idigracgubitnik, vrijeme
        FROM borba WHERE idborba = $1`, [idBorba]);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbGetBorbaByIdKorisnik = async (idIgrac) => {
    try {
        const result = await db.query(`SELECT idborba, idigracpobjednik, idigracgubitnik, vrijeme
         FROM borba WHERE idigracpobjednik = $1 OR idigracgubitnik = $1
         ORDER BY vrijeme DESC`, [idIgrac]);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbGetBorbaByIdPobjednik = async (idIgrac) => {
    try {
        const result = await db.query(`SELECT idborba, idigracpobjednik, idigracgubitnik, vrijeme
         FROM borba WHERE idigracpobjednik = $1`, [idIgrac]);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbGetBorbaByIdGubitnik = async (idIgrac) => {
    try {
        const result = await db.query(`SELECT idborba, idigracpobjednik, idigracgubitnik, vrijeme
         FROM borba WHERE idigracgubitnik = $1`, [idIgrac]);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

//umetanje zapisa o igracu u bazu podataka
dbNewBorba = async (borba) => {
    try {
        const result = await db.query(`INSERT INTO borba (idigracpobjednik, idigracgubitnik, vrijeme) 
        VALUES ($1, $2, $3) RETURNING idborba`,
         [borba.idIgracPobjednik, borba.idIgracGubitnik, borba.vrijeme]);

        return result.rows[0].idborba;
    } catch (err) {
        console.log(err);
        throw err
    }
}

//Update Borbe
dbUpdateBorba = async(changeId, newIgracPobjednik, newIgracGubitnik, newVrijeme) => {
    try {
        await db.query(`UPDATE borba SET (idigracpobjednik, idigracgubitnik, vrijeme) = ($1, $2, $3)
        WHERE idborba = $4;`, [newIgracPobjednik, newIgracGubitnik, newVrijeme, changeId]);

    }catch (err) {
        console.log(err);
        throw err
    }
}