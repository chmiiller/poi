import NativePoiModule from './NativePoiModule';

const { BASE_URL } = NativePoiModule.getConstants();
const apiKey = '';
const radius = '5000';

export const searchPointsOfInterest = async({ term, lat, lon }) => {
    term = sanitizeString(term);
    try {
        const response = await NativePoiModule.getPointsOfInterest({
            baseUrl: BASE_URL,
            apiKey,
            term,
            limit: '10',
            lat,
            lon,
            radius,
        });
        // console.log(` >>>>>>>>>>>>>>>>>>>>>>>>>>>>> response: ${JSON.stringify(response,null,'    ')} `);
        if (response && response.length > 1) {
            const [ summary, results ] = response;
            return results;
        }
    } catch (error) {
        console.error(`Error! ${error}`);
    }
    
    // Fetching with JS
    // const url = `${BASE_URL}/search/2/poiSearch/${term}.json?typeahead=false&limit=10&lat=${lat}&lon=${lon}&radius=${radius}&key=${apiKey}`;
    // const response = await fetch(url);
    // const json = await response.json();
    // if (json.results) {
    //     return json.results.map(poi => preparePOIItem(poi));
    // }
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

const sanitizeString = str => {
    str = str.toLowerCase();
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
    str = encodeURIComponent(str);
    return str.trim();
};