package com.idrp.backend.controller;

import com.idrp.backend.TestcontainersConfiguration;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.greaterThan;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Seeds the real src/main/resources/seed/*.json into a fresh database, then reads every
 * public content endpoint the website uses, anonymously and with open-in-view off (as in
 * production). Catches seed/entity drift and lazy-collection serialization failures.
 */
@SpringBootTest(properties = "app.seed-static-data=true")
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
class PublicContentApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @ParameterizedTest(name = "GET {0}")
    @CsvSource({
            "/api/startups?size=500",
            "/api/startups?status=FUNDED&size=500",
            "/api/startups?domain=HEALTH_TECH&size=500",
            "/api/events?size=500",
            "/api/resources?type=NEWSLETTER&size=500",
            "/api/mentors?size=500",
            "/api/partners?size=500",
            "/api/team-members?size=500",
            "/api/board-members?size=500",
            "/api/impact-numbers?size=500",
            "/api/programs?size=500",
            "/api/nain-projects?size=500"
    })
    void publicListEndpointReturnsSeededContent(String url) throws Exception {
        mockMvc.perform(get(url))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalElements", greaterThan(0)));
    }

    @ParameterizedTest(name = "startup collections serialize: {0}")
    @CsvSource({"domains", "founders", "techFacultyMentors"})
    void startupCollectionsAreSerialized(String field) throws Exception {
        mockMvc.perform(get("/api/startups?size=500"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0]." + field).isArray());
    }

    @ParameterizedTest(name = "bad filter value {0} is a 400, not a 500")
    @CsvSource({"/api/startups?status=NOT_A_STATUS", "/api/startups?domain=NOT_A_DOMAIN"})
    void badFilterIsClientError(String url) throws Exception {
        mockMvc.perform(get(url)).andExpect(status().isBadRequest());
    }
}
