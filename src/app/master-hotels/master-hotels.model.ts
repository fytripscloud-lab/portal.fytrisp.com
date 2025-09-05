export class MasterHotels {
    id: number;
    hotel_name: string;
    route: any;
    destination: any;
    room: any;
    hotel_images: [];
    // uploaded_file: string;
    constructor(hotels: MasterHotels) {
      {
        this.id = hotels.id || 0;
        this.hotel_name = hotels.hotel_name || '';
        this.route = hotels.route || '';
        this.destination = hotels.destination || '';
        this.room = hotels.room || '';
        this.hotel_images = hotels.hotel_images || [];
      }
    }
  }
  