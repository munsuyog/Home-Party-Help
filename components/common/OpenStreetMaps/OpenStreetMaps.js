import React, { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';

const OpenStreetMap = ({ markers }) => {
  const [markerScript, setMarkerScript] = useState('');

  useEffect(() => {
    if (markers) {
      const { latitude, longitude } = markers;
      const markerScript = `new ol.Feature({geometry: new ol.geom.Point(ol.proj.fromLonLat([${longitude}, ${latitude}]))})`;
      setMarkerScript(markerScript);
    }
  }, [markers]);

  useEffect(() => {
    if (markers) {
      const { latitude, longitude } = markers;
      const script = `
        var map = new ol.Map({
          target: "map",
          layers: [
            new ol.layer.Tile({
              source: new ol.source.OSM()
            })
          ],
          view: new ol.View({
            center: ol.proj.fromLonLat([${longitude}, ${latitude}]),
            zoom: 20 // Adjust zoom level as needed
          })
        });
        
        var marker = ${markerScript};
        var markerLayer = new ol.layer.Vector({
          source: new ol.source.Vector({
            features: [marker]
          }),
          style: new ol.style.Style({
            image: new ol.style.Icon({
              src: 'https://openlayers.org/en/latest/examples/data/icon.png'
            })
          })
        });
        map.addLayer(markerLayer);
      `;
      setZoomScript(script);
    }
  }, [markerScript]);

  const [zoomScript, setZoomScript] = useState('');

  return (
    <WebView
      source={{
        html: `
          <html>
            <head>
              <link rel="stylesheet" href="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v6.4.3/css/ol.css" type="text/css">
            </head>
            <body>
              <div id="map" style="width: 100%; height: 100%;"></div>
              <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v6.4.3/build/ol.js"></script>
              <script>
                ${zoomScript}
              </script>
            </body>
          </html>
        `,
      }}
    />
  );
};

export default OpenStreetMap;
