export class Destination {
    id: number;
    name: string;
    search_location: string;
    latitude: string;
    longitude: string;
    house_no: string;
    locality: string;
    pincode: string;
    state: string;
    city: string;
    country: string;
    country_data: any;
    state_data: any;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    meta_tags: string;
    uploaded_file: string;
    is_next_destination: boolean;
    is_popular_destination: boolean;
    is_explore_destination: boolean;
    is_dream_destination: boolean;
    file_path: string;
    image_alt: string;
    constructor(destination: Destination) {
      {
        this.id = destination.id || 0;
        this.name = destination.name || '';
        this.search_location = destination.search_location || '';
        this.latitude = destination.latitude || '';
        this.longitude = destination.longitude || '';
        this.house_no = destination.house_no || '';
        this.locality = destination.locality || '';
        this.pincode = destination.pincode || '';
        this.state = destination.state || '';
        this.city = destination.city || '';
        this.country = destination.country || '';
        this.country_data = destination.country_data ||{};
        this.state_data = destination.state_data ||{};
        this.meta_title = destination.meta_title || '';
        this.meta_description = destination.meta_description || '';
        this.meta_keywords = destination.meta_keywords || '';
        this.meta_tags = destination.meta_tags || '';
        this.uploaded_file = destination.uploaded_file || '';
        this.is_next_destination = destination.is_next_destination || false;
        this.is_popular_destination = destination.is_popular_destination || false;
        this.is_explore_destination = destination.is_explore_destination || false;
        this.is_dream_destination = destination.is_dream_destination || false;
        this.file_path = destination.file_path || '';
        this.image_alt = destination.image_alt || '';
      }
    }
  }
  