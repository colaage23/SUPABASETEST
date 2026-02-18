import { NavigationContainer } from '@react-navigation/native';
import React, { JSX } from 'react';
import RootStacks from './src/Router/RootStacks';
import Home from './src/Home/Home';

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <RootStacks />
    </NavigationContainer>
  );
}

export default App;
