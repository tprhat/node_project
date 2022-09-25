const db = require('../db');
const Korisnik = require('./KorisnikModel');


module.exports = class Administrator extends Korisnik {

    constructor(username, email, password, photo, aktivan) {
        super(username, email, password, photo, aktivan, "administrator");
    }

    static async fetchByEmail(email) {

        let result = await dbGetAdministratorByEmail(email);
        let newUser = new Administrator();

        if (result.length > 0) {
            newUser = new Administrator(result[0].username, result[0].email, result[0].password, result[0].foto, result[0].aktivan);
            newUser.idKorisnik = result[0].idkorisnik;  
        }

        return newUser;
    }

    static async fetchByUsername(username) {

        let result = await dbGetAdministratorByUsername(username);
        let newUser = new Administrator();

        if (result.length > 0) {
            newUser = new Administrator(result[0].username, result[0].email, result[0].password, result[0].foto, result[0].aktivan);
            newUser.idKorisnik = result[0].idkorisnik;  
        }

        return newUser;
    }

    static async fetchByUserId(idKorisnik) {
       
        let result = await dbGetAdministratorById(idKorisnik)
        let newUser = new Administrator()

        if (result.length > 0) {
            newUser = new Administrator(result[0].username, result[0].email, result[0].password, result[0].foto, result[0].aktivan);
            newUser.idKorisnik = result[0].idkorisnik;  
        }

        return newUser;
    }

    isPersisted(){
        return this.idKorisnik;
    }
    checkPassword(password){
        return this.password ? this.password == password : false
    }

    async persist() {
        try {
            let userID = await dbNewAdministrator(this)
            this.idKorisnik = userID
        } catch(err) {
            console.log("ERROR persisting user data: " + JSON.stringify(this))
            throw err
        }
    }


}

//dohvat administratora iz baze podataka na osnovu email-a(stupac email)
dbGetAdministratorByEmail = async (email) => {
    try {
        const result = await db.query(`SELECT idkorisnik, username, email, password, foto, aktivan
        FROM korisnik NATURAL JOIN administrator WHERE email = $1`, [email]);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

//dohvat administratora iz baze podataka na osnovu username-a (stupac username)
dbGetAdministratorByUsername = async (username) => {
    try {
        const result = await db.query(`SELECT idkorisnik, username, email, password, foto, aktivan
        FROM korisnik NATURAL JOIN administrator WHERE username = $1`, [username]);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

//dohvat administratoru iz baze podataka na osnovu id korisnika (stupac idKorisnik)
dbGetAdministratorById = async (idKorisnik) => {
    try {
        const result = await db.query(`SELECT idkorisnik, username, email, password, foto, aktivan
        FROM korisnik NATURAL JOIN administrator WHERE idkorisnik = $1`, [idKorisnik]);

        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

//umetanje zapisa o administratoru u bazu podataka
dbNewAdministrator = async (administrator) => {
    try {
        const result = await db.query(`INSERT INTO Korisnik (username, email, password, foto, aktivan) VALUES
        ($1, $2, $3, $4, $5, $6) RETURNING idkorisnik`,
         [administrator.username, administrator.email, administrator.password, administrator.foto, administrator.aktivan]);

        await db.query(`INSERT INTO Administrator (idkorisnik) VALUES ($1)`, 
        [result.rows[0].idkorisnik]);

        return result.rows[0].idkorisnik;
    } catch (err) {
        console.log(err);
        throw err
    }
}
