package com.idrp.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@org.springframework.scheduling.annotation.EnableAsync
public class IdrpBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(IdrpBackendApplication.class, args);
	}
}
