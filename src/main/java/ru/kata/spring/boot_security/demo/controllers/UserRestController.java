package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.UserServiceImpl;
import ru.kata.spring.boot_security.demo.util.UserNotCreatedException;
import ru.kata.spring.boot_security.demo.util.UserValidator;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserRestController {

    private final UserServiceImpl userServiceImpl;
    private final UserValidator userValidator;

    @Autowired
    public UserRestController(UserServiceImpl userServiceImpl, UserValidator userValidator) {
        this.userServiceImpl = userServiceImpl;
        this.userValidator = userValidator;
    }

    @GetMapping("/current")
    public ResponseEntity<User> getCurrentUser(Principal principal) {
        return new ResponseEntity<>(userServiceImpl.findByUsername(principal.getName()), HttpStatus.OK);
    }

    @PatchMapping("/update")
    public ResponseEntity<HttpStatus> updateCurrentUser(@RequestBody @Valid User user,
                                                        BindingResult bindingResult,
                                                        Principal principal) {
        userValidator.validate(user, bindingResult);

        if (bindingResult.hasErrors()) {
            StringBuilder errorMessage = new StringBuilder();

            List<FieldError> fieldErrors = bindingResult.getFieldErrors();
            for (FieldError error : fieldErrors) {
                errorMessage.append(error.getField())
                        .append(": ")
                        .append(error.getDefaultMessage())
                        .append("\n");
            }

            throw new UserNotCreatedException(errorMessage.toString());
        }

        User existingUser = userServiceImpl.findByUsername(principal.getName());
        userServiceImpl.updateUser(existingUser.getId(), user);

        return ResponseEntity.ok(HttpStatus.OK);
    }
}