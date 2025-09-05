export class Room {
  id: number;
  name: string;
  description: string;
  constructor(room: Room) {
    {
      this.id = room.id || 0;
      this.name = room.name || '';
      this.description = room.description || '';
    }
  }
  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
