/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';
import {
    SafeAreaView,
    StatusBar,
    useColorScheme,
} from 'react-native';

import { BLACK_CONTAINER, WHITE } from './constants/colors';
import SearchScreen from './scenes/search';

const App = (props: {}): React.Node => {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? BLACK_CONTAINER : WHITE,
    };

    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <SearchScreen />
        </SafeAreaView>
    );
};

export default App;
