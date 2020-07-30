import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    '&$checked': {
      transform: 'translateX(12px)',
      color: theme.palette.common.white,
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: 'none',
  },
  track: {
    height: 14,
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 50px;

  h6, .text-input {
    margin-bottom: 10px;
  }
  .gold-loc {
    width: 130px;
  }
  .rational-behavior {
    display: flex;
    align-content: center;
    height: 30px;
  }
  a {
    margin-top: 20px;
  }
`

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: center;
  min-width: 200px;
  min-height: 200px;
  height: min-content;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;

  &:hover {
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  }
`

const Cluster = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 10px;
`

const Menu = ({ 
  gridSize, 
  getGridSize, 
  goldLoc,
  getGoldXCoor,
  getGoldYCoor,
  pitsLoc,
  getPitsLoc,
  beaconsLoc,
  getBeaconsLoc,
  behavior,
  getBehavior
}) => (
  <Container>
    <Card>
      <Typography variant="subtitle1" gutterBottom>
        Enter parameters:
      </Typography>
      <TextField 
        id="outlined-basic" 
        className="text-input"
        label="Grid size" 
        variant="outlined" 
        value={gridSize}
        onChange={(event) => {
          getGridSize(event)
        }}
      />
      <Cluster>
        <TextField 
          id="outlined-basic" 
          className="gold-loc text-input"      
          label="Gold row number" 
          variant="outlined" 
          value={goldLoc.row}
          onChange={(event) => {
            getGoldXCoor(event)
          }}
        />
        <TextField 
          id="outlined-basic" 
          className="gold-loc text-input"
          label="Gold col number" 
          variant="outlined" 
          value={goldLoc.col}
          onChange={(event) => {
            getGoldYCoor(event)
          }}
        />
      </Cluster>
      <TextField 
        id="outlined-basic" 
        className="text-input"
        label="Pits location"
        placeholder="3, 5, 2, 8" 
        variant="outlined" 
        value={pitsLoc}
        onChange={(event) => {
          getPitsLoc(event)
        }}
      />
      <TextField 
        id="outlined-basic" 
        className="text-input"
        label="Beacons location"
        placeholder="4, 6, 3, 9" 
        variant="outlined" 
        value={beaconsLoc}
        onChange={(event) => {
          getBeaconsLoc(event)
        }}
      />
      <Typography component="div" className="rational-behavior">
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item>Random</Grid>
          <Grid item>
            <AntSwitch checked={behavior} onChange={getBehavior} />
          </Grid>
          <Grid item>Smart</Grid>
        </Grid>
        </Typography>
      <Link to='/gold-miner'>
        <Button variant="contained">Start Gold Miner</Button>
      </Link>
    </Card>
  </Container>       
)

export default Menu;