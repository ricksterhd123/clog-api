const Ajv = require('ajv');
const articleSchema = require('./article.json');

const ajv = new Ajv();
const validateArticle = ajv.compile(articleSchema);

module.exports = {
    validateArticle,
};
