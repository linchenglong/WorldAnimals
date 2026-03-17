import * as THREE from 'three';

/**
 * Convert latitude/longitude to 3D position on a sphere
 * @param lat - Latitude in degrees (-90 to 90)
 * @param lng - Longitude in degrees (-180 to 180)
 * @param radius - Sphere radius
 * @returns THREE.Vector3 position
 */
export function latLonToVector3(lat: number, lng: number, radius: number = 1): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return new THREE.Vector3(x, y, z);
}

/**
 * Convert 3D position back to latitude/longitude
 * @param position - THREE.Vector3 position
 * @returns [lat, lng] in degrees
 */
export function vector3ToLatLon(position: THREE.Vector3): [number, number] {
  const radius = position.length();
  const lat = 90 - Math.acos(position.y / radius) * (180 / Math.PI);
  const lng = Math.atan2(position.z, -position.x) * (180 / Math.PI) - 180;
  return [lat, lng];
}

/**
 * Calculate the distance between two lat/lng points using Haversine formula
 */
export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
