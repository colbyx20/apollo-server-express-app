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


const CREATE_STUDENTS = gql`
mutation CreateStudentAccounts($cid: ID!, $userLogin: String, $password: String, $firstname: String, $lastname: String, $groupNumber: Int) {
  createStudentAccounts(CID: $cid, userLogin: $userLogin, password: $password, firstname: $firstname, lastname: $lastname, groupNumber: $groupNumber)
}
`

const CREATE_ACCOUNTS = gql`
    mutation Mutation($cid: ID, $groupNumber: Int, $groupName: String, $userLogin: String, $password: String, $firstname: String, $lastname: String) {
    createAccounts(CID: $cid, groupNumber: $groupNumber, groupName: $groupName, userLogin: $userLogin, password: $password, firstname: $firstname, lastname: $lastname)
    }
`

const CREATE_GROUP = gql`

    mutation Mutation($cid: ID!, $groupNumber: Int, $groupName: String) {
    createGroup(CID: $cid, groupNumber: $groupNumber, groupName: $groupName)
    }
`

function FileUpload() {
    const { user } = useContext(AuthContext);
    const ref = useRef();
    const [image, setImage] = useState(null);
    const [fileName, setFileName] = useState("No selected file");
    const [createStudentAccounts] = useMutation(CREATE_STUDENTS);
    const [createAccounts] = useMutation(CREATE_ACCOUNTS);
    const [createGroup] = useMutation(CREATE_GROUP)

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
            complete: async function (results) {
                console.log(results.data)
                for (const row of results.data) {
                    await createAccounts({
                        variables: {
                            cid: user.id,
                            groupNumber: parseInt(row[0]),
                            groupName: row[1],
                            userLogin: row[2],
                            password: row[3],
                            firstname: row[4],
                            lastname: row[5]
                        }
                    })
                }
                // results.data.forEach((row) => {
                //     createAccounts({
                //         variables: {
                //             cid: user.id,
                //             groupNumber: parseInt(row[0]),
                //             groupName: row[1],
                //             userLogin: row[2],
                //             password: row[3],
                //             firstname: row[4],
                //             lastname: row[5]
                //         }
                //     })
                // createStudentAccounts({
                //     variables: {
                //         cid: user.id,
                //         userLogin: row[0],
                //         password: row[1],
                //         firstname: row[2],
                //         lastname: row[3],
                //         groupNumber: parseInt(row[4])
                //     }
                // })
                // })
            }
        },
        );
    };

    const handleFileUpload2 = () => {
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
                            groupNumber: parseInt(row[0]),
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
                <div className='currentName'>Import Students<br />
                    <Button size='small' sx={{ color: 'white', backgroundColor: 'blue' }} onClick={handleFileUpload}><CheckIcon /></Button>
                    <Button size='small' sx={{ color: 'white', backgroundColor: 'red' }} onClick={reset}><DeleteIcon /></Button>
                </div>
            </div>

            <div className='currentFile'>
                <div className='currentName'>Import Groups<br />
                    <Button size='small' sx={{ color: 'white', backgroundColor: 'blue' }} onClick={handleFileUpload2}><CheckIcon /></Button>
                    <Button size='small' sx={{ color: 'white', backgroundColor: 'red' }} onClick={reset}><DeleteIcon /></Button>
                </div>
            </div>
        </div>
    )
}

export default FileUpload