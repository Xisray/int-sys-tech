export const GenerateRandomPoints = (numPoints) => {
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    points.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      clusterId: i,
    });
  }
  return points;
};

export function initCentroids(numClusters) {
  return GenerateRandomPoints(numClusters);
}

export function clusterize(points, centroids) {
  return points.map((point) => {
    const distances = centroids.map((c) => Math.hypot(c.x - point.x, c.y - point.y));
    const clusterId = distances.indexOf(Math.min(...distances));
    return { ...point, clusterId };
  });
}

export function calculateCentroids(points) {
  const groups = {};
  points.forEach((p) => {
    if (!groups[p.clusterId]) groups[p.clusterId] = [];
    groups[p.clusterId].push(p);
  });

  return Object.keys(groups).map((clusterId) => {
    const clusterPoints = groups[clusterId];
    return {
      x: clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length,
      y: clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length,
    };
  });
}

export function checkConvergence(oldCentroids, newCentroids, threshold = 0.0001) {
  return oldCentroids.every((c, i) => Math.hypot(c.x - newCentroids[i].x, c.y - newCentroids[i].y) < threshold);
}
