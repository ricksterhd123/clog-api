const Articles = require('./routes/articles');

/**
 * Assign API paths here
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
            rawQueryString,
            requestContext: {
            // authorizer: {
            //     jwt,
            // },
                http: {
                    method,
                },
                stage,
            },
        } = event;

        const route = getPathRoot(stage, rawPath);
        const handlerFn = stage && Paths[route][method.toUpperCase()];

        if (!(rawPath && rawQueryString && handlerFn)) {
            return {
                statusCode: 404,
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ error: 'Resource not found' }),
            };
        }

        return handlerFn(event);
    } catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ error: 'Server error' }),
        };
    }
}

module.exports = {
    dispatchEvent,
};
