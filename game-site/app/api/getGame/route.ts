export async function POST(request: Request) {
    try {
      const url = new URL(request.url);
      const gameId = url.searchParams.get('id') || '';

      const tokenResponse = await fetch(process.env.NEXT_PUBLIC_API_URL! + '/api/getToken', { method: 'POST' });
      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      const gamesUrl = 'https://api.igdb.com/v4/games';

      const response = await fetch(gamesUrl, {
        method: 'POST',
        headers: {
          'Client-ID': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: `fields name, cover.image_id, summary, screenshots.image_id; where id = (${gameId});`
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`IGDB API error: ${errorText}`);
      }
  
      const games = await response.json();
      console.log('API Response:', games);
  
      return new Response(JSON.stringify(games[0]), { status: 200 });
    } catch (error) {
      console.error('Failed to fetch games:', error);
      return new Response('Failed to fetch games', { status: 500 });
    }
  }
  