import React, { useState } from "react";
import QRCodeScanner from "./QrScanner";

const Scanner = () => {
  const [scannedData, setScannedData] = useState(null);

  const handleScanData = (data) => {
    setScannedData(data); // Store scanned data
    alert(`Scanned Data: ${data}`); // Display the scanned data
  };

  return (
    <div className="App">
      <h1 className="text-center text-2xl font-bold mt-10">QR Code Scanner</h1>
      <QRCodeScanner onScan={handleScanData} />
      {scannedData && (
        <div className="mt-4 text-center text-lg text-green-600">
          Scanned Result: {scannedData}
        </div>
      )}
    </div>
  );
};

export default Scanner;
