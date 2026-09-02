import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Room } from '../../models/room.model';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  rooms: Room[] = [];
  todaysCheckIns = 4;
  loadError: string | null = null;

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.roomService.rooms$.subscribe((rooms) => (this.rooms = rooms));
    this.roomService.loadError$.subscribe((error) => (this.loadError = error));
  }

  get totalRooms(): number {
    return this.rooms.length;
  }

  get availableRooms(): number {
    return this.rooms.filter((r) => r.status === 'AVAILABLE').length;
  }

  get occupiedRooms(): number {
    return this.rooms.filter((r) => r.status === 'OCCUPIED').length;
  }
}
