const {
    config: awsConfig,
    DynamoDB: { DocumentClient },
} = require('aws-sdk');

awsConfig.update({ region: process.env.REGION });

const config = {
    tableName: process.env.BLOG_API_DYNAMODB_TABLE_NAME,
    hashKey: process.env.BLOG_API_DYNAMODB_HASH_KEY_NAME,
    sortKey: process.env.BLOG_API_DYNAMODB_SORT_KEY_NAME,
    dbDocumentClient: new DocumentClient(),
};

async function get(Key) {
    const { tableName, dbDocumentClient } = config;
    return dbDocumentClient.get({
        TableName: tableName,
        Key,
    }).promise();
}

async function query(KeyConditionExpression, ExpressionAttributeValues) {
    const { tableName, hashKey: indexName, dbDocumentClient } = config;
    return dbDocumentClient.query({
        TableName: tableName,
        IndexName: indexName,
        KeyConditionExpression,
        ExpressionAttributeValues,
    }).promise();
}

async function put(Item) {
    const { tableName, dbDocumentClient } = config;
    return dbDocumentClient.put({
        TableName: tableName,
        Item,
    }).promise();
}

async function update(
    Key,
    UpdateExpression,
    ConditionExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
) {
    const { tableName, dbDocumentClient } = config;
    return dbDocumentClient.update({
        TableName: tableName,
        Key,
        UpdateExpression,
        ConditionExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
    }).promise();
}

async function destroy(Key) {
    const { tableName, dbDocumentClient } = config;
    return dbDocumentClient.delete({
        TableName: tableName,
        Key,
    }).promise();
}

module.exports = {
    config,
    get,
    query,
    put,
    update,
    destroy,
};
