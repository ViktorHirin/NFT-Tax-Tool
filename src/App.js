import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import Locales from 'ui-component/Locales';
import NavigationScroll from 'layout/NavigationScroll';
// import RTLLayout from 'ui-component/RTLLayout';
import Snackbar from 'ui-component/extended/Snackbar';

// web3 Provider
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

// ==============================|| APP ||============================== //

function getLibrary(provider) {
    const library = new Web3Provider(provider);
    library.pollingInterval = 8000;
    return library;
}

const App = () => {
    const customization = useSelector((state) => state.customization);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>
                <CssBaseline />
                {/* RTL layout */}
                {/* <RTLLayout> */}
                <Locales>
                    <NavigationScroll>
                        <Web3ReactProvider getLibrary={getLibrary}>
                            <>
                                <Routes />
                                <Snackbar />
                            </>
                        </Web3ReactProvider>
                    </NavigationScroll>
                </Locales>
                {/* </RTLLayout> */}
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
