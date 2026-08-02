import { CalendarDays } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export function UpcomingAppointments() {
  const { appointments, isLoading } = useDashboard();

  return (
    <section className="rounded-2xl border border-dashed border-sky-200 bg-sky-50/45 p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-white text-sky-600 shadow-sm">
          <CalendarDays className="size-5" />
        </span>
        <div>
          <h2 className="font-bold text-slate-950">Upcoming appointments</h2>
          <p className="text-sm text-slate-500">
            {isLoading
              ? "Loading appointments..."
              : appointments.length
                ? `${appointments.length} appointment${appointments.length === 1 ? "" : "s"} scheduled`
                : "No appointments added yet."}
          </p>
        </div>
      </div>

      {!isLoading && appointments.length > 0 && (
        <div className="mt-5 space-y-3">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="rounded-xl bg-white/80 p-3 text-sm shadow-sm">
              <p className="font-semibold text-slate-700">{appointment.doctor}</p>
              <p className="mt-1 text-slate-500">{appointment.date} · {appointment.time}</p>
            </div>
          ))}
        </div>
      )}

      {!isLoading && appointments.length === 0 && (
        <button className="mt-5 rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700">
          Schedule Appointment
        </button>
      )}
    </section>
  );
}
