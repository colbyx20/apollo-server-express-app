import { useEffect, useState, useContext } from "react";
import { gql, useQuery } from '@apollo/client';
import { AuthContext } from '../context/authContext';
import "../components/css/calendar2.css"
import { ToggleButton, Button, ToggleButtonGroup } from "@mui/material";

const GET_All_COORDINATOR_SCHEDULE = gql`
query Query {
  getFullTimeRange {
    _id
    times
  }
}
`

function DisplayDesignWeek(props) {
    const { user } = useContext(AuthContext);
    const [daysList, setDayList] = useState(props.daysList);
    const [selected, setSelected] = useState([]);
    const [selectedTime, setSelectedTime] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [inputValue, setInputValue] = useState('');
    // const { data } = useQuery(GET_All_COORDINATOR_SCHEDULE)
    // console.log(data);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        checkEmptyList();
    }

    const handleSelectedTime = (event, newSelected) => {
        setSelectedTime(newSelected);
        checkEmptyList();
    };

    const handleSelected = (event, newSelected) => {
        setSelected(newSelected);
        checkEmptyList();
    };

    useEffect(() => {
        setDayList(props.daysList);
    }, [props.daysList]);

    useEffect(() => {
        if (selected.length > 0 && selectedTime.length > 0 && inputValue != '') {
            setIsEmpty(true);
        } else {
            setIsEmpty(false);
        }
    }, [selected, selectedTime, inputValue]);



    if (daysList.length === 0) {
        return <div>No items to display.</div>;
    }

    const buttonList = daysList.map((day, index) =>
        <ToggleButton
            key={index}
            value={index}
            sx={{ height: '75px', width: '75px', }}
            variant="outlined"
        >
            {(day.getMonth() + 1) + "/" + day.getDate()}
        </ToggleButton>
    );

    const timeList = [
        "8:00am",
        "9:00am",
        "10:00am",
        "11:00am",
        "12:00pm",
        "1:00pm",
        "2:00pm",
        "3:00pm",
        "4:00pm",
        "5:00pm",
        "6:00pm",
        "7:00pm",
        "8:00pm",
    ]

    const TimeList = timeList.map((day, index) =>
        <ToggleButton
            key={index}
            value={index}
            sx={{ height: '75px', width: '75px', }}
        >
            {day}
        </ToggleButton>
    );

    const handleAddItmes = () => {
        // Add index values to something before clearing
        let timeIndex = [];

        selectedTime.forEach((t, index) => {
            timeIndex.push(selectedTime[index])
        })


        props.onScheduleDate(selected);
        props.onTimeRange(timeIndex);
        props.onRoomInput(inputValue);
        setSelected([]);
        setSelectedTime([]);
    }

    const checkEmptyList = () => {

        if (selected.length > 0 && selectedTime.length > 0 && inputValue != '')
            setIsEmpty(true);
    }

    return (
        <>
            {user.privilege === 'coordinator' ?
                <>
                    <div className="designWeekContainer">
                        <ToggleButtonGroup
                            value={selected}
                            onChange={handleSelected}
                            sx={{ marginRights: '50px' }}>
                            {buttonList}
                        </ToggleButtonGroup>
                    </div>
                    <div className="designWeekContainer">
                        <ToggleButtonGroup
                            value={selectedTime}
                            onChange={handleSelectedTime}
                            sx={{ marginRights: '50px' }}>
                            {TimeList}
                        </ToggleButtonGroup>
                    </div>
                    <div className="designWeekRoom">
                        <input
                            placeholder="Room Location"
                            className="designInput"
                            value={inputValue}
                            onChange={handleInputChange}
                        />
                    </div>
                </>
                :
                <>
                    <span style={{ color: 'red' }}></span>
                </>

            }
            <Button variant="contained" color="primary" type="submit"
                style={{ width: "82%", margin: "auto", marginTop: '4px', display: "flex", alignItems: "center" }}
                disabled={!isEmpty}
                onClick={handleAddItmes}
            >Add to Schedule</Button>
        </>
    )

}

export default DisplayDesignWeek;