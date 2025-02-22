import { NextResponse } from 'next/server';

export function middleware(request: any) {
  const response = NextResponse.next();
  
 
  response.headers.append('Access-Control-Allow-Origin', "*"); // Allow only your Vercel origin
  response.headers.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allowed methods
  response.headers.append('Access-Control-Allow-Headers', 'Content-Type'); // Allowed headers

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return NextResponse.json({}, { status: 200, headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: '/api/:path*', // Apply middleware to API routes
};
