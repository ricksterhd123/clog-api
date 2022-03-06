const { CognitoJwtVerifier } = require('aws-jwt-verify');

async function verifyJwt(jwt) {
    const verifier = CognitoJwtVerifier.create({
        userPoolId: process.env.USER_POOL_ID,
        tokenUse: 'access',
        clientId: process.env.USER_POOL_APP_CLIENT_ID,
    });

    try {
        return await verifier.verify(jwt);
    } catch {
        return false;
    }
}

module.exports = {
    verifyJwt,
};
