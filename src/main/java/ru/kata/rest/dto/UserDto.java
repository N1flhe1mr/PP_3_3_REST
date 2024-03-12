package ru.kata.rest.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.validation.annotation.Validated;
import ru.kata.rest.model.Role;

import java.util.Collection;

@Validated
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private long id;

    @NotNull
    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotNull
    @NotBlank(message = "Surname cannot be blank")
    private String surname;

    @NotNull
    @Min(value = 18, message = "Age should not be less than 0")
    @Max(value = 100, message = "Age should not be greater than 100")
    private byte age;

    @NotNull
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    private String email;

    @NotNull
    @NotBlank(message = "Username cannot be blank")
    private String username;

    private String password;

    @NotNull
    private Collection<Role> roles;
}