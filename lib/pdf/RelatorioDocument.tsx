import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { ResultadoRelatorio, ResultadoCategoria, IndicadorRisco, ItemPlanoAcao } from "../types";
import { CLASSIFICACAO_GERAL } from "../conteudo/classificacao-geral";
import { GRUPOS_TEMATICOS } from "../conteudo/grupos";
import { CORES, corPorNivel } from "./theme";
import { semEmoji } from "./sem-emoji";
import { CategoriaIcone, IconeShield } from "./icons";
import { GaugeCircular, RankingCategorias } from "./charts";

const styles = StyleSheet.create({
  page: {
    paddingTop: 64,
    paddingBottom: 50,
    paddingHorizontal: 40,
    fontSize: 10.5,
    color: CORES.cinzaTexto,
    fontFamily: "Helvetica",
  },
  // ---------- masthead (cabeçalho das páginas internas) ----------
  masthead: {
    position: "absolute",
    top: 24,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: CORES.bordaCard,
    paddingBottom: 8,
  },
  mastheadMarca: { fontSize: 9, fontFamily: "Helvetica-Bold", color: CORES.rosa, letterSpacing: 0.5 },
  mastheadDireita: { alignItems: "flex-end" },
  mastheadNome: { fontSize: 8.5, color: CORES.cinzaClaro },
  mastheadPagina: { fontSize: 7, color: CORES.cinzaClaro, marginTop: 1 },
  // ---------- capa ----------
  capaSelo: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: CORES.rosa,
    letterSpacing: 2,
    marginBottom: 10,
  },
  capaTitulo: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: CORES.cinzaTexto,
    marginBottom: 6,
  },
  capaSubtitulo: {
    fontSize: 11,
    color: CORES.cinzaClaro,
    marginBottom: 36,
  },
  capaGaugeWrap: { alignItems: "center", marginBottom: 28 },
  capaClassificacao: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    marginTop: 14,
    marginBottom: 14,
    textAlign: "center",
  },
  capaParagrafo: {
    fontSize: 10.5,
    lineHeight: 1.6,
    textAlign: "center",
    color: CORES.cinzaTexto,
    maxWidth: 380,
    alignSelf: "center",
  },
  capaRodapeInfo: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 28,
    marginTop: 40,
    paddingTop: 16,
    borderTopWidth: 0.5,
    borderTopColor: CORES.bordaCard,
  },
  capaRodapeBloco: { alignItems: "center" },
  capaRodapeNumero: { fontSize: 13, fontFamily: "Helvetica-Bold", color: CORES.cinzaTexto },
  capaRodapeLabel: { fontSize: 7.5, color: CORES.cinzaClaro, marginTop: 2 },
  // ---------- seções genéricas ----------
  secaoTitulo: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    color: CORES.cinzaTexto,
    marginBottom: 6,
  },
  secaoIntro: {
    fontSize: 9.8,
    lineHeight: 1.5,
    color: CORES.cinzaClaro,
    marginBottom: 18,
    maxWidth: 460,
  },
  paragrafo: {
    fontSize: 10.5,
    lineHeight: 1.55,
    marginBottom: 8,
    color: CORES.cinzaTexto,
  },
  // ---------- pontos de atenção ----------
  riscoCard: {
    flexDirection: "row",
    gap: 10,
    borderLeftWidth: 2.5,
    borderLeftColor: CORES.vermelhoBaixo,
    backgroundColor: CORES.vermelhoBaixoBg,
    borderRadius: 4,
    padding: 12,
    marginBottom: 10,
  },
  riscoCardAtencao: { borderLeftColor: CORES.amareloModerado, backgroundColor: CORES.amareloModeradoBg },
  riscoIconeWrap: { paddingTop: 1 },
  riscoTitulo: { fontSize: 10.5, fontFamily: "Helvetica-Bold", marginBottom: 3 },
  riscoTexto: { fontSize: 9.5, lineHeight: 1.45, color: CORES.cinzaTexto },
  riscoSelo: { fontSize: 7, fontFamily: "Helvetica-Bold", letterSpacing: 0.8, marginBottom: 4 },
  // ---------- grupos temáticos ----------
  grupoFaixa: {
    backgroundColor: CORES.fundoCard,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 22,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: CORES.bordaCard,
  },
  grupoTitulo: { fontSize: 12, fontFamily: "Helvetica-Bold", color: CORES.rosa, marginBottom: 3 },
  grupoDescricao: { fontSize: 9, lineHeight: 1.4, color: CORES.cinzaClaro },
  gradeCategorias: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  categoriaCard: {
    width: "48.5%",
    backgroundColor: CORES.branco,
    borderWidth: 0.5,
    borderColor: CORES.bordaCard,
    borderRadius: 7,
    padding: 11,
    marginBottom: 12,
  },
  categoriaHeader: { flexDirection: "row", alignItems: "center", marginBottom: 7 },
  categoriaIconeWrap: {
    width: 24,
    height: 24,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
  },
  categoriaTituloBloco: { flexGrow: 1 },
  categoriaTitulo: { fontSize: 9.8, fontFamily: "Helvetica-Bold", color: CORES.cinzaTexto },
  categoriaNivel: { fontSize: 8, fontFamily: "Helvetica-Bold", marginTop: 1 },
  categoriaBarraFundo: { height: 5, borderRadius: 2.5, backgroundColor: CORES.bordaCard, marginBottom: 8 },
  categoriaBarraPreenchida: { height: 5, borderRadius: 2.5, position: "absolute", top: 0, left: 0 },
  categoriaTexto: { fontSize: 8.7, lineHeight: 1.42, color: CORES.cinzaTexto, marginBottom: 5 },
  categoriaRecLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: CORES.cinzaClaro, marginBottom: 2 },
  // ---------- plano de ação ----------
  planoIntro: { fontSize: 9.8, lineHeight: 1.5, color: CORES.cinzaClaro, marginBottom: 16, maxWidth: 460 },
  planoItem: { flexDirection: "row", marginBottom: 13, gap: 12 },
  planoNumero: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  planoNumeroTexto: { fontSize: 10, fontFamily: "Helvetica-Bold", color: CORES.branco },
  planoTextoBloco: { flexGrow: 1, paddingTop: 1 },
  planoTitulo: { fontSize: 10.3, fontFamily: "Helvetica-Bold", color: CORES.cinzaTexto, marginBottom: 2 },
  planoTexto: { fontSize: 9.3, lineHeight: 1.45, color: CORES.cinzaTexto },
  planoEncerramento: {
    marginTop: 14,
    padding: 14,
    backgroundColor: CORES.fundoCard,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: CORES.bordaCard,
  },
  planoEncerramentoTexto: { fontSize: 9.3, lineHeight: 1.5, color: CORES.cinzaTexto },
  // ---------- rodapé / paginação ----------
  rodape: {
    position: "absolute",
    bottom: 22,
    left: 40,
    right: 40,
    fontSize: 7,
    color: CORES.cinzaClaro,
    textAlign: "center",
    borderTopWidth: 0.5,
    borderTopColor: CORES.bordaCard,
    paddingTop: 7,
  },
});

function Masthead({ nome }: { nome: string }) {
  return (
    <View style={styles.masthead} fixed>
      <Text style={styles.mastheadMarca}>MAPA DA FERTILIDADE</Text>
      <View style={styles.mastheadDireita}>
        <Text style={styles.mastheadNome}>{nome}</Text>
        <Text style={styles.mastheadPagina} render={({ pageNumber, totalPages }) => `página ${pageNumber} de ${totalPages}`} />
      </View>
    </View>
  );
}

function Rodape() {
  return (
    <Text style={styles.rodape} fixed>
      Relatório educativo, gerado a partir das respostas informadas pela usuária. Não substitui consulta,
      diagnóstico ou tratamento médico.
    </Text>
  );
}

function CardRisco({ indicador }: { indicador: IndicadorRisco }) {
  const isAlerta = indicador.severidade === "alerta";
  const cor = isAlerta ? CORES.vermelhoBaixo : CORES.amareloModerado;
  return (
    <View style={[styles.riscoCard, ...(!isAlerta ? [styles.riscoCardAtencao] : [])]} wrap={false}>
      <View style={styles.riscoIconeWrap}>
        <IconeShield cor={cor} tamanho={15} />
      </View>
      <View style={{ flexGrow: 1 }}>
        <Text style={[styles.riscoSelo, { color: cor }]}>{isAlerta ? "ALERTA CLÍNICO" : "PONTO DE ATENÇÃO"}</Text>
        <Text style={styles.riscoTitulo}>{indicador.titulo}</Text>
        <Text style={styles.riscoTexto}>{indicador.mensagem}</Text>
      </View>
    </View>
  );
}

function CardCategoria({ categoria }: { categoria: ResultadoCategoria }) {
  const { cor, fundo } = corPorNivel(categoria.nivel);
  return (
    <View style={styles.categoriaCard} wrap={false}>
      <View style={styles.categoriaHeader}>
        <View style={[styles.categoriaIconeWrap, { backgroundColor: fundo }]}>
          <CategoriaIcone id={categoria.id} cor={cor} tamanho={14} />
        </View>
        <View style={styles.categoriaTituloBloco}>
          <Text style={styles.categoriaTitulo}>{categoria.label}</Text>
          <Text style={[styles.categoriaNivel, { color: cor }]}>{categoria.nivel}</Text>
        </View>
      </View>

      <View style={styles.categoriaBarraFundo}>
        <View
          style={[
            styles.categoriaBarraPreenchida,
            { width: `${Math.max(2, Math.min(100, categoria.percentual))}%`, backgroundColor: cor },
          ]}
        />
      </View>

      <Text style={styles.categoriaTexto}>{categoria.analise}</Text>
      <Text style={styles.categoriaRecLabel}>RECOMENDAÇÃO</Text>
      <Text style={styles.categoriaTexto}>{categoria.recomendacao}</Text>
    </View>
  );
}

function ItemPlano({ item, indice }: { item: ItemPlanoAcao; indice: number }) {
  const cor = item.prioridade === 0 ? CORES.vermelhoBaixo : item.prioridade <= 2 ? CORES.amareloModerado : CORES.rosa;
  return (
    <View style={styles.planoItem} wrap={false}>
      <View style={[styles.planoNumero, { backgroundColor: cor }]}>
        <Text style={styles.planoNumeroTexto}>{indice}</Text>
      </View>
      <View style={styles.planoTextoBloco}>
        <Text style={styles.planoTitulo}>{item.titulo}</Text>
        <Text style={styles.planoTexto}>{item.texto}</Text>
      </View>
    </View>
  );
}

export function RelatorioDocument({ resultado }: { resultado: ResultadoRelatorio }) {
  const { cor } = corPorNivel(resultado.nivelGeral);
  const textoGeral = CLASSIFICACAO_GERAL[resultado.nivelGeral];
  const dataHoje = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date());

  const itensRanking = [...resultado.categorias]
    .sort((a, b) => a.percentual - b.percentual)
    .map((c) => ({ label: c.label, percentual: c.percentual, cor: corPorNivel(c.nivel).cor }));

  const temRiscos = resultado.indicadoresRisco.length > 0;

  return (
    <Document title={`Mapa da Fertilidade — ${resultado.nome}`} author="Mapa da Fertilidade">
      {/* PÁGINA 1 — CAPA */}
      <Page size="A4" style={[styles.page, { paddingTop: 70 }]}>
        <Text style={styles.capaSelo}>RELATÓRIO PERSONALIZADO</Text>
        <Text style={styles.capaTitulo}>Mapa da Fertilidade</Text>
        <Text style={styles.capaSubtitulo}>
          {resultado.nome} · {dataHoje}
        </Text>

        <View style={[styles.capaGaugeWrap, { marginTop: 30 }]}>
          <GaugeCircular percentual={resultado.percentual} cor={cor} rotulo="taxa de fertilidade" />
        </View>

        <Text style={[styles.capaClassificacao, { color: cor }]}>{semEmoji(textoGeral.titulo)}</Text>
        <Text style={styles.capaParagrafo}>{textoGeral.paragrafos[0]}</Text>

        <View style={{ flexGrow: 1 }} />

        <View style={styles.capaRodapeInfo}>
          <View style={styles.capaRodapeBloco}>
            <Text style={styles.capaRodapeNumero}>{resultado.pontuacaoTotal.toFixed(0)}</Text>
            <Text style={styles.capaRodapeLabel}>PONTOS DE {resultado.pontuacaoMaxima}</Text>
          </View>
          <View style={styles.capaRodapeBloco}>
            <Text style={styles.capaRodapeNumero}>13</Text>
            <Text style={styles.capaRodapeLabel}>PILARES AVALIADOS</Text>
          </View>
          <View style={styles.capaRodapeBloco}>
            <Text style={[styles.capaRodapeNumero, { color: temRiscos ? CORES.vermelhoBaixo : CORES.verdeAlto }]}>
              {resultado.indicadoresRisco.length}
            </Text>
            <Text style={styles.capaRodapeLabel}>PONTOS DE ATENÇÃO</Text>
          </View>
        </View>

        <Rodape />
      </Page>

      {/* PÁGINA 2 — VISÃO GERAL (gráfico comparativo) */}
      <Page size="A4" style={styles.page}>
        <Masthead nome={resultado.nome} />

        <Text style={styles.secaoTitulo}>Visão geral por categoria</Text>
        <Text style={styles.secaoIntro}>
          Os 13 pilares avaliados, ordenados do que mais precisa de atenção para o que já está mais
          consolidado. Use este panorama para decidir por onde começar — o detalhamento de cada pilar vem
          nas próximas páginas.
        </Text>

        <RankingCategorias itens={itensRanking} />

        <Rodape />
      </Page>

      {/* PÁGINA 3 — PONTOS DE ATENÇÃO ESPECÍFICOS (só se houver) */}
      {temRiscos && (
        <Page size="A4" style={styles.page}>
          <Masthead nome={resultado.nome} />

          <Text style={styles.secaoTitulo}>Pontos de atenção específicos</Text>
          <Text style={styles.secaoIntro}>
            Identificados a partir de respostas específicas suas — aparecem aqui independentemente da sua
            classificação geral, porque merecem atenção mesmo quando o restante do seu mapa está
            equilibrado.
          </Text>

          {resultado.indicadoresRisco.map((indicador) => (
            <CardRisco key={indicador.id} indicador={indicador} />
          ))}

          <Rodape />
        </Page>
      )}

      {/* PÁGINA(S) — DETALHAMENTO POR GRUPO TEMÁTICO */}
      <Page size="A4" style={styles.page}>
        <Masthead nome={resultado.nome} />

        <Text style={styles.secaoTitulo}>Detalhamento por pilar</Text>
        <Text style={styles.secaoIntro}>
          Os mesmos 13 pilares do panorama anterior, agora organizados por tema e com a análise completa de
          cada um.
        </Text>

        {GRUPOS_TEMATICOS.map((grupo) => {
          const categoriasDoGrupo = grupo.categorias.map(
            (id) => resultado.categorias.find((c) => c.id === id)!
          );
          return (
            <View key={grupo.id}>
              <View style={styles.grupoFaixa} wrap={false}>
                <Text style={styles.grupoTitulo}>{grupo.titulo}</Text>
                <Text style={styles.grupoDescricao}>{grupo.descricao}</Text>
              </View>
              <View style={styles.gradeCategorias}>
                {categoriasDoGrupo.map((categoria) => (
                  <CardCategoria key={categoria.id} categoria={categoria} />
                ))}
              </View>
            </View>
          );
        })}

        <Rodape />
      </Page>

      {/* PÁGINA FINAL — PLANO DE AÇÃO CONSOLIDADO */}
      <Page size="A4" style={styles.page}>
        <Masthead nome={resultado.nome} />

        <Text style={styles.secaoTitulo}>Seu plano de ação</Text>
        <Text style={styles.planoIntro}>
          Uma síntese do que priorizar agora, juntando os pontos de atenção específicos com os pilares que
          mais precisam de cuidado — começando pelo mais urgente.
        </Text>

        {resultado.planoDeAcao.length > 0 ? (
          resultado.planoDeAcao.map((item, i) => <ItemPlano key={item.titulo + i} item={item} indice={i + 1} />)
        ) : (
          <Text style={styles.paragrafo}>
            Nenhum ponto crítico identificado nas suas respostas — seu mapa está bem equilibrado. Siga as
            recomendações de manutenção descritas em cada pilar no detalhamento.
          </Text>
        )}

        <View style={styles.planoEncerramento} wrap={false}>
          <Text style={styles.planoEncerramentoTexto}>
            Este relatório é um retrato do momento atual a partir das suas respostas — não um diagnóstico.
            Leve-o para sua próxima consulta como ponto de partida para uma conversa mais direcionada com
            seu médico ou especialista.
          </Text>
        </View>

        <Rodape />
      </Page>
    </Document>
  );
}
