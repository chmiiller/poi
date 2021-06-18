import NativePoiModule from './NativePoiModule';

const { BASE_URL } = NativePoiModule.getConstants(); // Reads BASE_URL from native module
const apiKey = '';
const radius = '5000';
const limit = '25';

export const searchPointsOfInterest = async({ term, lat, lon }) => {
    term = sanitizeString(term);
    try {
        // Fetching with JS just for comparison
        const start = new Date();

        const url = `${BASE_URL}/search/2/poiSearch/${term}.json?typeahead=false&limit=10&lat=${lat}&lon=${lon}&radius=${radius}&key=${apiKey}`;
        const response = await fetch(url);
        const json = await response.json();
        if (json.results) {
            const parsed = json.results.map(poi => preparePOIItem(poi));
            
            const end = new Date();
            const time = end - start;
            console.log(`JS query execution time = ${time}ms`);
        }
    } catch (error) {
        console.error(`JS API error! ${error}`);
    }

    try {
        const nativeStart = new Date();
        // Calling native modules
        const response = await NativePoiModule.getPointsOfInterest({
            baseUrl: BASE_URL,
            apiKey,
            term,
            limit,
            lat,
            lon,
            radius,
        });

        if (response && response.length > 1) {
            const [ summary, results ] = response;
            console.log(` >>>>>>>>>>>>>>>>>>>>>>>>>>>>> summary: ${JSON.stringify(summary,null,'    ')} `);
            if (results.length === 0) {
                return { error: 'empty' };
            }
            
            const nativeEnd = new Date();
            const nativeTime = nativeEnd - nativeStart;
            console.log(`Native query execution time = ${nativeTime}ms`);

            return results;
        }
    } catch (error) {
        console.error(`API error! ${error}`);
        return { error: 'api' };
    }
};

const preparePOIItem = item => {
    const { name, phone } = item.poi;
    return {
        id: item.id,
        name,
        phone,
        distance: Math.round(item.dist),
        address: item.address.freeformAddress,
    };

};

// Avoiding special characters and properly encoding strings
const sanitizeString = str => {
    str = str.toLowerCase();
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
    str = encodeURIComponent(str);
    return str.trim();
};