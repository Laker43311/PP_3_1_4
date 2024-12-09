package ru.kata.spring.boot_security.demo.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.UserServiceImpl;

@Component
public class UserValidator implements Validator {
    private final UserServiceImpl userServiceImpl;

    @Autowired
    public UserValidator(UserServiceImpl userServiceImpl) {
        this.userServiceImpl = userServiceImpl;
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return User.class.equals(aClass);
    }

    @Override
    public void validate(Object o, Errors errors) {
        User user = (User) o;

        if (userServiceImpl.findByUsername(user.getEmail()) != null) {
            User userFromDb = userServiceImpl.findByUsername(user.getEmail());
            if (!userFromDb.getId().equals(user.getId())) {
                errors.rejectValue("email", "", "Email already exists");
            }
        }
    }
}
