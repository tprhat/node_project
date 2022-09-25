const db = require('../db');


module.exports = class Korisnik {

    constructor(username, email, password, foto, aktivan, role) {
        this.idKorisnik = undefined;
        this.username = username;
        this.password = password;
        this.email = email;
        this.foto = foto;
        this.aktivan = aktivan;
        this.role = role
    }
    
    static async fetchByEmail(email) {

        let result = await dbGetUserByEmail(email);
        let newUser = new Korisnik();

        if (result.length > 0) {
            newUser = new Korisnik(result[0].username, result[0].email, result[0].password, result[0].foto, result[0].aktivan, result[0].role);
            newUser.idKorisnik = result[0].idkorisnik;  
        }

        return newUser;
    }

    static async fetchByUsername(username) {

        let result = await dbGetUserByUsername(username);
        let newUser = new Korisnik();

        if (result.length > 0) {
            newUser = new Korisnik(result[0].username, result[0].email, result[0].password, result[0].foto, result[0].aktivan, result[0].role);
            newUser.idKorisnik = result[0].idkorisnik;  
        }

        return newUser;
    }

    static async fetchByUserId(idKorisnik) {
       
        let result = await dbGetUserById(idKorisnik)
        let newUser = new Korisnik()

        if (result.length > 0) {
            newUser = new Korisnik(result[0].username, result[0].email, result[0].password, result[0].foto, result[0].aktivan, result[0].role);
            newUser.idKorisnik = result[0].idkorisnik;  
        }

        return newUser;
    }

    async changeUsername(newUsername) {
        await dbUpdateUser(this.idKorisnik, this.email, newUsername, this.password, this.foto, this.aktivan);
        this.username = newUsername;
    }
    
    async changePassword(newPassword) {
        await dbUpdateUser(this.idKorisnik, this.email, this.username, newPassword, this.foto, this.aktivan);
        this.password = newPassword;
    }

    async changeFoto(newFoto) {
        await dbUpdateUser(this.idKorisnik, this.email, this.username, this.password, newFoto, this.aktivan);
        this.foto = newFoto;
    }

    async changeAktivan(newAktivan) {
        await dbUpdateUser(this.idKorisnik, this.email, this.username, this.password, this.foto, newAktivan);
        this.aktivan = newAktivan;
    }

    async changeEmail(newEmail) {
        await dbUpdateUser(this.idKorisnik, newEmail, this.username, this.password, this.foto, this.aktivan);
        this.email = newEmail;
    }

    static async setNewValues(newId, newEmail, newUsername, newPassword, newFoto, newAktivan) {
        await dbUpdateUser(newId, newEmail, newUsername, newPassword, newFoto, newAktivan);
    }

    isPersisted(){
        return this.idKorisnik;
    }
    checkPassword(password){
        return this.password ? this.password == password : false
    }


}

//dohvat korisnika iz baze podataka na osnovu email-a(stupac email)
dbGetUserByEmail = async (email) => {
    try {
        const result = await db.query(`SELECT idKorisnik, username, email, password, foto, aktivan, role
        FROM korisnik WHERE email = $1`, [email]);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};



//dohvat korisnika iz baze podataka na osnovu Username-a (stupac username)
dbGetUserByUsername = async (username) => {
    try {
        const result = await db.query(`SELECT idKorisnik, username, email, password, foto, aktivan, role
        FROM korisnik WHERE username = $1`, [username]);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

//dohvat korisnika iz baze podataka na osnovu id korisnika (stupac idKorisnik)
dbGetUserById = async (idKorisnik) => {
    try {
        const result = await db.query(`SELECT idKorisnik, username, email, password, foto, aktivan, role
        FROM korisnik WHERE idkorisnik = $1`, [idKorisnik]);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

//umetanje zapisa o korisniku u bazu podataka
//Ne bi trebala postojati funkcija newUser vec samo newIgrac, newAdministrator, newKartograf
dbNewUser = async (user) => {
    try {
        const result = await db.query(`INSERT INTO Korisnik (username, email, password, foto, aktivan, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING idkorisnik`,
         [user.username, user.email, user.password, user.foto, user.aktivan, user.role]);

        return result.rows[0].idkorisnik;
    } catch (err) {
        console.log(err);
        throw err
    }
}

//Postavlja korisniku s idKorisnik = changeId svojstva na svojstva od korisnika user
dbUpdateUser = async(changeId, newEmail, newUsername, newPassword, newFoto, newAktivan) => {
    try {
        await db.query(`UPDATE korisnik SET (username, email, password, foto, aktivan) = ($1, $2, $3, $4, $5)
        WHERE idkorisnik = $6`, 
        [newUsername, newEmail, newPassword, newFoto, newAktivan, changeId]);

    }catch (err) {
        console.log(err);
        throw err
    }
}