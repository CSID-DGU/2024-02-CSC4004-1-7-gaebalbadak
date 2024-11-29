// import { useEffect, useRef } from "react";

// function NaverMap() {
//     const mapContainer = useRef(null);

//     useEffect(()=> {
//         const { naver } = window;

//         const location = new naver.maps.LatLng(37.561118, 126.995013);
//         const options = {
//             center: location,
//             zoom: 17,
//         };
//         const map = new naver.maps.Map(mapContainer.current, options);
//     },[]);

//     return <div ref={mapContainer} style={{ width: '100%', height: '100%', borderRadius: '20px', margin: '0 auto'}} />;
// }

// export default NaverMap;

//api없는 하드코딩 마커
import React, { useEffect, useRef } from 'react';
import './Map.scss'; 

const NaverMapComponent = () => {
  const mapContainer = useRef(null); 

  useEffect(() => {
    const { naver } = window;
    if (!naver) {
      console.error("Naver Maps API가 로드되지 않았습니다.");
      return;
    }

  
    const location = new naver.maps.LatLng(37.5665, 126.9780); // 초기 중심 좌표
    const options = {
      center: location,
      zoom: 14,
    };


    const map = new naver.maps.Map(mapContainer.current, options);


    const markers = [
      { lat: 37.5665, lng: 126.9780, order: 1, title: "서울시청" },
      { lat: 37.5700, lng: 126.9820, order: 2, title: "종로구청" },
      { lat: 37.5600, lng: 126.9750, order: 3, title: "남산타워" },
    ];


    markers.forEach((markerData) => {
      new naver.maps.Marker({
        position: new naver.maps.LatLng(markerData.lat, markerData.lng), 
        map, 
        title: markerData.title, 
        icon: {
          content: `
            <div class="markerBox">
              <div class="totalOrder">${markerData.order}</div>
              ${markerData.title}
            </div>
          `,
          anchor: new naver.maps.Point(42.5, 15), 
        },
      });
    });
  }, []);

  return (
    <div
      ref={mapContainer}
      style=
        {{ width: '100%', height: '100%', borderRadius: '20px', margin: '0 auto'}}
      
    ></div>
  );
};

export default NaverMapComponent;