package com.RouteSphere.REST;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RestApplication {

	public static void main(String[] args) {
		System.out.println(">>> main() entered");
		try {
			SpringApplication.run(RestApplication.class, args);
		} catch (Throwable t) {
			t.printStackTrace();
		}
		System.out.println(">>> main() exiting normally");
	}
}
