package io.github.mamachanko.messagesservices;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@DataJpaTest
public class MessageRepositoryTest {

    @Autowired
    private MessageRepository messageRepository;

    @Test
    public void returnsAllSavedMessages() {
        Message message3 = new Message(UUID.randomUUID().toString(), "message-text-3", 789L);
        Message message1 = new Message(UUID.randomUUID().toString(), "message-text-1", 123L);
        Message message2 = new Message(UUID.randomUUID().toString(), "message-text-2", 456L);

        messageRepository.save(message1);
        messageRepository.save(message3);
        messageRepository.save(message2);

        Pageable firstPageOfTwoMostRecent = PageRequest.of(0, 2, Sort.by("timestamp").descending());

        Page<Message> messages = messageRepository.findAll(firstPageOfTwoMostRecent);

        assertThat(messages).containsExactly(
                message3,
                message2
        );
    }
}