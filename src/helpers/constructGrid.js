export default function constructGrid(gridSize, pits, beacons, gold) {
  // const defaultGridSize = gridSize || 8;
  const grid = new Array(Number(gridSize)).fill(0);

  for (let row=0; row<gridSize; row++) {
    grid[row] = new Array(Number(gridSize)).fill(0);
  }

  if(grid.length > 0) {
    pits.forEach(pit => {
      if (pit.col !== undefined) {
        grid[pit.row][pit.col] = -1;
      }
    })
  
    beacons.forEach(beacon => {
      if (beacon.col !== undefined) {
        let distance = 0;
  
        if (gold.row === beacon.row) {
          distance = Math.abs(gold.col - beacon.col);
        }
        
        if (gold.col === beacon.col) {
          distance = Math.abs(gold.row - beacon.row);
        }
  
        grid[beacon.row][beacon.col] = distance;
      }
    })
  }
  
  return grid;
}