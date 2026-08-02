"use client";

export default function BackgroundPattern() {
  return (
    <>
      {/* Gradient Background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-sky-50 via-white to-cyan-100" />

      {/* Blur Circles */}
      <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-400/20 blur-[120px]" />

      <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-300/20 blur-[140px]" />

      {/* Grid */}
      <div
        className="absolute inset-0 -z-10 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right,#60a5fa 1px,transparent 1px),
            linear-gradient(to bottom,#60a5fa 1px,transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
    </>
  );
}