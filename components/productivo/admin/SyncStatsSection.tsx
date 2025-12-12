import React from "react";
import { FaLink, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import StatCard from "./StatCard";

interface SyncStatsSectionProps {
  unlinkedCount: number;
  diffCount: number;
  syncedCount: number;
  activeTab: "unlinked" | "diff" | "synced";
  onTabChange: (tab: "unlinked" | "diff" | "synced") => void;
}

/**
 * Display sync statistics as interactive cards
 * Shows counts for unlinked, different, and synced products
 */
export default function SyncStatsSection({
  unlinkedCount,
  diffCount,
  syncedCount,
  activeTab,
  onTabChange,
}: SyncStatsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatCard
        title="Por Vincular"
        count={unlinkedCount}
        icon={<FaLink className="w-6 h-6" />}
        color="warning"
        isActive={activeTab === "unlinked"}
        onClick={() => onTabChange("unlinked")}
      />

      <StatCard
        title="Con Diferencias"
        count={diffCount}
        icon={<FaExclamationTriangle className="w-6 h-6" />}
        color="error"
        isActive={activeTab === "diff"}
        onClick={() => onTabChange("diff")}
      />

      <StatCard
        title="Sincronizados"
        count={syncedCount}
        icon={<FaCheckCircle className="w-6 h-6" />}
        color="success"
        isActive={activeTab === "synced"}
        onClick={() => onTabChange("synced")}
      />
    </div>
  );
}
