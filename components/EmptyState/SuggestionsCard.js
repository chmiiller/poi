// @flow strict-local
import * as React from 'react';
import { Button, Platform, StyleSheet, Text, View, useColorScheme } from 'react-native';

import { AMIGO, BLUE_IOS, GRAY3, WHITE } from '../../constants/colors';

type SuggestionsCardProps = {
    onClick: any,
};

const SuggestionsCard = ({ onClick }: SuggestionsCardProps): React.Node => {
    const isDarkMode: boolean = useColorScheme() === 'dark';
    const suggestions: Array<string> = ['Restaurants', 'Gas Stations', 'Parking', 'Pizza', 'Groceries'];
    
    const Item = ({ name }: {name: string}): React.Node => {
        return (
            <View style={styles.buttonContainer}>
                <Button color={Platform.OS === 'ios' ? BLUE_IOS : AMIGO} title={name} onPress={() => {
                    if (onClick) {
                        onClick(name);
                    }
                }} />
            </View>
        );
    };
    return (
        <View>
            {Platform.OS !== 'ios' && (<Text style={[styles.title, { color: isDarkMode ? WHITE : GRAY3}]}>Discover</Text>) }
            {suggestions.map((name: string) => (<Item key={name} name={name} />))}
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        marginTop: 20,
        marginHorizontal: 24,
        borderRadius: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    }
});

export default SuggestionsCard;