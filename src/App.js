import './App.css';
import Calc from './Calcuations';
import { useState } from 'react';
import Dashboard from './Dashboard';
import Calc2 from './Calc2';
import TMTOTPI from './TMTOTPI';
import Production from './Production';

function App() {

  const [open, setOpen] = useState(false)
  const [calculator, setCalculator] = useState(1)
  return (
    <div className="App">
      {
        calculator === 1 ?

          <Calc open={open} setOpen={setOpen} />
          : calculator === 2 ?
            <Calc2 open={open} setOpen={setOpen} /> : calculator === 3 ?
            <TMTOTPI open={open} setOpen={setOpen} /> :
            <Production open={open} setOpen={setOpen} />

      }
      <Dashboard open={open} setOpen={setOpen} setCalculator={setCalculator} calculator={calculator} />
    </div>
  );
}

export default App;
