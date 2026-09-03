package com.hotelapp.backend.config;

import com.hotelapp.backend.entity.Room;
import com.hotelapp.backend.entity.RoomStatus;
import com.hotelapp.backend.entity.User;
import com.hotelapp.backend.repository.RoomRepository;
import com.hotelapp.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Seeds starter data on first startup, when the database is empty.
 * With a real database, data now survives restarts - this only fills
 * an empty database, it never resets existing data.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public DataSeeder(RoomRepository roomRepository, UserRepository userRepository) {
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        if (roomRepository.count() == 0) {
            roomRepository.save(new Room(null, "101", "Single", 2000, RoomStatus.AVAILABLE));
            roomRepository.save(new Room(null, "102", "Deluxe", 3000, RoomStatus.OCCUPIED));
            roomRepository.save(new Room(null, "103", "Suite", 5000, RoomStatus.AVAILABLE));
        }

        if (userRepository.count() == 0) {
            userRepository.save(new User(null, "admin@grandstay.com", "admin123", "Admin"));
        }
    }
}
