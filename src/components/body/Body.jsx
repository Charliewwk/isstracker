import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import Spinner from "react-bootstrap/Spinner";
import Card from "react-bootstrap/Card";
import { geocode } from "opencage-api-client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./body.css";

const Body = () => {
  const [issLocation, setIssLocation] = useState({ latitude: 0, longitude: 0 });
  const [isIssLocationLoaded, setIsIssLocationLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef(null);
  const [locationInfo, setLocationInfo] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://api.open-notify.org/iss-now.json"
        );
        const { latitude, longitude } = response.data.iss_position;
        setIssLocation({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        });
        setIsIssLocationLoaded(true);

        const geocodingResponse = await geocode({
          key: "b766dc83ca2a46798499428c449d4b5c",
          q: `${latitude},${longitude}`,
          language: "es",
        });

        const firstResult = geocodingResponse.results[0];

        if (firstResult) {
          setLocationInfo({
            country: firstResult.components.country,
            continent: firstResult.components.continent || "Océano",
            city: firstResult.components.city || "Desconocida",
            state: firstResult.components.state || "Desconocido",
          });
        } else {
          setLocationInfo({
            country: "Desconocido",
            continent: "Desconocido",
            city: "Desconocida",
            state: "Desconocido",
          });
        }
      } catch (error) {
        console.error(
          "Hubo un error al obtener la ubicación de la ISS: ",
          error
        );
        setIsLoading(false);
        setErrorMsg(
          "No pude obtener la ubicación de la ISS. Por favor, inténtalo más tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (isIssLocationLoaded && map) {
      map.on("zoomend", () => {
        const currentZoom = map.getZoom();
        if (
          currentZoom > 1 &&
          !map
            .getBounds()
            .contains([issLocation.latitude, issLocation.longitude])
        ) {
          map.setView(
            [issLocation.latitude, issLocation.longitude],
            currentZoom
          );
        }
      });
    }
  }, [isIssLocationLoaded, issLocation.latitude, issLocation.longitude]);

  return (
    <div className="margenSup">
      <Card>
        <Card.Header>
          {isIssLocationLoaded ? (
            <>
              <div>
                <span>Volando a 7.66 km/s y una Altura de 408 Km</span>
              </div>
              {locationInfo.continent === "Océano" ? (
                <div>
                  <span>Sobre el Océano</span>
                </div>
              ) : (
                <>
                  <div>
                    <span>
                      Ciudad: <strong>{locationInfo.city}</strong>
                    </span>
                  </div>
                  <div>
                    <span>
                      Estado/Provincia: <strong>{locationInfo.state}</strong>
                    </span>
                  </div>
                  <div>
                    <span>
                      País: <strong>{locationInfo.country}</strong>
                    </span>
                  </div>
                  <div>
                    <span>
                      Continente: <strong>{locationInfo.continent}</strong>
                    </span>
                  </div>
                </>
              )}
            </>
          ) : (
            "Cargando..."
          )}
        </Card.Header>
        <Card.Body>
          {isLoading ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          ) : (
            <MapContainer
              center={[issLocation.latitude, issLocation.longitude]}
              zoom={3}
              style={{ height: "400px", width: "100%" }}
              ref={mapRef}
            >
              <TileLayer
                attribution='Larga vida al async away! &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[issLocation.latitude, issLocation.longitude]}
                icon={L.icon({
                  iconUrl: "../src/assets/iss_icon.png",
                  iconSize: [50, 50],
                  iconAnchor: [25, 25],
                  popupAnchor: [0, -25],
                })}
              >
                <Tooltip>
                  <div>
                    <strong>Ubicación ISS</strong>
                  </div>
                  <div>
                    Latitud: {issLocation.latitude}, Longitud:{" "}
                    {issLocation.longitude}
                  </div>
                </Tooltip>
              </Marker>
            </MapContainer>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Body;
