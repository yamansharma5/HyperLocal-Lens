// Geo query utility — build $near query for MongoDB 2dsphere

/**
 * Build a MongoDB $near query for geospatial searches
 * @param {number} lng - Longitude
 * @param {number} lat - Latitude
 * @param {number} maxDistanceMeters - Max distance in meters (default 5km)
 * @returns {Object} MongoDB $near query object
 */
export const buildNearQuery = (lng, lat, maxDistanceMeters = 5000) => {
    return {
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [parseFloat(lng), parseFloat(lat)],
                },
                $maxDistance: maxDistanceMeters,
            },
        },
    };
};
