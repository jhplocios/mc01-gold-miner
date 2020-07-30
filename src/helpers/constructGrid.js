export default function constructGrid(gridSize, pits, beacons, gold) {
  const grid = new Array(gridSize);

  for (let row=0; row<gridSize; row++) {
    grid[row] = new Array(gridSize).fill(0);
  }

  pits.forEach(pit => {
    if (pit.col !== undefined) {
      grid[pit.row][pit.col] = -1;
    }
  })

  beacons.forEach(beacon => {
    if (beacon.col !== undefined) {
      let distance = 0;
      if (gold.row > beacon.row) {
        distance = gold.row - beacon.row;
      } else {
        distance = beacon.row - gold.row;
      }
      if (gold.col > beacon.col) {
        const horizontalDistance = gold.col - beacon.col;
        if (horizontalDistance > distance) {
          distance = horizontalDistance;
        }
      } else {
        const horizontalDistance =  beacon.col - gold.col;
        if (horizontalDistance > distance) {
          distance = horizontalDistance;
        }
      }
      grid[beacon.row][beacon.col] = distance;
    }
  })

  return grid;
}