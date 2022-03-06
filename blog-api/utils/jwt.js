const { CognitoJwtVerifier } = require('aws-jwt-verify');

const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.USER_POOL_ID,
    tokenUse: 'access',
    clientId: process.env.USER_POOL_APP_CLIENT_ID,
});

async function isJwtValid(jwt) {
    try {
        return verifier.verify(jwt);
    } catch {
        return false;
    }
}

module.exports = {
    isJwtValid,
};
