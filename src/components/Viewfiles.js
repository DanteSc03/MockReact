import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';

const ViewFiles = () => {
  const [eventDate, setEventDate] = useState('');
  const [files, setFiles] = useState([]);
  const [events, setEvents] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
  setEventDate(selectedDate);
  if (selectedDate) {
    fetchFiles(selectedDate); // Automatically fetch files when date is selected
  }

  };

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

  const fetchFiles = async (date) => {
    setLoading(true);
    setError('');

    try {
        const response = await axiosPrivate.get(`/eventfiles/date/${date}`);
        if (Array.isArray(response.data)) {
          setFiles(response.data);
        } else if (response.data.message) {
          setError(response.data.message);
        } else {
          setError('Unexpected response format.');
        }
      } catch (err) {
        setError('Error fetching files.');
      } finally {
        setLoading(false);
      }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString); 
    const day = String(date.getDate()).padStart(2, '0'); 
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear(); 
    return `${day}-${month}-${year}`; 
  };

  const handleDownload = async (fileId) => {
    try {
        const response = await axiosPrivate.get(`/eventfiles/download/${fileId}`, {
            responseType: 'blob', 
        });

        const contentDisposition = response.headers['content-disposition'];
        let fileName = `download-${fileId}`; 
    
        if (contentDisposition) {
            const matches = /filename[^;=\n]*=((['"]).*?\2|([^;\n]*))/i.exec(contentDisposition);
            if (matches != null && matches[1]) {
                fileName = matches[1].replace(/['"]/g, ''); 
            }
        }

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName); 

        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading file:', error);
        setError('Error downloading file.'); 
    }
};

  return (
    <section>
      <h1>View Files for Event Date</h1>
      
      <label htmlFor="eventSelect">Select Event Date:</label>
      <select id="eventSelect" value={eventDate} onChange={handleDateChange}>
        <option value="">Select an event</option>
        {events.map((event) => (
          <option key={event.id} value={event.eventDate}>
            {formatDate(event.eventDate)} 
          </option>
        ))}
      </select>
      

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <h2>Files:</h2>
      <ul>
                {files.map((file) => {
                    console.log('Rendering file:', file); 
                    return (
                        <li key={file.fileId}>
                            <span
                                onClick={() => handleDownload(file.fileId)}
                                style={{ cursor: 'pointer', color: 'lightblue', textDecoration: 'underline' }}
                            >
                                {file.fileName}
                            </span>
                        </li>
                    );
                })}
            </ul>

      <div className="flexGrow">
        <button onClick={goBack}>Go Back</button>
      </div>
    </section>
  );
};

export default ViewFiles;
