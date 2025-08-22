import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || "health statistics"

    // In production, this would connect to actual WHO APIs
    const mockWHOData = {
      source: "World Health Organization",
      query,
      data: [
        {
          id: "who-001",
          title: "Global Health Observatory Data",
          category: "Health Statistics",
          description: "Comprehensive health data and statistics from WHO",
          lastUpdated: "2025-01-15",
          relevance: 0.95,
          data: {
            globalHealthIndicators: [
              "Life expectancy at birth",
              "Infant mortality rate",
              "Maternal mortality ratio",
              "Disease prevalence rates",
            ],
            regions: ["Global", "Americas", "Europe", "Africa", "Asia", "Oceania"],
          },
        },
        {
          id: "who-002",
          title: "Disease Classification (ICD-11)",
          category: "Medical Classification",
          description: "International Classification of Diseases 11th Revision",
          lastUpdated: "2025-01-10",
          relevance: 0.88,
          data: {
            categories: ["Infectious diseases", "Neoplasms", "Cardiovascular diseases", "Respiratory diseases"],
          },
        },
      ],
      metadata: {
        totalResults: 2,
        apiVersion: "1.0",
        responseTime: "245ms",
      },
    }

    return NextResponse.json({
      success: true,
      integration: "WHO",
      ...mockWHOData,
    })
  } catch (error) {
    console.error("[v0] WHO API integration error:", error)
    return NextResponse.json({ error: "Failed to fetch WHO data" }, { status: 500 })
  }
}
