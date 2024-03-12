package ru.kata.rest.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.rest.dto.UserMapper;
import ru.kata.rest.model.User;
import ru.kata.rest.service.UserService;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
public class UserRestController {

    private final UserService userService;

    @GetMapping({"api/user", "admin/api/user"})
    public ResponseEntity<?> getCurrentUser(Principal principal) {
        User currentUser = userService.findUserByUsername(principal.getName());

        if (currentUser == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(UserMapper.INSTANCE.UserToUserDto(currentUser), HttpStatus.OK);
    }
}