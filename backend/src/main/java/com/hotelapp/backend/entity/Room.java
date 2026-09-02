package com.hotelapp.backend.entity;

public class Room {

    private Long id;
    private String roomNumber;
    private String roomType;
    private double price;
    private RoomStatus status;

    public Room() {
    }

    public Room(Long id, String roomNumber, String roomType, double price, RoomStatus status) {
        this.id = id;
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.price = price;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public RoomStatus getStatus() {
        return status;
    }

    public void setStatus(RoomStatus status) {
        this.status = status;
    }
}
