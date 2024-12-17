// src/pages/api/getToken.ts

export async function POST(request: Request) {
  try {
    // Define the URL for the Twitch OAuth2 token endpoint
    const url = 'https://id.twitch.tv/oauth2/token';
    
    // Create the request body using URLSearchParams
    const body = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID!,
      client_secret: process.env.TWITCH_CLIENT_SECRET!,
      grant_type: 'client_credentials',
    }).toString();

    // Make the POST request to Twitch
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    // Check if the response is OK
    if (!response.ok) {
      const error = await response.text();
      return new Response(error, { status: response.status });
    }

    // Parse the JSON response and return it
    const data = await response.json();
    console.log('Token response:', data);
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    // Handle any errors that occurred during the request
    return new Response('Failed to obtain IGDB access token', { status: 500 });
  }
}
