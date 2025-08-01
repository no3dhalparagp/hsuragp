import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { formatDate } from "@/utils/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  CalendarIcon, 
  FileTextIcon, 
  UserIcon, 
  ClipboardIcon,  // Add this import
  EyeIcon, 
  AlertCircleIcon 
} from "lucide-react"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CopyApplicationId } from "@/components/copy-application-id"

const StaffDashboard = async () => {
  const cstaff = await currentUser()

  if (!cstaff) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full transform transition-all hover:scale-105">
          <AlertCircleIcon className="w-20 h-20 text-yellow-500 mb-6 mx-auto animate-pulse" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Access Denied</h2>
          <p className="text-gray-600 text-center text-lg">Please log in to view your dashboard.</p>
        </div>
      </div>
    )
  }

  const warishApplications = await db.warishApplication.findMany({
    where: {
      assingstaffId: cstaff.id,
      warishApplicationStatus: "process",
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-200 transform transition-all hover:shadow-3xl">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8">
            <h2 className="text-3xl font-bold flex items-center">
              <ClipboardIcon className="mr-4 h-8 w-8 animate-bounce" />
              Assigned Applications
            </h2>
          </div>
          <div className="p-8">
            {warishApplications.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-2xl">
                <FileTextIcon className="mx-auto h-16 w-16 text-gray-400 mb-6 animate-pulse" />
                <p className="text-2xl font-semibold text-gray-700 mb-2">No assigned applications</p>
                <p className="text-gray-500 text-lg">New applications will appear here when assigned.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-[800px]">
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b-2 border-purple-100">
                      <TableHead className="py-6 px-6 text-left text-sm font-bold text-purple-800 uppercase tracking-wider">
                        Application ID
                      </TableHead>
                      <TableHead className="py-6 px-6 text-left text-sm font-bold text-purple-800 uppercase tracking-wider">
                        Applicant Name
                      </TableHead>
                      <TableHead className="py-6 px-6 text-left text-sm font-bold text-purple-800 uppercase tracking-wider">
                        Status
                      </TableHead>
                      <TableHead className="py-6 px-6 text-left text-sm font-bold text-purple-800 uppercase tracking-wider">
                        Application Date
                      </TableHead>
                      <TableHead className="py-6 px-6 text-left text-sm font-bold text-purple-800 uppercase tracking-wider">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {warishApplications.map((application, index) => (
                      <TableRow
                        key={application.id}
                        className={`transition-all duration-200 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-indigo-50 hover:shadow-inner`}
                      >
                        <TableCell className="py-5 px-6">
                          <CopyApplicationId applicationId={application.acknowlegment} />
                        </TableCell>
                        <TableCell className="py-5 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="bg-indigo-100 p-2 rounded-full">
                              <UserIcon className="h-6 w-6 text-indigo-600" />
                            </div>
                            <span className="font-medium text-gray-800 text-sm">{application.applicantName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-5 px-6">
                          <Badge
                            variant={
                              application.warishApplicationStatus === "approved"
                                ? "success"
                                : application.warishApplicationStatus === "rejected"
                                  ? "destructive"
                                  : "default"
                            }
                            className="text-xs px-3 py-1 rounded-full shadow-sm"
                          >
                            {application.warishApplicationStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-5 px-6">
                          <div className="flex items-center text-gray-600 space-x-2">
                            <div className="bg-indigo-100 p-2 rounded-full">
                              <CalendarIcon className="h-5 w-5 text-indigo-600" />
                            </div>
                            <span className="text-sm font-medium">{formatDate(application.createdAt)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-5 px-6">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 rounded-full"
                            asChild
                          >
                            <Link href={`/employeedashboard/warish/view-assigned/${application.id}`}>
                              <div className="flex items-center space-x-2">
                                <EyeIcon className="h-4 w-4" />
                                <span>View Details</span>
                              </div>
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

export default StaffDashboard
