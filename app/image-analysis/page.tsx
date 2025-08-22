"use client"

import { useState, useRef } from "react"
import { ZoomIn, ZoomOut, Move, Ruler, Eye, Download, ArrowLeft, Maximize, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock medical image data
const mockImageData = {
  id: 1,
  fileName: "Chest_X-Ray_Patient_001.dcm",
  imageType: "X-Ray",
  patientId: "P001",
  studyDate: "2025-01-20",
  modality: "CR",
  bodyPart: "Chest",
  imageUrl: "/chest-xray-scan.png",
  analysis: {
    findings: ["Clear lung fields bilaterally", "Normal cardiac silhouette", "No acute abnormalities detected"],
    confidence: 94,
    annotations: [
      { x: 45, y: 30, label: "Heart", type: "normal" },
      { x: 25, y: 25, label: "Left Lung", type: "normal" },
      { x: 65, y: 25, label: "Right Lung", type: "normal" },
    ],
  },
}

export default function ImageAnalysisPage() {
  const [zoom, setZoom] = useState(100)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [showAnnotations, setShowAnnotations] = useState(true)
  const [selectedTool, setSelectedTool] = useState("pan")
  const [measurements, setMeasurements] = useState<any[]>([])
  const imageRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 400))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 25))
  const resetView = () => {
    setZoom(100)
    setBrightness(100)
    setContrast(100)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <a href="/dashboard" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </a>
              </Button>
              <div>
                <h1 className="text-xl font-bold font-serif text-primary">Medical Image Analysis</h1>
                <p className="text-sm text-muted-foreground">{mockImageData.fileName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{mockImageData.imageType}</Badge>
              <Badge className="bg-green-100 text-green-800">{mockImageData.analysis.confidence}% Confidence</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Image Viewer */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-serif">Image Viewer</CardTitle>
                  <div className="flex items-center gap-2">
                    {/* Toolbar */}
                    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                      <Button
                        size="sm"
                        variant={selectedTool === "pan" ? "default" : "ghost"}
                        onClick={() => setSelectedTool("pan")}
                      >
                        <Move className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedTool === "measure" ? "default" : "ghost"}
                        onClick={() => setSelectedTool("measure")}
                      >
                        <Ruler className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={showAnnotations ? "default" : "ghost"}
                        onClick={() => setShowAnnotations(!showAnnotations)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="outline" onClick={handleZoomOut}>
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium min-w-[60px] text-center">{zoom}%</span>
                      <Button size="sm" variant="outline" onClick={handleZoomIn}>
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  ref={imageRef}
                  className="relative bg-black rounded-lg overflow-hidden"
                  style={{ height: "600px" }}
                >
                  <div
                    className="relative w-full h-full flex items-center justify-center"
                    style={{
                      transform: `scale(${zoom / 100})`,
                      filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                      transition: "transform 0.2s ease",
                    }}
                  >
                    <img
                      src={mockImageData.imageUrl || "/placeholder.svg"}
                      alt="Medical scan"
                      className="max-w-full max-h-full object-contain"
                      draggable={false}
                    />

                    {/* AI Annotations Overlay */}
                    {showAnnotations && (
                      <div className="absolute inset-0">
                        {mockImageData.analysis.annotations.map((annotation, index) => (
                          <div
                            key={index}
                            className="absolute"
                            style={{
                              left: `${annotation.x}%`,
                              top: `${annotation.y}%`,
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            <div className="relative">
                              <div
                                className={`w-3 h-3 rounded-full border-2 ${
                                  annotation.type === "normal"
                                    ? "bg-green-500 border-green-400"
                                    : "bg-red-500 border-red-400"
                                }`}
                              />
                              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                {annotation.label}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Panel */}
          <div className="space-y-6">
            {/* Image Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-serif">Image Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Brightness</label>
                  <Slider
                    value={[brightness]}
                    onValueChange={(value) => setBrightness(value[0])}
                    max={200}
                    min={50}
                    step={10}
                    className="w-full"
                  />
                  <span className="text-xs text-muted-foreground">{brightness}%</span>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Contrast</label>
                  <Slider
                    value={[contrast]}
                    onValueChange={(value) => setContrast(value[0])}
                    max={200}
                    min={50}
                    step={10}
                    className="w-full"
                  />
                  <span className="text-xs text-muted-foreground">{contrast}%</span>
                </div>

                <Button variant="outline" onClick={resetView} className="w-full bg-transparent">
                  Reset View
                </Button>
              </CardContent>
            </Card>

            {/* Study Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-serif">Study Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Patient ID:</span>
                  <span className="font-medium">{mockImageData.patientId}</span>

                  <span className="text-muted-foreground">Study Date:</span>
                  <span className="font-medium">{mockImageData.studyDate}</span>

                  <span className="text-muted-foreground">Modality:</span>
                  <span className="font-medium">{mockImageData.modality}</span>

                  <span className="text-muted-foreground">Body Part:</span>
                  <span className="font-medium">{mockImageData.bodyPart}</span>
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis Results */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-serif">AI Analysis</CardTitle>
                <CardDescription>Confidence: {mockImageData.analysis.confidence}%</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="findings" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="findings">Findings</TabsTrigger>
                    <TabsTrigger value="measurements">Measurements</TabsTrigger>
                  </TabsList>

                  <TabsContent value="findings" className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Key Findings</h4>
                      <ul className="space-y-1">
                        {mockImageData.analysis.findings.map((finding, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <span className="text-green-600 mt-1">•</span>
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="measurements" className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Use the ruler tool to add measurements to the image.
                    </div>
                    {measurements.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">No measurements yet</div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-serif">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full bg-transparent" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  <Maximize className="w-4 h-4 mr-2" />
                  Fullscreen View
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Compare Images
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
