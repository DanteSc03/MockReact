import { Link } from "react-router-dom"

const Admin = () => {
    return (
        <section>
            <h1>Admins Page</h1>
            <div className="flexGrow">
                <Link to="/attendanceform">Mark Attendance</Link>
            </div>
            <br />
            <div className="flexGrow">
                <Link to="/eventform">Create Event</Link>
            </div>
            <br />
            <div className="flexGrow">
                <Link to="/users">View Users</Link>
            </div>
            <br />
            <div className="flexGrow">
                <Link to="/fileupload">Upload Files</Link>
            </div>
            <br />
            <div className="flexGrow">
                <Link to="/">Home</Link>
            </div>
        </section>
    )
}

export default Admin