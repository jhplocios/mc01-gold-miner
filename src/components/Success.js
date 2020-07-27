import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@material-ui/core';

const Container = styled.div`
display: flex;
justify-content: center;
padding-top: 50px;

h5 {
  color: green;
}

a {
  justify-self: center;
  margin-top: 20px;
}
`

const Cluster = styled.div`
display: flex;
justify-content: center;

h6:first-child {
  margin-right: 10px;
}
`
const Card = styled.div`
  display: grid;
  justify-content: center;
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

const Success = () => {
  const { move, rotate, scan } = useParams();
  return (
    <Container>
      <Card>
        <Typography variant="h5" gutterBottom>
          Search successful
        </Typography>
        <Cluster>
          <Typography variant="subtitle1" gutterBottom>
            Total moves:
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {move}
          </Typography>
        </Cluster>
        <Cluster>
          <Typography variant="subtitle1" gutterBottom>
            Total rotate:
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {rotate}
          </Typography>
        </Cluster>
        <Cluster>
          <Typography variant="subtitle1" gutterBottom>
            Total scan:
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {scan}
          </Typography>
        </Cluster>
        <Link to='/'>
          <Button variant="contained">Back</Button>
        </Link> 
      </Card>
    </Container>
  )
}

export default Success;