require('dotenv').config();

//For some ungodly reason, this is required (at least locally) to use MongoDB Atlas
const dns = require("dns");
dns.setServers(["1.1.1.1"]);

const { MongoClient, ServerApiVersion, Db, ObjectId} = require('mongodb');
const uri = process.env.DB_HOST || "mongodb://localhost";
if(!process.env.DB_HOST){
    console.log("Using local MongoDB instance")
}
else console.log("Using MongoDB instance supplied by environment variable")
const USERS_DB = "users"
const ADMINS_DB = "admins"

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

class DbManager{
    static async #openConnection() {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        return client.db("marketplace");
    }
    static async #closeConnection(){
        await client.close();
    }
    static async #addToCollection(collection, object){
        try {
            let db = await this.#openConnection()
            await db.collection(collection).insertOne(object, function(err, res) {
                if (err) throw err;
            });
            console.log("1 document inserted");
        }
        finally {
            await this.#closeConnection()
        }
    }
    static async addUser(user){
        await this.#addToCollection(USERS_DB, user)
    }
    static async addAdmin(user){
        await this.#addToCollection(ADMINS_DB, user)
    }
    static async #findInDb(database, query){
        try {
            let db = await this.#openConnection()
            return await db.collection(database).find(query).toArray()
        }
        finally {
            await this.#closeConnection()
        }
    }
    static async #findOneInDb(database, query){
        try {
            let db = await this.#openConnection()
            return await db.collection(database).findOne(query)
        }
        finally {
            await this.#closeConnection()
        }
    }
    static async #findByID(database, id){
        try {
            console.log(id)
            let db = await this.#openConnection()
            return await db.collection(database).findOne({_id: new ObjectId(id)})
        }
        finally {
            await this.#closeConnection()
        }
    }
    static async findUser(query){
        try{
            return this.#findOneInDb(USERS_DB, query)
        }
        catch (e){
            return null
        }
    }
    static async findAdmin(query){
        try{
            return this.#findOneInDb(ADMINS_DB, query)
        }
        catch (e){
            return null
        }
    }
    static async findUserByUID(UID){
        try{
            return this.#findByID(USERS_DB, UID)
        }
        catch (e){
            return null
        }
    }
}

module.exports = DbManager
