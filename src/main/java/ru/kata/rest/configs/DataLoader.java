package ru.kata.rest.configs;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import ru.kata.rest.model.Role;
import ru.kata.rest.model.User;
import ru.kata.rest.repository.RoleRepository;
import ru.kata.rest.repository.UserRepository;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public void run(String... args) {

        Role adminRole = roleRepository.findRoleByName("ADMIN").orElseGet(() -> {
            Role role = new Role();
            role.setId(1L);
            role.setName("ADMIN");
            return roleRepository.save(role);
        });

        Role userRole = roleRepository.findRoleByName("USER").orElseGet(() -> {
            Role role = new Role();
            role.setId(2L);
            role.setName("USER");
            return roleRepository.save(role);
        });

        if (userRepository.findUserByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setId(1L);
            admin.setUsername("admin");
            admin.setPassword(bCryptPasswordEncoder.encode("admin"));
            admin.setRoles(new HashSet<>(Arrays.asList(userRole, adminRole)));
            admin.setName("AdminName");
            admin.setSurname("AdminSurname");
            admin.setAge((byte) 30);
            admin.setEmail("admin@admin.com");
            userRepository.save(admin);
        }

        if (userRepository.findUserByUsername("user").isEmpty()) {
            User user = new User();
            user.setId(2L);
            user.setUsername("user");
            user.setPassword(bCryptPasswordEncoder.encode("user"));
            user.setRoles(Collections.singleton(userRole));
            user.setName("UserName");
            user.setSurname("UserSurname");
            user.setAge((byte) 20);
            user.setEmail("user@user.com");
            userRepository.save(user);
        }
    }
}
