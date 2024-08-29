export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const searchQuery = url.searchParams.get('search') || '';

    // Fetch the access token from your /api/getToken endpoint
    const tokenResponse = await fetch(process.env.NEXT_PUBLIC_API_URL! + '/api/getToken', { method: 'POST' });
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Define the URL for the IGDB API endpoint for games
    const gamesUrl = 'https://api.igdb.com/v4/games';

    // Fetch games with expanded cover data
    const response = await fetch(gamesUrl, {
      method: 'POST',
      headers: {
        'Client-ID': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: `
        fields id,name,rating,cover.image_id,platforms;
        where cover != null${searchQuery ? ` & name ~ *"${searchQuery}"*` : ''};
        sort rating desc;
        limit ${limit};
        offset ${(page - 1) * limit};
      `,
    });

    const games = await response.json();
    const totalGames = parseInt(response.headers.get('x-count') || '0');
    const totalPages = Math.ceil(totalGames / limit);

    console.log('game data: ', games);

    // Return the games with expanded cover images
    return new Response(JSON.stringify({ games, totalPages }), { status: 200 });
  } catch (error) {
    console.error('Failed to fetch games:', error);
    return new Response('Failed to fetch games', { status: 500 });
  }
}
