package com.hotelapp.backend.model;

public class Room {

    private Long id;
    private String roomNumber;
    private String type;
    private boolean available;

    public Room(Long id, String roomNumber, String type, boolean available) {
        this.id = id;
        this.roomNumber = roomNumber;
        this.type = type;
        this.available = available;
    }

    public Long getId() {
        return id;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public String getType() {
        return type;
    }

    public boolean isAvailable() {
        return available;
    }
}
