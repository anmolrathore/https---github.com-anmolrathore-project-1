import React, { useEffect } from "react";
import "./showdata.css";
import { Button } from "@mui/material";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import axios from "axios";
import {ExportToExcel} from '../../components/ExportToExcel'
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
const Showdata = ({ files, data, setFiles, setData }) => {
  const fileName = files.name;
  let navigate = useNavigate();
  useEffect(()=>{
    // console.log(data,'data')
  },[data])

  const clearimage=()=>{
   console.log("ghhj")
    setFiles('')
    navigate('/fileupload')
  }
  return (
    <>
      {/* {console.log(JSON.stringify(data))} */}
      <div className="container">
        <div className="header">
          <Navbar/>
        </div>

        <div className="middle-data">
          <div className="left-d">
            <h1>uploaded file</h1>
            <div className="check-book">
              {/* <img src='images/cheque.svg'/> */}
              <TransformWrapper>
                <TransformComponent>
                  <img src={files.preview} />
                </TransformComponent>
              </TransformWrapper>

              <h2> {files.name}</h2>
            </div>
            <div className="outlined-btn">
              <Button variant="outlined" onClick={clearimage}>upload another file</Button>
            </div>
          </div>
          <div className="right-d">
            <h1>parsed data</h1>
            <div className="staticdata">
              <div className="image-data-container" >
                {Object.keys(data).map((x)=>{
                  return(
                    <div className="row1">
                    <h2 style={{textTransform:'capitalize'}}>{x.replace(/_/g, " ")}</h2>
                    <p style={{textTransform:'capitalize'}}>{data[x]}</p>
                  </div>
                  )
                })}
               
               
              </div>
              <div className="right-btn" style={{marginTop:'33px'}}>
                {/* <Button variant="contained">download</Button> */}
                <ExportToExcel apiData={JSON.stringify(data)} fileName={fileName} />
              </div>
            </div>
          </div>
        </div>

        <div className="footer">
          <Footer/>
        </div>
      </div>
    </>
  );
};

export default Showdata;
