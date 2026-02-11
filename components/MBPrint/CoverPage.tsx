import React from "react";
import { MBPrintMetadata } from "./types";

interface CoverPageProps {
  metadata: MBPrintMetadata;
}

export const CoverPage: React.FC<CoverPageProps> = ({ metadata }) => {
  return (
    <div className="page-container">
      <div
        className="page-border"
        style={{
          justifyContent: "space-between",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <div style={{ textAlign: "right", fontWeight: "bold" }}>Page 1</div>
        <div>
          <h1
            style={{ fontSize: "24pt", fontWeight: "bold", margin: "20px 0" }}
          >
            MEASUREMENT BOOK
          </h1>
          <h2
            style={{ fontSize: "16pt", fontWeight: "bold", margin: "10px 0" }}
          >
            No. 3 Dhalpara Gram Panchayat
          </h2>
          <div style={{ margin: "40px 0", fontSize: "14pt" }}>
            <strong>MB NO. -</strong>{" "}
            <span style={{ textDecoration: "underline" }}>
              {metadata.mbNumber}
            </span>
          </div>
        </div>

        <div
          style={{
            textAlign: "justify",
            fontSize: "12pt",
            lineHeight: "1.6",
            margin: "0 40px",
          }}
        >
          This is to certify that this MB contains pages from 01 to 25 and
          issued to Nirman Sahayak of No.- 3 Dhalpara Gram Panchayat
          on......................................................
        </div>

        <div
          style={{
            marginTop: "50px",
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: "40px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ marginBottom: "50px" }}></div>{" "}
            {/* Space for signature */}
            <div
              style={{
                borderTop: "1px solid black",
                paddingTop: "5px",
                width: "200px",
              }}
            >
              Prodhan
              <br />
              No.- 3 Dhalpara Gram Panchayat
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
