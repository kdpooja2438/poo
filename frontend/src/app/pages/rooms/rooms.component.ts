import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Room } from '../../models/room.model';
import { RoomService } from '../../services/room.service';
import { RoomFormComponent } from '../../components/room-form/room-form.component';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, RoomFormComponent],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];
  isFormOpen = false;
  editingRoom: Room | null = null;
  loadError: string | null = null;

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.roomService.rooms$.subscribe((rooms) => (this.rooms = rooms));
    this.roomService.loadError$.subscribe((error) => (this.loadError = error));
  }

  openAddForm(): void {
    this.editingRoom = null;
    this.isFormOpen = true;
  }

  openEditForm(room: Room): void {
    this.editingRoom = room;
    this.isFormOpen = true;
  }

  closeForm(): void {
    this.isFormOpen = false;
    this.editingRoom = null;
  }

  saveRoom(roomData: Omit<Room, 'id'>): void {
    if (this.editingRoom) {
      this.roomService.updateRoom(this.editingRoom.id, roomData).subscribe(() => this.closeForm());
    } else {
      this.roomService.addRoom(roomData).subscribe(() => this.closeForm());
    }
  }

  deleteRoom(room: Room): void {
    if (confirm(`Delete room ${room.roomNumber}?`)) {
      this.roomService.deleteRoom(room.id).subscribe();
    }
  }
}
