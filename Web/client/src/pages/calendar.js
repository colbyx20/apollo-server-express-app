import { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import CustomSidebar from '../components/Sidebar';
import { gql, useMutation } from '@apollo/client';
import dayjs from 'dayjs';
import { Button } from "@mui/material";
import { styled } from '@mui/material/styles';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { GetAllCoordinatorSchedule } from '../components/GetAllCoordinatorSchedule'
import { GET_All_COORDINATOR_SCHEDULE } from '../components/GetAllCoordinatorSchedule'
import { GetProfessorSchedule } from '../components/GetProfessorSchedule'
import { GET_PROFESSOR } from '../components/GetProfessorSchedule'

// import { CreateProfessorSchedule } from '../components/CreateProfessorSchedule'
import "../components/css/calendar2.css"

const ADD_DATES = gql`
    mutation Mutation($id: ID!, $privilege: String!, $time: [String]) {
    createProfessorSchedule(ID: $id, privilege: $privilege, time: $time)
    }
`

function Calendar(props) {
    // user data lives in here  
    const { user, logout } = useContext(AuthContext);
    let navigate = useNavigate();

    const [selectedDates, setDate] = useState([]);
    const [deleteDate, setDeleteDate] = useState(null);
    const [createProfessorSchedule] = useMutation(ADD_DATES);
    const [clearSelection, setClear] = useState(false);
    const [udpateSchedule, setUpdate] = useState(false);

    const onLogout = () => {
        logout();
        navigate('/');
    }

    const handleCheckedStatesChange = (checkedStates) => {
        setDate(checkedStates);
    };

    const handleIndexRest = (index) => {
        setDeleteDate(index)
    }

    const updatedDates = (index) => {
        setDeleteDate(index);
    };

    const RedButton = styled(Button)(({ theme }) => ({
        color: 'white',
        backgroundColor: '#f44336',
        '&:hover': {
            backgroundColor: '#d32f2f',
        },
        float: 'right',
        marginRight: '5px',
    }));

    const SubmitButton = styled(Button)(({ theme }) => ({
        margin: 'auto',
        marginTop: '5px',
        width: '91%',
        marginLeft: '4.5%'
    }));

    function returnCurrentDateTime(date1) {
        let date = new Date(date1);

        date.setHours(date.getHours() - 4);
        const edtTime = date.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true, timeZone: "America/New_York" });
        return edtTime;
    }

    function handleAddAvailability(selectedDates) {

        let availDates = []
        for (let i = 0; i < selectedDates.length; i++) {
            let date = new Date(selectedDates[i].time);
            let offset = date.getTimezoneOffset();
            date.setMinutes(date.getMinutes() - offset);
            availDates.push(date.toISOString());
        }

        createProfessorSchedule({
            variables: { id: user.id, privilege: user.privilege, time: availDates },
            refetchQueries: [
                { query: GET_All_COORDINATOR_SCHEDULE, variables: { id: user.id } },
                { query: GET_PROFESSOR, variables: { id: user.id } }
            ]
        })

        setClear(true);
        setUpdate(true);

    }
    return (
        <>
            <div className='calendar2Page'>
                {user !== null ?
                    <>
                        <CustomSidebar />
                        <div className='calendar2Wrapper'>
                            <div className='userInfo'>
                                <p className='accountHeader'>Schedule Creator</p>
                            </div>
                            <div className='leftContainer'>
                                <div className='timeListContainer'>
                                    <h2 className='timeListTitle'>Pick Schedule</h2>
                                    <div className='listContainer'>
                                        <GetAllCoordinatorSchedule
                                            onCheckedStatesChange={handleCheckedStatesChange}
                                            updatedCheckedStates={deleteDate}
                                            onDelete={handleIndexRest}
                                            onSubmit={clearSelection} />
                                    </div>
                                </div>
                            </div>
                            <div className='rightContainer'>
                                <div className='timeListContainer'>
                                    <h2 className='timeListTitle'>Selected Items</h2>
                                    <div className='timeItemContainer'>
                                        {selectedDates.map((data, index) => {
                                            return (
                                                <div className='timeItem' key={data._id}>
                                                    <div className='timeData'>
                                                        {new Date(data.time).toLocaleDateString('en-US', { month: 'long' })}{' '}
                                                        {new Date(data.time).getDate().toLocaleString('en-US', { minimumIntegerDigits: 2 })}
                                                        {new Date(data.time).getDate() % 10 === 1 ? 'st' : new Date(data.time).getDate() % 10 === 2 ? 'nd' : new Date(data.time).getDate() % 10 === 3 ? 'rd' : 'th'},{' '}
                                                        {returnCurrentDateTime(data.time) + " "}
                                                    </div>
                                                    <div>
                                                        {"Room: " + data.room + " "}
                                                    </div>
                                                    <div>{data.coordinatorInfo?.coordinatorLName}</div>
                                                    <RedButton onClick={() => updatedDates(index)}><DeleteForeverIcon /></RedButton>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <SubmitButton
                                        variant="contained"
                                        color="primary"
                                        disabled={selectedDates.length <= 0}
                                        onClick={() => handleAddAvailability(selectedDates)}> Update Schedule</SubmitButton>

                                    <div className='currentSchedule'>
                                        <h2 className='timeListTitle'>Current Schedule</h2>
                                        <div className='scheduleContainer'>
                                            <GetProfessorSchedule onUpdate={udpateSchedule} />
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </>
                    :
                    <>
                        <div className='noUser'>
                            <h3>No Page Found</h3>
                            <Button style={{ color: 'white' }} onClick={onLogout}>Redirect to Login</Button>
                        </div>
                    </>
                }
            </div>
        </>
    )
}

export default Calendar;