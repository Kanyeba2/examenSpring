package com.examen.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * Classe principale de l'application Spring Boot
 * Point d'entrée de l'application Examen Spring
 */
@SpringBootApplication
@ComponentScan(basePackages = {"com.examen"})
public class ExamenSpringApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExamenSpringApplication.class, args);
    }
}
