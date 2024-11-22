import { useEffect, useRef } from "react";

function NaverMap() {
    const mapContainer = useRef(null);

    useEffect(()=> {
        const { naver } = window;

        const location = new naver.maps.LatLng(37.561118, 126.995013);
        const options = {
            center: location,
            zoom: 17,
        };
        const map = new naver.maps.Map(mapContainer.current, options);
    },[]);

    return <div ref={mapContainer} style={{ width: '100%', height: '100%', borderRadius: '20px', margin: '0 auto'}} />;
}

export default NaverMap;