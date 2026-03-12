"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Calendar, Building2, Download, Newspaper } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { getNotices } from "@/action/notice"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface NoticeItem {
  id: string
  title: string
  description: string
  department: string
  type: "Tender" | "Notice" | "Circular" | "Other"
  reference: string
  date: string
  files?: {
    name: string
    url: string
    type: string
  }[]
}

function NoticeList({ notices }: { notices: NoticeItem[] }) {
  return (
    <ScrollArea className="h-[500px]">
      <Table>
        <TableHeader className="sticky top-0 bg-gray-100">
          <TableRow>
            <TableHead className="text-sm font-semibold text-gray-700">Title & Description</TableHead>
            <TableHead className="text-sm font-semibold text-gray-700 w-[120px]">Type</TableHead>
            <TableHead className="text-sm font-semibold text-gray-700 w-[180px]">Department</TableHead>
            <TableHead className="text-sm font-semibold text-gray-700 w-[140px]">Date</TableHead>
            <TableHead className="text-sm font-semibold text-gray-700 w-[180px]">Files</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="bg-white">
          {notices.map((notice) => (
            <TableRow
              key={notice.id}
              className="border-b border-gray-200 hover:bg-blue-50 transition"
            >
              <TableCell className="p-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">
                      {notice.title}
                    </h3>
                    <Badge variant="outline" className="text-xs border-gray-400 text-gray-700">
                      {notice.reference}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {notice.description}
                  </p>
                </div>
              </TableCell>

              <TableCell className="p-3">
                <Badge className="bg-blue-100 text-[#1e3a8a] hover:bg-blue-100">
                  {notice.type}
                </Badge>
              </TableCell>

              <TableCell className="p-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#1e3a8a]" />
                  {notice.department}
                </div>
              </TableCell>

              <TableCell className="p-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#1e3a8a]" />
                  {notice.date}
                </div>
              </TableCell>

              <TableCell className="p-3">
                {notice.files && notice.files.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {notice.files.map((file, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white"
                        onClick={() => window.open(file.url, "_blank")}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        {file.name}
                      </Button>
                    ))}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}

export default function LatestNewsUpdate() {
  const [notices, setNotices] = useState<NoticeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const result = await getNotices()
        if (result.data?.length) {
          setNotices(
            result.data.map((notice) => ({
              ...notice,
              date: new Date(notice.date).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            })),
          )
        } else {
          setError("No notices available at the moment")
        }
      } catch {
        setError("Failed to load notices. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchNotices()
  }, [])

  if (loading) {
    return (
      <Card className="w-full border border-gray-200 shadow-none">
        <CardHeader className="bg-[#1e3a8a] py-4 px-5">
          <CardTitle className="text-white text-xl font-semibold flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Official Notice Board
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-full bg-gray-200" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full border border-gray-200 shadow-none">
        <CardHeader className="bg-[#1e3a8a] py-4 px-5">
          <CardTitle className="text-white text-xl font-semibold flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Official Notice Board
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Alert variant="destructive">
            <AlertDescription>
              <span className="font-semibold">Error:</span> {error}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full border border-gray-200 shadow-none">
      <CardHeader className="bg-[#1e3a8a] py-4 px-5">
        <CardTitle className="text-white text-xl font-semibold flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          Official Notice Board
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        <Tabs defaultValue="all">
          <TabsList className="w-full bg-gray-100 p-1 mb-4">
            {["all", "tender", "notice", "circular", "other"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="text-xs data-[state=active]:bg-white data-[state=active]:text-[#1e3a8a]"
              >
                {tab === "all" ? "All Notices" : tab + "s"}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <NoticeList notices={notices} />
          </TabsContent>
          <TabsContent value="tender">
            <NoticeList notices={notices.filter((n) => n.type === "Tender")} />
          </TabsContent>
          <TabsContent value="notice">
            <NoticeList notices={notices.filter((n) => n.type === "Notice")} />
          </TabsContent>
          <TabsContent value="circular">
            <NoticeList notices={notices.filter((n) => n.type === "Circular")} />
          </TabsContent>
          <TabsContent value="other">
            <NoticeList notices={notices.filter((n) => n.type === "Other")} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
