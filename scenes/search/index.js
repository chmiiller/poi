import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View, useColorScheme } from 'react-native';
import RNLocation from 'react-native-location';

import SearchResultItem from '../../components/ListItem/SearchResultItem';
import PermissionNotGranted from '../../components/EmptyState/PermissionNotGranted';
import SuggestionsCard from '../../components/EmptyState/SuggestionsCard';
import SearchBar from '../../components/SearchBar';
import { GRAY3, WHITE } from '../../constants/colors';

import { searchPointsOfInterest } from '../../api';

RNLocation.configure({
    distanceFilter: 5.0
});

const styles = StyleSheet.create({
    content: {
        backgroundColor: 'transparent',
        width: '100%',
        height: '90%',
        padding: 8,
    },
    flatList: {
        marginTop: 0,
    },
    
});

const SearchScreen = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [permissionsGranted, setPermissionsGranted] = useState(true);
    const [suggestedTerm, setSuggestedTerm] = useState('');
    const [latLon, setLatLon] = useState({ lat: '', lon: '' });
    const [searchResults, setSearchResults] = useState([]);
    const isDarkMode = useColorScheme() === 'dark';

    const checkPermission = async () => {
        const permission = await RNLocation.checkPermission({
            ios: 'whenInUse',
            android: {
                detail: 'fine'
            }
        });
        return permission;
    };
    
    const askForPermissions = async () => {
        try {
            const granted = await RNLocation.requestPermission({
                ios: 'whenInUse',
                android: {
                    detail: 'fine',
                    rationale: {
                        title: `We need access to your device's location`,
                        message: `This app recommends Points of Interest based on your device's location`,
                        buttonPositive: 'OK',
                        buttonNegative: 'Cancel',
                    }
                }
            });
            if (granted) {
                await getLocation();
                setPermissionsGranted(true);
            }
        } catch (error) {
            setPermissionsGranted(false);
        }
        
    };

    useEffect(() => {
        initLocationService();
    }, []);

    const initLocationService = async() => {
        const hasLocationPermission = await checkPermission();
        if (hasLocationPermission) {
            setPermissionsGranted(true);
            await getLocation();
        } else {
            setPermissionsGranted(false);
            await askForPermissions();
        }
    };

    const getLocation = async() => {
        let location = await RNLocation.getLatestLocation({timeout: 100});
        if (location) {
            setLatLon({ lat: location.latitude.toString(), lon: location.longitude.toString() });
        }
    };

    const onSubmitSearch = term => {
        if (term && term.length > 3) {
            setIsLoading(true);
            callSearchApi(term);
        } else {
            setSearchResults([]);
        }
    };

    const callSearchApi = async term => {
        if (term && latLon.lat && latLon.lon) {
            setIsLoading(true);
            const result = await searchPointsOfInterest({
                term,
                lat: latLon.lat,
                lon: latLon.lon,
            });
            setIsLoading(false);
            setSearchResults(result);
        }
    };

    const ResultItem = ({ item, index }) => (
        <SearchResultItem
            item={item}
            index={index}
            onClick={item => {
                console.log(` >>>>>>>>>>>>>>>>>>>>>>>>>>>>> item: ${JSON.stringify(item,null,'    ')} `);
            }}
        />
    );

    const renderSearchContent = () => {
        if ( isLoading ) {
            return ( <ActivityIndicator size="large" color={isDarkMode ? WHITE : GRAY3} /> );
        }
        if (searchResults.length === 0) {
            return ( <SuggestionsCard onClick={term => {
                onSubmitSearch(term);
                setSuggestedTerm(term);
            }}/> );
        }

        return (
            <FlatList
                style={styles.flatList}
                data={searchResults}
                renderItem={({ item, index }) => ResultItem({ item, index })}
                keyExtractor={item => `result_${item.id}`}
            />
        );
    };

    return (
        <View>
            <SearchBar onSearch={onSubmitSearch} suggestedTerm={suggestedTerm}/>
            <View style={styles.content}>
                {!permissionsGranted && (
                    <PermissionNotGranted onClick={async() => {
                        await askForPermissions();
                    }}/>
                )}
                {permissionsGranted && (renderSearchContent())}
            </View>
        </View>
        
    );
};

export default SearchScreen;
