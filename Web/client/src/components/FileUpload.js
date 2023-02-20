import React from 'react';
import './css/fileupload.css';

const FileUpload = ({files, setFiles}) => {
 
    const  uploadHandler = () => {}
    return(
        <>
            <div className='uploadWrapper'>
                <div className='uploadedFiles'>
                    <input type='file'/>
                </div>
            </div>
        </>
    )
}

export default FileUpload