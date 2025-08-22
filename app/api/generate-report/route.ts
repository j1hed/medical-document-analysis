import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: NextRequest) {
  try {
    const { documentData, reportType, patientInfo } = await request.json()

    if (!documentData || !reportType) {
      return NextResponse.json({ error: "Document data and report type are required" }, { status: 400 })
    }

    let prompt = ""

    if (reportType === "medical") {
      prompt = `Generate a comprehensive medical report based on the following analysis data:

Document: ${documentData.fileName}
Type: ${documentData.type}
Analysis Results: ${JSON.stringify(documentData.analysis)}
Patient: ${patientInfo?.name || "Patient"}

Create a professional medical report including:
1. Executive Summary
2. Clinical Findings
3. Diagnostic Impressions
4. Recommendations
5. Follow-up Instructions

Format as a structured medical report suitable for healthcare professionals.`
    } else if (reportType === "patient") {
      prompt = `Generate a patient-friendly summary based on the following medical analysis:

Document: ${documentData.fileName}
Analysis Results: ${JSON.stringify(documentData.analysis)}
Patient: ${patientInfo?.name || "Patient"}

Create a clear, easy-to-understand summary including:
1. What was examined
2. Key findings in simple terms
3. What this means for the patient
4. Next steps or recommendations
5. When to contact healthcare provider

Use simple language, avoid medical jargon, and be reassuring while accurate.`
    }

    const { text: reportContent } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt,
    })

    // Generate report metadata
    const reportMetadata = {
      id: `RPT-${Date.now()}`,
      type: reportType,
      documentId: documentData.id,
      patientInfo,
      generatedAt: new Date().toISOString(),
      confidence: documentData.analysis?.confidence || 85,
      status: "completed",
    }

    return NextResponse.json({
      success: true,
      report: {
        ...reportMetadata,
        content: reportContent,
        title:
          reportType === "medical"
            ? `Medical Analysis Report - ${documentData.fileName}`
            : `Patient Summary - ${documentData.fileName}`,
      },
    })
  } catch (error) {
    console.error("[v0] Report generation error:", error)
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
  }
}
