export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';

export interface Room {
  id: number;
  roomNumber: string;
  roomType: string;
  price: number;
  status: RoomStatus;
}
