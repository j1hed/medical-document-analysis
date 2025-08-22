"use client"

import { useState } from "react"
import { Stethoscope, Users, FileText, TrendingUp, AlertTriangle, ArrowLeft, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock doctor data
const doctorData = {
  name: "Dr. Sarah Johnson",
  specialty: "Internal Medicine",
  license: "MD-12345",
  department: "Internal Medicine",
  patients: 247,
  pendingReviews: 12,
}

const patientList = [
  {
    id: "P001",
    name: "John Doe",
    age: 39,
    lastVisit: "2025-01-20",
    condition: "Routine Check-up",
    status: "stable",
    recentTests: [
      { type: "Chest X-Ray", date: "2025-01-20", result: "Normal", confidence: 94 },
      { type: "Blood Work", date: "2025-01-18", result: "Elevated Cholesterol", confidence: 89 },
    ],
    riskFactors: ["Hypertension", "Family History"],
    medications: ["Lisinopril 10mg", "Atorvastatin 20mg"],
  },
  {
    id: "P002",
    name: "Jane Smith",
    age: 45,
    lastVisit: "2025-01-19",
    condition: "Diabetes Management",
    status: "needs-attention",
    recentTests: [
      { type: "HbA1c", date: "2025-01-19", result: "8.2% (High)", confidence: 96 },
      { type: "Lipid Panel", date: "2025-01-15", result: "Normal", confidence: 92 },
    ],
    riskFactors: ["Type 2 Diabetes", "Obesity"],
    medications: ["Metformin 1000mg", "Insulin Glargine"],
  },
  {
    id: "P003",
    name: "Robert Wilson",
    age: 62,
    lastVisit: "2025-01-18",
    condition: "Cardiac Follow-up",
    status: "critical",
    recentTests: [
      { type: "ECG", date: "2025-01-18", result: "Atrial Fibrillation", confidence: 91 },
      { type: "Echocardiogram", date: "2025-01-16", result: "Reduced EF 35%", confidence: 88 },
    ],
    riskFactors: ["Heart Failure", "Atrial Fibrillation", "Smoking History"],
    medications: ["Warfarin 5mg", "Metoprolol 50mg", "Lisinopril 20mg"],
  },
]

const pendingReviews = [
  {
    id: "REV-001",
    patientName: "John Doe",
    testType: "Chest X-Ray",
    date: "2025-01-20",
    aiAnalysis: "Normal chest radiograph. Clear lung fields bilaterally. Normal cardiac silhouette.",
    confidence: 94,
    priority: "routine",
    findings: ["Clear lung fields", "Normal heart size", "No acute abnormalities"],
  },
  {
    id: "REV-002",
    patientName: "Jane Smith",
    testType: "Retinal Scan",
    date: "2025-01-19",
    aiAnalysis: "Diabetic retinopathy changes detected. Microaneurysms and hard exudates present.",
    confidence: 87,
    priority: "urgent",
    findings: ["Microaneurysms present", "Hard exudates detected", "Mild diabetic retinopathy"],
  },
]

export default function DoctorPortalPage() {
  const [selectedPatient, setSelectedPatient] = useState(patientList[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredPatients = patientList.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = statusFilter === "all" || patient.status === statusFilter
    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "stable":
        return <Badge className="bg-green-100 text-green-800">Stable</Badge>
      case "needs-attention":
        return <Badge className="bg-yellow-100 text-yellow-800">Needs Attention</Badge>
      case "critical":
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge className="bg-red-100 text-red-800">Urgent</Badge>
      case "routine":
        return <Badge className="bg-blue-100 text-blue-800">Routine</Badge>
      default:
        return <Badge variant="secondary">Normal</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <a href="/" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </a>
              </Button>
              <div>
                <h1 className="text-xl font-bold font-serif text-primary">Doctor Portal</h1>
                <p className="text-sm text-muted-foreground">Welcome, {doctorData.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">{doctorData.specialty}</Badge>
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="patients" className="space-y-6">
          <TabsList>
            <TabsTrigger value="patients">My Patients</TabsTrigger>
            <TabsTrigger value="reviews">Pending Reviews ({pendingReviews.length})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-6">
            {/* Doctor Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{doctorData.patients}</div>
                  <p className="text-xs text-muted-foreground">+12 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                  <FileText className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{doctorData.pendingReviews}</div>
                  <p className="text-xs text-muted-foreground">Require attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">3</div>
                  <p className="text-xs text-muted-foreground">Need immediate attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">91.2%</div>
                  <p className="text-xs text-muted-foreground">Average confidence</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Patient List */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">Patient List</CardTitle>
                  <CardDescription>Manage your patients and their care</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search and Filter */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px]">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="stable">Stable</SelectItem>
                        <SelectItem value="needs-attention">Needs Attention</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Patient Cards */}
                  <div className="space-y-3">
                    {filteredPatients.map((patient) => (
                      <div
                        key={patient.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                          selectedPatient?.id === patient.id ? "border-primary bg-primary/5" : ""
                        }`}
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{patient.name}</h4>
                          {getStatusBadge(patient.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Age {patient.age}</span>
                          <span>Last visit: {patient.lastVisit}</span>
                        </div>
                        <p className="text-sm mt-1">{patient.condition}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Patient Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif">{selectedPatient.name}</CardTitle>
                  <CardDescription>
                    Patient ID: {selectedPatient.id} • Age {selectedPatient.age}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Status</span>
                    {getStatusBadge(selectedPatient.status)}
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Recent Tests</h4>
                    <div className="space-y-2">
                      {selectedPatient.recentTests.map((test, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div>
                            <p className="font-medium text-sm">{test.type}</p>
                            <p className="text-xs text-muted-foreground">{test.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">{test.result}</p>
                            <p className="text-xs text-muted-foreground">{test.confidence}% confidence</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Risk Factors</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedPatient.riskFactors.map((factor, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Current Medications</h4>
                    <ul className="space-y-1">
                      {selectedPatient.medications.map((medication, index) => (
                        <li key={index} className="text-sm">
                          • {medication}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Update Care Plan
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      Schedule Follow-up
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <Stethoscope className="w-5 h-5 text-primary" />
                  Pending AI Analysis Reviews
                </CardTitle>
                <CardDescription>Review and approve AI-generated medical analyses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingReviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">
                          {review.patientName} - {review.testType}
                        </h4>
                        <p className="text-sm text-muted-foreground">{review.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(review.priority)}
                        <Badge className="bg-blue-100 text-blue-800">{review.confidence}% Confidence</Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-sm mb-1">AI Analysis</h5>
                        <p className="text-sm text-muted-foreground">{review.aiAnalysis}</p>
                      </div>

                      <div>
                        <h5 className="font-medium text-sm mb-1">Key Findings</h5>
                        <ul className="space-y-1">
                          {review.findings.map((finding, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              {finding}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Approve Analysis
                        </Button>
                        <Button size="sm" variant="outline">
                          Request Revision
                        </Button>
                        <Button size="sm" variant="outline">
                          View Full Report
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Practice Analytics
                </CardTitle>
                <CardDescription>Insights into your practice and AI analysis performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Patient Distribution by Condition</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Diabetes Management</span>
                        <span className="text-sm font-medium">35%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Hypertension</span>
                        <span className="text-sm font-medium">28%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Routine Check-ups</span>
                        <span className="text-sm font-medium">22%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Cardiac Conditions</span>
                        <span className="text-sm font-medium">15%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">AI Analysis Performance</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Average Confidence</span>
                        <span className="text-sm font-medium">91.2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Analyses This Month</span>
                        <span className="text-sm font-medium">156</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Doctor Approval Rate</span>
                        <span className="text-sm font-medium">94.8%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Time Saved</span>
                        <span className="text-sm font-medium">23.5 hours</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
