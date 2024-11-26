import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Leaflet's CSS
import L from "leaflet";
import "leaflet-defaulticon-compatibility"; // To fix missing marker icons in Leaflet for React
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const LocationCard = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [address, setAddress] = useState("");

  const customIcon = new L.Icon({
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    iconSize: [25, 41], // size of the icon
    iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    shadowSize: [41, 41], // size of the shadow
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCurrentPosition({
          lat,
          lng,
        });

        // Fetch address using reverse geocoding
        const fetchedAddress = await fetchAddress(lat, lng);
        setAddress(fetchedAddress);
      },
      (error) => {
        console.error("Error getting location: ", error);
      }
    );
  }, []);

  // Function to get address using reverse geocoding
  const fetchAddress = async (lat, lng) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    return data.display_name; // This returns the full address
  };

  return (
    <div className=" p-4 bg-slate-800 rounded-lg shadow-lg max-w-full ">
      <h2 className="text-2xl font-bold text-center text-white mb-6">
        Your Location
      </h2>

      <div
        className="mapContainer"
        style={{
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          height: "300px",
          width: "100%",
        }}
      >
        {currentPosition ? (
          <MapContainer
            center={currentPosition}
            zoom={13}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={currentPosition} icon={customIcon}>
              <Popup>You are here</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div className="skeleton h-60 w-90"></div>
        )}
      </div>

      {currentPosition ? (
        <div className="location-details mt-4 p-4 rounded bg-gray-100">
          <p className="text-lg font-semibold">Address:</p>
          <p className="text-sm text-gray-600">
            {address || "Fetching address..."}
          </p>
        </div>
      ) : (
        <div className="skeleton h-20 w-full"></div>
      )}
    </div>
  );
};

export default LocationCard;
