import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://103.103.20.23:8080/api';

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/brands`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Backend API error:', error);
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const response = await fetch(`${BACKEND_URL}/brands`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Backend API error:', error);
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const id = formData.get('id');
    
    const response = await fetch(`${BACKEND_URL}/brands/${id}`, {
      method: 'PUT',
      body: formData,
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Backend API error:', error);
    return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/brands/delete/${id}`, {
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
    return NextResponse.json({ error: 'Failed to delete brand' }, { status: 500 });
  }
}