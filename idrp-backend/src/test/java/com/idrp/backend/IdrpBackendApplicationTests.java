package com.idrp.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

/**
 * Boots the whole application against a fresh PostgreSQL: Flyway applies every
 * migration and Hibernate (ddl-auto=validate) fails the context if an entity and the
 * migrated schema disagree.
 */
@SpringBootTest
@Import(TestcontainersConfiguration.class)
class IdrpBackendApplicationTests {

	@Test
	void contextLoadsAndSchemaMatchesEntities() {
	}

}
