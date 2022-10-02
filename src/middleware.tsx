import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  console.log(req.nextUrl.pathname);

  if (req.nextUrl.pathname.startsWith('/api/get-url/')) {
    console.log('returning early');
    return;
  }

  const slug = req.nextUrl.pathname.split('/').pop();

  if (!slug) {
    return;
  }

  console.log(slug);

  const data = await (await fetch(`${req.nextUrl.origin}/api/get-url/${slug}`)).json();
  if (data?.url) {
    console.log('redirecting... ', data.url);
    return NextResponse.redirect(data.url);
  }
}
