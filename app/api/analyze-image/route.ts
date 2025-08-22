import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, imageType, fileName } = await request.json()

    if (!imageUrl || !imageType) {
      return NextResponse.json({ error: "Image URL and type are required" }, { status: 400 })
    }

    const { text: analysis } = await generateText({
      model: xai("grok-vision-beta"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this ${imageType} medical image. Provide:
              1. Anatomical structures visible
              2. Any abnormalities or findings
              3. Diagnostic impressions
              4. Confidence level (0-100%)
              5. Recommendations
              
              Format as JSON: {
                "structures": ["structure1", "structure2"],
                "findings": ["finding1", "finding2"],
                "abnormalities": ["abnormality1"],
                "confidence": 90,
                "recommendations": ["rec1", "rec2"],
                "impression": "Overall diagnostic impression"
              }`,
            },
            {
              type: "image",
              image: imageUrl,
            },
          ],
        },
      ],
    })

    // Parse the AI response
    let analysisResult
    try {
      analysisResult = JSON.parse(analysis)
    } catch {
      // Fallback if JSON parsing fails
      analysisResult = {
        structures: ["Image analyzed"],
        findings: ["Please review with radiologist"],
        abnormalities: [],
        confidence: 70,
        recommendations: ["Professional review recommended"],
        impression: analysis.substring(0, 200) + "...",
      }
    }

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      processedAt: new Date().toISOString(),
      fileName,
      imageType,
    })
  } catch (error) {
    console.error("[v0] Image analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze medical image" }, { status: 500 })
  }
}
