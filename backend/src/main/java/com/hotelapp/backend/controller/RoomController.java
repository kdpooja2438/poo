package com.hotelapp.backend.controller;

import com.hotelapp.backend.model.Room;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:5173")
public class RoomController {

    @GetMapping
    public List<Room> getRooms() {
        return List.of(
                new Room(1L, "101", "Single", true),
                new Room(2L, "102", "Double", false),
                new Room(3L, "201", "Suite", true)
        );
    }
}
