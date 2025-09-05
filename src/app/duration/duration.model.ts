export class Duration {
    id: number;
    no_of_days: number;
    destination: any;
    file_path: string;
    constructor(duration: Duration) {
      {
        this.id = duration?.id || 0;
        this.no_of_days = duration?.no_of_days || 0;
        this.destination = duration?.destination || {}; 
        this.file_path = duration?.file_path || '';       
      }
    }
  }
  