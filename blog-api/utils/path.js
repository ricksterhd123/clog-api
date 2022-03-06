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

module.exports = {
    getPathRoot,
};
