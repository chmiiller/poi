// @flow strict-local
import * as React from 'react';
import { Pressable, StyleSheet, Text, useColorScheme } from 'react-native';

import { BLACK_89 } from '../../constants/colors';

type ErrorMessageProps = {
    type: string,
    onPress: any,
};

const ErrorMessage = ({ type, onPress }: ErrorMessageProps ): React.Node => {
    const isDarkMode: boolean = useColorScheme() === 'dark';
    const titleColor: string = isDarkMode ? 'white' : BLACK_89;
    let errorTitle: string = '';
    let errorMessage: string = '';
    switch (type) {
    case 'gps':
        errorTitle = `We couldn't find you!`;
        errorMessage = `Please check if your GPS is enabled and try searching again.`;
        break;
    case 'empty':
        errorTitle = `Ops! We didn't find that`;
        errorMessage = `Please try searching for something else.`;
        break;
    case 'api':
        errorTitle = `Ops, something is wrong`;
        errorMessage = `We couldn't find anything at the moment. Please try again later.`;
        break;
    
    default:
        errorTitle = `Ops, something is wrong`;
        errorMessage = `We couldn't find anything at the moment. Please try again later.`;
        break;
    }
    return (
        <Pressable onPress={onPress} style={[styles.card, { backgroundColor: isDarkMode ? BLACK_89 : 'white' }]}>
            <Text style={[styles.title, { color: titleColor }]}>{errorTitle}</Text>
            <Text style={[styles.subtitle, { color: titleColor }]}>{errorMessage}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        backgroundColor: 'white',
        margin: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { height: 3 },
        shadowOpacity: 0.45,
        shadowRadius: 5,
        elevation: 3,
    },
    title: {
        fontSize: 20,
        color: 'black',
        fontWeight: '600',
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'normal',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 8,
    },
});

export default ErrorMessage;