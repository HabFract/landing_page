import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    const response = await fetch(
      'https://www.youtube.com/feeds/videos.xml?channel_id=UCQgkI83Fwlh4ncl_4tK6dSg'
    );

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch YouTube feed' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const xmlText = await response.text();

    return new Response(xmlText, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error fetching YouTube feed:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch YouTube feed' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
