const { v5 } = require('uuid');
const dynamoDb = require('./dynamoDb');

const typeName = 'ARTICLE';
const NAMESPACE = 'f32ddcff-9177-4d3e-8cb5-efd0fad3b401';

async function create(author, title, body, tags) {
    if (!(author && title && body)) {
        return false;
    }

    const { hashKey: id, sortKey: type } = dynamoDb.config;

    const Item = {
        author,
        title,
        body,
        tags,
    };

    Item[id] = v5(title, NAMESPACE);
    Item[type] = typeName;

    return dynamoDb.put(Item);
}

module.exports = {
    create,
};
