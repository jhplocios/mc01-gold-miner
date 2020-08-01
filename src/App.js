import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from 'styled-components';

import Menu from './components/Menu'
import GoldMiner from './components/GoldMiner';
import Success from './components/Success';
import GameOver from './components/GameOver';
import getRandomInt from './helpers/getRandomInt';
import parse from './helpers/parse';

const Container = styled.div`
  display: grid;
  grid-template-rows: 56px 1fr;
`

const NavBar = styled.div`
  display: grid;
  align-content: center;
  width: 100%;
  height: 56px;
  background-color: #6B8E23;
  padding: 10px 20px;
  box-sizing: border-box;
  color: #fff;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-size: 1.5em;
`

function App() {
  const getRandomGoldLoc = (s) => {
    const size = Number(s)
    const row = getRandomInt(0, size-1)
    const col = getRandomInt(0, size-1)
    return { row, col }
  }
  const getRandomValidBeacon = (s, r, c) => {
    const size = Number(s)
    const option1 = `${r}, ${getRandomInt(0, size)}`
    const option2 = `${getRandomInt(0, size)}, ${c}`
    return getRandomInt(0, 1) === 1 ? option1 : option2;
  }
  const getRandomPitsLoc = (s) => `${getRandomInt(0, s-1)}, ${getRandomInt(0, s-1)}`

  const [gridSize, setGridSize] = useState(8);
  const [goldLoc, setGoldLoc] = useState(getRandomGoldLoc(8));
  const [pitsLoc, setPitsLoc] = useState(getRandomPitsLoc(8));
  const [beaconsLoc, setBeaconsLoc] = useState(getRandomValidBeacon(8, goldLoc.row, goldLoc.col));
  const [behavior, setBehavior] = useState(false);

  const pits = parse(pitsLoc);
  const beacons = parse(beaconsLoc);
  return (
    <Router>
      <Container>
        <NavBar>
          MC01 GOLD MINER
        </NavBar>
        <Switch>
          <Route path='/success/:move/:rotate/:scan'>
            <Success />
          </Route>
          <Route path='/game-over/:move/:rotate/:scan'>
            <GameOver />
          </Route>
          <Route path='/gold-miner'>
            <GoldMiner 
              gridSize={gridSize}
              goldLoc={goldLoc}
              smart={behavior}
              pits={pits}
              beacons={beacons}
            />
          </Route>
          <Route path='/' exact>
            <Menu 
              gridSize={gridSize} 
              getGridSize={(e) => {
                const v = e.target.value
                setGridSize(e.target.value)
                const newGoldLoc = getRandomGoldLoc(v)
                setGoldLoc(newGoldLoc)
                setBeaconsLoc(getRandomValidBeacon(v, newGoldLoc.row, newGoldLoc.col))
                setPitsLoc(getRandomPitsLoc(v))
              }}
              goldLoc={goldLoc}
              getGoldXCoor={(e) => setGoldLoc(prev => ({ 
                  ...prev, 
                  row: e.target.value 
                }))}
              getGoldYCoor={(e) => setGoldLoc(prev => ({ 
                  ...prev, 
                  col: e.target.value 
                }))}
              pitsLoc={pitsLoc}
              getPitsLoc={(e) => setPitsLoc(e.target.value)}
              beaconsLoc={beaconsLoc}
              getBeaconsLoc={(e) => setBeaconsLoc(e.target.value)}
              behavior={behavior}
              getBehavior={(e) => setBehavior(e.target.checked)}
            />
          </Route>
        </Switch>
      </Container>  
    </Router>
  );
}

export default App;
