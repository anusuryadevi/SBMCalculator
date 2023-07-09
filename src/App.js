import './App.css';
import Calc from './Calcuations';
import { useState } from 'react';

function App() {
  const [tableData, setTableData] = useState([{
    key:'1',
    count :'',
    strength :'',
    csp :''
  }]) 
  const [lastKey, setLastKey] = useState(1)
  return (
    <div className="App">
      <Calc tableData={tableData} setTableData={setTableData} lastKey={lastKey} setLastKey={setLastKey}/>
    </div>
  );
}

export default App;
