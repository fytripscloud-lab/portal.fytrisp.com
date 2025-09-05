export class MasterRoute {
    id: number;
    route_name: string;
    destination: any;
    images: [];
    search_location: string;
    latitude: string;
    longitude: string;
    house_no: string;
    locality: string;
    pincode: string;
    state: string;
    city: string;
    country: string;
    // uploaded_file: string;
    constructor(routeList: MasterRoute) {
      {
        this.id = routeList?.id || 0;
        this.route_name = routeList?.route_name || '';
        this.destination = routeList?.destination || '';
        this.images = routeList?.images || [];
        this.search_location = routeList?.search_location || '';
        this.latitude = routeList?.latitude || '';
        this.longitude = routeList?.longitude || '';
        this.house_no = routeList?.house_no || '';
        this.locality = routeList?.locality || '';
        this.pincode = routeList?.pincode || '';
        this.state = routeList?.state || '';
        this.city = routeList?.city || '';
        this.country = routeList?.country || '';
      }
    }
  }
  