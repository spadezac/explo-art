export interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

export interface ApiResponse {
  data: Artwork[];
  pagination: {
    total: number;
    current_page: number;
    total_pages: number;
  };
}


export const fetchArtworks = async (page: number, limit: number = 12): Promise<ApiResponse> => {
  try {
    const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch artworks');
    }
    const data = await response.json();
    return data as ApiResponse;
  } catch (error) {
    console.error('Error fetching artworks:', error);
    throw error;
  }
};

// for future use - If I decide to add search filter
export const searchArtworks = async (searchTerm: string, page: number, limit: number = 12): Promise<ApiResponse> => {
  try {
    const response = await fetch(`https://api.artic.edu/api/v1/artworks/search?q=${searchTerm}&page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to search artworks');
    }
    const data = await response.json();
    return data as ApiResponse;
  } catch (error) {
    console.error('Error searching artworks:', error);
    throw error; 
  }
};
