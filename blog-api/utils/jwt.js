const { CognitoJwtVerifier } = require('aws-jwt-verify');

async function isJwtValid(jwt) {
    const verifier = CognitoJwtVerifier.create({
        userPoolId: process.env.USER_POOL_ID,
        tokenUse: 'access',
        clientId: process.env.USER_POOL_APP_CLIENT_ID,
    });

    try {
        return verifier.verify(jwt);
    } catch {
        return false;
    }
}

module.exports = {
    isJwtValid,
};
