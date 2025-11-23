package com.krawl;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class KrawlBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(KrawlBackendApplication.class, args);
	}

}
