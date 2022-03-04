const { Article } = require('../models');

async function create(event) {
    const { body: bodyRaw } = event;
    const {
        author,
        title,
        body,
        tags,
    } = JSON.parse(bodyRaw);

    const result = await Article.create(author, title, body, tags);
    console.log(result);

    if (result) {
        return {
            statusCode: 204,
        };
    }

    return {
        statusCode: 500,
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({ error: 'Could not create article' }),
    };
}

// async function read(event) {
// }
// async function update(event) {
// }
// async function destroy(event) {
// }

module.exports = {
    create,
    // read,
    // update,
    // destroy,
};
