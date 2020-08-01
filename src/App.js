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
  const [gridSize, setGridSize] = useState(8);
  const [goldLoc, setGoldLoc] = useState({ 
    row: getRandomInt(0, gridSize-1), 
    col: getRandomInt(0, gridSize-1)
  });
  const [pitsLoc, setPitsLoc] = useState(
    `${getRandomInt(0, gridSize-1)}, ${getRandomInt(0, gridSize-1)}`
  );
  const [beaconsLoc, setBeaconsLoc] = useState("");
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
              getGridSize={(e) => setGridSize(e.target.value)}
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
