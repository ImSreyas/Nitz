import { Button } from "@/components/ui/button";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Download, Trash, Upload } from "lucide-react";

export default function Settings() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Platform Settings</h2>
        <Button size="sm">Save Changes</Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Points & Tier System</CardTitle>
            <CardDescription>
              Configure how points are awarded and tier thresholds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Points Formula</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="easy-points">Easy Problem</Label>
                    <Input id="easy-points" type="number" defaultValue={10} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medium-points">Medium Problem</Label>
                    <Input id="medium-points" type="number" defaultValue={20} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hard-points">Hard Problem</Label>
                    <Input id="hard-points" type="number" defaultValue={30} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expert-points">Expert Problem</Label>
                    <Input id="expert-points" type="number" defaultValue={50} />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Tier Thresholds</Label>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bronze-threshold">Bronze</Label>
                      <Input
                        id="bronze-threshold"
                        type="number"
                        defaultValue={0}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="silver-threshold">Silver</Label>
                      <Input
                        id="silver-threshold"
                        type="number"
                        defaultValue={500}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gold-threshold">Gold</Label>
                      <Input
                        id="gold-threshold"
                        type="number"
                        defaultValue={1500}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="platinum-threshold">Platinum</Label>
                      <Input
                        id="platinum-threshold"
                        type="number"
                        defaultValue={3000}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diamond-threshold">Diamond</Label>
                      <Input
                        id="diamond-threshold"
                        type="number"
                        defaultValue={5000}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moderation Settings</CardTitle>
            <CardDescription>
              Configure moderation thresholds and automated actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Auto-Flag Thresholds</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="problem-reports">Problem Reports</Label>
                    <Input
                      id="problem-reports"
                      type="number"
                      defaultValue={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-reports">User Reports</Label>
                    <Input id="user-reports" type="number" defaultValue={3} />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Blackpoint System</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-blackpoints">
                      Max Allowed Blackpoints
                    </Label>
                    <Input
                      id="max-blackpoints"
                      type="number"
                      defaultValue={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blackpoint-reset">
                      Reset Period (days)
                    </Label>
                    <Input
                      id="blackpoint-reset"
                      type="number"
                      defaultValue={90}
                    />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Automated Actions</Label>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-block" defaultChecked />
                    <Label htmlFor="auto-block">
                      Auto-block users at max blackpoints
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-review" defaultChecked />
                    <Label htmlFor="auto-review">
                      Auto-assign reports to moderators
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-notify" defaultChecked />
                    <Label htmlFor="auto-notify">
                      Notify admins of flagged content
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Streak & Reward System</CardTitle>
            <CardDescription>
              Configure how streaks and rewards work
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Streak Rewards</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="streak-7">7 Day Streak</Label>
                    <Input id="streak-7" type="number" defaultValue={50} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="streak-30">30 Day Streak</Label>
                    <Input id="streak-30" type="number" defaultValue={200} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="streak-100">100 Day Streak</Label>
                    <Input id="streak-100" type="number" defaultValue={500} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="streak-365">365 Day Streak</Label>
                    <Input id="streak-365" type="number" defaultValue={2000} />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Daily Challenges</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="daily-challenges" defaultChecked />
                  <Label htmlFor="daily-challenges">
                    Enable daily challenges
                  </Label>
                </div>
                <div className="space-y-2 mt-2">
                  <Label htmlFor="daily-reward">Daily Challenge Reward</Label>
                  <Input id="daily-reward" type="number" defaultValue={15} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Backup & Data Management</CardTitle>
            <CardDescription>
              Configure backup settings and manage platform data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Automated Backups</Label>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-backup" defaultChecked />
                  <Label htmlFor="auto-backup">Enable automated backups</Label>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="backup-frequency">
                      Backup Frequency (hours)
                    </Label>
                    <Input
                      id="backup-frequency"
                      type="number"
                      defaultValue={24}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backup-retention">
                      Retention Period (days)
                    </Label>
                    <Input
                      id="backup-retention"
                      type="number"
                      defaultValue={30}
                    />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Data Management</Label>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Export All Platform Data
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Data
                  </Button>
                  <Button variant="destructive" className="justify-start">
                    <Trash className="mr-2 h-4 w-4" />
                    Purge Inactive User Data
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
