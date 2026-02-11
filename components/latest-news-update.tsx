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
        <TableHeader className="sticky top-0 bg-slate-50 shadow-sm">
          <TableRow>
            <TableHead className="text-left text-sm font-semibold text-gray-600">Title & Description</TableHead>
            <TableHead className="text-left text-sm font-semibold text-gray-600 w-[150px]">Type</TableHead>
            <TableHead className="text-left text-sm font-semibold text-gray-600 w-[200px]">Department</TableHead>
            <TableHead className="text-left text-sm font-semibold text-gray-600 w-[150px]">Date</TableHead>
            <TableHead className="text-left text-sm font-semibold text-gray-600 w-[200px]">Files</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {notices.map((notice) => (
            <TableRow key={notice.id} className="border-b border-gray-100 hover:bg-green-50 transition-colors">
              <TableCell className="p-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{notice.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {notice.reference}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{notice.description}</p>
                </div>
              </TableCell>
              <TableCell className="p-3">
                <Badge className="bg-green-100 text-green-700 hover:bg-green-200">{notice.type}</Badge>
              </TableCell>
              <TableCell className="p-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 className="h-4 w-4 text-green-600" />
                  {notice.department}
                </div>
              </TableCell>
              <TableCell className="p-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4 text-green-600" />
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
                        className="h-7 text-xs gap-1 hover:bg-green-50"
                        onClick={() => window.open(file.url, "_blank")}
                      >
                        <Download className="h-3 w-3 text-green-600" />
                        <span>{file.name}</span>
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
              date: new Date(notice.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            })),
          )
        } else {
          setError("No notices available at the moment")
        }
      } catch (err) {
        setError("Failed to load notices. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchNotices()
  }, [])

  if (loading) {
    return (
      <Card className="w-full shadow-md">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 py-4 px-5">
          <CardTitle className="text-white text-2xl font-bold flex items-center gap-2">
            <Newspaper className="h-6 w-6" />
            <span>Official Notice Board</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-6 w-[200px] bg-green-100" />
              <Skeleton className="h-4 w-[300px] bg-green-100" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-[120px] bg-green-100" />
                <Skeleton className="h-4 w-[120px] bg-green-100" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full shadow-md">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 py-4 px-5">
          <CardTitle className="text-white text-2xl font-bold flex items-center gap-2">
            <Newspaper className="h-6 w-6" />
            <span>Official Notice Board</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertDescription className="flex items-center gap-2 text-red-700">
              <span className="font-semibold">Error:</span> {error}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 py-4 px-5">
        <CardTitle className="text-white text-2xl font-bold flex items-center gap-2">
          <Newspaper className="h-6 w-6" />
          <span>Official Notice Board</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="all">
          <TabsList className="w-full bg-slate-50 p-1 rounded-md mb-4">
            {["all", "tender", "notice", "circular", "other"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="text-xs px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:text-green-700"
              >
                {tab === "all" ? "All Notices" : tab + "s"}
              </TabsTrigger>
            ))}
          </TabsList>

          <div>
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
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
