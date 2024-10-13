import { Link } from "react-router-dom"
import Attendance from "./Attendance"

const Grades = () => {
    return (
        <section>
            <h1>Grades</h1>
            <br />
            <Attendance />
            <br />
            <div className="flexGrow">
                <Link to="/">Home</Link>
            </div>
        </section>
    )
}

export default Grades