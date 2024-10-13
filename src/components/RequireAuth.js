import {useLocation, Navigate, Outlet} from 'react-router-dom';
import useAuth  from '../hooks/useAuth';

const RequireAuth = ({allowedRoles}) => {
    const {auth} = useAuth();
    const location = useLocation();

    console.log("Auth data: ", auth);
    const userRole = auth?.roles;

    return(
        allowedRoles.includes(userRole)
            ? <Outlet />
            : auth?.accessToken
                ? <Navigate to="/unauthorized" state={{from: location}} replace />
                : <Navigate to="/login" state={{from: location}} replace />
    );
}

export default RequireAuth;