import React from 'react';
import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
import { ToolbarItems } from './features/toolbar-item/ToolbarItems';
import './App.css';

function App() {
  // if (loading) {
  //   return <AppLoading />;
  // }

  return (
    <>
    <header>
      Sketchem App
    </header>
    <div className="App">
        <ToolbarItems />
    </div>
    </>
  );
}

export default App;
