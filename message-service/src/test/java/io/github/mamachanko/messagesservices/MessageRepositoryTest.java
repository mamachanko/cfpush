package io.github.mamachanko.messagesservices;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@DataJpaTest
public class MessageRepositoryTest {

    @Autowired
    private MessageRepository messageRepository;

    @Test
    public void returnsAllSavedMessages() {
        String id = UUID.randomUUID().toString();
        Message message = new Message(id, "message-text");
        messageRepository.save(message);

        List<Message> messages = messageRepository.findAll();

        assertThat(messages).containsExactly(new Message(id, "message-text"));
    }
}