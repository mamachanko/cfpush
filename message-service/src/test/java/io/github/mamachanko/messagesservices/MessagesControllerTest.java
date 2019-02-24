package io.github.mamachanko.messagesservices;

import org.junit.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class MessagesControllerTest {

    @Test
    public void returnsMessages() throws Exception {
        MessageRepository messageRepositoryStub = mock(MessageRepository.class);
        IdProvider idProviderDummy = mock(IdProvider.class);

        PageImpl<Message> messages = new PageImpl<Message>(Collections.singletonList(new Message("message-id", "message-text", 123L)));
        PageRequest mostRecent = PageRequest.of(0, 12, Sort.by("timestamp").descending());
        given(messageRepositoryStub.findAll(mostRecent)).willReturn(messages);

        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new MessagesController(messageRepositoryStub, idProviderDummy, 12)).build();

        mockMvc.perform(get("/api/messages"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].text", is("message-text")))
                .andExpect(jsonPath("$[0].timestamp", is(123)));
    }

    @Test
    public void savesMessage() throws Exception {
        MessageRepository messageRepositoryMock = mock(MessageRepository.class);
        IdProvider idProviderStub = mock(IdProvider.class);
        given(idProviderStub.getNextId()).willReturn("message-id");
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new MessagesController(messageRepositoryMock, idProviderStub, 123)).build();

        mockMvc.perform(post("/api/messages")
                .content("{\n" +
                        "  \"text\": \"message-text\",\n" +
                        "  \"timestamp\": 456\n" +
                        "}")
                .contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.text", is("message-text")));
        verify(messageRepositoryMock).save(new Message("message-id", "message-text", 456L));
    }
}