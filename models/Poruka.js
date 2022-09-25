const db = require('../db');

module.exports = class Poruka {

    constructor(tekst, vrijeme, posiljatelj, primatelj) {
        this.idPoruka = null;
        this.tekst = tekst;
        this.vrijeme = vrijeme;
        this.idKorisnikPos = posiljatelj;
        this.idKorisnikPrim = primatelj;
    }

    static async fetchByIdPoruka(idPoruka) {
       
        let result = await dbGetPorukaById(idPoruka)
        let newPoruka = new Poruka()

        if (result.length > 0) {
            newPoruka = new Poruka(result[0].tekst, result[0].vrijeme, result[0].idkorisnikposiljatelj, result[0].idkorisnikprimatelj);
            newPoruka.idPoruka = result[0].idPoruka;  
        }

        return newPoruka;
    }

    // Treba napisati funkciju fetchByPosiljatelj ili nesto slicno kako bi se moglo efikasno raditi s porukama

    async persist() {
        try {
            let porID = await dbNewPoruka(this);
            this.idPoruka = porID;
        } catch(err) {
            console.log("ERROR persisting user data: " + JSON.stringify(this))
            throw err
        }
    }

}

//dohvat poruke iz baze podataka na osnovu id poruke (stupac idPoruka)
dbGetPorukaById = async (idPoruka) => {
    try {
        const result = await db.query(`SELECT idporuka, tekst, vrijeme, idkorisnikposiljatelj, idkorisnikprimatelj
        FROM poruka WHERE idporuka = $1`, [idPoruka]);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

//umetanje zapisa o poruci u bazu podataka
dbNewPoruka = async (poruka) => {
    try {
        const result = await db.query(`INSERT INTO poruka (tekst, vrijeme, idkorisnikposiljatelj, idkorisnikprimatelj)
         VALUES ($1, $2, $3, $4) RETURNING idporuka`,
         [poruka.tekst, poruka.vrijeme, poruka.idKorisnikPos, poruka.idKorisnikPrim]);

        return result.rows[0].idporuka;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbUpdatePoruka = async(changeId, newTekst, newVrijeme) => {
    try {
        await db.query(`UPDATE poruka SET (tekst, vrijeme) = ($1, $2)
        WHERE idporuka = $3`, 
        [newTekst, newVrijeme, changeId]);

    }catch (err) {
        console.log(err);
        throw err
    }
}