import PropTypes from 'prop-types';

// project imports
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';

// Import EventBus
import EventBus from 'hooks/eventBus';

// ==============================|| GUEST GUARD ||============================== //

/**
 * Guest guard for routes having no auth required
 * @param {PropTypes.node} children children element/node
 */

const GuestGuard = ({ children }) => {
    const { active, account, chainId } = useAuth();

    useEffect(() => {
        if (active) {
            console.log('<:::Connect Wallet:::>', account);
        }
    }, [active]);

    return children;
};

GuestGuard.propTypes = {
    children: PropTypes.node
};

export default GuestGuard;
