const { getResponse } = require('../utils');
const { Article } = require('../models');

async function create(event) {
    let { body: eventBody } = event;

    try {
        eventBody = JSON.parse(eventBody);
    } catch (error) {
        return getResponse(400, { error: 'Invalid JSON' });
    }

    const {
        author,
        title,
        body,
        tags,
    } = eventBody;

    const result = await Article.create(author, title, body, tags);
    console.log(result);

    if (result) {
        return getResponse(204, body);
    }

    return getResponse(400, '');
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
