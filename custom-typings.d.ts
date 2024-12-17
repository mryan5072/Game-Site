declare module 'igdb-api-node' {
    interface IGDB {
      games(query: string): Promise<any>;
      covers(query: string): Promise<any>;
    }
  
    export default function createClient(clientId: string, apiKey: string): IGDB;
  }
  