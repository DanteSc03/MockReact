import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Layout from './components/Layout';
import Admin from './components/Admin';
import Missing from './components/Missing';
import Unauthorized from './components/Unauthorized';
import Lounge from './components/Lounge';
import LinkPage from './components/LinkPage';
import RequireAuth from './components/RequireAuth';
import PersistLogin from './components/PersistLogin';
import Grades from './components/Grades';
import Attendanceform from './components/Attendanceform.js';
import Eventform from './components/Eventform.js';
import Users from './components/Users';
import Fileupload from './components/Fileupload';
import Viewfiles from './components/Viewfiles';
import {Routes, Route} from 'react-router-dom';

const ROLES = {
  User: 2001,
  Editor: 1984,
  Admin: 5150
}

function App() {

  return (
    <Routes>
      <Route path = "/" element = {<Layout />}>
        {/* public Routes */}
        <Route path = "login" element = {<Login />} />
        <Route path = "register" element = {<Register />} />
        <Route path = "linkpage" element = {<LinkPage />} />
        <Route path = "unauthorized" element = {<Unauthorized />} />
        

        {/* We want to protect these private Routes */}
        <Route element = {<PersistLogin />}>
          <Route element = {<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin, ROLES.Editor]} />}>
            <Route path = "/" element = {<Home />} />
            <Route path = "grades" element = {<Grades />} />
            <Route path = "viewfiles" element = {<Viewfiles />} />
          </Route>

          <Route element = {<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path = "admin" element = {<Admin />} />
            <Route path = "attendanceform" element = {<Attendanceform />} />
            <Route path = "eventform" element = {<Eventform />} />
            <Route path = "users" element = {<Users />} />  
            <Route path = "fileupload" element = {<Fileupload />} />
          </Route>

          <Route element = {<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
            <Route path = "lounge" element = {<Lounge />} />
          </Route>
        </Route>

        {/* Catchall */}
        <Route path = "*" element = {<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;