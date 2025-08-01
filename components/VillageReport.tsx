

"use client"

import { useState, useEffect } from "react"
import type { Prisma } from "@prisma/client"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

// Define the type for the village data
type VillageWithYearlyData = Prisma.VillageGetPayload<{
  include: {
    yearlyData: true
  }
}>

// Define the structure of a row in the PDF table
interface VillageReportRow {
  jlNo: string
  name: string
  totalPopulation: string
  male: string
  female: string
  literacy: string
  sc: string
  st: string
}

export default function VillageReport() {
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [searchTerm, setSearchTerm] = useState("")
  const [data, setData] = useState<VillageWithYearlyData[]>([])
  const [loading, setLoading] = useState(true)
  const [availableYears] = useState<number[]>(
    Array.from({ length: 14 }, (_, i) => 2011 + i), // 2011-2024
  )

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/villages?year=${year}`)
        const result = await response.json()
        setData(result.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [year])

  // Filter data based on search term and selected year
  const filteredData = data.filter((village) => {
    const yearlyData = village.yearlyData.find((d) => d.year === year)
    if (!yearlyData) return false

    return (
      village.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      village.jlNo.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Calculate totals for the footer
  const totals = filteredData.reduce(
    (acc, village) => {
      const yearlyData = village.yearlyData.find((d) => d.year === year)
      if (yearlyData) {
        acc.totalPopulation += yearlyData.totalPopulation
        acc.malePopulation += yearlyData.malePopulation
        acc.femalePopulation += yearlyData.femalePopulation
        acc.totalLiterate += yearlyData.totalLiterate
        acc.scPopulation += yearlyData.scPopulation
        acc.stPopulation += yearlyData.stPopulation
      }
      return acc
    },
    {
      totalPopulation: 0,
      malePopulation: 0,
      femalePopulation: 0,
      totalLiterate: 0,
      scPopulation: 0,
      stPopulation: 0,
    },
  )

  const generatePDF = () => {
    const doc = new jsPDF("l", "mm", "a4")
    const date = new Date()
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })

    // Title
    doc.setFontSize(18)
    doc.text(`Village Census Report - ${year}`, 14, 22)
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Generated on ${formattedDate} at ${formattedTime}`, 14, 28)

    // Table data
    const columns: { header: string; dataKey: keyof VillageReportRow }[] = [
      { header: "JL No", dataKey: "jlNo" },
      { header: "Village Name", dataKey: "name" },
      { header: "Population", dataKey: "totalPopulation" },
      { header: "Male", dataKey: "male" },
      { header: "Female", dataKey: "female" },
      { header: "Literacy %", dataKey: "literacy" },
      { header: "SC", dataKey: "sc" },
      { header: "ST", dataKey: "st" },
    ]

    const rows: VillageReportRow[] = filteredData.map((village) => {
      const yearlyData = village.yearlyData.find((d) => d.year === year)!
      return {
        jlNo: village.jlNo,
        name: village.name,
        totalPopulation: yearlyData.totalPopulation.toLocaleString(),
        male: yearlyData.malePopulation.toLocaleString(),
        female: yearlyData.femalePopulation.toLocaleString(),
        literacy: `${((yearlyData.totalLiterate / yearlyData.totalPopulation) * 100).toFixed(1)}%`,
        sc: yearlyData.scPopulation.toLocaleString(),
        st: yearlyData.stPopulation.toLocaleString(),
      }
    })

    // Add totals row
    const footerData: VillageReportRow[] = [
      {
        jlNo: "Total",
        name: `${filteredData.length} villages`,
        totalPopulation: totals.totalPopulation.toLocaleString(),
        male: totals.malePopulation.toLocaleString(),
        female: totals.femalePopulation.toLocaleString(),
        literacy:
          totals.totalPopulation > 0
            ? `${((totals.totalLiterate / totals.totalPopulation) * 100).toFixed(1)}%`
            : "0.0%",
        sc: totals.scPopulation.toLocaleString(),
        st: totals.stPopulation.toLocaleString(),
      },
    ]

    // Generate the table
    autoTable(doc, {
      head: [columns.map((col) => col.header)],
      body: rows.map((row) => columns.map((col) => row[col.dataKey])),
      foot: [footerData.map((data) => columns.map((col) => data[col.dataKey]))],
      startY: 32,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 10 },
      bodyStyles: { fontSize: 9 },
      footStyles: { fillColor: [44, 62, 80], textColor: 255, fontSize: 10, fontStyle: "bold" },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30, halign: "right", fontStyle: "bold" },
        3: { cellWidth: 30, halign: "right" },
        4: { cellWidth: 30, halign: "right" },
        5: { cellWidth: 30, halign: "right" },
        6: { cellWidth: 30, halign: "right" },
        7: { cellWidth: 30, halign: "right" },
      },
      didDrawPage: (data) => {
        // Footer text
        doc.setFontSize(10)
        doc.setTextColor(100)
        const pageCount = doc.getNumberOfPages()
        const footerText = `Page ${data.pageNumber} of ${pageCount} | Generated on ${formattedDate} at ${formattedTime}`

        // Add footer to each page
        doc.text(footerText, data.settings.margin.left, doc.internal.pageSize.height - 10)
      },
    })

    // Save the PDF
    doc.save(`village-report-${year}.pdf`)
  }
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-3 items-center">
          <Select value={year.toString()} onValueChange={(value) => setYear(Number(value))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500">Reporting Year</span>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <Input
            placeholder="Search village..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button onClick={generatePDF} className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border shadow-sm overflow-hidden">
          <Table className="border-collapse">
            <TableHeader className="bg-gray-50/80 hover:bg-gray-50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px]">JL No</TableHead>
                <TableHead className="min-w-[200px]">Village Name</TableHead>
                <TableHead className="text-right">Population</TableHead>
                <TableHead className="text-right">Male</TableHead>
                <TableHead className="text-right">Female</TableHead>
                <TableHead className="text-right">Literacy</TableHead>
                <TableHead className="text-right">SC</TableHead>
                <TableHead className="text-right">ST</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredData.map((village) => {
                const yearlyData = village.yearlyData.find((d) => d.year === year)
                if (!yearlyData) return null

                return (
                  <TableRow key={village.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-medium">{village.jlNo}</TableCell>
                    <TableCell className="font-medium text-gray-900">{village.name}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {yearlyData.totalPopulation.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-gray-600">
                      {yearlyData.malePopulation.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-gray-600">
                      {yearlyData.femalePopulation.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium text-blue-600">
                        {((yearlyData.totalLiterate / yearlyData.totalPopulation) * 100).toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-gray-600">
                      {yearlyData.scPopulation.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-gray-600">
                      {yearlyData.stPopulation.toLocaleString()}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>

            <TableFooter className="bg-gray-50/80">
              <TableRow>
                <TableCell colSpan={2} className="text-right font-medium">
                  Total ({filteredData.length} villages)
                </TableCell>
                <TableCell className="text-right font-semibold">{totals.totalPopulation.toLocaleString()}</TableCell>
                <TableCell className="text-right">{totals.malePopulation.toLocaleString()}</TableCell>
                <TableCell className="text-right">{totals.femalePopulation.toLocaleString()}</TableCell>
                <TableCell className="text-right font-medium text-blue-600">
                  {((totals.totalLiterate / totals.totalPopulation) * 100).toFixed(1)}%
                </TableCell>
                <TableCell className="text-right">{totals.scPopulation.toLocaleString()}</TableCell>
                <TableCell className="text-right">{totals.stPopulation.toLocaleString()}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          {filteredData.length === 0 && !loading && (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-2">
              <span className="text-2xl">🏞️</span>
              <p className="mt-2">No villages found matching your criteria</p>
              <p className="text-sm text-gray-400">Try adjusting your search or year filter</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
