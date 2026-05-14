package com.gastrocontrol.domain.entity;

import com.gastrocontrol.domain.enums.RoleTipo;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entidade que representa um usuário do sistema GastroControl.
 * Suporta soft delete e auditoria completa.
 */
@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id", callSuper = false)
@ToString(exclude = {"senha"})
public class Usuario extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(nullable = false, unique = true, length = 200)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "role_tipo")
    private RoleTipo role;

    @Column(nullable = false)
    @Builder.Default
    private Boolean ativo = true;

    @Column(length = 20)
    private String telefone;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(name = "ultimo_login")
    private LocalDateTime ultimoLogin;
}
