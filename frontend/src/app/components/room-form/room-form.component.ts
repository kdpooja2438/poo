import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Room, RoomStatus } from '../../models/room.model';

@Component({
  selector: 'app-room-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './room-form.component.html',
  styleUrl: './room-form.component.css'
})
export class RoomFormComponent implements OnChanges {
  @Input() room: Room | null = null;
  @Output() save = new EventEmitter<Omit<Room, 'id'>>();
  @Output() cancel = new EventEmitter<void>();

  statuses: RoomStatus[] = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE'];

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      roomNumber: ['', Validators.required],
      roomType: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      status: ['AVAILABLE' as RoomStatus, Validators.required]
    });
  }

  ngOnChanges(): void {
    this.form.reset(
      this.room
        ? { ...this.room }
        : { roomNumber: '', roomType: '', price: 0, status: 'AVAILABLE' }
    );
  }

  get isEditMode(): boolean {
    return this.room !== null;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.getRawValue() as Omit<Room, 'id'>);
  }
}
