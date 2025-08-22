"use client"

import { useState } from "react"
import {
  Settings,
  Database,
  Globe,
  Shield,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Mock integration status data
const integrationStatus = {
  who: {
    name: "World Health Organization",
    description: "Global health data and statistics",
    status: "connected",
    lastSync: "2025-01-20T09:15:00Z",
    dataPoints: 15420,
    enabled: true,
    apiKey: "who_****_****_****_1234",
    endpoint: "https://ghoapi.azureedge.net/api/",
  },
  nih: {
    name: "National Institutes of Health",
    description: "Medical imaging datasets and research data",
    status: "connected",
    lastSync: "2025-01-20T08:45:00Z",
    dataPoints: 89650,
    enabled: true,
    apiKey: "nih_****_****_****_5678",
    endpoint: "https://api.nih.gov/datasets/",
  },
  fhir: {
    name: "FHIR Healthcare API",
    description: "Healthcare interoperability standard",
    status: "pending",
    lastSync: null,
    dataPoints: 0,
    enabled: false,
    apiKey: "",
    endpoint: "https://hapi.fhir.org/baseR4/",
  },
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(integrationStatus)
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<any>({})

  const testIntegration = async (integrationKey: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/health-integrations/${integrationKey}`)
      const result = await response.json()

      setTestResults((prev) => ({
        ...prev,
        [integrationKey]: {
          success: result.success,
          responseTime: result.metadata?.responseTime || "N/A",
          dataCount: result.data?.length || result.datasets?.length || result.resources?.length || 0,
        },
      }))
    } catch (error) {
      setTestResults((prev) => ({
        ...prev,
        [integrationKey]: {
          success: false,
          error: "Connection failed",
        },
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const toggleIntegration = (integrationKey: string) => {
    setIntegrations((prev) => ({
      ...prev,
      [integrationKey]: {
        ...prev[integrationKey as keyof typeof prev],
        enabled: !prev[integrationKey as keyof typeof prev].enabled,
      },
    }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      default:
        return <Badge variant="secondary">Disconnected</Badge>
    }
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
                <h1 className="text-xl font-bold font-serif text-primary">Health API Integrations</h1>
                <p className="text-sm text-muted-foreground">Manage external healthcare data connections</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                <Shield className="w-4 h-4 mr-1" />
                HIPAA Compliant
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="who">WHO Integration</TabsTrigger>
            <TabsTrigger value="nih">NIH Integration</TabsTrigger>
            <TabsTrigger value="fhir">FHIR Integration</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Integration Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(integrations).map(([key, integration]) => (
                <Card key={key}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 font-serif">
                        {key === "who" && <Globe className="w-5 h-5 text-primary" />}
                        {key === "nih" && <Database className="w-5 h-5 text-primary" />}
                        {key === "fhir" && <Settings className="w-5 h-5 text-primary" />}
                        {integration.name}
                      </CardTitle>
                      {getStatusIcon(integration.status)}
                    </div>
                    <CardDescription>{integration.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status</span>
                      {getStatusBadge(integration.status)}
                    </div>

                    {integration.lastSync && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Last Sync</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(integration.lastSync).toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Data Points</span>
                      <span className="text-sm font-medium">{integration.dataPoints.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor={`${key}-enabled`} className="text-sm">
                        Enabled
                      </Label>
                      <Switch
                        id={`${key}-enabled`}
                        checked={integration.enabled}
                        onCheckedChange={() => toggleIntegration(key)}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => testIntegration(key)}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        {isLoading ? (
                          <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4 mr-1" />
                        )}
                        Test
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Configure
                      </Button>
                    </div>

                    {testResults[key] && (
                      <div
                        className={`p-2 rounded text-xs ${
                          testResults[key].success
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {testResults[key].success ? (
                          <div>
                            <div>✓ Connection successful</div>
                            <div>Response time: {testResults[key].responseTime}</div>
                            <div>Data points: {testResults[key].dataCount}</div>
                          </div>
                        ) : (
                          <div>✗ {testResults[key].error}</div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Integration Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Integration Statistics</CardTitle>
                <CardDescription>Overview of external data usage and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">3</div>
                    <div className="text-sm text-muted-foreground">Active Integrations</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">105K</div>
                    <div className="text-sm text-muted-foreground">Total Data Points</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">99.8%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">245ms</div>
                    <div className="text-sm text-muted-foreground">Avg Response</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="who" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <Globe className="w-5 h-5 text-primary" />
                  WHO Integration Configuration
                </CardTitle>
                <CardDescription>
                  Configure connection to World Health Organization global health datasets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="who-endpoint">API Endpoint</Label>
                    <Input id="who-endpoint" value={integrations.who.endpoint} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="who-key">API Key</Label>
                    <Input id="who-key" type="password" value={integrations.who.apiKey} readOnly />
                  </div>
                </div>

                <div>
                  <Label htmlFor="who-datasets">Available Datasets</Label>
                  <Textarea
                    id="who-datasets"
                    value="• Global Health Observatory Data
• Disease Classification (ICD-11)
• Health Statistics by Region
• Mortality and Morbidity Data
• Health System Performance Indicators"
                    readOnly
                    rows={5}
                  />
                </div>

                <div className="flex gap-2">
                  <Button>Save Configuration</Button>
                  <Button variant="outline">Test Connection</Button>
                  <Button variant="outline">View Documentation</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nih" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <Database className="w-5 h-5 text-primary" />
                  NIH Integration Configuration
                </CardTitle>
                <CardDescription>
                  Configure connection to National Institutes of Health medical imaging datasets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nih-endpoint">API Endpoint</Label>
                    <Input id="nih-endpoint" value={integrations.nih.endpoint} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="nih-key">API Key</Label>
                    <Input id="nih-key" type="password" value={integrations.nih.apiKey} readOnly />
                  </div>
                </div>

                <div>
                  <Label htmlFor="nih-datasets">Available Datasets</Label>
                  <Textarea
                    id="nih-datasets"
                    value="• NIH Chest X-ray Dataset (112K images)
• Brain MRI Collection (45K images)
• Pathology Image Database
• Clinical Trial Data
• Biomedical Research Publications"
                    readOnly
                    rows={5}
                  />
                </div>

                <div className="flex gap-2">
                  <Button>Save Configuration</Button>
                  <Button variant="outline">Test Connection</Button>
                  <Button variant="outline">View Documentation</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fhir" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <Settings className="w-5 h-5 text-primary" />
                  FHIR Integration Configuration
                </CardTitle>
                <CardDescription>Configure connection to FHIR healthcare interoperability standard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fhir-endpoint">FHIR Server Endpoint</Label>
                    <Input
                      id="fhir-endpoint"
                      value={integrations.fhir.endpoint}
                      placeholder="https://your-fhir-server.com/fhir/"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fhir-version">FHIR Version</Label>
                    <Input id="fhir-version" value="R4" readOnly />
                  </div>
                </div>

                <div>
                  <Label htmlFor="fhir-resources">Supported Resources</Label>
                  <Textarea
                    id="fhir-resources"
                    value="• Patient - Patient demographics and information
• DiagnosticReport - Diagnostic test results
• Observation - Clinical observations and measurements
• ImagingStudy - Medical imaging studies
• DocumentReference - Clinical documents"
                    readOnly
                    rows={5}
                  />
                </div>

                <div className="flex gap-2">
                  <Button>Save Configuration</Button>
                  <Button variant="outline">Test Connection</Button>
                  <Button variant="outline">View Documentation</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
