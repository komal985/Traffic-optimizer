// Utility functions for geospatial calculations

/**
 * Converts degrees to radians.
 * @param {number} deg - Angle in degrees.
 * @returns {number} Angle in radians.
 */
function toRadians(deg) {
    return deg * (Math.PI / 180);
  }
  
  /**
   * Calculates the Haversine distance between two coordinates.
   * @param {number} lat1 - Latitude of the first point.
   * @param {number} lon1 - Longitude of the first point.
   * @param {number} lat2 - Latitude of the second point.
   * @param {number} lon2 - Longitude of the second point.
   * @returns {number} Distance in kilometers.
   */
  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }
  
  /**
   * Converts latitude and longitude to a grid cell identifier.
   * @param {number} lat - Latitude.
   * @param {number} lon - Longitude.
   * @param {number} gridSize - Size of the grid cell in degrees (default: 0.01 for ~1km).
   * @returns {string} Grid cell identifier (e.g., "12.97,77.59").
   */
  function getGridCell(lat, lon, gridSize = 0.01) {
    const gridLat = Math.floor(lat / gridSize) * gridSize;
    const gridLon = Math.floor(lon / gridSize) * gridSize;
    return `${gridLat.toFixed(2)},${gridLon.toFixed(2)}`;
  }
  
  /**
   * Checks if a coordinate is within a bounding box.
   * @param {number} lat - Latitude of the point.
   * @param {number} lon - Longitude of the point.
   * @param {number} minLat - Minimum latitude of the bounding box.
   * @param {number} minLon - Minimum longitude of the bounding box.
   * @param {number} maxLat - Maximum latitude of the bounding box.
   * @param {number} maxLon - Maximum longitude of the bounding box.
   * @returns {boolean} True if the point is within the bounding box.
   */
  function isWithinBoundingBox(lat, lon, minLat, minLon, maxLat, maxLon) {
    return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
  }
  
  /**
   * Converts a grid cell identifier back to latitude and longitude.
   * @param {string} gridCell - Grid cell identifier (e.g., "12.97,77.59").
   * @returns {Object} Latitude and longitude of the grid cell center.
   */
  function getGridCellCenter(gridCell) {
    const [lat, lon] = gridCell.split(',').map(parseFloat);
    return { lat: lat + 0.005, lon: lon + 0.005 }; // Center of the grid cell
  }
  
  module.exports = {
    toRadians,
    haversineDistance,
    getGridCell,
    isWithinBoundingBox,
    getGridCellCenter,
  };