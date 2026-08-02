import type { Medicine } from "@/types/medicine";

export const dummyMedicine: Medicine = {
  name: "Paracetamol 500 mg",
  brandName: "Crocin",
  genericName: "Paracetamol (Acetaminophen)",
  prescriptionRequired: false,
  type: "Tablet",
  overview:
    "Paracetamol is commonly used for the short-term relief of mild to moderate pain and fever. Always use medicines exactly as directed by a healthcare professional or the product label.",
  uses: ["Fever relief", "Headache", "Muscle aches", "Cold and flu discomfort"],
  dosage: "Adults: 500–1000 mg every 4–6 hours when needed. Do not exceed the maximum daily dose stated on the label.",
  sideEffects: ["Nausea", "Stomach discomfort", "Skin rash (rare)"],
  warnings: [
    "Do not combine with other medicines containing paracetamol.",
    "Speak to a clinician before use if you have liver disease.",
    "Seek urgent care for signs of an allergic reaction.",
  ],
  storage: "Store below 25°C in a dry place, away from direct sunlight and out of reach of children.",
  foodInteraction: "Can usually be taken with or without food. Taking it after food may help if you have a sensitive stomach.",
  alcoholInteraction: "Avoid or limit alcohol. Alcohol can increase the risk of liver damage when combined with paracetamol.",
  pregnancySafety: "Generally considered suitable when clinically needed, but consult your obstetrician or pharmacist before use.",
  drivingSafety: "Does not usually affect alertness. If you feel unwell or dizzy, avoid driving or operating machinery.",
  alternatives: ["Calpol 500 mg", "Dolo 500", "Pacimol 500"],
};
