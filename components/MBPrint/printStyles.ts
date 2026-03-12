export const printStyles = `
@page {
  size: A4 landscape;
  margin: 0;
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: "Times New Roman", serif;
  font-size: 11px;
  color: #000;
  background: #e5e7eb;
}

.print-root {
  margin: 0;
  padding: 0;
  width: 100%;
}

@media print {
  html, body, .print-root {
    background: #fff !important;
  }
  .sheet {
    page-break-after: always;
    break-after: page;
  }
  .page-container {
    overflow: hidden;
  }
}

/* Sheet = one A4 landscape sheet holding two pages side-by-side */
.sheet {
  width: 297mm;
  height: 210mm;
  display: flex;
  gap: 4mm;
  padding: 0 4mm;
  page-break-after: always;
  box-sizing: border-box;
  overflow: hidden;
}

/* Each page occupies exactly half the landscape sheet */
.page-container {
  flex: 1 1 0;
  min-width: 0;
  height: 210mm;
  max-height: 210mm;
  padding: 5mm;
  display: flex;
  box-sizing: border-box;
  overflow: hidden;
}

/* Border */
.page-border {
  border: 1px solid #000;
  padding: 4mm;
  width: 100%;
  min-width: 0;
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
}

/* Header */
.page-header {
  height: 10mm;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Content – fills remaining space, clips at boundary */
.content {
  flex: 1 1 0;
  overflow: hidden;
  min-height: 0;
}

/* Table */
table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

thead {
  display: table-header-group;
}

tr {
  page-break-inside: avoid;
  break-inside: avoid;
}

th, td {
  border: 1px solid #000;
  padding: 3px 4px;
  vertical-align: top;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  line-height: 1.35;
}

td.cell-description,
th.cell-description {
  max-width: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
}

.cell-description-wide {
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  line-height: 1.35;
}

tbody tr td {
  min-height: 1.35em;
}

/* Footer */
.signature-block {
  height: 16mm;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  margin-top: auto;
}

.signature-line {
  min-width: 35mm;
  text-align: center;
}

.signature-line::before {
  content: "";
  display: block;
  border-top: 1px solid #000;
  margin-bottom: 2mm;
}

.total-row td {
  font-weight: bold;
}

.group-header td {
  font-weight: bold;
}

.text-right {
  text-align: right;
}

.text-center {
  text-align: center;
}

.bold {
  font-weight: bold;
}

.page-number {
  font-weight: bold;
  font-size: 11px;
}
`;
