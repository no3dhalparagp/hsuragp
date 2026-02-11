"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Download, FileText, ChevronLeft, ChevronRight, User, Users } from "lucide-react"
import { useEffect, useState } from "react"

type CertificateItem = {
  id: string
  applicantName: string
  nameOfDeceased: string
  warishRefNo: string | null
  warishRefDate: Date | null
  documentUrl: string
}

export default function WarishPrintListClient({ items: initial }: { items: CertificateItem[] }) {
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(initial.length)
  const [items, setItems] = useState<CertificateItem[]>(initial)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const run = async () => {
      setIsLoading(true)
      try {
        const url = `/api/warish/certificates?q=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}`
        const res = await fetch(url, { signal: controller.signal })
        if (res.ok) {
          const data = await res.json()
          setItems(data.items)
          setTotal(data.total)
        }
      } catch (error) {
        // Handle fetch cancellation
      } finally {
        setIsLoading(false)
      }
    }
    run()
    return () => controller.abort()
  }, [q, page, pageSize])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const startItem = (page - 1) * pageSize + 1
  const endItem = Math.min(page * pageSize, total)

  const handleDownload = (url: string, applicantName: string) => {
    const link = document.createElement('a')
    link.href = url
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.download = `warish-certificate-${applicantName.replace(/\s+/g, '-').toLowerCase()}.pdf`
    link.click()
  }

  const formatCertificateNumber = (refNo: string | null) => {
    if (!refNo) return 'N/A'
    return `#${refNo}`
  }

  return (
    <Card className="shadow-xl border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-200 hover:shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Warish Certificates
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage and download inheritance certificates
              </p>
            </div>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search certificates..."
              value={q}
              onChange={(e) => { setPage(1); setQ(e.target.value) }}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-t border-gray-100 dark:border-gray-800 overflow-x-auto bg-white dark:bg-gray-900">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800/60">
              <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                <TableHead className="w-12 text-center font-semibold text-gray-700 dark:text-gray-300">
                  #
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Applicant
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Deceased
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                  Certificate No
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-center">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow 
                  key={item.id} 
                  className="border-b border-gray-100 dark:border-gray-800 transition-colors hover:bg-blue-50/30 dark:hover:bg-gray-800/50 group"
                >
                  <TableCell className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                    {startItem + index}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                        {item.applicantName}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">
                    {item.nameOfDeceased}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={item.warishRefNo ? "default" : "secondary"}
                      className="font-mono text-xs"
                    >
                      {formatCertificateNumber(item.warishRefNo)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(item.documentUrl, item.applicantName)}
                        className="flex items-center gap-2 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {items.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No certificates found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {q ? "Try adjusting your search terms" : "No warish certificates have been generated yet"}
              </p>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-4">Loading certificates...</p>
            </div>
          )}
        </div>
        
        {/* Enhanced Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-gray-50 dark:bg-gray-800/40 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-0">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{startItem}-{endItem}</span> of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">{total}</span> results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((p) => p - 1)}
              className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = i + 1
                return (
                  <Button
                    key={pageNumber}
                    variant={page === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNumber)}
                    disabled={isLoading}
                    className="w-8 h-8 p-0 disabled:opacity-50"
                  >
                    {pageNumber}
                  </Button>
                )
              })}
              {totalPages > 5 && (
                <span className="text-gray-500 dark:text-gray-400 px-2">...</span>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
