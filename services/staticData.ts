export const POPULAR_BRANDS = [
  "Abarth", "Alfa Romeo", "Alpine", "Aston Martin", "Audi", "Bentley", "BMW", 
  "Bugatti", "BYD", "Cadillac", "Chevrolet", "Chrysler", "Citroën", "Cupra", 
  "Dacia", "Dodge", "DS Automobiles", "Ferrari", "Fiat", "Ford", "Genesis", 
  "GMC", "Honda", "Hummer", "Hyundai", "Infiniti", "Isuzu", "Jaguar", "Jeep", 
  "Kia", "Lamborghini", "Lancia", "Land Rover", "Lexus", "Lotus", "Maserati", 
  "Mazda", "McLaren", "Mercedes-Benz", "MG", "Mini", "Mitsubishi", "Nissan", 
  "Opel", "Peugeot", "Polestar", "Porsche", "RAM", "Renault", "Rolls-Royce", 
  "Saab", "Seat", "Skoda", "Smart", "SsangYong", "Subaru", "Suzuki", "Tesla", 
  "Toyota", "Volkswagen", "Volvo"
];

export const BRAND_MODELS: Record<string, string[]> = {
  "Renault": ["Captur", "Clio", "Espace", "Kadjar", "Kangoo", "Koleos", "Laguna", "Mégane", "Scénic", "Talisman", "Trafic", "Twingo", "Zoe"],
  "Peugeot": ["108", "2008", "208", "3008", "301", "308", "4008", "408", "5008", "508", "Partner", "Rifter", "Traveller"],
  "Citroën": ["AMI", "Berlingo", "C1", "C3", "C3 Aircross", "C4", "C4 Cactus", "C5", "C5 Aircross", "C8", "DS3", "Jumpy", "SpaceTourer"],
  "Dacia": ["Dokker", "Duster", "Jogger", "Lodgy", "Logan", "Sandero", "Spring"],
  "Volkswagen": ["Amarok", "Arteon", "Caddy", "Golf", "ID.3", "ID.4", "Passat", "Polo", "T-Cross", "T-Roc", "Taigo", "Tiguan", "Touareg", "Touran", "Transporter", "up!"],
  "Toyota": ["Auris", "Aygo", "bZ4X", "C-HR", "Camry", "Corolla", "Hilux", "Land Cruiser", "Prius", "RAV4", "Yaris", "Yaris Cross"],
  "BMW": ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "7 Series", "i3", "i4", "iX", "X1", "X3", "X5", "Z4"],
  "Mercedes-Benz": ["A-Class", "B-Class", "C-Class", "CLA", "CLS", "E-Class", "EQB", "EQE", "EQS", "GLA", "GLB", "GLC", "GLE", "S-Class", "V-Class", "Sprinter"],
  "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "TT", "e-tron"],
  "Ford": ["EcoSport", "Fiesta", "Focus", "Kuga", "Mondeo", "Mustang", "Puma", "Ranger", "S-Max", "Tourneo", "Transit"],
  "Nissan": ["370Z", "Ariya", "Juke", "Leaf", "Micra", "Navara", "Note", "Qashqai", "X-Trail"],
  "Hyundai": ["Bayon", "i10", "i20", "i30", "IONIQ", "IONIQ 5", "Kona", "Santa Fe", "Tucson"],
  "Kia": ["Carens", "Ceed", "EV6", "Niro", "Picanto", "Rio", "Sorento", "Sportage", "Stonic"],
  "Fiat": ["500", "500X", "500L", "Doblo", "Ducato", "Panda", "Punto", "Tipo"],
  "Opel": ["Adam", "Astra", "Combo", "Corsa", "Crossland", "Grandland", "Insignia", "Mokka", "Vivaro"],
  "Tesla": ["Model 3", "Model S", "Model X", "Model Y", "Roadster"],
  "Porsche": ["718 Boxster", "718 Cayman", "911", "Cayenne", "Macan", "Panamera", "Taycan"],
  "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Range Rover", "Range Rover Evoque", "Range Rover Sport", "Range Rover Velar"],
  "Honda": ["Accord", "Civic", "CR-V", "HR-V", "Jazz"],
  "Mazda": ["CX-3", "CX-30", "CX-5", "CX-60", "MX-5", "Mazda2", "Mazda3", "Mazda6"]
};

export const getFallbackModelsByBrand = (brand: string): string[] => {
  if (!brand) return [];

  const normalizedBrand = brand.toLocaleLowerCase('fr');
  const matchedBrand = Object.keys(BRAND_MODELS).find(
    (key) => key.toLocaleLowerCase('fr') === normalizedBrand
  );

  return matchedBrand ? BRAND_MODELS[matchedBrand] : [];
};

export const BODY_TYPES = [
  "Berline", "Break", "Cabriolet", "Coupé", "SUV / 4x4", "Monospace", 
  "Utilitaire", "Pick-up", "Citadine", "Roadster", "Targa", "Limousine"
];

export const ENGINE_TYPES = [
  "Essence", "Diesel", "Hybride", "Hybride rechargeable (PHEV)", 
  "Électrique", "GPL", "Éthanol (E85)", "Hydrogène"
];

export const getYears = (): string[] => {
  const currentYear = new Date().getFullYear() + 1;
  const years = [];
  for (let i = currentYear; i >= 1950; i--) {
    years.push(i.toString());
  }
  return years;
};
