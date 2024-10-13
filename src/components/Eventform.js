import { useState } from "react";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate } from "react-router-dom"

const EventForm = () => {
  const [eventDate, setEventDate] = useState(new Date().toISOString().split("T")[0]); // Default to today's date
  const axiosPrivate = useAxiosPrivate();
  const [errorMessage, setErrorMessage] = useState(""); 
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const goBack = () => navigate(-1);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setErrorMessage("");
      setSuccess("");

      // Send the event date to the server on the /events endpoint
      await axiosPrivate.post("/events", { eventDate });
      setSuccess("Event created successfully!");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // Event already exists, handle 409 conflict
        setErrorMessage("An event on this date already exists. Please choose another date.");
      } else {
        console.error("Error creating event:", error);
        setErrorMessage("Failed to create event.");
      }
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit} >
        <h2>Create Event</h2>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} 
        {success && <p style={{ color: 'green' }}>{success}</p>} 

        <label htmlFor="eventDate">
          Event Date:
        </label>
        <input
          type="date"
          id="eventDate"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />

        <button type="submit">
          Submit
        </button>
      </form>
      <div className="flexGrow">
                <button onClick={goBack}>Go Back</button>
            </div>
    </section>
  );
};

export default EventForm;
