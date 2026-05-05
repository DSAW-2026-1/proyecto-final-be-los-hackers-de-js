require('dotenv').config();

//For some ungodly reason, this is required (at least locally) to use MongoDB Atlas
const dns = require("dns");
dns.setServers(["1.1.1.1"]);

const { MongoClient, ServerApiVersion, Db, ObjectId} = require('mongodb');
const uri = process.env.MONGODB_URI || "mongodb://localhost";
if(!process.env.DB_HOST){
    console.log("Using local MongoDB instance")
}
else console.log("Using MongoDB instance supplied by environment variable")
const USERS_DB = "users"
const ADMINS_DB = "admins"
const LOGS_DB = "logs"
const PRODUCTS_DB = "products"
const PRODUCT_IMAGES_KEY = "images"
const MAIN_DB = "marketplace"
const ORDERS_DB = "orders"

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

class DbManager{
    /*static async #openConnection() {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        return client.db("marketplace");
    }*/
    
    static async #closeConnection(){
        await client.close();
    }
    static async #addToCollection(collection, object){
        //let db = await this.#openConnection()
        await client.db(MAIN_DB).collection(collection).insertOne(object, function(err, res) {
            if (err) throw err;
        });
        console.log("1 document inserted");
    }
    static async addUser(user){
        await this.#addToCollection(USERS_DB, user)
    }
    static async addAdmin(user){
        await this.#addToCollection(ADMINS_DB, user)
    }
    static async #findInDb(database, query){
        //let db = await this.#openConnection()
        return await client.db(MAIN_DB).collection(database).find(query).toArray()
    }
    static async #findOneInDb(database, query){
        //let db = await this.#openConnection()
        return await client.db(MAIN_DB).collection(database).findOne(query)

    }
    static async #findByID(database, id){
        try {
            //let db = await this.#openConnection()
            return await client.db(MAIN_DB).collection(database).findOne({_id: new ObjectId(id)})
        }
        catch (e){
            return null
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
    static async #updateItem(collection, id, newData){
        try {
            await client.db(MAIN_DB).collection(collection).updateOne(
                {_id: new ObjectId(id)},
                { $set: newData }
            )
            return true
        }
        catch (e){
            return false
        }
    }
    static async #appendToArrays(collection, id, newData){
        try {
            await client.db(MAIN_DB).collection(collection).updateOne(
                {_id: new ObjectId(id)},
                { $push: newData }
            )
            return true
        }
        catch (e){
            return false
        }
    }
    static async updateUser(UID, newData){
        return await this.#updateItem(USERS_DB, UID, newData)
    }
    static async addProduct(product){
        await this.#addToCollection(PRODUCTS_DB, product)
    }
    static async #updateItemsInsideItem(collection, id, key, newData){
        try {
            let temp = {}
            for (let internalKey in newData) {
                temp[key+"."+internalKey] = newData[internalKey]
            }
            await client.db(MAIN_DB).collection(collection).updateOne(
                {_id: new ObjectId(id)},
                { $set: temp }
            )
            return true
        }
        catch (e){
            return false
        }
    }
    static async updateProduct(ID, newData, newImages){
        if(await this.#isSoftDeleted(PRODUCTS_DB, ID)) return false
        else {
            let success = null
            if (newData) success = await this.#updateItem(PRODUCTS_DB, ID, newData)
            if ((success && newImages) || !newData) {
                let result = await this.#updateItemsInsideItem(PRODUCTS_DB, ID, PRODUCT_IMAGES_KEY, newImages)
                if (result) return true
            } else if (!newImages) return true
            return false
        }
    }
    static async findProductByID(ID){
        const item =  await this.#findByID(PRODUCTS_DB, ID)
        if(!item) return null
        return (!(item.deleted)) ? item : null
    }
    static async softDeleteProduct(ID) {
        await this.#updateItem(PRODUCTS_DB, ID, { deleted: true })
    }
    static async #isSoftDeleted(collection, id){
        const item = await this.#findByID(collection, id)
        if(!item) return true //Technically not the case but makes sure stuff doesn't explode and lets the caller know the item is 'deleted' in some way
        return item.deleted || false
    }
    static async findAllProducts(query){
        try{
            return this.#findInDb(PRODUCTS_DB, query)
        }
        catch (e){
            return null
        }
    }
    static async #findLimitedInDb(database, query, page, limit){
        //let db = await this.#openConnection()
        const result = await client.db(MAIN_DB).collection(database).find(query)
            .skip(page * limit)
            .limit(limit)
        const count = await client.db(MAIN_DB).collection(database).countDocuments(query)
        return {
            result: await result.toArray(),
            count: count
        }
    }
    static async findProducts(query, page, limit){
        try{
            query["deleted"] = {$ne: true}
            return this.#findLimitedInDb(PRODUCTS_DB, query, page, limit)
        }
        catch (e){
            return null
        }
    }
    static async addOrder(order) {
        const {sellerID, buyerID} = order
        if(!sellerID || !buyerID) return false
        else {
            let seller = await this.findUserByUID(sellerID)
            let buyer = await this.findUserByUID(buyerID)
            if(!buyer || !seller || buyer.isSuspended || seller.isSuspended) return false
            else {
                //if(!buyer.orders) await this.updateUser(order.sellerID, {orders: []})
                //if(!seller.sales) await this.updateUser(order.buyerID, {sales: []})
                await this.#addToCollection(ORDERS_DB, order)
                //await this.updateUser(order.buyerID, {$push: {orders: order._id}})
                //await this.updateUser(order.sellerID, {$push: {sales: order._id}})
                await this.#appendToArrays(USERS_DB, sellerID, {saleData: order._id})
                await this.updateUser(sellerID, {sales: (seller.sales || 0) + 1})
                await this.#appendToArrays(USERS_DB, buyerID, {orders: order._id})
                return true
            }
        }
    }
}

module.exports = DbManager
