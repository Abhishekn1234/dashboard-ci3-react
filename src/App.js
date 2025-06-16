import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './components/Dashboard';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
     <Dashboard/>
     <ToastContainer />
    </>
    
   
  );
}

export default App;
