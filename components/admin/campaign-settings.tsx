"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Save, Upload, Eye, Edit } from "lucide-react"

export default function CampaignSettings() {
  const [settings, setSettings] = useState({
    campaignTitle: "Together, We Can Transform Lives with Tech",
    campaignDescription:
      "Empowering communities through technology education and digital literacy programs. Every donation creates opportunities for a brighter future.",
    fundraisingGoal: 5000000,
    currentAmount: 2847500,
    isActive: true,
    allowAnonymous: true,
    showDonorWall: true,
    autoThankYou: true,
    minimumDonation: 1000,
  })

  const handleSave = () => {
    // Save settings logic here
    console.log("Settings saved:", settings)
  }

  return (
    <div className="space-y-6">
      {/* Campaign Status */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center justify-between">
            Campaign Status
            <Badge className={settings.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {settings.isActive ? "Active" : "Inactive"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="campaign-active" className="text-foreground font-semibold">
                Campaign Active
              </Label>
              <p className="text-sm text-muted-foreground">Enable or disable the fundraising campaign</p>
            </div>
            <Switch
              id="campaign-active"
              checked={settings.isActive}
              onCheckedChange={(checked) => setSettings({ ...settings, isActive: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Basic Settings */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Basic Campaign Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="campaign-title" className="text-foreground">
              Campaign Title
            </Label>
            <Input
              id="campaign-title"
              value={settings.campaignTitle}
              onChange={(e) => setSettings({ ...settings, campaignTitle: e.target.value })}
              className="text-lg font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="campaign-description" className="text-foreground">
              Campaign Description
            </Label>
            <Textarea
              id="campaign-description"
              value={settings.campaignDescription}
              onChange={(e) => setSettings({ ...settings, campaignDescription: e.target.value })}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fundraising-goal" className="text-foreground">
                Fundraising Goal (₦)
              </Label>
              <Input
                id="fundraising-goal"
                type="number"
                value={settings.fundraisingGoal}
                onChange={(e) => setSettings({ ...settings, fundraisingGoal: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimum-donation" className="text-foreground">
                Minimum Donation (₦)
              </Label>
              <Input
                id="minimum-donation"
                type="number"
                value={settings.minimumDonation}
                onChange={(e) => setSettings({ ...settings, minimumDonation: Number(e.target.value) })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Donation Settings */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Donation Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allow-anonymous" className="text-foreground font-semibold">
                Allow Anonymous Donations
              </Label>
              <p className="text-sm text-muted-foreground">Let donors choose to remain anonymous</p>
            </div>
            <Switch
              id="allow-anonymous"
              checked={settings.allowAnonymous}
              onCheckedChange={(checked) => setSettings({ ...settings, allowAnonymous: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-donor-wall" className="text-foreground font-semibold">
                Show Donor Wall
              </Label>
              <p className="text-sm text-muted-foreground">Display recent donations on the website</p>
            </div>
            <Switch
              id="show-donor-wall"
              checked={settings.showDonorWall}
              onCheckedChange={(checked) => setSettings({ ...settings, showDonorWall: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-thank-you" className="text-foreground font-semibold">
                Automatic Thank You Emails
              </Label>
              <p className="text-sm text-muted-foreground">Send thank you emails automatically after donations</p>
            </div>
            <Switch
              id="auto-thank-you"
              checked={settings.autoThankYou}
              onCheckedChange={(checked) => setSettings({ ...settings, autoThankYou: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Media Settings */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Media & Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-foreground font-semibold">Hero Image</Label>
              <p className="text-sm text-muted-foreground mb-3">Upload a compelling hero image for your campaign</p>
              <div className="flex items-center gap-4">
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Upload className="h-4 w-4" />
                  Upload Image
                </Button>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-foreground font-semibold">Campaign Video</Label>
              <p className="text-sm text-muted-foreground mb-3">Add a video to tell your story</p>
              <div className="flex items-center gap-4">
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Upload className="h-4 w-4" />
                  Upload Video
                </Button>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
