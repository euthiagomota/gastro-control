package com.gastrocontrol.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuração do Swagger/OpenAPI para documentação da API.
 */
@Configuration
public class SwaggerConfig {

    @Value("${server.servlet.context-path:/api}")
    private String contextPath;

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(apiInfo())
                .servers(List.of(
                        new Server().url("http://localhost:8080" + contextPath).description("Ambiente Local"),
                        new Server().url("https://api.gastrocontrol.com" + contextPath).description("Produção")
                ))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Insira o token JWT no formato: Bearer {token}")
                        )
                );
    }

    private Info apiInfo() {
        return new Info()
                .title("GastroControl API")
                .version("1.0.0")
                .description("""
                        ## GastroControl - API de Gestão Gastronômica
                        
                        Sistema SaaS para automação do planejamento de produção gastronômica.
                        
                        ### Fluxo Principal
                        1. **Demanda** → Previsão de produção com pratos e quantidades
                        2. **Cálculo** → Sistema calcula automaticamente ingredientes necessários
                        3. **Estoque** → Verifica disponibilidade e calcula déficit
                        4. **Compras** → Gera lista de compras automaticamente
                        5. **Relatórios** → Analytics e KPIs do restaurante
                        
                        ### Autenticação
                        Use o endpoint `/auth/login` para obter o token JWT.
                        """)
                .contact(new Contact()
                        .name("GastroControl Team")
                        .email("contato@gastrocontrol.com")
                        .url("https://gastrocontrol.com"))
                .license(new License()
                        .name("Proprietário")
                        .url("https://gastrocontrol.com/terms"));
    }
}
