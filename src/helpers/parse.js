export default function parse(location) {
  return location.split(',').reduce((acc, cur, i) => {
    if (i % 2 === 0) {
      const coordinates = { row: Number(cur), col: undefined}
      acc[Math.floor(i/2)] = coordinates;
    } else {
      acc[Math.floor(i/2)].col = Number(cur);
    }
    return acc; 
  }, [])
}