import React, { useState, useRef, useContext } from 'react';
import { Button } from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import './css/fileupload.css';
import Upload from './images/upload.svg'
import { gql, useMutation, useQuery } from '@apollo/client';
import { AuthContext } from '../context/authContext';
import Papa from "papaparse";


const CREATE_ACCOUNTS = gql`
    mutation Mutation($cid: ID, $groupNumber: Int, $groupName: String, $userLogin: String, $password: String, $firstname: String, $lastname: String, $role: String, $isSponsor: Int) {
        createAccounts(CID: $cid, groupNumber: $groupNumber, groupName: $groupName, userLogin: $userLogin, password: $password, firstname: $firstname, lastname: $lastname, role: $role, isSponsor: $isSponsor)
    }
`

const GET_GROUPS = gql`
query Query($coordinatorId: String) {
    getGroupsByCoordinator(coordinatorId: $coordinatorId) {
        _id
        coordinatorId
        groupName
        groupNumber
        projectField
        isSponsor
    }
}
`

function FileUpload(props) {
    const { user } = useContext(AuthContext);
    const ref = useRef();
    const [image, setImage] = useState(null);
    const [fileName, setFileName] = useState("No selected file");
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const { refetch } = useQuery(GET_GROUPS, {
        variables: { coordinatorId: user.id }
    });

    const [createAccounts] = useMutation(CREATE_ACCOUNTS, {
        onCompleted: () => {
            refetch()
        }
    });

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
                for (const row of results.data) {
                    setIsLoading(true);
                    setOpen(true);

                    try {
                        await createAccounts({
                            variables: {
                                cid: user.id,
                                groupNumber: parseInt(row[0]),
                                groupName: row[1],
                                userLogin: row[2],
                                password: row[3],
                                firstname: row[4],
                                lastname: row[5],
                                role: row[6],
                                isSponsor: parseInt(row[7])
                            },
                        });
                    } catch (error) {
                        console.error(`ERROR!! ${error}`);
                    }
                    setIsLoading(false);
                    setOpen(false);
                }
            },
        });
    };

    return (
        <>{isLoading ?
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            :

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
            </div>
        }
        </>
    )
}

export default FileUpload