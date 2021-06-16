import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const SearchResultItem = ({ item, index, onClick }) => {
    if(!item || !item.id) {
        return <View />;
    }
    const first = (index === 0);
    const distanceStr = item.dist ? `${Math.round(item.dist)}m` : false;
    return (
        <Pressable
            key={`level_card_${item.id}`}
            style={({ pressed }) => cardStyle({ pressed, first })}
            onPress={() => onClick(item)}
        >
            <View style={styles.cardTextContainer}>
                <Text style={styles.title}>{item.name}</Text>
                {distanceStr && <Text style={styles.subtitle}>{distanceStr}</Text>}
                <Text style={styles.subtitle}>{item.address}</Text>
            </View>
        </Pressable>
    );
};

const cardStyle = ({ pressed, first }) => {
    let newStyle = styles.card;
    if (first) {
        newStyle = { ...newStyle, marginTop: 32 }
    }
    return (!pressed) ? newStyle : { ...newStyle, opacity: 0.6 };
};

const styles = StyleSheet.create({
    card: {
        height: 110,
        borderRadius: 4,
        backgroundColor: 'black',
        flexDirection: 'row',
        marginHorizontal: 24,
        marginTop: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { height: 1 },
        shadowOpacity: 0.45,
        shadowRadius: 2,
        elevation: 3,
    },
    cardImage: {
        height: '100%',
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 0,
    },
    cardTextContainer: {
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        padding: 8,
        backgroundColor: 'black',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        color: 'white',
        fontWeight: '600',
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'normal',
        textAlign: 'center',
        marginTop: 8,
    },
});

export default SearchResultItem;