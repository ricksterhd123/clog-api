const { v4 } = require('uuid');
const dynamoDb = require('./dynamoDb');

const typeName = 'ARTICLE';

async function create(author, title, body, tags) {
    if (!(author && title && body)) {
        return false;
    }

    const { hashKey: id, sortKey: type } = dynamoDb.config;

    const timeCreated = new Date().toISOString();
    const timeUpdated = timeCreated;

    const Item = {
        author,
        title,
        body,
        tags,
        timeCreated,
        timeUpdated,
    };

    Item[id] = v4();
    Item[type] = typeName;

    return dynamoDb.put(Item);
}

module.exports = {
    create,
};
