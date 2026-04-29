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
const LOGS_DB = "logs"
const PRODUCTS_DB = "products"
const PRODUCT_IMAGES_KEY = "images"

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
            let db = await this.#openConnection()
            return await db.collection(database).findOne({_id: new ObjectId(id)})
        }
        catch (e){
            return null
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
    //TODO: Try/catch in findUserByUID and findAdminByUID is probably unnecessary
    static async findUserByUID(UID){
        try{
            return this.#findByID(USERS_DB, UID)
        }
        catch (e){
            return null
        }
    }
    static async findAdminByUID(UID){
        try{
            return this.#findByID(ADMINS_DB, UID)
        }
        catch (e){
            return null
        }
    }
    static async log(level, service, message, context){
        await this.#addToCollection(LOGS_DB,{
            timestamp: new Date(),
            level,
            service,
            message,
            context
        })
    }
    static async #updateItem(collection, id, newData, keepConnectionAlive){
        let result = null
        let db = null
        try {
            db = await this.#openConnection()
            await db.collection(collection).updateOne(
                {_id: new ObjectId(id)},
                { $set: newData }
            )
            result = true
        }
        catch (e){
            result = false
        }
        finally {
            if(!keepConnectionAlive || !(keepConnectionAlive === true)) {
                await this.#closeConnection()
                return result
            }
            else return db
        }
    }
    static async updateUser(UID, newData){
        return await this.#updateItem(USERS_DB, UID, newData)
    }
    static async addProduct(product){
        await this.#addToCollection(PRODUCTS_DB, product)
    }
    static async #updateItemsInsideItem(collection, id, key, newData, db){
        try {
          if(!db) db = await this.#openConnection()
            let temp = {}
            for (let internalKey in newData) {
                temp[key+"."+internalKey] = newData[internalKey]
            }
            await db.collection(collection).updateOne(
                {_id: new ObjectId(id)},
                { $set: temp }
            )
            return true
        }
        catch (e){
            return false
        }
        finally {
            await this.#closeConnection()
        }
    }
    static async updateProduct(ID, newData, newImages){
        let db = null
        if(newData) db = await this.#updateItem(PRODUCTS_DB, ID, newData, true)
        if((db && newImages) || !newData){
            let result = await this.#updateItemsInsideItem(PRODUCTS_DB, ID, PRODUCT_IMAGES_KEY, newImages, db)
            if(result) return true
        }
        else if(!newImages) return true
        return false
    }
    static async findProductByID(ID){
        return this.#findByID(PRODUCTS_DB, ID)
    }
}

module.exports = DbManager
