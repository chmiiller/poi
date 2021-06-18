// @flow strict-local
import * as React from 'react';
import { Button, Linking, StyleSheet, Text, View, useColorScheme } from 'react-native';

import { BLACK_89 } from '../../constants/colors';

type PermissionNotGrantedProps = {
    onClick: any,
};

// const Section = ({ title, content, link }: SectionProps) => (
const PermissionNotGranted = ({ onClick }: PermissionNotGrantedProps): React.Node => {
    const isDarkMode: boolean = useColorScheme() === 'dark';
    const titleColor: string = isDarkMode ? 'white' : BLACK_89;
    return (
        <View style={[styles.card, { backgroundColor: isDarkMode ? BLACK_89 : 'white' }]}>
            <Text style={[styles.title, { color: titleColor }]}>{`We couldn't find you!`}</Text>
            <Text style={[styles.subtitle, { color: titleColor }]}>{`Please allow location access in the Settings app so we can search for places around you.`}</Text>
            <Button title={'Open Settings'} onPress={() => {
                Linking.openSettings();
            }}  />
            <Text style={[styles.subtitle, { color: titleColor }]}>{`Then when you're back, press "Done" to continue`}</Text>
            <Button title={'Done'} onPress={onClick}  />
        </View>
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

export default PermissionNotGranted;