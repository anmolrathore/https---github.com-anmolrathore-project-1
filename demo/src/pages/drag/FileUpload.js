import React, { useEffect } from "react";
import "./FileUpload.css";
import { useNavigate } from "react-router";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { Button } from "@mui/material";
import Showdata from "../show/Showdata";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ToysTwoTone } from "@mui/icons-material";
import { url } from "../../API";

const FileUpload = ({ files, data, setFiles, setData }) => {
  // navigate('/home')
  let navigate = useNavigate();
  // const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getRootProps, getInputProps, fileRejections, acceptedFiles } =
    useDropzone({
      accept: "image/*",

      onDrop: (acceptedFiles) => {
        acceptedFiles.map((file) =>
          setFiles(
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        );
      },
    });

   
  const handle_reupload=()=>{
    setFiles("")
  }
  

  const handle_upload = () => {
    if (files.length !== 0) {
      setLoading(true);
      var data = new FormData();
      data.append("file", files);

      var config = {
        method: "post",
        url: `${url}/analyze`,
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))} `,
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          if (response.data.error) {
            setLoading(false);

            console.log(response.data);
            toast.error(response.data.error);
          } else {
            setLoading(false);
            setData(response.data);
            navigate("/detailedpage");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      toast.error("kindly select a file");
    }
  };

  return (
    <>
      <div className="blockk1">
        <ToastContainer />
        <div className="header">
          <Navbar />
        </div>

        <div className="outer">
          <div className="inner">
            <div className="inner-heading">
              <h1>upload your file here</h1>
              {/* {thumbs} */}
            </div>
            {files.name ? <div className="filespreview" ><img src={files.preview} /></div> :
            <div className="parent-upload-container">
              <div className="upload-container">
                {/* <img src={JSON.parse(localStorage.getItem('image'))} style={{width:'500px'}}/>  */}

                <section >
                  <div {...getRootProps({ className: "dropzone" })}>
                    <input {...getInputProps()} />
                    <div className="drag-icon">
                      <img
                        className="icoico"
                        src="images/icoico.svg"
                        alt="icoico"
                      />
                    </div>
                    <div className="drag-content">
                      {" "}
                      <p>Drag and drop or browse your files</p>
                    </div>
                    {/* <img src={files.preview}/> */}
                  </div>
                </section>
              </div>
            </div> }
            {loading && (
              <div>
                {" "}
                <Box
                  sx={{ display: "flex" }}
                  style={{
                    justifyContent: "center",
                    flexDirection: "row",
                    marginTop: "1rem",
                  }}
                >
                  {" "}
                  <CircularProgress />{" "}
                </Box>
              </div>
            )}

            <div className="drag-done-btn">
              {/* <Link to="/detailedpage" className='btn btn-submit'>Submit</Link> */}
              <Button variant="contained" onClick={handle_upload}>
                Done
              </Button>
              {files.name ? 
              <Button variant="contained" onClick={handle_reupload} style={{marginLeft:"10px"}} >
                ReUpload
              </Button>
              : null }
            </div>
          </div>
        </div>
        <div className="footer">
          <Footer />
        </div>
      </div>
    </>
  );
};
export default FileUpload;
