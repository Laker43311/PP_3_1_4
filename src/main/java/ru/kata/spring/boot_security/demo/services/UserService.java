package ru.kata.spring.boot_security.demo.services;

import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

public interface UserService {
    public List<User> getAllUsers();
    public User findByUsername(String username);
    public User getUserById(long id);
    public void updateUser(long id, User updatedUser);
    public void deleteUser(Long id);
    public void addUser(User user);

}
