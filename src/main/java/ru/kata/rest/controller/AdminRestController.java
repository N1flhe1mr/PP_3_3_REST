package ru.kata.rest.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ru.kata.rest.dto.UserDto;
import ru.kata.rest.dto.UserMapper;
import ru.kata.rest.model.User;
import ru.kata.rest.service.UserService;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AdminRestController {

    private final UserService userService;

    @GetMapping("admin/api/users")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getUsers() {
        List<UserDto> users = userService.getUsers().stream()
                .map(UserMapper.INSTANCE::UserToUserDto)
                .toList();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("admin/api/users/roles")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getRoles() {
        return new ResponseEntity<>(userService.getUsersRoles(), HttpStatus.OK);
    }

    @PostMapping("admin/api/users/save")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> saveUser(@Validated @RequestBody UserDto user) {
        userService.save(UserMapper.INSTANCE.UserDtoToUser(user));
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("admin/api/users/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> findUserById(@PathVariable Long id) {
        UserDto userDto = UserMapper.INSTANCE.UserToUserDto(userService.findUserById(id));
        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }

    @PatchMapping("admin/api/users/update")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateUser(@Validated @RequestBody UserDto userDto) {
        User user = UserMapper.INSTANCE.UserDtoToUser(userDto);
        user.setPassword(userService.findUserById(user.getId()).getPassword());
        userService.update(user);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("admin/api/users/delete/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
