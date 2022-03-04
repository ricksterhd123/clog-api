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
