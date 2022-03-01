async function get(event, context) {
    return {
        statusCode: 200,
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({event, context})
    };
}

module.exports = {
    get
};
