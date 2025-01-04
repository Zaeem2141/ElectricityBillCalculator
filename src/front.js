import React, { useRef, useState } from "react";
import { Modal } from "antd";
import jsPDF from "jspdf";
import "./front.css";

const Front = () => {
  const [inputs, setInputs] = useState({
    totalBill: "",
    totalUnits: "",
    groundFloorUnits: "",
    firstFloorUnits: "",
  });

  const [calculatedData, setCalculatedData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const modalContentRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleCalculate = () => {
    const pricePerUnit = +inputs.totalBill / +inputs.totalUnits;
    const groundSubPrice = +inputs.groundFloorUnits * +pricePerUnit;
    const firstSubPrice = +inputs.firstFloorUnits * +pricePerUnit;
    const commonUnits =
      +inputs?.totalUnits -
      (+inputs?.groundFloorUnits + +inputs?.firstFloorUnits);
    const totalCommonBill = commonUnits * pricePerUnit;
    const pricePerHead = totalCommonBill / 7;

    const groundCommonBill = pricePerHead * 3;
    const firstCommonBill = pricePerHead * 2;
    const secondCommonBill = pricePerHead * 2;

    const groundTotalBill = groundCommonBill + groundSubPrice + 300;
    const firstTotalBill = firstCommonBill + firstSubPrice + 200;
    const secondTotalBill = secondCommonBill + 210;

    setCalculatedData({
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
        day: "numeric",
      }),
      totalUnits: inputs.totalUnits,
      totalBill: inputs.totalBill,
      groundSubPrice,
      firstSubPrice,
      commonUnits,
      pricePerUnit,
      totalCommonBill,
      groundCommonBill,
      firstCommonBill,
      secondCommonBill,
      groundTotalBill,
      firstTotalBill,
      secondTotalBill,
    });

    setIsModalVisible(true);
  };
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const modalContent = modalContentRef.current;

    // Generate the PDF directly from HTML content
    doc.html(modalContent, {
      callback: function (doc) {
        doc.save("electricity-bill.pdf");
      },
      x: 10, // horizontal margin
      y: 10, // vertical margin
      width: 180, // content width
      windowWidth: window.innerWidth, // full window width
      margin: [0, 10, 0, 10], // remove extra margins
      autoPaging: true, // handle auto page breaks
      overflow: true, // allow overflow content, can be adjusted if needed
    });
  };

  


  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="app-container">
      <div className="calculator-container">
        <h1 className="main-title">Ajmal House</h1>
        <h2 className="sub-title">Electricity Bill Calculator</h2>
        <form>
          <div className="input-group">
            <label htmlFor="totalBill">Total Bill</label>
            <input
              type="number"
              id="totalBill"
              name="totalBill"
              value={inputs.totalBill}
              onChange={handleInputChange}
              placeholder="Enter total bill"
            />
          </div>

          <div className="input-group">
            <label htmlFor="totalUnits">Total Units</label>
            <input
              type="number"
              id="totalUnits"
              name="totalUnits"
              value={inputs.totalUnits}
              onChange={handleInputChange}
              placeholder="Enter total units"
            />
          </div>

          <div className="input-group">
            <label htmlFor="groundFloorUnits">Ground Floor Units</label>
            <input
              type="number"
              id="groundFloorUnits"
              name="groundFloorUnits"
              value={inputs.groundFloorUnits}
              onChange={handleInputChange}
              placeholder="Enter ground floor units"
            />
          </div>

          <div className="input-group">
            <label htmlFor="firstFloorUnits">First Floor Units</label>
            <input
              type="number"
              id="firstFloorUnits"
              name="firstFloorUnits"
              value={inputs.firstFloorUnits}
              onChange={handleInputChange}
              placeholder="Enter first floor units"
            />
          </div>

          <button
            type="button"
            className="calculate-button"
            onClick={handleCalculate}
          >
            Calculate
          </button>
        </form>
      </div>

      {/* Modal for displaying calculated data */}
      <Modal
        title="Ajmal House Electricity Bill"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
            <button key="download" className="download-button" onClick={handleDownloadPDF}>
              Download PDF
            </button>,
            <button key="close" className="close-button" onClick={handleCancel}>
              Close
            </button>,
          ]}
      >
        {calculatedData && (
          <div ref={modalContentRef} className="modal-content">
            <p>
              <strong style={{ float: "center" }}>Date:</strong>{" "}
              {calculatedData.date}
            </p>
            <p className="centered-row">
              <span>
                <strong>Total Units:</strong> {calculatedData.totalUnits}
              </span>
              <span>
                <strong>Total Bill:</strong> {calculatedData.totalBill}
              </span>
            </p>
            <br/><br/>
            <p className="centered-row">
  <span>
    <strong>Ground Sub Units:</strong> {inputs.groundFloorUnits}
  </span>
  <span>
    <strong>First Floor Sub Units:</strong> {inputs.firstFloorUnits}
  </span>
</p>
            <p>
              <strong>Common Units:</strong> {calculatedData.commonUnits}
            </p>
            <h3 style={{ textAlign: "center", color: "#007bff" }}>
              Price Per Unit: {calculatedData?.pricePerUnit?.toFixed(2)}
            </h3>
            <p className="centered-row">
  <span>
    <strong>Ground Sub Meter Bill:</strong>{" "}
    {calculatedData?.groundSubPrice?.toFixed(2)}
  </span>
  <span>
    <strong>First Floor Sub Meter Bill:</strong>{" "}
    {calculatedData?.firstSubPrice?.toFixed(2)}
  </span>
</p>
            <h3 style={{ textAlign: "center", color: "#007bff" }}>
              <strong>Total Common Bill:</strong>{" "}
              {calculatedData?.totalCommonBill?.toFixed(2)}
            </h3>
            <p>
              <strong>Wasa Bill:</strong>
            </p>
            <ul>
              <li>Ground: 300</li>
              <li>First Floor: 200</li>
              <li>Second Floor: 210</li>
            </ul>
            <p>
              <strong>Ground Common Bill:</strong>{" "}
              {calculatedData?.groundCommonBill?.toFixed(2)}
              <br />
              <strong>First Floor Common Bill:</strong>{" "}
              {calculatedData?.firstCommonBill?.toFixed(2)}
              <br />
              <strong>Second Floor Common Bill:</strong>{" "}
              {calculatedData?.secondCommonBill?.toFixed(2)}
            </p>
            <h3 style={{ textAlign: "center", color: "#28a745" }}>
              Total Bills:
            </h3>
            <p>
              <strong>Ground Floor Total:</strong>{" "}
              {calculatedData?.groundTotalBill?.toFixed(0)}
              <br />
              <strong>First Floor Total:</strong>{" "}
              {calculatedData?.firstTotalBill?.toFixed()}
              <br />
              <strong>Second Floor Total:</strong>{" "}
              {calculatedData?.secondTotalBill?.toFixed(0)}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Front;
