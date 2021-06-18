// @flow strict-local
import * as React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View, useColorScheme } from 'react-native';
import RNLocation from 'react-native-location'; // location services like permissions and latitude/longitude

import { searchPointsOfInterest } from '../../api';

import SearchResultItem from '../../components/ListItem/SearchResultItem';
import PermissionNotGranted from '../../components/EmptyState/PermissionNotGranted';
import SuggestionsCard from '../../components/EmptyState/SuggestionsCard';
import ErrorMessage from '../../components/EmptyState/ErrorMessage';
import SearchBar from '../../components/SearchBar';
import { GRAY3, WHITE } from '../../constants/colors';

RNLocation.configure({
    // min distance meters that the device location needs to change before calling the location update callback
    distanceFilter: 5.0
});


type ResultItemProps = {
    item: {
        id: string,
        dist?: number,
        name: string,
        address: string,
    },
    index: number,
};

const SearchScreen = (): React.Node => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [permissionsGranted, setPermissionsGranted] = React.useState(true);
    const [suggestedTerm, setSuggestedTerm] = React.useState('');
    const [withError, setWithError] = React.useState('');
    const [latLon, setLatLon] = React.useState({ lat: '', lon: '' });
    const [searchResults, setSearchResults] = React.useState([]);
    const isDarkMode = useColorScheme() === 'dark';

    const checkPermission = async (): Promise<boolean> => {
        const permission: boolean = await RNLocation.checkPermission({
            ios: 'whenInUse',
            android: {
                detail: 'fine'
            }
        });
        return permission;
    };
    
    const askForPermissions = async () =>  {
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

    React.useEffect(() => {
        initLocationService();
    }, []);

    const initLocationService = async() => {
        const hasLocationPermission: boolean = await checkPermission();
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

    const onSubmitSearch = (term: string) => {
        if (term && term.length > 3) {
            setIsLoading(true);
            callSearchApi(term);
        } else {
            setSearchResults([]);
        }
    };

    const callSearchApi = async (term: string) => {
        if (term && latLon.lat && latLon.lon) {
            setIsLoading(true);
            const result = await searchPointsOfInterest({
                term,
                lat: latLon.lat,
                lon: latLon.lon,
            });
            setIsLoading(false);
            if (!result.error) {
                setWithError('');
                setSearchResults(result);
            } else {
                setWithError(result.error);
            }
        } else if (!latLon.lat || !latLon.lon) {
            setIsLoading(false);
            setWithError('gps');
        }
    };

    // Separated list item for better readability
    const ResultItem = ({ item, index }: ResultItemProps) => (
        <SearchResultItem
            item={item}
            index={index}
            onClick={item => {
                console.log(` >>>>>>>>>>>>>>>>>>>>>>>>>>>>> item: ${JSON.stringify(item,null,'    ')} `);
            }}
        />
    );

    // This is separated method so it's easier to manipulate and understand different search states
    const renderSearchContent = () => {
        if ( isLoading ) {
            // Returns a loading component...
            return ( <ActivityIndicator size="large" color={isDarkMode ? WHITE : GRAY3} /> );
        }

        if (withError) {
            // Returns a friendly clickable error card
            return ( <ErrorMessage type={withError} onPress={async() => {
                await initLocationService();
                setIsLoading(false);
                setWithError('');
            }} /> );
        }

        if (searchResults.length === 0) {
            // When there are no results or is the first time opening this screen,
            // we present a list of suggestions (buttons)
            return ( <SuggestionsCard onClick={term => {
                onSubmitSearch(term);
                setSuggestedTerm(term);
            }}/> );
        }

        return (
            // The search results list
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

export default SearchScreen;
