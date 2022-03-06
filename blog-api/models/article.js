const { v4 } = require('uuid');
const dynamoDb = require('./dynamoDb');

const typeName = 'ARTICLE';

/**
 * Create article
 * @param {string} author Author of article
 * @param {string} title Title of article
 * @param {string} body Main body of article
 * @param {{[tagName: string]: string}} tags Custom tags
 * @throws if PutObject fails
 * @returns {string} article ID
 */
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

    const success = await dynamoDb.put(Item);
    if (!success) {
        const itemString = JSON.stringify(Item);
        throw new Error(`Failed to submit article ${itemString} into dynamoDB`);
    }

    return Item[id];
}

module.exports = {
    create,
};
