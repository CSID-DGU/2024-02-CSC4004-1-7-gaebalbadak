// import React, { useEffect, useState } from "react";
// import './Map.scss';
// import { NaverMap, Marker, useNavermaps } from 'react-naver-maps';

//마커 스타일 조정 전 원래 코드
 
// const NaverMapComponent = () => {
//   const [markers, setMarkers] = useState([]); 

//   useEffect(() => {
//     // 데이터 API 호출
//     fetch("https://your-api-endpoint.com/markers") 
//       .then((response) => response.json())
//       .then((data) => {
//         setMarkers(data); // 마커 데이터를 상태로 저장
//       })
//       .catch((error) => {
//         console.error("Error fetching marker data:", error);
//       });
//   }, []);

//   useEffect(() => {

//     const map = new naver.maps.Map("map", {
//       center: new naver.maps.LatLng(37.5665, 126.9780),
//       zoom: 10,
//     });


//     markers.forEach((markerData) => {
//       new naver.maps.Marker({
//         position: new naver.maps.LatLng(markerData.lat, markerData.lng), 
//         map,
//         title: markerData.title, 
//       });
//     });
//   }, [markers]); 

//   return <div id="map" style={{ width: "100%", height: "400px" }}></div>;
// };

// export default NaverMapComponent;

//api받아오는 마커표시 지도 아직 확인 불가능(api주소 없어서)
import React, { useEffect, useState } from "react";
import './Map.scss';

const NaverMapComponent = () => {
  const [markers, setMarkers] = useState([]); 

  useEffect(() => {
    // 데이터 API 호출
    fetch("https://your-api-endpoint.com/markers")
      .then((response) => response.json())
      .then((data) => {
        setMarkers(data);
      })
      .catch((error) => {
        console.error("Error fetching marker data:", error);
      });
  }, []);

  useEffect(() => {
    const { naver } = window; 
    if (!naver) {
      console.error("Naver Maps API가 로드되지 않았습니다.");
      return;
    }


    const map = new naver.maps.Map("map", {
      center: new naver.maps.LatLng(37.5665, 126.9780),
      zoom: 14,
    });

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
  }, [markers]); 

  return <div id="map" style={{ width: "100%", height: "400px" }}></div>;
};

export default NaverMapComponent;
