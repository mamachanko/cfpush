package io.github.mamachanko.messagesservices;

import lombok.Data;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.UUID;

@SpringBootApplication
public class MessagesServicesApplication {

    public static void main(String[] args) {
        SpringApplication.run(MessagesServicesApplication.class, args);
    }

}

@Configuration
@Profile("!cloud")
class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**");
    }
}

@RepositoryRestResource
interface MessageRepository extends PagingAndSortingRepository<Message, Long> {

    @Override
    @RestResource(exported = false)
    void deleteById(Long aLong);

    @Override
    @RestResource(exported = false)
    void delete(Message entity);

}

@EnableJpaAuditing
@Configuration
class JpaConfig {
}

@Data
@Entity
@EntityListeners(AuditingEntityListener.class)
class Message {

    @Id
    @GeneratedValue
    private UUID id;

    private String text;

    @CreatedDate
    private Long timestamp;
}
