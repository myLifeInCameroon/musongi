import { Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionHeader } from "./SectionHeader";
import { CanvasData } from "@/types/canvas";

interface ProjectInfoSectionProps {
  data: CanvasData["projectInfo"];
  onUpdate: (updates: Partial<CanvasData["projectInfo"]>) => void;
}

export function ProjectInfoSection({ data, onUpdate }: ProjectInfoSectionProps) {
  return (
    <div className="section-card animate-fade-in">
      <SectionHeader
        icon={Building2}
        title="Project Information"
        subtitle="Basic details about your business"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="project-name">Project Name</Label>
          <Input
            id="project-name"
            placeholder="e.g., Konnectik"
            value={data.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="promoter">Promoter Name</Label>
          <Input
            id="promoter"
            placeholder="e.g., John Doe"
            value={data.promoter}
            onChange={(e) => onUpdate({ promoter: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="e.g., Douala, Cameroon"
            value={data.location}
            onChange={(e) => onUpdate({ location: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sector">Industry Sector</Label>
          <Input
            id="sector"
            placeholder="e.g., Telecommunications"
            value={data.sector}
            onChange={(e) => onUpdate({ sector: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Start Date</Label>
          <Input
            id="date"
            type="date"
            value={data.date}
            onChange={(e) => onUpdate({ date: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
