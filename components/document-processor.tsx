"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, FileText, ImageIcon, CheckCircle, AlertCircle } from "lucide-react"

interface DocumentProcessorProps {
  file: File
  onAnalysisComplete: (result: any) => void
}

export default function DocumentProcessor({ file, onAnalysisComplete }: DocumentProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const processDocument = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      const isImage = file.type.startsWith("image/")

      if (isImage) {
        const imageUrl = URL.createObjectURL(file)
        const response = await fetch("/api/analyze-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl,
            imageType: getImageType(file.name),
            fileName: file.name,
          }),
        })

        const result = await response.json()
        if (result.success) {
          setAnalysisResult(result)
          onAnalysisComplete(result)
        } else {
          setError(result.error)
        }
      } else {
        const text = await file.text()
        const response = await fetch("/api/analyze-document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentText: text,
            documentType: getDocumentType(file.name),
            fileName: file.name,
          }),
        })

        const result = await response.json()
        if (result.success) {
          setAnalysisResult(result)
          onAnalysisComplete(result)
        } else {
          setError(result.error)
        }
      }
    } catch (err) {
      console.error("[v0] Processing error:", err)
      setError("Failed to process document")
    } finally {
      setIsProcessing(false)
    }
  }

  const getDocumentType = (fileName: string) => {
    const ext = fileName.toLowerCase().split(".").pop()
    switch (ext) {
      case "pdf":
        return "Lab Report"
      case "txt":
        return "Clinical Notes"
      case "docx":
        return "Medical Report"
      default:
        return "Medical Document"
    }
  }

  const getImageType = (fileName: string) => {
    if (fileName.toLowerCase().includes("xray") || fileName.toLowerCase().includes("x-ray")) {
      return "X-Ray"
    }
    if (fileName.toLowerCase().includes("mri")) {
      return "MRI"
    }
    if (fileName.toLowerCase().includes("ct")) {
      return "CT Scan"
    }
    return "Medical Image"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {file.type.startsWith("image/") ? (
            <ImageIcon className="w-5 h-5 text-primary" />
          ) : (
            <FileText className="w-5 h-5 text-primary" />
          )}
          {file.name}
        </CardTitle>
        <CardDescription>
          {file.type.startsWith("image/") ? getImageType(file.name) : getDocumentType(file.name)} •{" "}
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!analysisResult && !error && (
          <Button onClick={processDocument} disabled={isProcessing} className="w-full">
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              "Start AI Analysis"
            )}
          </Button>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {analysisResult && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-green-700">Analysis Complete</span>
              <Badge variant="secondary" className="ml-auto">
                {analysisResult.analysis.confidence}% confidence
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Key Findings</h4>
                <ul className="space-y-1">
                  {analysisResult.analysis.findings?.map((finding: string, index: number) => (
                    <li key={index} className="text-sm">
                      • {finding}
                    </li>
                  ))}
                </ul>
              </div>

              {analysisResult.analysis.concerns?.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Areas of Concern</h4>
                  <ul className="space-y-1">
                    {analysisResult.analysis.concerns.map((concern: string, index: number) => (
                      <li key={index} className="text-sm text-orange-700">
                        • {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {analysisResult.analysis.recommendations?.map((rec: string, index: number) => (
                    <li key={index} className="text-sm">
                      • {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
