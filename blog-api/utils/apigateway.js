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

    const stagePart = `/${stage}/`;
    const stagePartIndex = routeKey.indexOf(stagePart);

    if (stagePartIndex === -1) {
        return false;
    }

    return routeKey.substring(stagePartIndex + stagePart.length);
}

/**
 * Extract the type and key from the authorization header
 * @param {string} authHeader Authorization header from apigateway event
 * @returns {{ type: string, key: string }} Deconstructed auth header
 */
function getAuthorization(authHeader) {
    if (!authHeader) {
        return false;
    }

    const [type, key] = authHeader.split(' ');

    if (!(type && key)) {
        return false;
    }

    return { type, key };
}

/**
 * Get an API-gateway lambda response
 * @param {number} statusCode
 * @param {any} body
 * @param {{[headerName: string]: string}} headers
 * @returns {{
 * statusCode: number,
 * headers: {
 *  [headerName: string]: string
 * },
 * body: string
 * }}
 */
function getResponse(
    statusCode,
    body,
    headers,
) {
    return {
        statusCode,
        headers: {
            'content-type': 'application/json',
            ...headers,
        },
        body: body && JSON.stringify(body),
    };
}

module.exports = {
    getPathRoot,
    getAuthorization,
    getResponse,
};
