"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, FileText, ImageIcon, Activity, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function VisionaryCarePage() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      setUploadedFiles((prev) => [...prev, ...files])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setUploadedFiles((prev) => [...prev, ...files])
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-serif text-primary">VisionaryCare</h1>
              <p className="text-muted-foreground mt-1">Professional Medical Document Analysis</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <a href="/dashboard">Dashboard</a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="/image-analysis">Image Analysis</a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="/reports">Reports</a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="/integrations">Integrations</a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="/patient-portal">Patient Portal</a>
              </Button>
              <Button variant="ghost" asChild>
                <a href="/doctor-portal">Doctor Portal</a>
              </Button>
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                <Shield className="w-4 h-4 mr-1" />
                HIPAA Compliant
              </Badge>
              <Button variant="outline">Sign In</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-serif text-foreground mb-4">Advanced Medical Document Analysis</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Upload medical documents, lab reports, X-rays, and MRIs for AI-powered analysis. Get comprehensive reports
            for both healthcare providers and patients.
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Upload className="w-5 h-5 text-primary" />
              Upload Medical Documents
            </CardTitle>
            <CardDescription>
              Drag and drop your medical files or click to browse. Supports PDF, DICOM, JPG, PNG formats.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Drop your medical files here</p>
              <p className="text-muted-foreground mb-4">or</p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <label htmlFor="file-upload" className="cursor-pointer">
                  Browse Files
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.dcm,.jpg,.jpeg,.png,.tiff"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </label>
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Supported formats: PDF, DICOM, JPG, PNG, TIFF (Max 50MB per file)
              </p>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">Uploaded Files ({uploadedFiles.length})</h4>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <Badge variant="outline">Ready for Analysis</Badge>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-primary hover:bg-primary/90" asChild>
                  <a href="/dashboard">Start Analysis & View Dashboard</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <FileText className="w-5 h-5 text-primary" />
                Document Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                AI-powered extraction of key findings from lab reports, prescriptions, and medical records using
                advanced Document Question Answering.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <ImageIcon className="w-5 h-5 text-primary" />
                Medical Imaging
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Advanced visual analysis of X-rays, MRIs, and CT scans with object detection to highlight potential
                abnormalities and conditions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Activity className="w-5 h-5 text-primary" />
                Smart Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Generate comprehensive doctor-friendly reports and patient-friendly summaries with clear explanations
                and actionable insights.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Integration Section */}
        <Card className="mt-8 max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Users className="w-5 h-5 text-primary" />
              Healthcare Integration
            </CardTitle>
            <CardDescription>Seamlessly connects with leading healthcare databases and standards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">WHO Datasets</h4>
                <p className="text-sm text-muted-foreground">Global health data integration</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">NIH Medical Imaging</h4>
                <p className="text-sm text-muted-foreground">Advanced imaging datasets</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">FHIR API</h4>
                <p className="text-sm text-muted-foreground">Healthcare interoperability</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 VisionaryCare. Professional medical document analysis platform.</p>
            <p className="text-sm mt-2">HIPAA compliant • Secure • Trusted by healthcare professionals</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
