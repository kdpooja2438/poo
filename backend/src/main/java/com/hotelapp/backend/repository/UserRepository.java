package com.hotelapp.backend.repository;

import com.hotelapp.backend.entity.User;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * In-memory storage for Phase 2. Replaced by a JpaRepository backed by the
 * "users" table in Phase 3.
 */
@Repository
public class UserRepository {

    private final Map<Long, User> users = new ConcurrentHashMap<>();
    private final AtomicLong nextId = new AtomicLong(1);

    public UserRepository() {
        save(new User(null, "admin@grandstay.com", "admin123", "Admin"));
    }

    public Optional<User> findByEmail(String email) {
        return users.values().stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email))
                .findFirst();
    }

    private User save(User user) {
        if (user.getId() == null) {
            user.setId(nextId.getAndIncrement());
        }
        users.put(user.getId(), user);
        return user;
    }
}
