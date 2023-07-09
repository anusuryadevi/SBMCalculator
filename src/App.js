import './App.css';
import Calc from './Calcuations';
import { useState } from 'react';
import Dashboard from './Dashboard';
import Calc2 from './Calc2';

function App() {

  const [open, setOpen] = useState(false)
  const [ calculator, setCalculator ] = useState(1)
  return (
    <div className="App">
      {
        calculator === 1 ?

          <Calc open={open} setOpen={setOpen} />
          :
          <Calc2 open={open} setOpen={setOpen}/>
      }
      <Dashboard open={open} setOpen={setOpen} setCalculator={setCalculator} calculator={calculator} />
    </div>
  );
}

export default App;
