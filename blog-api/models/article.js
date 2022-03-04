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

    Item[id] = title;
    Item[type] = typeName;

    return dynamoDb.put(Item);
}

module.exports = {
    create,
};
