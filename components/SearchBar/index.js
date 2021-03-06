// @flow strict-local
import * as React from 'react';
import { StyleSheet, TextInput, View, useColorScheme } from 'react-native';

import { ATOM_GRAY, GRAY0, GRAY2, GRAY3, BLACK_89, WHITE } from '../../constants/colors';
import { SEARCH_PLACEHOLDER } from '../../constants/strings';

type SearchBarProps = {
    suggestedTerm?: string,
    onSearch: any,
};

const SearchBar = ({ suggestedTerm, onSearch }: SearchBarProps): React.Node => {
    const isDarkMode: boolean = useColorScheme() === 'dark';
    const titleColor: string = isDarkMode ? WHITE : BLACK_89;

    const [value, setSearchValue] = React.useState('');

    const onChangeText = (text: string) => {
        setSearchValue(text);
    };

    React.useEffect(() => {
        setSearchValue(suggestedTerm);
    }, [suggestedTerm]);

    return (
        <View style={[styles.barContainer, {
            backgroundColor: isDarkMode ? ATOM_GRAY : GRAY0,
            borderColor: isDarkMode ? BLACK_89 : GRAY2,
        }]}>
            <TextInput
                selectionColor={titleColor}
                placeholderTextColor={GRAY3}
                onSubmitEditing={() => { onSearch(value); }}
                placeholder={SEARCH_PLACEHOLDER}
                style={[styles.textInput, { color: titleColor }]}
                value={value}
                onChangeText={onChangeText}
                keyboardAppearance={isDarkMode ? 'dark' : 'light'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    barContainer: {
        backgroundColor: WHITE,
        borderColor: BLACK_89,
        borderBottomWidth: 1,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        margin: 12,
        height: 50,
    },
    textInput: {
        flex: 1,
        fontSize: 18,
        color: BLACK_89,
        paddingTop: 0,
        paddingBottom: 0,
    },
});

export default SearchBar;