const { v5 } = require('uuid');
const dynamoDb = require('./dynamoDb');

const typeName = 'ARTICLE';

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

    Item[id] = v5(title, author);
    Item[type] = typeName;

    return dynamoDb.put(Item);
}

module.exports = {
    create,
};
