package com.hotelapp.backend.service;

import com.hotelapp.backend.entity.Room;
import com.hotelapp.backend.repository.RoomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found: " + id));
    }

    public Room createRoom(Room room) {
        room.setId(null);
        return roomRepository.save(room);
    }

    public Room updateRoom(Long id, Room updatedRoom) {
        Room existing = getRoomById(id);
        existing.setRoomNumber(updatedRoom.getRoomNumber());
        existing.setRoomType(updatedRoom.getRoomType());
        existing.setPrice(updatedRoom.getPrice());
        existing.setStatus(updatedRoom.getStatus());
        return roomRepository.save(existing);
    }

    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found: " + id);
        }
        roomRepository.deleteById(id);
    }
}
