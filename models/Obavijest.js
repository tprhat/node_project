const db = require('../db');

module.exports = class Obavijest {

    constructor(tekst, vrijeme) {
        this.idObavijest = undefined;
        this.tekst = tekst;
        this.vrijeme = vrijeme;
    }

    static async fetchByIdObavijest(idObavijest) {
       
        let result = await dbGetObavijestById(idObavijest)
        let newObavijest = new Obavijest();

        if (result.length > 0) {
            newObavijest = new Obavijest(result[0].tekst, result[0].vrijeme);
            newObavijest.idObavijest = result[0].idObavijest;  
        }

        return newObavijest;
    }

    static async getAllObavijesti() {
        let result = await dbGetObavijesti();

        if (result.length > 0) {
            let newObavijest;
            let tmp, vrijemeFormat;
            let arrayObavijesti = new Array(result.length);
                for (let i = 0; i < result.length; i++) {
                    tmp = String(result[i].vrijeme);
                    vrijemeFormat = tmp.substring(0, tmp.lastIndexOf("GMT") - 1);
                    newObavijest = new Obavijest(result[i].tekst, vrijemeFormat);
                    newObavijest.idObavijest = result[i].idobavijest;
                    arrayObavijesti[i] = newObavijest;
                }
        return arrayObavijesti;

        }else {
            return null
        }
    }

    async persist() {
        try {
            let obID = await dbNewObavijest(this);
            this.idObavijest = obID;
        } catch(err) {
            console.log("ERROR persisting user data: " + JSON.stringify(this))
            throw err
        }
    }

}

//dohvat obavijesti iz baze podataka na osnovu id obavijesti (stupac idObavijest)
dbGetObavijestById = async (idObavijest) => {
    try {
        const result = await db.query(`SELECT idObavijest, tekst, vrijeme
        FROM obavijest WHERE idobavijest = $1`, [idObavijest]);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbGetObavijesti = async () => {
    try {
        const result = await db.query(`SELECT idObavijest, tekst, vrijeme
        FROM obavijest`, []);
        return result.rows.reverse();
    } catch (err) {
        console.log(err);
        throw err
    }
}

//umetanje zapisa o obavijesti u bazu podataka
dbNewObavijest = async (obavijest) => {
    try {
        const result = await db.query(`INSERT INTO Obavijest (tekst, vrijeme) VALUES ($1, $2) RETURNING idobavijest`,
         [obavijest.tekst, obavijest.vrijeme]);

        return result.rows[0].idobavijest;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbUpdateObavijest = async(changeId, newTekst, newVrijeme) => {
    try {
        await db.query(`UPDATE obavijest SET (tekst, vrijeme) = ($1, $2)
        WHERE idobavijest = $3`, 
        [newTekst, newVrijeme, changeId]);

    }catch (err) {
        console.log(err);
        throw err
    }
}