// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDeviceAnalytics, IconHelp, IconSitemap, IconScan, IconReportMoney } from '@tabler/icons';

// constant
const icons = {
    IconDeviceAnalytics,
    IconHelp,
    IconSitemap,
    IconScan,
    IconReportMoney
};

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
    id: 'dashboard',
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: <FormattedMessage id="dashboard" />,
            type: 'item',
            url: '/',
            icon: icons.IconDeviceAnalytics,
            breadcrumbs: false
        },
        {
            id: 'gastracker',
            title: <FormattedMessage id="gastracker" />,
            type: 'item',
            url: '/gastracker',
            icon: icons.IconReportMoney,
            breadcrumbs: false
        },
        {
            id: 'etherscan',
            title: <FormattedMessage id="etherscan" />,
            type: 'item',
            url: 'https://etherscan.com/',
            icon: icons.IconScan,
            external: true,
            target: true
        },
        {
            id: 'bscscan',
            title: <FormattedMessage id="bscscan" />,
            type: 'item',
            url: 'https://bscscan.com/',
            icon: icons.IconScan,
            external: true,
            target: true
        },
        {
            id: 'polygonscan',
            title: <FormattedMessage id="polygonscan" />,
            type: 'item',
            url: 'https://polygonscan.com/',
            icon: icons.IconScan,
            external: true,
            target: true
        },
        {
            id: 'help',
            title: <FormattedMessage id="help" />,
            type: 'item',
            url: '/help',
            icon: icons.IconHelp,
            breadcrumbs: false
        }
    ]
};

export default other;
