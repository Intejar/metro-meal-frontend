import React, { useRef, useEffect } from "react";
import QRCode from "qrcode-generator";
import { jsPDF } from "jspdf";

const QRCodeGenerator = ({ value, order }) => {
  const canvasRef = useRef();

  // QR Code generation and drawing on the canvas
  useEffect(() => {
    const qr = QRCode(0, "L");
    qr.addData(value);
    qr.make();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    canvas.width = 50; // Adjust size as needed
    canvas.height = 50;

    // Create the QR code image
    const imgData = qr.createImgTag();
    const img = new Image();
    img.src = imgData.split('"')[1]; // Extract the image source
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
    };
  }, [value]);

  // PDF Download Function
  const downloadPDF = (order) => {
    const doc = new jsPDF();
    const canvas = canvasRef.current;

    // Convert canvas to image
    const imgData = canvas.toDataURL("image/png");
    doc.addImage(imgData, "PNG", 10, 10, 50, 50); // Adjust dimensions as needed
    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;

    doc.setFontSize(12);
    doc.text(`Order ID: ${order.orderId}`, centerX, 20, { align: "center" });
    doc.text(`Order Plan: ${order.mealPlan}`, centerX, 30, { align: "center" });
    doc.text(`User Name: ${order.name}`, centerX, 40, { align: "center" });
    doc.text(`User Email: ${order.email}`, centerX, 50, { align: "center" });
    doc.save("qr-code.pdf");
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onClick={() => downloadPDF(order)} // Trigger download on click
        style={{ cursor: "pointer" }}
      />
    </div>
  );
};

export default QRCodeGenerator;
