import NativePoiModule from './NativePoiModule';

const { BASE_URL } = NativePoiModule.getConstants();
const apiKey = '';
const spuiLat = '52.076558403826354';
const spuiLon = '4.317172258276077';
const radius = '5000';

export const searchPointsOfInterest = async term => {
    if (!term) return;

    term = sanitizeString(term);
    try {
        try {
            const response = await NativePoiModule.getPointsOfInterest({
                baseUrl: BASE_URL,
                apiKey,
                term,
                limit: '10',
                lat: spuiLat,
                lon: spuiLon,
                radius,
            });
            console.log(` >>>>>>>>>>>>>>>>>>>>>>>>>>>>> response: ${JSON.stringify(response,null,'    ')} `);
            if (response && response.length > 1) {
                const [summary, results] = response;
                console.log(` >>>>>>>>>>>>>>>>>>>>>>>>>>>>> summary: ${JSON.stringify(summary,null,'    ')} `);
                return results;
            }
        } catch (error) {
            console.error(`Error! ${error}`);
        }
        
        /*
            ** Fetching with JS
            const url = `${BASE_URL}/search/2/poiSearch/${term}.json?typeahead=false&limit=10&lat=${spuiLat}&lon=${spuiLon}&radius=${radius}&key=${apiKey}`;
            const response = await fetch(url);
            const json = await response.json();
            if (json.results) {
                return json.results.map(poi => preparePOIItem(poi));
            }
        */
    } catch (error) {
        console.error(error);
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

const sanitizeString = str => {
    str = str.toLowerCase();
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
    return str.trim();
};