import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]); // Array to hold multiple files
  const [eventId, setEventId] = useState(''); 
  const [events, setEvents] = useState([]); 
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const axiosPrivate = useAxiosPrivate(); 
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  // Fetch the list of events for the dropdown
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosPrivate.get('/events');
        setEvents(response.data);
      } catch (err) {
        setMessage('Failed to fetch events');
      }
    };

    fetchEvents();
  }, [axiosPrivate]);

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]); // Handle multiple files
    setMessage('');
    setProgress(0);
  };

  const handleEventChange = (e) => {
    setEventId(e.target.value);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0 || !eventId) {
      setMessage('Please select files and choose an event.');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('files', file); // Append each file to the form data
    });
    formData.append('eventId', eventId);

    try {
      await axiosPrivate.post('eventfiles/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      setMessage('Files uploaded successfully!');
      setSelectedFiles([]); // Clear the files after upload
    } catch (error) {
      console.error('Error uploading files:', error);
      setMessage('Error uploading files.');
    }
  };

  return (
    <section>
      <h2>Upload Files for Event</h2>
      <form onSubmit={handleUpload}>
        <div>
          <label htmlFor="event">Select Event:</label>
          <select id="event" value={eventId} onChange={handleEventChange} required>
            <option value="">Select an event</option>
            {events.length > 0 ? (
              events.map((event) => (
                <option key={event.eventId} value={event.eventId}>
                  {new Date(event.eventDate).toLocaleDateString('en-US')}
                </option>
              ))
            ) : (
              <option disabled>No events available</option>
            )}
          </select>
        </div>
        <div>
          <label htmlFor="file">Choose Files:</label>
          <input type="file" id="file" onChange={handleFileChange} required multiple />
        </div>
        <div>
          <button type="submit">Upload Files</button>
        </div>
      </form>
      {progress > 0 && <p>Upload Progress: {progress}%</p>}
      {message && <p>{message}</p>}
      <br />
      <div className="flexGrow">
        <button onClick={goBack}>Go Back</button>
      </div>
    </section>
  );
};

export default FileUpload;
