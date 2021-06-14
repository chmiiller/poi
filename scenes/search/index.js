import React, { useState, createRef } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

import { BLACK_54 } from '../../constants/colors';
import { SEARCH_PLACEHOLDER, SEARCH_NOT_FOUND } from '../../constants/strings';
import SearchResultItem from '../../components/ListItem/SearchResultItem';
import { searchGame } from '../../api';

/* 
const isDarkMode = useColorScheme() === 'dark';
const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
};

style={[
    styles.sectionTitle,
    {
        color: isDarkMode ? Colors.white : Colors.black,
    },
]}>

*/
const styles = StyleSheet.create({
    barContainer: {
        backgroundColor: BLACK_54,
        padding: 8,
        borderColor: BLACK_54,
        borderBottomWidth: 0.5,
        margin: 8,
        flexDirection: 'row', 
        alignItems: 'center', 
        height: 50,
    },
    textInput: {
        flex: 1,
        fontSize: 18,
        color: BLACK_54,
        paddingTop: 0,
        paddingBottom: 0,
    },
    content: {
        backgroundColor: 'transparent', 
        width: '100%',
        padding: 8,
    },
    flatList: {
        marginTop: 0,
    },
    
});

const SearchScreen = () => {
    const isDarkMode = useColorScheme === 'dark';

    const [value, setSearchValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [withError, setWithError] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const textInputRef = createRef();

    const onCancelPress = () => {
        setSearchValue('');
        setSearchResults([]);
        setIsLoading(false);
        setWithError(false);
        textInputRef.current.blur();
    };

    const onChangeText = (text) => {
        setSearchValue(text);
    };

    const onSubmitSearch = () => {
        if (value) {
            setIsLoading(true);
            callSearchApi(value);
        }
    };

    const callSearchApi = async term => {
        const result = await searchGame(term);
        setIsLoading(false);
        setSearchResults(result);
    };

    const buttonExtraMargin = { top: 10, bottom: 10, left: 10, right: 10 };

    const ResultItem = ({ item, index }) => (
        <SearchResultItem
            item={item}
            index={index}
            onClick={() => {
                alert('Item clicked');
            }}
        />
    );

    const renderSearchContent = () => {
        if (searchResults.length === 0) {
            return ( <View/> );
        }

        if ( isLoading ) {
            return ( <ActivityIndicator size="large" color={'white'} /> );
        } else {
            return (
                <FlatList
                    style={styles.flatList}
                    data={searchResults}
                    renderItem={({ item, index }) => ResultItem({ item, index })}
                    keyExtractor={item => `result_${item.id}`}
                />
            );
        }
    };

    return (
        <View>
            <View style={[styles.barContainer, { backgroundColor: isDarkMode ? BLACK_54 : 'white' }]}>
                <TextInput
                    ref={textInputRef}
                    selectionColor={BLACK_54}
                    placeholderTextColor={BLACK_54}
                    onSubmitEditing={onSubmitSearch}
                    placeholder={SEARCH_PLACEHOLDER}
                    style={[styles.textInput, { color: isDarkMode ? 'white' : BLACK_54 }]}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardAppearance={isDarkMode ? 'light' : 'dark'}
                />
                <TouchableOpacity
                    onPress={onCancelPress}
                    hitSlop={buttonExtraMargin}
                >
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                {renderSearchContent()}
            </View>
        </View>
        
    );
};

export default SearchScreen;
