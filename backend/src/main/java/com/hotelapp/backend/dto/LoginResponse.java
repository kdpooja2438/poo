package com.hotelapp.backend.dto;

public class LoginResponse {

    private String email;
    private String name;

    public LoginResponse(String email, String name) {
        this.email = email;
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }
}
