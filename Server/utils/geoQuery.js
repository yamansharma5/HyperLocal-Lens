// Geo query utility - build $near query for MongoDB 2dsphere

export const parseCoordinate = (value) => {
  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : null;
};

export const isValidLatitude = (lat) => lat >= -90 && lat <= 90;
export const isValidLongitude = (lng) => lng >= -180 && lng <= 180;

export const parseGeoPoint = (lat, lng) => {
  const parsedLat = parseCoordinate(lat);
  const parsedLng = parseCoordinate(lng);

  if (
    parsedLat === null ||
    parsedLng === null ||
    !isValidLatitude(parsedLat) ||
    !isValidLongitude(parsedLng)
  ) {
    return null;
  }

  return { lat: parsedLat, lng: parsedLng };
};

/**
 * Build a MongoDB $near query for geospatial searches.
 * @param {number} lng - Longitude
 * @param {number} lat - Latitude
 * @param {number} maxDistanceMeters - Max distance in meters (default 5km)
 * @returns {Object} MongoDB $near query object
 */
export const buildNearQuery = (lng, lat, maxDistanceMeters = 5000) => {
  const longitude = Number(lng);
  const latitude = Number(lat);

  return {
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistanceMeters,
      },
    },
  };
};
