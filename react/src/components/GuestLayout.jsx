import { Outlet } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import { Navigate } from 'react-router-dom';

function GuestLayout() {
  const {userToken} = useStateContext();
  if (userToken){
    return <Navigate to="/"/>
  }

    return (
        <div>
            <Outlet />
        </div>
    );
}

export default GuestLayout;