import React, { useState, useRef, useContext } from 'react';
import { Button } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import './css/fileupload.css';
import Upload from './images/upload.svg'
import csvtojson from 'csvtojson';
import { gql, useMutation } from '@apollo/client';
import { AuthContext } from '../context/authContext';
import Papa from "papaparse";


const CREATE_GROUPS = gql`
    mutation Mutation($cid: ID!, $groupNumber: String, $groupName: String) {
    createGroup(CID: $cid, groupNumber: $groupNumber, groupName: $groupName)
    }
`

function FileUpload() {
    const { user } = useContext(AuthContext);
    const ref = useRef();
    const [image, setImage] = useState(null);
    const [fileName, setFileName] = useState("No selected file");
    const [createGroup] = useMutation(CREATE_GROUPS)

    const reset = () => {
        setFileName("No selected file")
        setImage(null)
        ref.current.value = "";
    }

    const handleFileUpload = () => {
        const file = ref.current.files[0];
        if (!file)
            return;

        Papa.parse(file, {
            header: false,
            skipEmptyLines: true,
            complete: function (results) {
                console.log(results.data)
                results.data.forEach((row) => {
                    createGroup({
                        variables: {
                            cid: user.id,
                            groupNumber: row[0],
                            groupName: row[1],
                        }
                    })
                })
            }
        },
        );
    };

    return (
        <div className='uploadWrapper'>
            <h2 className='uploadTitle'>Upload Design Projects File</h2>
            <form className='uploadedForm'
                onClick={() => document.querySelector(".uploadInput").click()}>
                <input className='uploadInput' accept='.csv, .xls, xlsx' type='file' ref={ref}
                    onChange={({ target: { files } }) => {
                        files[0] && setFileName(files[0].name)
                        if (files) {
                            setImage(URL.createObjectURL(files[0]));
                        }
                    }} />

                {image ?
                    <img className='uploadImg' src={image} />
                    :
                    <img className='uploadIcon' src={Upload} />

                }
            </form>
            <div className='currentFile'>
                <div className='currentName'>{fileName}<br />
                    <Button size='small' sx={{ color: 'white', backgroundColor: 'blue' }} onClick={handleFileUpload}><CheckIcon /></Button>
                    <Button size='small' sx={{ color: 'white', backgroundColor: 'red' }} onClick={reset}><DeleteIcon /></Button>
                </div>
            </div>
        </div>
    )
}

export default FileUpload