import * as THREE from 'three';

/**
 * 将经纬度坐标转换为3D球面坐标
 * @param lat 纬度 (-90 到 90)
 * @param lng 经度 (-180 到 180)
 * @param radius 球体半径
 * @returns THREE.Vector3 3D坐标
 */
export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  // 将角度转换为弧度
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  // 球面坐标转笛卡尔坐标
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return new THREE.Vector3(x, y, z);
}

/**
 * 将3D坐标转换回经纬度
 * @param position 3D坐标
 * @param radius 球体半径
 * @returns [lat, lng] 经纬度数组
 */
export function vector3ToLatLng(position: THREE.Vector3, radius: number): [number, number] {
  const normalizedY = position.y / radius;
  const clampedY = Math.max(-1, Math.min(1, normalizedY));
  const lat = 90 - Math.acos(clampedY) * (180 / Math.PI);
  const lng = Math.atan2(position.z, -position.x) * (180 / Math.PI) - 180;
  
  return [lat, lng];
}

/**
 * 计算两个经纬度点之间的距离（km）
 */
export function getDistanceInKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // 地球半径 km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * 在球面上插值两点
 */
export function slerp(
  start: THREE.Vector3, 
  end: THREE.Vector3, 
  t: number, 
  radius: number
): THREE.Vector3 {
  const omega = Math.acos(start.clone().normalize().dot(end.clone().normalize()));
  const sinOmega = Math.sin(omega);
  
  if (sinOmega < 0.0001) {
    return start.clone().lerp(end, t).normalize().multiplyScalar(radius);
  }
  
  const a = Math.sin((1 - t) * omega) / sinOmega;
  const b = Math.sin(t * omega) / sinOmega;
  
  return new THREE.Vector3(
    a * start.x + b * end.x,
    a * start.y + b * end.y,
    a * start.z + b * end.z
  ).normalize().multiplyScalar(radius);
}

/**
 * 生成随机的星星位置
 */
export function generateStarPositions(count: number, minRadius: number, maxRadius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const radius = minRadius + Math.random() * (maxRadius - minRadius);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }
  
  return positions;
}

/**
 * 缓动函数
 */
export const easing = {
  easeInOut: (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeOut: (t: number): number => t * (2 - t),
  easeIn: (t: number): number => t * t,
  easeOutCubic: (t: number): number => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t: number): number => 
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
};
