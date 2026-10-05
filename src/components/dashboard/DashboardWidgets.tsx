import { Plus } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardCardSkeleton, QuickActionSkeleton, StatsSkeleton } from "@/components/dashboard/SkeletonCard";
import { QuickAction } from "@/components/dashboard/QuickAction";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { RecentReports } from "@/components/dashboard/RecentReports";
import { StatCard } from "@/components/dashboard/StatCard";
import { UpcomingAppointments } from "@/components/dashboard/UpcomingAppointments";
import { useDashboard } from "@/context/DashboardContext";

export function DashboardWidgets() {
  const { stats, actions, tools, isLoading } = useDashboard();

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => <StatsSkeleton key={index} />)
          : stats.map((stat) => {
              const Icon = stat.icon;
              return <StatCard key={stat.label} label={stat.label} value={`${stat.value}${stat.suffix ?? ""}`} trend={stat.trend} icon={<Icon className="size-4.5" />} />;
            })}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-2xl border border-white/80 bg-white/75 p-5 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-950">Quick actions</h2>
              <p className="mt-1 text-sm text-slate-500">Start with what you need today.</p>
            </div>
            <Plus className="size-5 text-sky-600" />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => <QuickActionSkeleton key={index} />)
              : actions.map((action) => {
                  const Icon = action.icon;
                  return <QuickAction key={action.label} label={action.label} description={action.description} href={action.href} icon={<Icon className="size-4.5" />} />;
                })}
          </div>
        </div>
        <RecentActivity />
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-950">Your health tools</h2>
            <p className="mt-1 text-sm text-slate-500">Everything you need, in one place.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => <DashboardCardSkeleton key={index} />)
            : tools.map((tool) => {
                const Icon = tool.icon;
                return <DashboardCard key={tool.title} title={tool.title} description={tool.description} href={tool.href} accent={tool.accent} icon={<Icon className="size-5" />} />;
              })}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <RecentReports />
        <UpcomingAppointments />
      </section>
    </>
  );
}
