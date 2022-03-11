// auth provider
import { useWeb3React } from '@web3-react/core';

// ==============================|| AUTH HOOKS ||============================== //

const useAuth = () => {
    const { active, account, chainId } = useWeb3React();
    return { active, account, chainId };
};

export default useAuth;
