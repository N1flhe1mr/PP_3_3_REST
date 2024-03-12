package ru.kata.rest.service;

import ru.kata.rest.model.Role;
import ru.kata.rest.model.User;

import java.util.List;

public interface UserService {
    void save(User user);

    void update(User user);
    User findUserByUsername(String name);

    User findUserById(long id);

    void deleteUserById(long id);

    List<User> getUsers();

    List<Role> getUsersRoles();
}
