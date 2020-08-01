import React, { useState } from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import { useHistory } from "react-router-dom";

import { Card } from './Menu';
import { useInterval } from '../helpers/useInterval';
import getRandomInt from '../helpers/getRandomInt';

import miner from '../assets/Miner.gif';
import gold from '../assets/gold.png';
import pit from '../assets/pit.png';
import beacon from '../assets/beacon.png';
import constructGrid from '../helpers/constructGrid';

const Container = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  justify-content: center;
  justify-items: center;
  align-items: center;
`
const Dashboard = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
  height: calc(100% - 10px);
  background: #fff;
  margin-top: 10px;
  padding: 20px;
  box-sizing: border-box;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);

  a, p {
    margin-top: 30px;
  }
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ col }) => col}, 1fr);
  grid-gap: 1px;
  max-width: 1250px;
  max-height: 750px;
  overflow: scroll;
`

const Cell = styled.div`
  display: grid;
  width: 50px;
  height: 50px;
  background: #DCDCDC;
  z-index: 1;
  place-content: center;
`

const Miner = styled.img`
  height: 49px;
  ${({ direction }) => {
    if (direction === 'E') {
      return 'transform: scaleX(-1);'
    } else if (direction === 'S') {
      return 'transform: rotate(270deg);'
    } else if (direction === 'N') {
      return 'transform: rotate(90deg);'
    }
  }}
  z-index: 10;
`

const Gold = styled.img`
  height: 40px;
  z-index: 5;
`

const Pit = styled.img`
  height: 40px;
  z-index: 5;
`

const Beacon = styled.img`
  height: 40px;
  z-index: 5;
`

const Cluster = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`

const GoldMiner = ({ gridSize, pits, beacons, goldLoc, smart }) => {
  let history = useHistory();

  const [grid] = useState(constructGrid(gridSize, pits, beacons, goldLoc))
  const [totalMove, setTotalMove] = useState(0);
  const [totalRotate, setTotalRotate] = useState(0);
  const [totalScan, setTotalScan] = useState(0);
  const [minerLoc, setMinerLoc] = useState({ row: 0, col: 0 });
  const [direction, setDirection] = useState('E');
  const [delay, setDelay] = useState(1000);
  const [goal, setGoal] = useState({ row: Number(gridSize)-1, col: Number(gridSize)-1 });

  const isMinerLoc = (r, c) => (r === minerLoc.row && c === minerLoc.col);
  const isGoldLoc = (r, c) => (r === Number(goldLoc.row) && c === Number(goldLoc.col));
  const getCellValue = () => grid[minerLoc.row][minerLoc.col];
  const getCurLoc = () => `${minerLoc.row}${minerLoc.col}`;

  const checkGameStatus = () => {
    if (isGoldLoc(minerLoc.row, minerLoc.col)) {
      history.push(`/success/${totalMove}/${totalRotate}/${totalScan}`);
    }
    if (getCellValue() < 0) {
      history.push(`/game-over/${totalMove}/${totalRotate}/${totalScan}`);
    }
  }

  const handleChangeDelay = (event, newValue) => {
    setDelay(newValue);
  };

  const move = () => {
    setTotalMove(prev => prev + 1);
    let newRow, newCol;
    switch(direction) {
      case 'E':
        if (minerLoc.col === gridSize-1) {
          return null;
        }
        newCol = minerLoc.col + 1;
        return { row: minerLoc.row, col: newCol }
      case 'S':
        if (minerLoc.row === gridSize-1) {
          return null;
        }
        newRow = minerLoc.row + 1;
        return { row: newRow, col: minerLoc.col }
      case 'W':
        if (minerLoc.col === 0) {
          return null;
        }
        newCol = minerLoc.col - 1;
        return { row: minerLoc.row, col: newCol }
      case 'N':
        if (minerLoc.row === 0) {
          return null;
        }
        newRow = minerLoc.row - 1;
        return { row: newRow, col: minerLoc.col }
      default:
    }
  }

  const rotate = () => {
    setTotalRotate(prev => prev + 1);
    switch(direction) {
      case 'E':
        setDirection('S');
        break;
      case 'S':
        setDirection('W');
        break;
      case 'W':
        setDirection('N');
        break;
      case 'N':
        setDirection('E');
        break;
      default:
    }
  }

  const scan = () => {
    setTotalScan(prev => prev + 1);
    const curRow = minerLoc.row;
    const curCol = minerLoc.col;
    switch(direction) {
      case 'E':
        for (let i=curCol+1; i<gridSize; i++) {
          const cellValue = grid[curRow][i]
          if (cellValue !== 0) {
            return cellValue > 0 ? 'B' : 'P';
          }
        }  
        return 'NULL';
      case 'S':
        for (let i=curRow+1; i<gridSize; i++) {
          const cellValue = grid[i][curCol]
          if (cellValue !== 0) {
            return cellValue > 0 ? 'B' : 'P';
          }
        }
        return 'NULL';
      case 'W':
        for (let i=curCol-1; i>=0; i--) {
          const cellValue = grid[curRow][i]
          if (cellValue !== 0) {
            return cellValue > 0 ? 'B' : 'P';
          }
        } 
        return 'NULL';
      case 'N':
        for (let i=curRow-1; i>=0; i--) {
          const cellValue = grid[i][curCol]
          if (cellValue !== 0) {
            return cellValue > 0 ? 'B' : 'P';
          }
        }
        return 'NULL';
      default:
        return 'NULL';
    }
  }

  const saveScan = () => {
    const curRow = minerLoc.row;
    const curCol = minerLoc.col;
    let toBeSaved = {}
    switch(direction) {
      case 'E':
        for (let i=curCol; i<gridSize-1; i++) {
          if (!scanMemory[`${curRow}${i}-${direction}`]) {
            console.log('memorize scan', `${curRow}${i}-${direction}`)
            toBeSaved[`${curRow}${i}-${direction}`] = 'NULL'
          }
        }
        setScanMemory({
          ...scanMemory,
          ...toBeSaved
        })
        break;  
      case 'S':
        for (let i=curRow; i<gridSize-1; i++) {
          if (!scanMemory[`${i}${curCol}-${direction}`]) {
            console.log('memorize scan', `${i}${curCol}-${direction}`)
            toBeSaved[`${i}${curCol}-${direction}`] = 'NULL'
          }
        }
        setScanMemory({
          ...scanMemory,
          ...toBeSaved
        })
        break;
      case 'W':
        for (let i=curCol; i>=1; i--) {
          if (!scanMemory[`${curRow}${i}-${direction}`]) {
            console.log('memorize scan', `${curRow}${i}-${direction}`)
            toBeSaved[`${curRow}${i}-${direction}`] = 'NULL'
          }
        } 
        setScanMemory({
          ...scanMemory,
          ...toBeSaved
        })
        break;
      case 'N':
        for (let i=curRow; i>=1; i--) {
          if (!scanMemory[`${i}${curCol}-${direction}`]) {
            console.log('memorize scan', `${i}${curCol}-${direction}`)
            toBeSaved[`${i}${curCol}-${direction}`] = 'NULL'
          }
        }
        setScanMemory({
          ...scanMemory,
          ...toBeSaved
        })
        break;
      default:
    }
  }

  const isScanable = () => {
    switch(direction) {
      case 'E':
        return minerLoc.col !== gridSize-1;
      case 'S':
        return minerLoc.row !== gridSize-1;
      case 'N':
        return minerLoc.row !== 0;
      case 'W':
        return minerLoc.col !== 0;
      default:
    }
  }

  const isScanDone = () => {
    const curLoc = getCurLoc()
    return scanMemory[`${curLoc}-E`] && 
      scanMemory[`${curLoc}-S`] &&
      scanMemory[`${curLoc}-W`] &&
      scanMemory[`${curLoc}-N`];
  }

  const beaconLocated = () => {
    const curLoc = getCurLoc()
    if (scanMemory[`${curLoc}-E`] === 'B') {
      return 'E';
    }
    if (scanMemory[`${curLoc}-S`] === 'B') {
      return 'S';
    }
    if (scanMemory[`${curLoc}-W`] === 'B') {
      return 'W';
    }
    if (scanMemory[`${curLoc}-N`] === 'B') {
      return 'N';
    }
    return null;
  }
  
  const forecast = () => {
    const curLoc = getCurLoc();
    const locN = `${minerLoc.row-1}${minerLoc.col}`;
    const locE = `${minerLoc.row}${minerLoc.col+1}`;
    const locS = `${minerLoc.row+1}${minerLoc.col}`;
    const locW = `${minerLoc.row}${minerLoc.col-1}`;
    const freq = []

    freq.push({
      goal: Math.abs(goal.row - minerLoc.row+1) + Math.abs(goal.col - minerLoc.col),
      prune: scanMemory[`${curLoc}-N`] === 'P' || minerLoc.row === 0,
      value: countMemory[locN] || 0,
      direction: 'N'
    }, {
      goal: Math.abs(goal.row - minerLoc.row) + Math.abs(goal.col - minerLoc.col-1),
      prune: scanMemory[`${curLoc}-E`] === 'P' || minerLoc.col === gridSize,
      value: countMemory[locE] || 0,
      direction: 'E'
    }, {
      goal: Math.abs(goal.row - minerLoc.row-1) + Math.abs(goal.col - minerLoc.col),
      prune: scanMemory[`${curLoc}-S`] === 'P' || minerLoc.row === gridSize,
      value: countMemory[locS] || 0,
      direction: 'S'
    }, {
      goal: Math.abs(goal.row - minerLoc.row) + Math.abs(goal.col - minerLoc.col+1),
      prune: scanMemory[`${curLoc}-W`] === 'P' || minerLoc.col === 0,
      value: countMemory[locW] || 0,
      direction: 'W'
    })

    const pruned = freq.filter(f => !f.prune)
    const sorted = pruned.sort((a, b) => {
      if (a.goal - b.goal !== 0) {
        return a.goal - b.goal;
      }
      return a.value - b.value;
    })
    const filtered = sorted.filter(f => f.goal === sorted[0].goal)
    const index = getRandomInt(0, filtered.length-1)
    console.log(freq, sorted, filtered, index)
    return filtered[index].direction;
  }

  const getGoldDirection = () => {
    const locN = `${minerLoc.row-1}${minerLoc.col}`;
    const locE = `${minerLoc.row}${minerLoc.col+1}`;
    const locS = `${minerLoc.row+1}${minerLoc.col}`;
    const locW = `${minerLoc.row}${minerLoc.col-1}`;
    const freq = []
    freq.push({
      prune: minerLoc.row === 0,
      value: countMemory[locN] || 0,
      direction: 'N'
    }, {
      prune: minerLoc.col === gridSize-1,
      value: countMemory[locE] || 0,
      direction: 'E'
    }, {
      prune: minerLoc.row === gridSize-1,
      value: countMemory[locS] || 0,
      direction: 'S'
    }, {
      prune: minerLoc.col === 0,
      value: countMemory[locW] || 0,
      direction: 'W'
    })

    const pruned = freq.filter(f => !f.prune)
    const sorted = pruned.sort((a, b) => a.value - b.value)
    const filtered = sorted.filter(f => f.value === sorted[0].value)
    const index = getRandomInt(0, filtered.length-1)
    console.log(freq, sorted, filtered, index)
    return filtered[index].direction;
  }

  const getReverse = () => {
    const d = ['N', 'E', 'S', 'W']
    const index = d.indexOf(direction)
    const newIndex = (index + 2) % 4;
    return d[newIndex];
  }

  const memorizeCount = () => {
    const curLoc = getCurLoc()
    if (countMemory[curLoc]) {
      const newCount = countMemory[curLoc] + 1;
      setCountMemory({
        ...countMemory,
        [curLoc]: newCount
      });
      console.log('memorize count add', curLoc, newCount)
    } else {
      setCountMemory({
        ...countMemory,
        [curLoc]: 1
      });
      console.log('memorize count init', curLoc)
    }
  }

  const randomBehavior = () => {
    if (getRandomInt(0, getRandomInt(2, 4)) === 2) {
      rotate();
    } else {
      const newLoc = move();
      if (newLoc) {
        setMinerLoc(newLoc);
      }
    }
  }

  const [scanResult, setScanResult] = useState('');
  const [scanMemory, setScanMemory] = useState({});
  const [countMemory, setCountMemory] = useState({});
  const [forecastDirection, setForecastDirection] = useState('');
  const [beaconDirection, setBeaconDirection] = useState('');
  const [distanceGold, setDistanceGold] = useState(-1);
  const [searchGold, setSearchGold] = useState({});
  const [backtrack, setBacktrack] = useState(false)

  const smartBehavior = () => {
    const scanDone = isScanDone();
    if (minerLoc.row === goal.row && minerLoc.col === goal.col) {
      setGoal({ row: getRandomInt(0, gridSize-1), col: getRandomInt(0, gridSize-1) })
    }
    
    if (beaconDirection === '' && scanResult === '' && !scanDone) {
      if (isScanable()) {
        if (!scanMemory[`${getCurLoc()}-${direction}`]) {
          const result = scan()
          console.log('scan', direction, result)
          setScanResult(result);
          if (result === 'NULL') {
            saveScan();
          } else {
            console.log('memorize scan', `${getCurLoc()}-${direction}`)
            setScanMemory({
              ...scanMemory,
              [`${getCurLoc()}-${direction}`]: result
            })
          }
        } else {
          rotate();
        }
      } else {
        console.log('scan n/a', direction)
        setScanMemory({
          ...scanMemory,
          [`${getCurLoc()}-${direction}`]: 'n/a'
        })
        rotate();
      }
    } else if (beaconDirection === '' && !scanDone) {
      console.log('rotate')
      rotate();
      setScanResult('');
    } else if (searchGold.direction && searchGold.direction !== '') {
      if (backtrack) {
        console.log('backtrack', searchGold)
        if (searchGold.direction !== direction) {
          rotate();
        } else if (searchGold.remaining > 0) {
          memorizeCount();
          const newLoc = move();
          if (newLoc) {
            setMinerLoc(newLoc);
            setSearchGold({
              ...searchGold,
              remaining: searchGold.remaining - 1,
            })
          }
        } else {
          setBacktrack(false)
          setSearchGold({
            direction: getGoldDirection(),
            remaining: distanceGold,
          })
        }
      } else if (searchGold.remaining > 0) {
        console.log('searching gold', searchGold)
        if (isScanable()) {
          if (searchGold.direction !== direction) {
            rotate();
          } else {
            memorizeCount();
            const newLoc = move();
            if (newLoc) {
              setMinerLoc(newLoc);
              setSearchGold({
                ...searchGold,
                remaining: searchGold.remaining - 1,
              })
            }
          }
        } else {
          setBacktrack(true)
          setSearchGold({
            direction: getReverse(),
            remaining: distanceGold - searchGold.remaining,
          })
        }
      } else {
        setBacktrack(true)
        setSearchGold({
          direction: getReverse(),
          remaining: distanceGold,
        })
      }

    } else if (beaconDirection !== '') {
      const cellValue = grid[minerLoc.row][minerLoc.col];
      const onBeacon = cellValue > 0;
      console.log('beacon targeted', beaconDirection, direction)

      if (beaconDirection !== direction) {
        rotate();
      } else if (onBeacon) {
        console.log('gold targeted')
        setDistanceGold(cellValue)
        setSearchGold({
          direction: getGoldDirection(),
          remaining: cellValue
        })
      } else {
        memorizeCount();
        const newLoc = move();
        if (newLoc) {
          setMinerLoc(newLoc);
        }
      }
    } else {
      const beaconDirection = beaconLocated();
      if (beaconDirection) {
        console.log('found beacon')
        setBeaconDirection(beaconDirection);
      } else if (forecastDirection === '') {
        console.log('forecasting')
        setForecastDirection(forecast());
      } else {
        console.log('forecast', forecastDirection, direction)
        if(forecastDirection !== direction) {
          rotate();
        } else {
          memorizeCount();
          const newLoc = move();
          if (newLoc) {
            setMinerLoc(newLoc);
            setForecastDirection('');
            setScanResult('');
          }
        }
      }
    }
  }

  useInterval(() => {
    checkGameStatus();
    behavior();
  }, delay);
  
  const behavior = smart ? smartBehavior : randomBehavior;
  return (
    <Container>
      <Dashboard>
        <Cluster>
          <Typography variant="h5" gutterBottom>
            Total moves:
          </Typography>
          <Typography variant="h5" gutterBottom>
            {totalMove}
          </Typography>
        </Cluster>
        <Cluster>
          <Typography variant="h5" gutterBottom>
            Total rotate:
          </Typography>
          <Typography variant="h5" gutterBottom>
            {totalRotate}
          </Typography>
        </Cluster>
        <Cluster>
          <Typography variant="h5" gutterBottom>
            Total scan:
          </Typography>
          <Typography variant="h5" gutterBottom>
            {totalScan}
          </Typography>
        </Cluster>
        <Typography id="continuous-slider" gutterBottom>
          Delay
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <DirectionsRunIcon />
          </Grid>
          <Grid item xs>
            <Slider 
              value={delay} 
              onChange={handleChangeDelay} 
              aria-labelledby="continuous-slider" 
              max={2000}
              min={50}
            />
          </Grid>
          <Grid item>
            <DirectionsWalkIcon />
          </Grid>
        </Grid>
        <Link to='/'>
          <Button variant="contained">Back</Button>
        </Link> 
      </Dashboard>
      <Card>
        <GridContainer col={gridSize}>
          {grid.map((_, r) => _.map((__, c) => {
            return (
              <Cell key={`${r}${c}`}>
                {isMinerLoc(r, c) 
                  ? <Miner src={miner} direction={direction} /> 
                  : isGoldLoc(r, c)
                    ? <Gold src={gold} />
                    : __ < 0
                      ? <Pit src={pit} />
                      : __ > 0
                        ? <Beacon src={beacon} />
                        : null}
              </Cell>
            )
          }))}
        </GridContainer>
      </Card>
    </Container>
  )
}

export default React.memo(GoldMiner, []);