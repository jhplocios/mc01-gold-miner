import React, { useState } from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { Card } from './Menu';
import Button from '@material-ui/core/Button';
import miner from '../assets/Miner.gif';
import gold from '../assets/gold.png';
import pit from '../assets/pit.png';
import beacon from '../assets/beacon.png';
import Typography from '@material-ui/core/Typography';
import { useInterval } from '../helpers/useInterval';
import parse from '../helpers/parse';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import { useHistory } from "react-router-dom";

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

const GoldMiner = ({ gridSize, goldLoc, pitsLoc, beaconsLoc }) => {
  // initialize
  const cols = Array(Number(gridSize)).fill(1);
  const rows = Array(Number(gridSize)).fill(cols);
  
  let history = useHistory();

  const [pits] = useState(parse(pitsLoc));
  const [beacons] = useState(parse(beaconsLoc));
  const [totalMove, setTotalMove] = useState(0);
  const [totalRotate, setTotalRotate] = useState(0);
  const [totalScan] = useState(0);
  const [minerLoc, setMinerLoc] = useState({ row: 0, col: 0 });
  const [direction, setDirection] = useState('E');
  const [delay, setDelay] = useState(1000);
  console.log(delay)
  const handleChangeDelay = (event, newValue) => {
    setDelay(newValue);
  };

  const move = () => {
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
    }
  }

  const rotate = () => {
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
    }
  }

  useInterval(() => {
    if (isGoldLoc(minerLoc.row, minerLoc.col)) {
      history.push(`/success/${totalMove}/${totalRotate}/${totalScan}`);
    }

    if (isPits(minerLoc.row, minerLoc.col)) {
      history.push(`/game-over/${totalMove}/${totalRotate}/${totalScan}`);
    }

    if (Math.floor(Math.random() * 4) === 0) {
      rotate();
      setTotalRotate(prev => prev + 1);
    } else {
      const newLoc = move();
      if (newLoc) {
        setTotalMove(prev => prev + 1);
        setMinerLoc(newLoc);
      }
    }
  }, delay);
  
  const isMinerLoc = (r, c) => (r === minerLoc.row && c === minerLoc.col);
  const isGoldLoc = (r, c) => (r === Number(goldLoc.row) && c === Number(goldLoc.col));
  const isPits = (r, c) => {
    return pits.find(loc => loc.row === r && loc.col === c)
  }
  const isBeacons = (r, c) => {
    return beacons.find(loc => loc.row === r && loc.col === c)
  }
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
          {rows.map((_, r) => _.map((__, c) => {
            return (
              <Cell key={`${r}${c}`}>
                {isMinerLoc(r, c) 
                  ? <Miner src={miner} direction={direction} /> 
                  : isGoldLoc(r, c)
                    ? <Gold src={gold} />
                    : isPits(r, c)
                      ? <Pit src={pit} />
                      : isBeacons(r, c)
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