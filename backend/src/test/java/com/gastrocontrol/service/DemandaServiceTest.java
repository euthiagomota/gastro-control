package com.gastrocontrol.service;

import com.gastrocontrol.domain.entity.*;
import com.gastrocontrol.domain.enums.*;
import com.gastrocontrol.dto.demanda.*;
import com.gastrocontrol.exception.RegraDeNegocioException;
import com.gastrocontrol.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Testes unitários do DemandaService - regra de negócio principal do GastroControl.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("DemandaService - Testes Unitários")
class DemandaServiceTest {

    @Mock private DemandaRepository demandaRepository;
    @Mock private PratoRepository pratoRepository;
    @Mock private FichaTecnicaRepository fichaTecnicaRepository;
    @Mock private EstoqueRepository estoqueRepository;
    @Mock private ListaComprasRepository listaComprasRepository;
    @Mock private ItemCompraRepository itemCompraRepository;
    @Mock private MovimentacaoEstoqueRepository movimentacaoRepository;

    @InjectMocks
    private DemandaService demandaService;

    private Prato prato;
    private Ingrediente ingrediente;
    private FichaTecnica fichaTecnica;
    private Demanda demanda;
    private DemandaPrato demandaPrato;
    private Estoque estoque;

    @BeforeEach
    void setUp() {
        // Setup security context mock
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("admin@test.com");
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(securityContext);

        // Ingrediente
        ingrediente = Ingrediente.builder()
                .id(1L)
                .nome("Frango")
                .unidadeMedida(UnidadeMedida.KG)
                .custoUnitario(new BigDecimal("12.90"))
                .categoriaRisco(CategoriaRisco.MEDIO)
                .ativo(true)
                .deleted(false)
                .build();

        // Prato
        prato = Prato.builder()
                .id(1L)
                .nome("Frango Grelhado")
                .categoria(CategoriaPrato.PRATO_PRINCIPAL)
                .ativo(true)
                .deleted(false)
                .porcoes(1)
                .build();

        // Ficha Técnica: 0.35kg de frango por porção, fator de correção 1.15
        fichaTecnica = FichaTecnica.builder()
                .id(1L)
                .prato(prato)
                .ingrediente(ingrediente)
                .qtdPorPorcao(new BigDecimal("0.35"))
                .fatorCorrecao(new BigDecimal("1.15"))
                .unidade(UnidadeMedida.KG)
                .build();

        // Demanda com 10 porções do prato
        demandaPrato = DemandaPrato.builder()
                .id(1L)
                .prato(prato)
                .quantidade(10)
                .build();

        demanda = Demanda.builder()
                .id(1L)
                .titulo("Demanda Teste")
                .dataInicio(LocalDate.now())
                .tipo(DemandaTipo.DIARIA)
                .status(DemandaStatus.PENDENTE)
                .deleted(false)
                .build();
        demanda.getDemandaPratos().add(demandaPrato);
        demandaPrato.setDemanda(demanda);

        // Estoque com 5kg disponíveis
        estoque = Estoque.builder()
                .id(1L)
                .ingrediente(ingrediente)
                .qtdDisponivel(new BigDecimal("5.0"))
                .qtdMinima(new BigDecimal("2.0"))
                .lote("LOTE-001")
                .build();
    }

    @Test
    @DisplayName("Deve calcular déficit corretamente ao processar demanda")
    void processarDemanda_DeveCalcularDeficitCorretamente() {
        // Given
        // 10 porções × 0.35kg × fator 1.15 = 4.025kg necessários
        // Estoque: 5.0kg → SEM déficit na verdade
        // Vamos testar com estoque insuficiente: 2.0kg

        when(demandaRepository.findByIdWithPratos(1L)).thenReturn(Optional.of(demanda));
        when(fichaTecnicaRepository.findAllByPratoIdWithIngrediente(1L))
                .thenReturn(List.of(fichaTecnica));
        when(estoqueRepository.sumQtdDisponivelByIngredienteId(1L))
                .thenReturn(new BigDecimal("2.0")); // apenas 2kg disponível
        when(listaComprasRepository.save(any())).thenReturn(
                ListaCompras.builder().id(1L).titulo("Test").build());
        when(estoqueRepository.findAllByIngredienteId(1L)).thenReturn(List.of(estoque));

        // When
        ResultadoProcessamentoDemanda resultado = demandaService.processarDemanda(1L);

        // Then
        assertThat(resultado).isNotNull();
        assertThat(resultado.getTotalIngredientes()).isEqualTo(1);
        assertThat(resultado.getTotalItensComDeficit()).isEqualTo(1);
        assertThat(resultado.isListaComprasGerada()).isTrue();

        // Verificar cálculo: 10 × 0.35 × 1.15 = 4.025kg necessários
        ItemDeficit deficit = resultado.getItensComDeficit().get(0);
        assertThat(deficit.getQtdNecessaria()).isEqualByComparingTo(new BigDecimal("4.0250"));
        // Déficit = 4.025 - 2.0 = 2.025
        assertThat(deficit.getDeficit()).isEqualByComparingTo(new BigDecimal("2.0250"));

        verify(demandaRepository).save(argThat(d ->
                d.getStatus() == DemandaStatus.PROCESSADA));
    }

    @Test
    @DisplayName("Não deve ter déficit quando estoque é suficiente")
    void processarDemanda_SemDeficitQuandoEstoqueSuficiente() {
        // Given - 10 × 0.35 × 1.15 = 4.025kg necessários, estoque: 10kg
        when(demandaRepository.findByIdWithPratos(1L)).thenReturn(Optional.of(demanda));
        when(fichaTecnicaRepository.findAllByPratoIdWithIngrediente(1L))
                .thenReturn(List.of(fichaTecnica));
        when(estoqueRepository.sumQtdDisponivelByIngredienteId(1L))
                .thenReturn(new BigDecimal("10.0")); // 10kg disponível (suficiente)

        // When
        ResultadoProcessamentoDemanda resultado = demandaService.processarDemanda(1L);

        // Then
        assertThat(resultado.getTotalItensComDeficit()).isZero();
        assertThat(resultado.isListaComprasGerada()).isFalse();

        // Não deve gerar lista de compras
        verify(listaComprasRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar processar demanda já processada")
    void processarDemanda_DeveRejeitarDemandaJaProcessada() {
        // Given
        demanda.setStatus(DemandaStatus.PROCESSADA);
        when(demandaRepository.findByIdWithPratos(1L)).thenReturn(Optional.of(demanda));

        // When & Then
        assertThatThrownBy(() -> demandaService.processarDemanda(1L))
                .isInstanceOf(RegraDeNegocioException.class)
                .hasMessageContaining("já foi processada");
    }

    @Test
    @DisplayName("Deve consolidar ingredientes repetidos entre pratos")
    void processarDemanda_DeveConsolidarIngredientesRepetidos() {
        // Given - mesmo ingrediente em 2 pratos diferentes da mesma demanda
        Prato prato2 = Prato.builder().id(2L).nome("Prato 2")
                .ativo(true).deleted(false).porcoes(1).build();

        FichaTecnica ficha2 = FichaTecnica.builder()
                .id(2L)
                .prato(prato2)
                .ingrediente(ingrediente) // mesmo ingrediente!
                .qtdPorPorcao(new BigDecimal("0.20"))
                .fatorCorrecao(BigDecimal.ONE)
                .unidade(UnidadeMedida.KG)
                .build();

        DemandaPrato demandaPrato2 = DemandaPrato.builder()
                .id(2L).prato(prato2).quantidade(5).build(); // 5 porções

        demanda.getDemandaPratos().add(demandaPrato2);

        when(demandaRepository.findByIdWithPratos(1L)).thenReturn(Optional.of(demanda));
        when(fichaTecnicaRepository.findAllByPratoIdWithIngrediente(1L))
                .thenReturn(List.of(fichaTecnica));
        when(fichaTecnicaRepository.findAllByPratoIdWithIngrediente(2L))
                .thenReturn(List.of(ficha2));
        when(estoqueRepository.sumQtdDisponivelByIngredienteId(1L))
                .thenReturn(new BigDecimal("50.0")); // suficiente para não gerar déficit

        // When
        ResultadoProcessamentoDemanda resultado = demandaService.processarDemanda(1L);

        // Then - deve ter apenas 1 ingrediente consolidado
        assertThat(resultado.getTotalIngredientes()).isEqualTo(1);

        // Total necessário: (10 × 0.35 × 1.15) + (5 × 0.20 × 1.0) = 4.025 + 1.0 = 5.025
        NecessidadeIngrediente necessidade = resultado.getNecessidades().get(0);
        assertThat(necessidade.getQtdNecessaria()).isEqualByComparingTo(new BigDecimal("5.0250"));
    }

    @Test
    @DisplayName("Deve rejeitar finalizar demanda que não está processada")
    void finalizarDemanda_DeveRejeitarDemandaNaoProcessada() {
        // Given
        when(demandaRepository.findByIdWithPratos(1L)).thenReturn(Optional.of(demanda));
        // demanda está PENDENTE

        // When & Then
        assertThatThrownBy(() -> demandaService.finalizarDemanda(1L))
                .isInstanceOf(RegraDeNegocioException.class)
                .hasMessageContaining("PROCESSADA");
    }
}
