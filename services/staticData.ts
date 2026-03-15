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