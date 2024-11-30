import { useEffect, useRef } from "react";

function NaverMap({ latitude_, longitude_ }) {
    const mapContainer = useRef(null);

    useEffect(() => {
        const { naver } = window;

        // 지도 위치와 옵션 설정
        const location = new naver.maps.LatLng(latitude_, longitude_);
        const options = {
            center: location,
            zoom: 17,
        };
        const map = new naver.maps.Map(mapContainer.current, options);

        // 마커 설정
        const marker = new naver.maps.Marker({
            position: location, // 마커 위치 설정
            map: map, // 마커를 표시할 지도
            icon: {
                url: '../assets/img/ping.png', // 마커로 사용할 이미지 경로
                size: new naver.maps.Size(40, 40), // 이미지 크기 (픽셀 단위)
                scaledSize: new naver.maps.Size(40, 40), // 이미지 리사이즈
                anchor: new naver.maps.Point(20, 20), // 마커 중심점 설정
            },
        });

        // 마커 업데이트 시 cleanup
        return () => marker.setMap(null);
    }, [latitude_, longitude_]); // 위도와 경도가 변경될 때마다 실행

    return <div ref={mapContainer} style={{ width: '100%', height: '100%', borderRadius: '20px', margin: '0 auto' }} />;
}

export default NaverMap;