package io.github.mamachanko.messagesservices;

import org.junit.Test;

import static org.assertj.core.api.Java6Assertions.assertThat;

public class IdProviderTest {

    @Test
    public void returnsNonNullId() {
        IdProvider idProvider = new IdProvider();

        assertThat(idProvider.getNextId()).isNotNull();
    }

    @Test
    public void returnsUniqueIds() {
        IdProvider idProvider = new IdProvider();

        assertThat(idProvider.getNextId()).isNotEqualTo(idProvider.getNextId());
    }
}