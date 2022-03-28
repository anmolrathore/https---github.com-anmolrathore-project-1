import React from 'react'
import { Button } from '@mui/material';
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export const ExportToExcel = ({ apiData, fileName }) => {
    let apiArr = [];
    apiArr[0] = JSON.parse(apiData)
  const fileType ="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const exportToCSV = (apiArr, fileName) => {
    console.log(apiArr);
    const ws = XLSX.utils.json_to_sheet(apiArr);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);};
    return (
      <Button variant="contained" onClick={(e) => exportToCSV(apiArr, fileName)}>download</Button> 

    // <button onClick={(e) => exportToCSV(apiArr, fileName)}>Download</button>
  );};