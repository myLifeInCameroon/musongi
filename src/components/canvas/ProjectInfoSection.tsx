import { Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionHeader } from "./SectionHeader";
import { CanvasData } from "@/types/canvas";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProjectInfoSectionProps {
  data: CanvasData["projectInfo"];
  onUpdate: (updates: Partial<CanvasData["projectInfo"]>) => void;
}

export function ProjectInfoSection({ data, onUpdate }: ProjectInfoSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="section-card animate-fade-in">
      <SectionHeader
        icon={Building2}
        title={t("projectInfo.title")}
        subtitle={t("projectInfo.subtitle")}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="project-name">{t("projectInfo.projectName")}</Label>
          <Input
            id="project-name"
            placeholder={t("projectInfo.projectNamePlaceholder")}
            value={data.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="promoter">{t("projectInfo.promoter")}</Label>
          <Input
            id="promoter"
            placeholder={t("projectInfo.promoterPlaceholder")}
            value={data.promoter}
            onChange={(e) => onUpdate({ promoter: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">{t("projectInfo.location")}</Label>
          <Input
            id="location"
            placeholder={t("projectInfo.locationPlaceholder")}
            value={data.location}
            onChange={(e) => onUpdate({ location: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sector">{t("projectInfo.sector")}</Label>
          <Input
            id="sector"
            placeholder={t("projectInfo.sectorPlaceholder")}
            value={data.sector}
            onChange={(e) => onUpdate({ sector: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">{t("projectInfo.startDate")}</Label>
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
