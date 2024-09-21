export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const searchQuery = url.searchParams.get('search') || '';
    const platformId = url.searchParams.get('platform') || '';
    const category = url.searchParams.get('category') || '';
    const sortBy = url.searchParams.get('sortby') || 'rating_desc'; // Default sort by rating

    // Fetch the access token from your /api/getToken endpoint
    const tokenResponse = await fetch(process.env.NEXT_PUBLIC_API_URL! + '/api/getToken', { method: 'POST' });
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Define the URL for the IGDB API endpoint for games
    const gamesUrl = 'https://api.igdb.com/v4/games';

    // Construct query body
    let queryBody = `
      fields id,name,category,rating,total_rating,cover.image_id,platforms,first_release_date;
      where cover != null
    `;

    if (platformId) {
      queryBody += ` & platforms = (${platformId})`;
    }

    if (category) {
      queryBody += ` & category = (${category})`;
    }

    if (searchQuery) {
      // Use search only, omit sorting
      queryBody += `; search "${searchQuery}"`;
    } else {
      // Apply sorting based on sortBy parameter
      if (sortBy === 'rating_desc') {
        queryBody += `; sort total_rating desc`;
      } else if (sortBy === 'rating_asc') {
        queryBody += `; sort total_rating asc`;
      } else if (sortBy === 'release_date_desc') {
        queryBody += `; sort first_release_date desc`;
      } else if (sortBy === 'release_date_asc') {
        queryBody += `; sort first_release_date asc`;
      }
    }

    queryBody += `; limit ${limit}; offset ${(page - 1) * limit};`;

    // Fetch games with expanded cover data
    const response = await fetch(gamesUrl, {
      method: 'POST',
      headers: {
        'Client-ID': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: queryBody.trim(), // Ensure no leading/trailing whitespace in the query body
    });

    if (!response.ok) {
      const errorText = await response.text(); // Capture the response text for debugging
      throw new Error(`IGDB API error: ${errorText}`);
    }

    const games = await response.json();
    const totalGames = parseInt(response.headers.get('x-count') || '0');
    const totalPages = Math.ceil(totalGames / limit);

    console.log('Request Body:', queryBody);
    console.log('API Response:', games);

    // Return the games with expanded cover images
    return new Response(JSON.stringify({ games, totalPages }), { status: 200 });
  } catch (error) {
    console.error('Failed to fetch games:', error);
    return new Response('Failed to fetch games', { status: 500 });
  }
}
