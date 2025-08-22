import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(request: NextRequest) {
  try {
    const { documentText, documentType, fileName } = await request.json()

    if (!documentText || !documentType) {
      return NextResponse.json({ error: "Document text and type are required" }, { status: 400 })
    }

    const { text: analysis } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      prompt: `You are a medical AI assistant analyzing a ${documentType}. 
      
      Document content: ${documentText}
      
      Please provide a comprehensive medical analysis including:
      1. Key findings and observations
      2. Potential concerns or abnormalities
      3. Recommendations for follow-up
      4. Confidence level (0-100%)
      5. Summary in simple terms for patients
      
      Format your response as JSON with the following structure:
      {
        "findings": ["finding1", "finding2"],
        "concerns": ["concern1", "concern2"],
        "recommendations": ["rec1", "rec2"],
        "confidence": 85,
        "patientSummary": "Simple explanation for patients",
        "technicalSummary": "Detailed medical summary"
      }`,
    })

    // Parse the AI response
    let analysisResult
    try {
      analysisResult = JSON.parse(analysis)
    } catch {
      // Fallback if JSON parsing fails
      analysisResult = {
        findings: ["Analysis completed"],
        concerns: ["Please review with healthcare provider"],
        recommendations: ["Follow up as needed"],
        confidence: 75,
        patientSummary: analysis.substring(0, 200) + "...",
        technicalSummary: analysis,
      }
    }

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      processedAt: new Date().toISOString(),
      fileName,
    })
  } catch (error) {
    console.error("[v0] Document analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze document" }, { status: 500 })
  }
}
