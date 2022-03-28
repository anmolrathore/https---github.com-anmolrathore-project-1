import { Route,Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login/Login';
import Showdata from './pages/show/Showdata';
import FileUpload from './pages/drag/FileUpload';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import HistoryTab from './pages/historytab/HistoryTab';

const App=()=>{
  useEffect(()=>{
    //  localStorage.setItem('token','')
    console.log(localStorage.getItem('token'));
    
  })
 const[files,setFiles]=useState([])
  const[data,setData]=useState([])

 return(
  <>
  <Routes>
    <Route exact='true' path='/' element={<Login/>}/>

    <Route path='/fileupload'  element={
      <PrivateRoute>
         <FileUpload files={files} data={data} setFiles={setFiles} setData={setData} />
      </PrivateRoute> 
    }/>
     <Route path='/detailedpage'  element={
      <PrivateRoute>
         <Showdata  files={files} data={data} setFiles={setFiles} setData={setData}/>
      </PrivateRoute> 
    }/>
    <Route path='/historytab' element={
    <PrivateRoute> <HistoryTab/></PrivateRoute>
     }/>
   </Routes>
   
      
  </>
)
}

export default App;

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to='/' />;
}
