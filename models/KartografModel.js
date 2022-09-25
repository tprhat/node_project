const db = require('../db');
const Korisnik = require('./KorisnikModel');


module.exports = class Kartograf extends Korisnik {

    constructor(username, email, password, photo, aktivan, idAdministrator, iban, fotoOsobne) {
        super(username, email, password, photo, aktivan, "kartograf");
        this.idAdministrator = idAdministrator;
        this.iban = iban;
        this.fotoOsobne = fotoOsobne;
    }

    static async fetchByEmail(email) {

        let result = await dbGetKartografByEmail(email);
        let newUser = new Kartograf();

        if (result.length > 0) {
            newUser = new Kartograf(result[0].username, result[0].email, result[0].password, result[0].foto, result[0].aktivan,
                result[0].idadministrator, result[0].iban, result[0].fotoosobne);
            newUser.idKorisnik = result[0].idkorisnik;  
        }

        return newUser;
    }

    static async fetchByUsername(username) {

        let result = await dbGetKartografByUsername(username);
        let newUser = new Kartograf();

        if (result.length > 0) {
            newUser = new Kartograf(result[0].username, result[0].email, result[0].password, result[0].foto, result[0].aktivan,
                result[0].idadministrator, result[0].iban, result[0].fotoosobne);
            newUser.idKorisnik = result[0].idkorisnik;  
        }

        return newUser;
    }

    static async fetchByUserId(idKorisnik) {
       
        let result = await dbGetKartografById(idKorisnik)
        let newUser = new Kartograf()

        if (result.length > 0) {
            newUser = new Kartograf(result[0].username, result[0].email, result[0].password, result[0].foto, result[0].aktivan,
                result[0].idadministrator, result[0].iban, result[0].fotoosobne);
            newUser.idKorisnik = result[0].idkorisnik;  
        }

        return newUser;
    }

    //bez uvjeta vraća sve, sa uvjetom vraća samo unchecked
    static async fetchKartografs(condition) {
        try {
            let result;
            if(condition == undefined){
                result = await dbGetAllKartografs();
               }
               else{
                result = await dbGetAllUncheckedKartografs();
               }
               let newUser;
               let ArrayKartografs = new Array(result.length);
                for (let i = 0; i < result.length; i++) {
                    newUser = new Kartograf(result[i].username, result[i].email, result[i].password, result[i].foto, result[i].aktivan,
                        result[i].idadministrator, result[i].iban, result[i].fotoosobne);
                    newUser.idKorisnik = result[i].idkorisnik;
                    ArrayKartografs[i] = newUser;
                }
                return ArrayKartografs;
            
        } catch (error) {
            console.log(error)
            throw err
        }
       
    }

    async setIdAdministrator(newidAdministrator) {
        await dbUpdateKartograf(this.idKorisnik, newidAdministrator, this.iban, this.fotoOsobne);
        this.idAdministrator = newidAdministrator;
    }

    async setIban(newIban) {
        await dbUpdateKartograf(this.idKorisnik, this.idAdministrator, newIban, this.fotoOsobne);
        this.iban = newIban;
    }

    async setFotoOsobne(newFotoOsobne) {
        await dbUpdateKartograf(this.idKorisnik, this.idAdministrator, this.iban, newFotoOsobne);
        this.fotoOsobne = newFotoOsobne;
    }

    static async setNewValues(newId, newidAdministrator, newIban, newFotoOsobne) {
        await dbUpdateKartograf(newId, newidAdministrator, newIban, newFotoOsobne);
    }


    isPersisted(){
        return this.idKorisnik;
    }
    checkPassword(password){
        return this.password ? this.password == password : false
    }

    async persist() {
        try {
            let userID = await dbNewKartograf(this)
            this.idKorisnik = userID
        } catch(err) {
            console.log("ERROR persisting user data: " + JSON.stringify(this))
            throw err
        }
    }


}

//dohvat Kartografa iz baze podataka na osnovu email-a(stupac email)
dbGetKartografByEmail = async (email) => {
    try {
        const result = await db.query(`SELECT idkorisnik, username, email, password, foto, aktivan, role, idAdministrator, iban, fotoOsobne
        FROM korisnik NATURAL JOIN kartograf WHERE email = $1`, [email]);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

//dohvat svih kartografa iz baze
dbGetAllKartografs = async () => {
    try {
        const result = await db.query(`SELECT idkorisnik, username, email, password, foto, aktivan, role, idAdministrator, iban, fotoOsobne
        FROM korisnik NATURAL JOIN kartograf
        ORDER BY idkorisnik`);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

dbGetAllUncheckedKartografs = async () => {
    try {
        const result = await db.query(`SELECT idkorisnik, username, email, password, foto, aktivan, role, idAdministrator, iban, fotoOsobne
        FROM korisnik NATURAL JOIN kartograf WHERE idAdministrator IS NULL
        ORDER BY idkorisnik`);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

//dohvat Kartografa iz baze podataka na osnovu username-a(stupac username)
dbGetKartografByUsername = async (username) => {
    try {
        const result = await db.query(`SELECT idkorisnik, username, email, password, foto, aktivan, role, idAdministrator, iban, fotoOsobne
        FROM korisnik NATURAL JOIN kartograf WHERE username = $1`, [username]);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

//dohvat Kartografa iz baze podataka na osnovu id korisnika (stupac idKorisnik)
dbGetKartografById = async (idKorisnik) => {
    try {
        const result = await db.query(`SELECT idkorisnik, username, email, password, foto, aktivan, role, idAdministrator, iban, fotoOsobne
        FROM korisnik NATURAL JOIN kartograf WHERE idkorisnik = $1`, [idKorisnik]);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

//sredi upisivanje uloge
//umetanje zapisa o kartografu u bazu podataka
dbNewKartograf = async (kartograf) => {
    try {
        const result = await db.query(`INSERT INTO Korisnik (username, email, password, foto, aktivan, role) VALUES
        ($1, $2, $3, $4, $5, $6) RETURNING idkorisnik`,
         [kartograf.username, kartograf.email, kartograf.password, kartograf.foto, kartograf.aktivan, kartograf.role]);

        await db.query(`INSERT INTO Kartograf (idKorisnik, iban, fotoOsobne) VALUES ($1, $2, $3)`, 
        [result.rows[0].idkorisnik, kartograf.iban, kartograf.fotoOsobne]);

        return result.rows[0].idkorisnik;
    } catch (err) {
        console.log(err);
        throw err
    }
}

//Update Kartografa
dbUpdateKartograf = async(changeId, newidAdministrator, newIban, newFotoOsobne) => {
    try {
        await db.query(`UPDATE kartograf SET (idAdministrator, IBAN, fotoOsobne) = ($1, $2, $3)
            WHERE idkorisnik = $4;`, 
            [newidAdministrator, newIban, newFotoOsobne, changeId]);

    }catch (err) {
        console.log(err);
        throw err
    }
}