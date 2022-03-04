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
    getResponse,
};
