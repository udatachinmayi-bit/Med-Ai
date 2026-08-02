import { FileSearch, HeartPulse, History, Mic, Pill, Stethoscope } from "lucide-react";
import { FeatureCard } from "../ui/FeatureCard";
import { SectionBadge } from "../ui/SectionBadge";
import { SectionHeading } from "../ui/SectionHeading";

const features = [
  { icon: Pill, title: "Medicine scanner", description: "Make sense of prescriptions, usage, and precautions with a simple scan.", href: "/medicine-scanner", gradient: "from-sky-500 to-cyan-500" },
  { icon: FileSearch, title: "Report analyzer", description: "Turn dense blood tests and medical reports into clear, useful explanations.", href: "/report-analyzer", gradient: "from-violet-500 to-indigo-500" },
  { icon: Stethoscope, title: "Symptom guidance", description: "Organise what you are feeling into actionable information for your next step.", href: "/symptom-checker", gradient: "from-emerald-500 to-teal-500" },
  { icon: Mic, title: "Voice assistant", description: "Ask naturally and receive supportive, easy-to-follow health guidance.", href: "/voice-assistant", gradient: "from-rose-500 to-pink-500" },
  { icon: HeartPulse, title: "Health dashboard", description: "Bring your health score, reports, and intelligent insights together in one view.", href: "/dashboard", gradient: "from-orange-500 to-rose-500" },
  { icon: History, title: "Medical history", description: "Keep meaningful records organised and ready whenever you need them.", href: "/medical-history", gradient: "from-blue-500 to-indigo-500" },
];

export default function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 sm:py-24 lg:py-32" id="services">
      <div aria-hidden="true" className="absolute left-1/2 top-0 h-64 w-[70%] -translate-x-1/2 rounded-full bg-sky-100/70 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <SectionHeading
          align="center"
          badge={<SectionBadge>Intelligence for every step</SectionBadge>}
          description="Powerful tools that help you understand medicines, reports, symptoms, and your overall health with more confidence."
          subtitle="Built around you"
          title="Everything you need for clearer healthcare."
          className="mx-auto"
        />
        <div className="mt-12 grid gap-5 sm:mt-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {features.map(({ icon: Icon, title, description, href, gradient }) => (
            <FeatureCard key={title} description={description} href={href} icon={<Icon className="size-6" />} iconGradient={gradient} title={title} />
          ))}
        </div>
      </div>
    </section>
  );
}
