import React, {useEffect} from 'react';
import Header from '../Header/Header';
import User from '../User/User';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes';

interface Props {
    isAuth: boolean,
    children: {}
}

const RequireAuth: React.FC<Props> = ({isAuth, ...props}) => {
    const navigate = useNavigate();

    console.log('RequireAuth RENDER AUTH', isAuth);

    useEffect(() => {
        isAuth ? navigate(ROUTES.trackers) : navigate(ROUTES.login)
    }, [isAuth])

   return !isAuth ? <><Header isAuth={isAuth}/><User /></> : <><Header isAuth={isAuth}/>{props.children}</>
};

export default RequireAuth;