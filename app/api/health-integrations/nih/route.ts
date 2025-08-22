import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageType = searchParams.get("imageType") || "xray"

    const mockNIHData = {
      source: "National Institutes of Health",
      imageType,
      datasets: [
        {
          id: "nih-chest-001",
          name: "NIH Chest X-ray Dataset",
          description: "Large-scale chest X-ray dataset with pathology labels",
          totalImages: 112120,
          pathologies: ["Pneumonia", "Pneumothorax", "Cardiomegaly", "Atelectasis", "Pleural Effusion"],
          lastUpdated: "2025-01-12",
          accessLevel: "Public",
          relevanceScore: 0.92,
        },
        {
          id: "nih-brain-002",
          name: "NIH Brain MRI Collection",
          description: "Comprehensive brain MRI dataset for neurological analysis",
          totalImages: 45680,
          pathologies: ["Brain Tumor", "Stroke", "Multiple Sclerosis", "Alzheimer Disease"],
          lastUpdated: "2025-01-08",
          accessLevel: "Restricted",
          relevanceScore: 0.87,
        },
      ],
      referenceStandards: [
        {
          name: "DICOM Standard",
          version: "3.0",
          compliance: "Full",
        },
        {
          name: "HL7 FHIR",
          version: "R4",
          compliance: "Partial",
        },
      ],
      metadata: {
        totalDatasets: 2,
        apiVersion: "2.1",
        responseTime: "312ms",
      },
    }

    return NextResponse.json({
      success: true,
      integration: "NIH",
      ...mockNIHData,
    })
  } catch (error) {
    console.error("[v0] NIH API integration error:", error)
    return NextResponse.json({ error: "Failed to fetch NIH data" }, { status: 500 })
  }
}
