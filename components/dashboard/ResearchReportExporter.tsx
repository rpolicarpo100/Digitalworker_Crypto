"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { MultiAssetAnalysisReport } from "@/lib/types/multi-asset";

export function ResearchReportExporter({ report }: { report: MultiAssetAnalysisReport }) {
  const [downloading, setDownloading] = useState(false);

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${report.profile.symbol}_RESEARCH_REPORT_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrintPdf = () => {
    setDownloading(true);
    window.print();
    setTimeout(() => setDownloading(false), 1000);
  };

  return (
    <div className="flex items-center space-x-2 font-mono">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportJson}
        className="bg-[#0b142b] border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-black font-bold text-xs rounded-xl"
      >
        💾 [EXPORT_JSON]
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={handlePrintPdf}
        disabled={downloading}
        className="bg-cyan-600 text-black hover:bg-cyan-400 font-bold text-xs rounded-xl shadow-[0_0_12px_rgba(6,182,212,0.4)]"
      >
        📄 [PRINT_PDF_REPORT]
      </Button>
    </div>
  );
}
