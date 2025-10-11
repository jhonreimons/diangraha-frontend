import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://103.103.20.23:8080/api';

// Static data untuk achievements (sesuai schema: id, title, image_url)
const achievements = [
  {
    id: 1,
    title: "Best Partner Award 2024",
    image_url: "https://dummyimage.com/80x80/ffd700/ffffff.png&text=🏆"
  },
  {
    id: 2,
    title: "Innovation Excellence 2023",
    image_url: "https://dummyimage.com/80x80/ff6b35/ffffff.png&text=💡"
  },
  {
    id: 3,
    title: "Quality Assurance Award",
    image_url: "https://dummyimage.com/80x80/4ecdc4/ffffff.png&text=✅"
  },
  {
    id: 4,
    title: "Customer Satisfaction Award",
    image_url: "https://dummyimage.com/80x80/45b7d1/ffffff.png&text=⭐"
  },
  {
    id: 5,
    title: "Safety Excellence Award",
    image_url: "https://dummyimage.com/80x80/f39c12/ffffff.png&text=🛡️"
  },
  {
    id: 6,
    title: "Environmental Leadership",
    image_url: "https://dummyimage.com/80x80/27ae60/ffffff.png&text=🌱"
  }
];

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/achievements`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      // Fallback to static data if backend fails
      return NextResponse.json(achievements);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Backend API error:', error);
    return NextResponse.json(achievements);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const response = await fetch(`${BACKEND_URL}/achievements`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Backend API error:', error);
    return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const id = formData.get('id');

    const response = await fetch(`${BACKEND_URL}/achievements/${id}`, {
      method: 'PUT',
      body: formData,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Backend API error:', error);
    return NextResponse.json({ error: 'Failed to update achievement' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    const response = await fetch(`${BACKEND_URL}/achievements/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Backend API error:', error);
    return NextResponse.json({ error: 'Failed to delete achievement' }, { status: 500 });
  }
}
