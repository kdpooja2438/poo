package com.hotelapp.backend.repository;

import com.hotelapp.backend.entity.Room;
import com.hotelapp.backend.entity.RoomStatus;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * In-memory storage for Phase 2. Method names mirror Spring Data JPA so this
 * gets replaced by a JpaRepository interface in Phase 3 without touching callers.
 */
@Repository
public class RoomRepository {

    private final Map<Long, Room> rooms = new ConcurrentHashMap<>();
    private final AtomicLong nextId = new AtomicLong(1);

    public RoomRepository() {
        save(new Room(null, "101", "Single", 2000, RoomStatus.AVAILABLE));
        save(new Room(null, "102", "Deluxe", 3000, RoomStatus.OCCUPIED));
        save(new Room(null, "103", "Suite", 5000, RoomStatus.AVAILABLE));
    }

    public List<Room> findAll() {
        return List.copyOf(rooms.values());
    }

    public Optional<Room> findById(Long id) {
        return Optional.ofNullable(rooms.get(id));
    }

    public Room save(Room room) {
        if (room.getId() == null) {
            room.setId(nextId.getAndIncrement());
        }
        rooms.put(room.getId(), room);
        return room;
    }

    public boolean existsById(Long id) {
        return rooms.containsKey(id);
    }

    public void deleteById(Long id) {
        rooms.remove(id);
    }
}
