import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// sample page routing
const Help = Loadable(lazy(() => import('views/help')));
const GasTracker = Loadable(lazy(() => import('views/gastracker')));
const Dashboard = Loadable(lazy(() => import('views/pages/Default')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/help',
            element: <Help />
        },
        {
            path: '/',
            element: <Dashboard />
        },
        {
            path: '/gastracker',
            element: <GasTracker />
        }
    ]
};

export default MainRoutes;
