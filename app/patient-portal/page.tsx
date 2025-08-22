"use client"

import { useState } from "react"
import { Heart, FileText, Calendar, MessageCircle, Bell, User, ArrowLeft, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock patient data
const patientData = {
  name: "John Doe",
  id: "P001",
  dateOfBirth: "1985-03-15",
  email: "john.doe@email.com",
  phone: "(555) 123-4567",
  primaryDoctor: "Dr. Sarah Johnson",
  lastVisit: "2025-01-20",
}

const patientReports = [
  {
    id: "RPT-P001",
    title: "Chest X-Ray Results",
    date: "2025-01-20",
    type: "Imaging",
    status: "completed",
    summary: "Good news! Your chest X-ray shows normal, healthy lungs with no signs of infection or other problems.",
    keyPoints: ["Your lungs appear clear and healthy", "Your heart size looks normal", "No signs of infection found"],
    nextSteps: [
      "Continue with your regular healthcare routine",
      "No urgent follow-up needed",
      "Contact your doctor if you have concerns",
    ],
    doctorNotes: "Patient can continue normal activities. Routine follow-up in 6 months.",
    confidence: 94,
  },
  {
    id: "RPT-P002",
    title: "Blood Test Results",
    date: "2025-01-18",
    type: "Lab Work",
    status: "completed",
    summary: "Your blood test results show most values are within normal ranges. A few areas need attention.",
    keyPoints: [
      "Most blood values are normal",
      "Cholesterol levels are slightly elevated",
      "Blood sugar levels are good",
    ],
    nextSteps: ["Consider dietary changes to lower cholesterol", "Increase physical activity", "Follow up in 3 months"],
    doctorNotes: "Recommend lifestyle modifications. Schedule follow-up to monitor cholesterol.",
    confidence: 89,
  },
]

const upcomingAppointments = [
  {
    id: "APT-001",
    date: "2025-02-15",
    time: "10:30 AM",
    doctor: "Dr. Sarah Johnson",
    type: "Follow-up Consultation",
    location: "Main Clinic - Room 205",
  },
  {
    id: "APT-002",
    date: "2025-03-20",
    time: "2:00 PM",
    doctor: "Dr. Michael Chen",
    type: "Routine Check-up",
    location: "Main Clinic - Room 101",
  },
]

export default function PatientPortalPage() {
  const [selectedReport, setSelectedReport] = useState(patientReports[0])

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
                <h1 className="text-xl font-bold font-serif text-primary">Patient Portal</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {patientData.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <User className="w-5 h-5 text-primary" />
                  My Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Patient ID</label>
                  <p className="text-sm text-muted-foreground">{patientData.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Date of Birth</label>
                  <p className="text-sm text-muted-foreground">{patientData.dateOfBirth}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Primary Doctor</label>
                  <p className="text-sm text-muted-foreground">{patientData.primaryDoctor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Last Visit</label>
                  <p className="text-sm text-muted-foreground">{patientData.lastVisit}</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="font-serif">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message Doctor
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <FileText className="w-4 h-4 mr-2" />
                  Request Records
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="results" className="space-y-6">
              <TabsList>
                <TabsTrigger value="results">My Results</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
              </TabsList>

              <TabsContent value="results" className="space-y-6">
                {/* Health Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-serif">
                      <Heart className="w-5 h-5 text-primary" />
                      Health Summary
                    </CardTitle>
                    <CardDescription>Overview of your recent test results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">2</div>
                        <div className="text-sm text-green-700">Normal Results</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">1</div>
                        <div className="text-sm text-yellow-700">Needs Attention</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">1</div>
                        <div className="text-sm text-blue-700">Upcoming Tests</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Results */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Results List */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-serif">Recent Results</CardTitle>
                      <CardDescription>Your latest test results and reports</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {patientReports.map((report) => (
                        <div
                          key={report.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                            selectedReport?.id === report.id ? "border-primary bg-primary/5" : ""
                          }`}
                          onClick={() => setSelectedReport(report)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{report.title}</h4>
                            <Badge className="bg-green-100 text-green-800">{report.confidence}% Accurate</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{report.type}</span>
                            <span>{report.date}</span>
                          </div>
                          <p className="text-sm mt-2 line-clamp-2">{report.summary}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Result Details */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="font-serif">{selectedReport.title}</CardTitle>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View Full
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <CardDescription>
                        {selectedReport.type} • {selectedReport.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">What This Means</h4>
                        <p className="text-sm text-muted-foreground">{selectedReport.summary}</p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Key Points</h4>
                        <ul className="space-y-1">
                          {selectedReport.keyPoints.map((point, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <span className="text-green-600 mt-1">•</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">What You Should Do</h4>
                        <ul className="space-y-1">
                          {selectedReport.nextSteps.map((step, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <span className="text-blue-600 mt-1">•</span>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-1">Doctor's Note</h4>
                        <p className="text-sm text-blue-700">{selectedReport.doctorNotes}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="appointments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-serif">
                      <Calendar className="w-5 h-5 text-primary" />
                      Upcoming Appointments
                    </CardTitle>
                    <CardDescription>Your scheduled appointments and visits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0">
                          <Calendar className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{appointment.type}</h4>
                          <p className="text-sm text-muted-foreground">
                            {appointment.doctor} • {appointment.location}
                          </p>
                          <p className="text-sm font-medium text-primary">
                            {appointment.date} at {appointment.time}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Reschedule
                          </Button>
                          <Button size="sm" variant="outline">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="messages" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-serif">
                      <MessageCircle className="w-5 h-5 text-primary" />
                      Messages
                    </CardTitle>
                    <CardDescription>Communication with your healthcare team</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Messages</h3>
                      <p className="text-muted-foreground mb-4">
                        You don't have any messages from your healthcare team.
                      </p>
                      <Button>Send New Message</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
