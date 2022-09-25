const db = require('../db');

module.exports = class TijekBorbe {

    constructor(idIzazivac, idIzazvan, ukupnaSnaga, idBorba) {
        this.idIzazivac = idIzazivac;
        this.idIzazvan = idIzazvan;
        this.ukupnaSnaga = ukupnaSnaga;
        this.idBorba = idBorba;
    }

    //Dohvaca borbu po id-u
    static async fetchByIdIzazivac(idIzazivac) {
        let result = await dbGetTijekBorbeByIdIzazivac(idIzazivac);

        if (result.length > 0) {
            let newTijekBorbe;
            let arrayTijekBorbe = new Array(result.length);
                for (let i = 0; i < result.length; i++) {
                    newTijekBorbe = new TijekBorbe(result[i].idizazivac, result[i].idizazvan, result[i].ukupnasnaga, result[i].idborba);
                    newTijekBorbe.idDvoboj = result[i].iddvoboj;
                    arrayTijekBorbe[i] = newTijekBorbe;
                }
        return arrayTijekBorbe;

        }else {
            return null;
        }
    }

    static async fetchDovrseni(idIzazivac) {
        let result = await dbGetDovrseniTijekBorbe(idIzazivac);

        if (result.length > 0) {
            let newTijekBorbe;
            let arrayTijekBorbe = new Array(result.length);
                for (let i = 0; i < result.length; i++) {
                    newTijekBorbe = new TijekBorbe(result[i].idizazivac, result[i].idizazvan, result[i].ukupnasnaga, result[i].idborba);
                    newTijekBorbe.idDvoboj = result[i].iddvoboj;
                    arrayTijekBorbe[i] = newTijekBorbe;
                }
        return arrayTijekBorbe;

        }else {
            return null;
        }
    }

    static async fetchByIdIzazvan(idIzazvan) {
        let result = await dbGetTijekBorbeByIdIzazvan(idIzazvan);

        if (result.length > 0) {
            let newTijekBorbe;
            let arrayTijekBorbe = new Array(result.length);
                for (let i = 0; i < result.length; i++) {
                    newTijekBorbe = new TijekBorbe(result[i].idizazivac, result[i].idizazvan, result[i].ukupnasnaga, result[i].idborba);
                    newTijekBorbe.idDvoboj = result[i].iddvoboj;
                    arrayTijekBorbe[i] = newTijekBorbe;
                }
        return arrayTijekBorbe;

        }else {
            return null;
        }
    }

    static async setIdBorba(idDvoboj, idBorba) {
        try {
            await dbUpdateTijekBorbe(idDvoboj, idBorba)
        }catch(err) {
            console.log("ERROR persisting user data: " + JSON.stringify(this))
            throw err;
        }
    }

    async persist() {
        try {
            let tijekID = await dbNewTijekBorbe(this)
            this.idDvoboj = tijekID;
        } catch(err) {
            console.log("ERROR persisting user data: " + JSON.stringify(this))
            throw err
        }
    }

    async deleteFromDB() {
        try {
            await dbDeleteTijekBorbe(this.idDvoboj)
        } catch(err) {
            console.log("ERROR deleting data: " + JSON.stringify(this))
            throw err
        }
    }


}


//dohvat igraca iz baze podataka na osnovu id korisnika (stupac idKorisnik)
dbGetTijekBorbeByIdIzazivac = async (idIzazivac) => {
    try {
        const result = await db.query(`SELECT iddvoboj, idizazivac, idizazvan, ukupnasnaga, idborba
        FROM borbautijeku WHERE idizazivac = $1 AND idBorba IS NULL`, [idIzazivac]);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbGetDovrseniTijekBorbe = async (idIzazivac) => {
    try {
        const result = await db.query(`SELECT iddvoboj, idizazivac, idizazvan, ukupnasnaga, idborba
        FROM borbautijeku WHERE idizazivac = $1 AND idBorba IS NOT NULL`, [idIzazivac]);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbGetTijekBorbeByIdIzazvan = async (idIzazvan) => {
    try {
        const result = await db.query(`SELECT iddvoboj, idizazivac, idizazvan, ukupnasnaga, idborba
        FROM borbautijeku WHERE idizazvan = $1 AND idBorba IS NULL`, [idIzazvan]);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}


//umetanje zapisa o igracu u bazu podataka
dbNewTijekBorbe = async (tijekBorbe) => {
    try {
        const result = await db.query(`INSERT INTO borbautijeku (idizazivac, idizazvan, ukupnasnaga, idborba) 
        VALUES ($1, $2, $3, $4) RETURNING iddvoboj`,
         [tijekBorbe.idIzazivac, tijekBorbe.idIzazvan, tijekBorbe.ukupnaSnaga, tijekBorbe.idBorba]);
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbUpdateTijekBorbe = async (idDvoboj, idBorba) => {
    try {
        const result = await db.query(`UPDATE borbautijeku SET idBorba = $1
        WHERE idDvoboj = $2`,
         [idBorba, idDvoboj]);
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbDeleteTijekBorbe = async (idDvoboj) => {
    try {
        const result = await db.query(`DELETE FROM borbautijeku WHERE iddvoboj = $1`,
         [idDvoboj]);
    } catch (err) {
        console.log(err);
        throw err
    }
}