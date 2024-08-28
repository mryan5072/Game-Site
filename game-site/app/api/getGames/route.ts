export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    // Fetch the access token from your /api/getToken endpoint
    const tokenResponse = await fetch('http://localhost:3000/api/getToken', { method: 'POST' });
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Define the URL for the IGDB API endpoint for games
    const gamesUrl = 'https://api.igdb.com/v4/games';

    // Fetch total count of games
    const countResponse = await fetch(gamesUrl, {
      method: 'POST',
      headers: {
        'Client-ID': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: `
        fields id; limit *;
      `,
    });

    const countData = await countResponse.json();
    const totalGames = Object.keys(countData).length;

    console.log("total games:", totalGames);

    const totalPages = Math.ceil(totalGames / limit);

    console.log("total pages:", totalPages);

    // Fetch games for the requested page
    const response = await fetch(gamesUrl, {
      method: 'POST',
      headers: {
        'Client-ID': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: `
        fields id,name,cover;
        where cover != null;
        sort rating desc;
        limit ${limit};
        offset ${(page - 1) * limit};
      `,
    });

    const games = await response.json();

    // Collect cover IDs from the fetched games
    const coverIds = games
      .filter((game: any) => game.cover)
      .map((game: any) => game.cover);

    if (coverIds.length === 0) {
      return new Response(JSON.stringify({ games, totalPages }), { status: 200 });
    }

    // Fetch covers in batches to avoid rate limiting
    const coversUrl = 'https://api.igdb.com/v4/covers';
    const coverMap: Record<number, string> = {};

    const batchSize = 10; // Adjust batch size based on expected rate limits
    for (let i = 0; i < coverIds.length; i += batchSize) {
      const batch = coverIds.slice(i, i + batchSize);
      const coversBody = `fields id,image_id; where id = (${batch.join(',')});`;

      const coversResponse = await fetch(coversUrl, {
        method: 'POST',
        headers: {
          'Client-ID': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: coversBody,
      });

      const covers = await coversResponse.json();
      covers.forEach((cover: any) => {
        coverMap[cover.id] = cover.image_id;
      });
    }

    // Add image_id to games based on cover ID
    const gamesWithImages = games.map((game: any) => ({
      ...game,
      image_id: coverMap[game.cover] || null, // Add image_id or null if not available
    }));

    // Return the games with cover images and image IDs
    return new Response(JSON.stringify({ games: gamesWithImages, totalPages }), { status: 200 });
  } catch (error) {
    console.error('Failed to fetch games:', error);
    return new Response('Failed to fetch games', { status: 500 });
  }
}
