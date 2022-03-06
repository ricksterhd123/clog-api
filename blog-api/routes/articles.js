const { getResponse } = require('../utils');
const { Article } = require('../models');
const { validateArticle } = require('./schemas');

async function create(event) {
    let { body, headers } = event;

    try {
        body = JSON.parse(body);
    } catch (error) {
        return getResponse(400, { error: 'Invalid JSON' });
    }

    if (!validateArticle(body)) {
        return getResponse(400, { error: validateArticle.errors });
    }

    const {
        author,
        title,
        body: articleBody,
        tags,
    } = body;

    const articleId = await Article.create(author, title, articleBody, tags);
    console.log(articleId);

    if (articleId) {
        return getResponse(200, { articleId });
    }

    return getResponse(400, 'Missing fields in JSON');
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
