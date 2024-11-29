import { useEffect, useRef } from "react";

function NaverMap({ latitude, longitude }) { // 위도와 경도 props로 받기
    const mapContainer = useRef(null);

    useEffect(() => {
        const { naver } = window;

        const location = new naver.maps.LatLng(latitude, longitude); // 전달받은 위도와 경도 사용
        const options = {
            center: location,
            zoom: 17,
        };
        const map = new naver.maps.Map(mapContainer.current, options);
    }, [latitude, longitude]); // 위도와 경도가 변경될 때마다 실행

    return <div ref={mapContainer} style={{ width: '100%', height: '100%', borderRadius: '20px', margin: '0 auto' }} />;
}

export default NaverMap;