package com.gastrocontrol;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Classe principal do GastroControl Backend.
 * Sistema SaaS de gestão gastronômica para pequenos e médios restaurantes.
 *
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAwareImpl")
@EnableCaching
@EnableAsync
@EnableScheduling
public class GastroControlApplication {

    public static void main(String[] args) {
        SpringApplication.run(GastroControlApplication.class, args);
    }
}
