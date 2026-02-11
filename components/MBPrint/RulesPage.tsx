import React from "react";

export const RulesPage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-border">
        <div className="page-number">Page 2</div>
        <h2
          style={{
            textAlign: "center",
            textDecoration: "underline",
            marginBottom: "15px",
          }}
        >
          RULES
        </h2>
        <div style={{ fontSize: "10px", textAlign: "justify" }}>
          <ol style={{ paddingLeft: "15px" }}>
            <li style={{ marginBottom: "5px" }}>
              The measurement book is the basic of all account of quantities
              whether of work done by daily labour or by place-work or contract
              or of materials received which have to be counted or measured had
              should be so kept up that the transaction may be readily traceable
              in the bill. The measurements effected should then be cancelled by
              cross redlines being drawn across the page or pages.
            </li>
            <li style={{ marginBottom: "5px" }}>
              All measurements are to be neatly taken down in this book and in
              no others. The description of the situation of work must be lucid,
              so as to admit of easy identification and check.
            </li>
            <li style={{ marginBottom: "5px" }}>
              The entries in the measurement book should if possible be made in
              ink but when this is not possible the entries have to be recorded
              in pencil. The pencil entries should not be inked over but left
              untouched. The contents or area should however be invariable inked
              by the officer who has taken the measurement. No page of the book
              should on any accounts be torn out. No entry should be erased or
              effected so as to be illegible. No erasers are allowed. If a
              mistake is made it should be corrected by drawing the pen through
              the incorrect entry and inserting the correct one in red ink
              between the lines. Every such correct should be initiled by the
              officer measuring the work. A reliable record is the object to be
              aimed at as it may have to be produced as evidence in a court of
              law.
            </li>
            <li style={{ marginBottom: "5px" }}>
              For large work a separate measurement book should be specially set
              as a part for each contractor and for each different class of work
              executed by the same contractor.
            </li>
            <li style={{ marginBottom: "5px" }}>
              The measurement books must be looked upon as important records.
              They should be carefully checked by the Executive Engineer to see
              that they are properly kept up and measurement duly recorded and
              that they are complete record of each kind of work for which
              certificates have been granted. The eventual return of all books
              to the divisional office for record should be insisted upon. They
              must be carefully preserved for 20 years.
            </li>
            <li style={{ marginBottom: "5px" }}>
              Before detailing the measurement relating to a work the following
              information should invariable be given at the top of the first
              page of such measurements: (a) Name of work. (b) Situation of work
              (c) Date of measurement. (d) Period during work executed or
              supplied.
            </li>
            <li style={{ marginBottom: "5px" }}>
              For facility of reference and to assist in carrying out the
              instruction given in para 4 above and Index has been provided for.
            </li>
            <li style={{ marginBottom: "5px" }}>
              A Register of measurement books should be maintained showing their
              receipts and disposal.
            </li>
            <li style={{ marginBottom: "5px" }}>
              A Register of transit of measurement books should be maintained by
              each Executive Engineer.
            </li>
            <li>
              Measurement books when not in use must be kept under lock and key.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
