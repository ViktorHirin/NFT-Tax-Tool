import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// project imports
import useAuth from 'hooks/useAuth';
import { useEffect } from 'react';

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const AuthGuard = ({ children }) => {
    const { active } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!active) {
            navigate('login', { replace: true });
        }
    }, []);

    return children;
};

AuthGuard.propTypes = {
    children: PropTypes.node
};

export default AuthGuard;
