import {useState, useEffect} from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import {useNavigate} from 'react-router-dom';


const Users = () => {
    const [attendanceData, setAttendanceData] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getAttendance = async () => {
            try {
                const response = await axiosPrivate.get('attendances/percentage-all',{
                    signal: controller.signal
                });
                console.log(response.data);
                isMounted && setAttendanceData(response.data);
            } catch (err) {
                console.error('Failed to load attendance data');
            }
        };

        getAttendance();

        return () => {
            isMounted = false;
            controller.abort();
        }
    },[axiosPrivate])

    return (
        <section>
            <h2>Users List</h2>
            {attendanceData?.length
            ?(
                <ul>
                    {attendanceData.map((user, i) => (
                        <li key={i}>
                            {user.username} - Attendance Score: {user.attendancePercentage}
                        </li>
                    ))}
                </ul>
            ) : <p>No users to display</p>
            }
            <br />
            <div className="flexGrow">
                <button onClick={goBack}>Go Back</button>
            </div>
        </section>
    );
}

export default Users
