const { Articles } = require('./routes');
const { getResponse, getPathRoot, isJwtValid } = require('./utils');

/**
 * Map endpoint and method with event handler
 */
const Paths = {
    articles: {
        POST: Articles.create,
        // GET: Articles.read,
        // PATCH: Articles.update,
        // DELETE: Articles.destroy,
    },
};

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
            headers: {
                authorization,
            },
        } = event;

        if (authorization && isJwtValid());
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
