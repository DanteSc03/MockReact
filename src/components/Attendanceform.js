import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate } from "react-router-dom"

const AttendanceForm = () => {
  const [attendances, setAttendances] = useState([]); // List of user attendance records
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosPrivate.get('/events');
        setEvents(response.data);
      } catch (err) {
        setError('Failed to fetch events');
      }
    };

    fetchEvents();
  }, [axiosPrivate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosPrivate.get('/users');
        const usersData = response.data.map(user => ({
          userId: user.userId,
          username: user.username,
          attended: false // Default to absent
        }));
        setAttendances(usersData);
      } catch (err) {
        setError('Failed to fetch users');
      }
    };

    fetchUsers();
  }, [axiosPrivate]);

  const handleAttendanceChange = (userId) => {
    setAttendances(prevAttendances =>
      prevAttendances.map(user =>
        user.userId === userId ? { ...user, attended: !user.attended } : user
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    try {
      for (const user of attendances) {
        const attendanceData = {
          userId: user.userId,
          eventId: selectedEventId,
          attended: user.attended
        };
        
        // Send each attendance log individually
        await axiosPrivate.post('/attendances', attendanceData);
      }
      setSuccess('Attendance marked successfully for all users');
    } catch (err) {
      console.error(err.response?.data);  // Log error response for more details
      setError('Failed to mark attendance');
    }
  };
  

  return (
    <section>
      <h1>Mark Attendance</h1>
      <form onSubmit={handleSubmit}>
        <br />
        <table>
          <thead>
            <tr>
              <h2>Users</h2>
              <th><select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)} required>
            <option value="">Select an event</option>
            {events.length > 0 ? (
              events.map(event => (
                <option key={event.eventId} value={event.eventId}>
                  {new Date(event.eventDate).toLocaleDateString('en-US')}
                </option>
              ))
            ) : (
              <option disabled>No events available</option>
            )}
          </select></th>
            </tr>
          </thead>
          <tbody>
            {attendances.length > 0 ? (
              attendances.map(user => (
                <tr key={user.userId}>
                  <td>{user.username}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={user.attended}
                      onChange={() => handleAttendanceChange(user.userId)}
                    />
                    {user.attended ? 'presente' : 'ausente'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No users available</td>
              </tr>
            )}
          </tbody>
        </table>
        <br />
        <button type="submit">Send</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <br />
      <button onClick={goBack}>Go Back</button>
    </section>
  );
};

export default AttendanceForm;
