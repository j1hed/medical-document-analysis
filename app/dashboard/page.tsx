"use client"

import { useState } from "react"
import {
  FileText,
  ImageIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  Search,
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import MedicalTrendsChart from "@/components/medical-trends-chart"

// Mock data for demonstration
const mockDocuments = [
  {
    id: 1,
    name: "Chest_X-Ray_Patient_001.dcm",
    type: "X-Ray",
    status: "completed",
    uploadDate: "2025-01-20",
    analysisDate: "2025-01-20",
    findings: ["No acute abnormalities", "Clear lung fields"],
    confidence: 94,
    size: "2.4 MB",
  },
  {
    id: 2,
    name: "Lab_Results_Comprehensive.pdf",
    type: "Lab Report",
    status: "processing",
    uploadDate: "2025-01-20",
    analysisDate: null,
    findings: [],
    confidence: null,
    size: "1.2 MB",
  },
  {
    id: 3,
    name: "MRI_Brain_Scan.dcm",
    type: "MRI",
    status: "completed",
    uploadDate: "2025-01-19",
    analysisDate: "2025-01-19",
    findings: ["Normal brain structure", "No lesions detected"],
    confidence: 89,
    size: "15.7 MB",
  },
  {
    id: 4,
    name: "Prescription_History.pdf",
    type: "Prescription",
    status: "failed",
    uploadDate: "2025-01-19",
    analysisDate: null,
    findings: [],
    confidence: null,
    size: "0.8 MB",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-4 h-4 text-green-600" />
    case "processing":
      return <Clock className="w-4 h-4 text-yellow-600" />
    case "failed":
      return <AlertCircle className="w-4 h-4 text-red-600" />
    default:
      return <Clock className="w-4 h-4 text-gray-400" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
    case "processing":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Processing</Badge>
    case "failed":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedDocument, setSelectedDocument] = useState<(typeof mockDocuments)[0] | null>(null)

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || doc.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const completedCount = mockDocuments.filter((doc) => doc.status === "completed").length
  const processingCount = mockDocuments.filter((doc) => doc.status === "processing").length
  const failedCount = mockDocuments.filter((doc) => doc.status === "failed").length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-serif text-primary">VisionaryCare</h1>
              <p className="text-muted-foreground mt-1">Document Analysis Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                <Shield className="w-4 h-4 mr-1" />
                HIPAA Compliant
              </Badge>
              <Button variant="outline">Dr. Sarah Johnson</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockDocuments.length}</div>
                  <p className="text-xs text-muted-foreground">+2 from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                  <p className="text-xs text-muted-foreground">Analysis complete</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Processing</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{processingCount}</div>
                  <p className="text-xs text-muted-foreground">In progress</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Confidence</CardTitle>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">91.5%</div>
                  <p className="text-xs text-muted-foreground">AI analysis accuracy</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Recent Activity</CardTitle>
                <CardDescription>Latest document analyses and findings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDocuments.slice(0, 3).map((doc) => (
                    <div key={doc.id} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                      <div className="flex-shrink-0">{getStatusIcon(doc.status)}</div>
                      <div className="flex-1">
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.type} • Uploaded {doc.uploadDate}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(doc.status)}
                        {doc.confidence && (
                          <p className="text-sm text-muted-foreground mt-1">{doc.confidence}% confidence</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Documents List */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Medical Documents</CardTitle>
                <CardDescription>{filteredDocuments.length} documents found</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        {doc.type === "X-Ray" || doc.type === "MRI" ? (
                          <ImageIcon className="w-8 h-8 text-primary" />
                        ) : (
                          <FileText className="w-8 h-8 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{doc.name}</h3>
                          {getStatusIcon(doc.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{doc.type}</span>
                          <span>{doc.size}</span>
                          <span>Uploaded {doc.uploadDate}</span>
                        </div>
                        {doc.findings.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-green-700">Key Findings:</p>
                            <ul className="text-sm text-muted-foreground">
                              {doc.findings.map((finding, index) => (
                                <li key={index}>• {finding}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(doc.status)}
                        {doc.confidence && (
                          <div className="text-right">
                            <p className="text-sm font-medium">{doc.confidence}%</p>
                            <Progress value={doc.confidence} className="w-16 h-2" />
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <MedicalTrendsChart />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Document Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>X-Ray</span>
                      <span className="font-medium">1</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Lab Reports</span>
                      <span className="font-medium">1</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>MRI</span>
                      <span className="font-medium">1</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Prescriptions</span>
                      <span className="font-medium">1</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <PieChart className="w-5 h-5 text-primary" />
                    Analysis Success Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-green-600">Successful</span>
                      <span className="font-medium">50%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-600">Processing</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-red-600">Failed</span>
                      <span className="font-medium">25%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Processing Timeline</CardTitle>
                <CardDescription>Average processing times by document type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span>X-Ray Analysis</span>
                    <span className="font-medium">2.3 minutes</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span>Lab Report Processing</span>
                    <span className="font-medium">4.7 minutes</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span>MRI Analysis</span>
                    <span className="font-medium">8.2 minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Generated Reports</CardTitle>
                <CardDescription>Download comprehensive analysis reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDocuments
                    .filter((doc) => doc.status === "completed")
                    .map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{doc.name} - Analysis Report</h3>
                          <p className="text-sm text-muted-foreground">
                            Generated on {doc.analysisDate} • {doc.confidence}% confidence
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" className="bg-primary hover:bg-primary/90">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
