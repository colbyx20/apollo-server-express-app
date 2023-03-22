import React, { useState, useRef} from 'react';
import { Button } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import './css/fileupload.css';
import Upload from './images/upload.svg'
import csvtojson from 'csvtojson';


function FileUpload(){
    const ref = useRef();

    const[image, setImage] = useState(null);
    const [fileName, setFileName] = useState("No selected file");
    const [jsonData, setJsonData] = useState([]);

    const reset = () =>{
        setFileName("No selected file")
        setImage(null)
        ref.current.value = "";
    }

    const handleFileUpload = () => {
        const file = ref.current.files[0];
        if(!file)
            return;
      
        const reader = new FileReader();
      
        reader.onload = () => {
          csvtojson()
            .fromString(reader.result)
            .then((json) => {
              setJsonData(json);
              console.log(jsonData);
            });
        };
      
        reader.readAsText(file);
    };


    return(
            <div className='uploadWrapper'>
                <h2 className='uploadTitle'>Upload Design Projects File</h2>
                <form className='uploadedForm'
                onClick={() => document.querySelector(".uploadInput").click()}>
                    <input className='uploadInput' accept='.csv, .xls, xlsx' type='file' ref={ref}
                    onChange={({ target: {files}}) =>{
                        files[0] && setFileName(files[0].name)
                        if(files){
                            setImage(URL.createObjectURL(files[0]));
                        }
                    }}/>
                    
                    {image ?
                    <img className='uploadImg' src={image}/>
                    :
                    <img className='uploadIcon' src={Upload}/>
                        
                }
                </form>
                <div className='currentFile'>
                    <div className='currentName'>{fileName}<br/>
                    <Button size='small' sx={{color: 'white', backgroundColor: 'blue'}} onClick={handleFileUpload}><CheckIcon /></Button>
                    <Button size='small' sx={{color: 'white', backgroundColor: 'red'}} onClick={reset}><DeleteIcon /></Button>
                    </div>
                </div>
            </div>
    )
}

export default FileUpload