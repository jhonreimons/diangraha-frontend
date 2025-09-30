import { NextResponse } from 'next/server';

// Static data untuk achievements
const achievements = [
  {
    id: 1,
    title: "Best Partner Award 2024",
    image: "https://dummyimage.com/80x80/ffd700/ffffff.png&text=🏆",
    description: "Awarded for outstanding partnership performance"
  },
  {
    id: 2,
    title: "Innovation Excellence 2023",
    image: "https://dummyimage.com/80x80/ff6b35/ffffff.png&text=💡",
    description: "Recognition for innovative solutions"
  },
  {
    id: 3,
    title: "Quality Assurance Award",
    image: "https://dummyimage.com/80x80/4ecdc4/ffffff.png&text=✅",
    description: "Excellence in quality management"
  },
  {
    id: 4,
    title: "Customer Satisfaction Award",
    image: "https://dummyimage.com/80x80/45b7d1/ffffff.png&text=⭐",
    description: "Outstanding customer service"
  },
  {
    id: 5,
    title: "Safety Excellence Award",
    image: "https://dummyimage.com/80x80/f39c12/ffffff.png&text=🛡️",
    description: "Commitment to workplace safety"
  },
  {
    id: 6,
    title: "Environmental Leadership",
    image: "https://dummyimage.com/80x80/27ae60/ffffff.png&text=🌱",
    description: "Leadership in environmental sustainability"
  }
];

export async function GET() {
  return NextResponse.json(achievements);
}