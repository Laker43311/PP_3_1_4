package ru.kata.spring.boot_security.demo.init;


import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.repositories.RoleRepository;
import ru.kata.spring.boot_security.demo.repositories.UserRepository;


import javax.annotation.PostConstruct;
import java.util.Collections;

@Component
public class Init {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public Init(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @PostConstruct
    public void initData() {
        Role roleAdmin = new Role("ROLE_ADMIN");
        Role roleUser = new Role("ROLE_USER");
        roleRepository.save(roleAdmin);
        roleRepository.save(roleUser);

        User admin = new User();
        admin.setName("admin");
        admin.setPassword("$2y$10$/U6KKct8hIyqVNr/WunfSeF80nj1r9eAPQCzenwtdTwnsQRNXJNmG"); //adminpass
        admin.setEmail("Vova123@mail.com");
        admin.setSurname("AdminSurname");
        admin.setAge((byte) 20);
        admin.setRoles(Collections.singleton(roleAdmin));
        userRepository.save(admin);

        User user = new User();
        user.setName("user");
        user.setPassword("$2y$10$4Ym0Nxq6OyzFyMDyX0ploOPrt4CxicXqBdRypQ4VY/QvDbo/LYdsW");  //userpass
        user.setEmail("Vasya123@mail.com");
        user.setSurname("UserSurname");
        user.setAge((byte) 18);
        user.setRoles(Collections.singleton(roleUser));
        userRepository.save(user);
    }
}
