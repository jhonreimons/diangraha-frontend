import { NextResponse } from 'next/server';

// Static data untuk brands
const brands = [
  {
    id: 1,
    name: "Schneider Electric",
    img: "https://dummyimage.com/150x150/4f46e5/ffffff.png&text=Schneider",
    description: "Global leader in energy management and automation",
    website: "https://schneider-electric.com"
  },
  {
    id: 2,
    name: "ABB",
    img: "https://dummyimage.com/150x150/dc2626/ffffff.png&text=ABB",
    description: "Technology leader in electrification and automation",
    website: "https://abb.com"
  },
  {
    id: 3,
    name: "Siemens",
    img: "https://dummyimage.com/150x150/059669/ffffff.png&text=Siemens",
    description: "Industrial manufacturing and infrastructure solutions",
    website: "https://siemens.com"
  },
  {
    id: 4,
    name: "Legrand",
    img: "https://dummyimage.com/150x150/7c3aed/ffffff.png&text=Legrand",
    description: "Electrical and digital building infrastructures",
    website: "https://legrand.com"
  },
  {
    id: 5,
    name: "Eaton",
    img: "https://dummyimage.com/150x150/ea580c/ffffff.png&text=Eaton",
    description: "Power management solutions",
    website: "https://eaton.com"
  },
  {
    id: 6,
    name: "Mitsubishi Electric",
    img: "https://dummyimage.com/150x150/be123c/ffffff.png&text=Mitsubishi",
    description: "Electrical and electronic equipment manufacturer",
    website: "https://mitsubishielectric.com"
  },
  {
    id: 7,
    name: "Omron",
    img: "https://dummyimage.com/150x150/0891b2/ffffff.png&text=Omron",
    description: "Industrial automation and electronic components",
    website: "https://omron.com"
  },
  {
    id: 8,
    name: "Phoenix Contact",
    img: "https://dummyimage.com/150x150/65a30d/ffffff.png&text=Phoenix",
    description: "Electrical connection and automation technology",
    website: "https://phoenixcontact.com"
  },
  {
    id: 9,
    name: "Weidmuller",
    img: "https://dummyimage.com/150x150/c2410c/ffffff.png&text=Weidmuller",
    description: "Electrical connectivity and automation solutions",
    website: "https://weidmuller.com"
  },
  {
    id: 10,
    name: "Rittal",
    img: "https://dummyimage.com/150x150/1d4ed8/ffffff.png&text=Rittal",
    description: "Enclosures, power distribution, and cooling systems",
    website: "https://rittal.com"
  },
  {
    id: 11,
    name: "Fluke",
    img: "https://dummyimage.com/150x150/facc15/000000.png&text=Fluke",
    description: "Electronic test tools and software",
    website: "https://fluke.com"
  },
  {
    id: 12,
    name: "Danfoss",
    img: "https://dummyimage.com/150x150/374151/ffffff.png&text=Danfoss",
    description: "Energy efficient solutions for heating, cooling, and motion",
    website: "https://danfoss.com"
  }
];

export async function GET() {
  return NextResponse.json(brands);
}