import AdminNav from './components/navigation/Navigationbar';
import './App.css'
import MainRoute from './routes/Mainroutes'
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <>
    <BrowserRouter>
    <MainRoute/>
    </BrowserRouter>
    </>
  )
}

export default App
