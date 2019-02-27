package io.github.mamachanko.messagesservices;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Collections.singletonMap;
import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class MessagesServicesApplicationTests {

    @Autowired
    private TestRestTemplate testRestTemplate;

    @Test
    public void canCreateAndGetSortedMessages() {
        createMessage("test-message-1");
        createMessage("test-message-2");
        createMessage("test-message-3");

        assertThat(getMessagesSortedByTimestamp(0, 2)).containsExactly(
                "test-message-3",
                "test-message-2"
        );
        assertThat(getMessagesSortedByTimestamp(1, 2)).containsExactly(
                "test-message-1"
        );
    }

    @Test
    public void cannotDeleteMessage() {
        ResponseEntity<String> deleteMessageResponse = testRestTemplate.exchange(
                "/api/messages/123",
                HttpMethod.DELETE,
                null,
                String.class
        );
        assertThat(deleteMessageResponse.getStatusCode()).isEqualTo(HttpStatus.METHOD_NOT_ALLOWED);
    }

    private void createMessage(String messageText) {
        ResponseEntity<Resource<Message>> createdResponse = testRestTemplate.exchange(
                "/api/messages",
                HttpMethod.POST,
                new HttpEntity<>(singletonMap("text", messageText)),
                new ParameterizedTypeReference<Resource<Message>>() {
                }
        );
        assertThat(createdResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }

    private List<String> getMessagesSortedByTimestamp(int pageNumber, int pageSize) {
        URI pagedMessagesSortedByTimestamp = UriComponentsBuilder
                .fromPath("/api/messages")
                .queryParam("page", pageNumber)
                .queryParam("size", pageSize)
                .queryParam("sort", "timestamp,desc")
                .build()
                .toUri();

        ResponseEntity<Resources<Message>> messagesResponse = testRestTemplate.exchange(
                pagedMessagesSortedByTimestamp,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Resources<Message>>() {
                }
        );

        assertThat(messagesResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        return messagesResponse
                .getBody()
                .getContent()
                .stream()
                .map(Message::getText)
                .collect(Collectors.toList());
    }
}
