export const printStyles = `
@page {
  size: A4 landscape;
  margin: 0;
}

* {
  box-sizing: border-box;
}

body {
  font-family: "Times New Roman", serif;
  color: #000;
  margin: 0;
  padding: 0;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* One physical sheet = two logical pages side by side */
.sheet {
  width: 297mm;
  height: 210mm;
  display: flex;
  page-break-after: always;
  break-after: page;
}

/* Logical page container used by all MB print components */
.page-container {
  width: 50%;
  padding: 5mm;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Inner bordered area to mimic MB register page */
.page-border {
  border: 1px solid #000;
  padding: 5mm;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  margin-bottom: 6mm;
}

.page-number {
  font-size: 10px;
  text-align: right;
}

.content {
  flex: 1;
  font-size: 11px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}

td, th {
  border: 1px solid #000;
  padding: 3px;
  vertical-align: top;
}

.text-center { text-align: center; }
.text-right { text-align: right; }
.text-left { text-align: left; }
.bold { font-weight: bold; }

.total-row td {
  border-top: 2px solid #000;
  font-weight: bold;
}

.signature-block {
  display: flex;
  justify-content: space-between;
  margin-top: 8mm;
  font-size: 10px;
}

.signature-line {
  text-align: center;
  min-width: 35mm;
}

.signature-line::before {
  content: "";
  display: block;
  border-top: 1px solid #000;
  margin-bottom: 2mm;
}

.no-print {
  display: none;
}
`;
