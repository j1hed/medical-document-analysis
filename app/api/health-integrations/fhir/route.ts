import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const resourceType = searchParams.get("resourceType") || "Patient"

    const mockFHIRData = {
      source: "FHIR R4 API",
      resourceType,
      resources: [
        {
          resourceType: "Patient",
          id: "patient-001",
          identifier: [
            {
              system: "http://hospital.example.org/patients",
              value: "P001",
            },
          ],
          name: [
            {
              family: "Doe",
              given: ["John"],
            },
          ],
          gender: "male",
          birthDate: "1985-03-15",
          active: true,
        },
        {
          resourceType: "DiagnosticReport",
          id: "report-001",
          status: "final",
          category: [
            {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/v2-0074",
                  code: "RAD",
                  display: "Radiology",
                },
              ],
            },
          ],
          subject: {
            reference: "Patient/patient-001",
          },
          effectiveDateTime: "2025-01-20T10:30:00Z",
          conclusion: "Normal chest radiograph. No acute abnormalities.",
        },
      ],
      capabilities: {
        fhirVersion: "R4",
        supportedResources: ["Patient", "DiagnosticReport", "Observation", "ImagingStudy", "DocumentReference"],
        interactions: ["read", "search", "create", "update"],
        searchParameters: ["_id", "identifier", "name", "birthdate"],
      },
      metadata: {
        totalResources: 2,
        apiVersion: "R4",
        responseTime: "189ms",
      },
    }

    return NextResponse.json({
      success: true,
      integration: "FHIR",
      ...mockFHIRData,
    })
  } catch (error) {
    console.error("[v0] FHIR API integration error:", error)
    return NextResponse.json({ error: "Failed to fetch FHIR data" }, { status: 500 })
  }
}
