import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import styled from 'styled-components';
import './index.css';

const Container = styled.div`
  display: grid;
  height: calc(100vh - 20px);
  width: calc(100vw - 20px);
  padding: 10px;
  background-color: #f5f5f5;
`

ReactDOM.render(
  <React.StrictMode>
    <Container>
      <App />
    </Container>
  </React.StrictMode>,
  document.getElementById('root')
);
