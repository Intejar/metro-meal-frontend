import React from "react";
import { QrReader } from "react-qr-reader";

const QRCodeScanner = ({ onScan }) => {
  const handleScan = (result) => {
    if (result) {
      onScan(result); // Send scanned result to parent component or handle it
    }
  };

  const handleError = (error) => {
    // console.error("QR Scan Error: ", error);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="border p-4 shadow-lg bg-white rounded">
        <QrReader
          onResult={(result, error) => {
            if (result) handleScan(result?.text);
            if (error) handleError(error);
          }}
          constraints={{ facingMode: "environment" }}
          containerStyle={{ width: "100%", maxWidth: 300 }}
        />
        <p className="mt-4 text-center text-gray-700">
          Point your camera at the QR code
        </p>
      </div>
    </div>
  );
};

export default QRCodeScanner;
