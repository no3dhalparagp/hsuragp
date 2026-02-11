# PDF Generators

Modern, professionally designed PDF generators using pdf-lib for better control and design.

## Features

- **Better Design**: Professional layouts with gradients, colors, and modern typography
- **Full Control**: Direct PDF creation using pdf-lib instead of templates
- **Consistent Branding**: Unified color scheme and styling across all documents
- **Better Typography**: Proper font sizes, weights, and spacing
- **Enhanced Readability**: Well-structured tables with alternating row colors
- **Official Look**: Headers, footers, and signature sections

## Color Scheme

- **Primary Color**: rgb(0.12, 0.29, 0.49) - Dark Blue
- **Accent Color**: rgb(0.0, 0.47, 0.75) - Bright Blue
- **Success Color**: rgb(0, 0.5, 0) - Green (for totals)
- **Error Color**: rgb(0.7, 0, 0) - Red (for deductions)

## Generators

### 1. Measurement Book PDF (`measurement-book-pdf.ts`)
Generates measurement book with:
- Professional header with gradient background
- Project details box
- Detailed measurement table with dimensions
- Total calculation section
- Signature areas
- Footer with generation date

### 2. Estimate PDF (`estimate-pdf.ts`)
Generates estimates with two modes:
- **Detailed Mode**: Shows all measurements with breakdown
- **Abstract Mode**: Summary view with totals only
Features:
- Project information header
- Itemwise breakdown
- GST and LWC calculations
- Grand total with amount in words

### 3. Bill Abstract PDF (`bill-abstract-pdf.ts`)
Generates bill abstracts with:
- Header with GP and block information
- Project and MB reference details
- Work items table
- Financial calculations (contractual deductions, GST, LWC)
- Gross bill amount
- Signature sections

### 4. Bill Deduction PDF (`bill-deduction-pdf.ts`)
Generates final payment certificates with:
- Comprehensive work details section
- Project timeline
- Detailed financial summary
- All deduction breakdowns (Income Tax, GST TDS, Labour Cess, Security Deposit)
- Net payable amount
- Amount in words
- Signature sections for approval

## Usage

```typescript
import { 
  generateMeasurementBookPDF,
  generateEstimatePDF,
  generateBillAbstractPDF,
  generateBillDeductionPDF
} from '@/lib/pdf-generators';

// Measurement Book
const mbPdfBytes = await generateMeasurementBookPDF({
  mbNumber: "MB-001",
  mbPageNumber: "P-01",
  workName: "Road Construction",
  location: "Village XYZ",
  contractorName: "ABC Contractors",
  measuredBy: "John Doe",
  activityCode: "AC-123",
  agreementAmount: "500000.00",
  entries: [...],
});

// Estimate
const estimatePdfBytes = await generateEstimatePDF({
  projectName: "Building Construction",
  projectLocation: "City ABC",
  activityCode: "AC-456",
  fund: "State Fund",
  items: [...],
  mode: 'detailed', // or 'abstract'
  ...calculations
});

// Bill Abstract
const billAbstractPdfBytes = await generateBillAbstractPDF({
  billType: "1st & Final Bill",
  projectName: "Road Work",
  projectLocation: "Village XYZ",
  entries: [...],
  ...calculations
});

// Bill Deduction
const billDeductionPdfBytes = await generateBillDeductionPDF({
  gpName: "GP Name",
  blockName: "Block Name",
  workName: "Work Description",
  ...workDetails,
  ...deductions
});
```

## Design Improvements over Template-based Approach

1. **Full Typography Control**: Different font sizes and weights for headers, body, and emphasis
2. **Color Consistency**: Unified color palette across all documents
3. **Better Layouts**: Precise positioning and spacing
4. **Dynamic Content**: Adapts to content length with page breaks
5. **No External Dependencies**: No need for JSON templates
6. **Easier Maintenance**: Code-based generation is easier to update and maintain
7. **Better Error Handling**: Direct control over PDF generation process

## Future Enhancements

- [ ] Add logo support
- [ ] QR code generation for verification
- [ ] Digital signatures
- [ ] Watermarks for drafts
- [ ] Multi-language support
- [ ] Custom font embedding
