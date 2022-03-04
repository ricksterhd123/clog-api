const Articles = require('./routes/articles');
const { getResponse } = require('./utils');

/**
 * Map endpoint and method with event handler
 */
const Paths = {
    articles: {
        POST: Articles.create,
        GET: Articles.read,
        PATCH: Articles.update,
        DELETE: Articles.destroy,
    },
};

/**
 * Get the root from the path
 * e.g. /dev/articles => articles
 * @param {string} stage stage from API gateway request event
 * @param {string} routeKey routeKey from API gateway request event
 * @returns {string} Path root
 */
function getPathRoot(stage, routeKey) {
    if (!(stage && routeKey)) {
        return false;
    }

    const pathRegex = new RegExp(`\\/${stage}\\/((\\w*-*)+)`);
    const [, route] = routeKey.match(pathRegex);
    return route;
}

/**
 * API gateway event dispatcher
 * @param {any} event API gateway AWS_PROXY event object
 * @returns {{
 *  statusCode: number,
 *  body: string,
 *  headers: any
 * }} API gateway compatible lambda response
 */
async function dispatchEvent(event) {
    try {
        console.log(event);

        const {
            rawPath,
            requestContext: {
                http: {
                    method,
                },
                stage,
            },
        } = event;

        const route = getPathRoot(stage, rawPath);
        const handlerFn = route && Paths[route][method.toUpperCase()];

        if (!(rawPath && handlerFn)) {
            return getResponse(404, { error: 'Resource not found' });
        }

        return handlerFn(event);
    } catch (error) {
        console.error(error);
        return getResponse(500, { error: 'Server error' });
    }
}

module.exports = {
    dispatchEvent,
};
