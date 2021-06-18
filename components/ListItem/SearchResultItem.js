// @flow strict-local
import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AMIGO, WHITE } from '../../constants/colors';

type SearchResultItemProps = {
    item: {
        id: string,
        dist?: number,
        name: string,
        address: string,
    },
    index: number,
    onClick: any,
};

const SearchResultItem = ({ item, index, onClick }: SearchResultItemProps): React.Node => {
    if(!item || !item.id) {
        return <View />;
    }
    const first = (index === 0);
    const distanceStr = item.dist ? `${Math.round(item.dist)}m` : '';
    return (
        <Pressable
            key={`level_card_${item.id}`}
            style={({ pressed }) => cardStyle({ pressed, first })}
            onPress={() => onClick(item)}
        >
            <View style={styles.cardTextContainer}>
                <Text style={styles.title}>{`${item.name} - ${distanceStr}`}</Text>
                <Text style={styles.subtitle}>{item.address}</Text>
            </View>
        </Pressable>
    );
};

const cardStyle = ({ pressed, first }) => {
    let newStyle = styles.card;
    if (first) {
        newStyle = { ...newStyle, marginTop: 12 };
    }
    return (!pressed) ? newStyle : { ...newStyle, opacity: 0.6 };
};

const styles = StyleSheet.create({
    card: {
        height: 110,
        flexDirection: 'row',
        marginHorizontal: 24,
        marginTop: 16,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { height: 1 },
        shadowOpacity: 0.45,
        shadowRadius: 2,
        elevation: 3,
    },
    cardImage: {
        height: '100%',
        flex: 1,
        backgroundColor: WHITE,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 0,
    },
    cardTextContainer: {
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 12,
        height: '100%',
        padding: 8,
        backgroundColor: AMIGO,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        color: WHITE,
        fontWeight: '600',
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 16,
        color: WHITE,
        fontWeight: 'normal',
        textAlign: 'center',
        marginTop: 8,
    },
});

export default SearchResultItem;