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

const GoldMiner = ({ gridSize, goldLoc, pits, beacons, smart, grid }) => {
  let history = useHistory();
  
  const [totalMove, setTotalMove] = useState(0);
  const [totalRotate, setTotalRotate] = useState(0);
  const [totalScan, setTotalScan] = useState(0);
  const [minerLoc, setMinerLoc] = useState({ row: 0, col: 0 });
  const [direction, setDirection] = useState('E');
  const [delay, setDelay] = useState(1000);

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
        return null;
      case 'S':
        for (let i=curRow+1; i<gridSize; i++) {
          const cellValue = grid[i][curCol]
          if (cellValue !== 0) {
            return cellValue > 0 ? 'B' : 'P';
          }
        }
        return null;
      case 'W':
        for (let i=curCol-1; i>=0; i--) {
          const cellValue = grid[curRow][i]
          if (cellValue !== 0) {
            return cellValue > 0 ? 'B' : 'P';
          }
        } 
        return null;
      case 'N':
        for (let i=curRow-1; i>=0; i--) {
          const cellValue = grid[i][curCol]
          if (cellValue !== 0) {
            return cellValue > 0 ? 'B' : 'P';
          }
        }
        return null;
      default:
        return null;
    }
  }

  const randomBehavior = () => {
    if (isGoldLoc(minerLoc.row, minerLoc.col)) {
      history.push(`/success/${totalMove}/${totalRotate}/${totalScan}`);
    }

    if (getCellValue() < 0) {
      history.push(`/game-over/${totalMove}/${totalRotate}/${totalScan}`);
    }

    if (getRandomInt(0, getRandomInt(2, 4)) === 2) {
      rotate();
    } else {
      const newLoc = move();
      if (newLoc) {
        setMinerLoc(newLoc);
      }
    }
  }

  const smartBehavior = () => {
    // let found = false;
    // while (!found) {

    // }
  }

  useInterval(() => {
    if (smart) {
      smartBehavior();
    } else {
      randomBehavior();
    }
  }, delay);
  
  const isMinerLoc = (r, c) => (r === minerLoc.row && c === minerLoc.col);
  const isGoldLoc = (r, c) => (r === Number(goldLoc.row) && c === Number(goldLoc.col));
  const getCellValue = () => grid[minerLoc.row][minerLoc.col];
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

export default GoldMiner;