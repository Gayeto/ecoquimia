import type { LatLngExpression } from "leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "../styles/coverage-leaflet.css";

type Pin = { name: string; lat: number; lng: number; note?: string };

const pulseIcon = (delayMs = 0) =>
  L.divIcon({
    className: "cov-pulseIcon",
    html: `
      <div class="cov-pulse" style="animation-delay:${delayMs}ms">
        <span class="cov-pulseCore"></span>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -18],
  });

function FitToPins({ pins }: { pins: Pin[] }) {
  const map = useMap();

  useEffect(() => {
    if (!pins.length) return;

    const bounds = L.latLngBounds(
      pins.map((p) => [p.lat, p.lng] as [number, number])
    );

    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 9,
      animate: true,
      duration: 0.7,
    });
  }, [map, pins]);

  return null;
}

export default function CoverageMapLeaflet() {
  const pins: Pin[] = useMemo(
    () => [
      { name: "CDMX", lat: 19.4326, lng: -99.1332, note: "Centro de operación" },
      { name: "Estado de México", lat: 19.285, lng: -99.549 },
      { name: "Morelos", lat: 18.9186, lng: -99.2342 },
      { name: "Puebla", lat: 19.0414, lng: -98.2063 },
      { name: "Querétaro", lat: 20.5888, lng: -100.3899 },
      { name: "Hidalgo", lat: 20.1011, lng: -98.7591 },
      { name: "Tlaxcala", lat: 19.3182, lng: -98.2375 },
    ],
    []
  );

  const center: LatLngExpression = [19.3, -99.3];

  return (
    <section id="cobertura" className="covL-section">
      <header className="covL-header">
        <p className="covL-kicker">
          <span className="covL-kicker-ic" aria-hidden="true">
            🗺️
          </span>
          <span>Cobertura</span>
        </p>

        <h2 className="covL-title">¿Dónde estamos y a dónde llegamos?</h2>
        <p className="covL-subtitle">
          Operamos desde <b>CDMX</b> y cubrimos la zona centro para entregas y
          atención.
        </p>
      </header>

      <div className="covL-bleed">
        <div className="covL-mapWrap">
          <MapContainer
            center={center}
            zoom={6}
            scrollWheelZoom={false}
            className="covL-map"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />

            <FitToPins pins={pins} />

            {pins.map((p, i) => (
              <Marker
                key={p.name}
                position={[p.lat, p.lng] as LatLngExpression}
                icon={pulseIcon(i * 200)}
              >
                <Popup>
                  <b>{p.name}</b>
                  {p.note ? <div style={{ marginTop: 4 }}>{p.note}</div> : null}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
}
