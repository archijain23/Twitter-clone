import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Page.css";

const DeviceManagement = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get(
          "https://twitter-clone-xylb.onrender.com//user/devices"
        );
        setDevices(response.data.devices);
      } catch (error) {
        console.error("Error fetching devices:", error);
        setError("Failed to fetch devices.");
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, []);

  const handleRemoveDevice = async (deviceId) => {
    if (!window.confirm("Are you sure you want to remove this device?")) {
      return;
    }

    try {
      await axios.delete(
        `https://twitter-clone-xylb.onrender.com//user/devices/${deviceId}`
      );
      setDevices(devices.filter((device) => device._id !== deviceId));
    } catch (error) {
      console.error("Error removing device:", error);
      setError("Failed to remove device.");
    }
  };

  return (
    <div className="profilePage">
      <h2>Your Devices</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <ul>
          {devices.map((device) => (
            <li key={device?._id}>
              {device?.type} - {device?.browser} on {device?.os}
              <button onClick={() => handleRemoveDevice(device?._id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeviceManagement;
