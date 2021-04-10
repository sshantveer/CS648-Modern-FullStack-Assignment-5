const { UserInputError } = require('apollo-server-express');
const { getDb, getNextSequence } = require('./db.js');

async function get(_, { id }) {
    const db = getDb();
    const product = await db.collection('products').findOne({ id });
    return product;
}

function productList() { 
    const db = getDb();
    const products = db.collection('products').find({}).toArray();
    return products;
}

async function productAdd(_, { product }) {
    const db = getDb();
    product.id = await getNextSequence('products');

    const result = await db.collection('products').insertOne(product);
    const savedProduct = await db.collection('products').findOne({ _id: result.insertedId });
    return savedProduct;
}

async function update(_, { id, changes }) {
    const db = getDb();
    if (changes.productName || changes.category || changes.price) {
        const product = await db.collection('products').findOne({ id });
        Object.assign(product, changes);
    }
    await db.collection('products').updateOne({ id }, { $set: changes });
    const savedProduct = await db.collection('products').findOne({ id });
    return savedProduct;
}

async function remove(_, { id }) {
    const db = getDb();
    const product = await db.collection('products').findOne({ id });
    if (!product) return false;
    product.deleted = new Date();

    let result = await db.collection('deleted_products').insertOne(product);
    if (result.insertedId) {
        result = await db.collection('products').removeOne({ id });
        return result.deletedCount === 1;
    }
    return false;
}

//get, update, delete: remove,
module.exports = {
    productList,
    productAdd,
    get,
    update,
    delete: remove,
};