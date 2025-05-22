import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
// Fix missing marker icons in Angular
// import 'leaflet/dist/images/marker-icon.png';
// import 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;

// L.Icon.Default.mergeOptions({
//   iconUrl: 'assets/marker-icon.png',
//   shadowUrl: 'assets/marker-shadow.png'
// });

@Component({
  selector: 'app-travel-map',
  templateUrl: './travel-map.component.html',
  styleUrl: './travel-map.component.scss'
})
export class TravelMapComponent implements AfterViewInit {
  private map: L.Map | undefined;

  private locations = {
    Amman: { lat: 31.9539, lng: 35.9106, color: 'blue' },
    Aqaba: { lat: 29.532, lng: 35.006, color: 'green' },
    WadiRum: { lat: 29.5766, lng: 35.4194, color: 'orange' },
    Petra: { lat: 30.3285, lng: 35.4444, color: 'yellow' }
  };

  ngAfterViewInit(): void {
    // this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [30.5852, 36.2384], // Jordan center
      zoom: 7
    });

    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '© OpenStreetMap contributors'
    // }).addTo(this.map);

//     Optional Alternatives(also in English):
// Provider	URL
// Carto Light	'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
// Carto Dark	'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
// Stamen Toner Lite	'https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png'

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> & contributors | Tiles by Carto',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map!);

    this.addMarkersAndRoutes();
  }

  private addMarkersAndRoutes(): void {
    const petra = this.locations.Petra;

    for (const [name, info] of Object.entries(this.locations)) {
      const marker = L.marker([info.lat, info.lng], {
        icon: L.icon({
          iconUrl: 'src/assets/1.png',
          shadowUrl: 'src/assets/1.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      })
        .bindTooltip(name, { permanent: true, direction: 'top' })
        .addTo(this.map!);
      L.marker([info.lat, info.lng], {
        icon: L.icon({
          iconUrl: 'src/assets/1.png',
          shadowUrl: 'src/assets/1.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      })
        .bindTooltip(name, { permanent: true, direction: 'top' })
        .addTo(this.map!);

      if (name !== 'Petra') {
        L.polyline([[info.lat, info.lng], [petra.lat, petra.lng]], {
          color: info.color,
          weight: 4,
          opacity: 0.8
        }).addTo(this.map!);
      }
    }
  }
}
