import { CategoriaId, NivelCategoria } from "../types";

interface TextoNivel {
  analise: string;
  recomendacao: string;
}

interface DefinicaoCategoria {
  label: string;
  emoji: string;
  textos: Record<NivelCategoria, TextoNivel>;
}

/**
 * Textos 100% copiados dos blocos "Calculo personalizado" do Typebot
 * (variáveis mensagem_infertilidade, mensagem_hormonal, mensagem_sono...).
 * Nenhum texto aqui é gerado por IA — é exatamente o que já estava em
 * produção, só que agora vive em código versionado em vez de dentro do
 * editor visual do Typebot.
 */
export const CATEGORIAS: Record<CategoriaId, DefinicaoCategoria> = {
  fatores_infertilidade: {
    label: "Fatores de Infertilidade",
    emoji: "🔬",
    textos: {
      Alto: {
        analise:
          "Você não apresenta condições clínicas relevantes como endometriose, SOP, doenças autoimunes ou obstruções tubárias. Seu peso corporal também está dentro da faixa ideal, o que favorece a função hormonal e a ovulação.",
        recomendacao: "Continue mantendo seus hábitos atuais de alimentação e atividade física.",
      },
      Moderado: {
        analise:
          "Você não apresenta obstruções graves ou doenças autoimunes, mas há pequenos pontos de atenção (como idade, SOP leve ou sensibilidade alimentar) que podem afetar sua fertilidade sem sintomas claros.",
        recomendacao: "Acompanhamento clínico regular + dieta anti-inflamatória para blindar esse pilar.",
      },
      Baixo: {
        analise:
          "Vários marcadores alterados – como idade elevada, diagnósticos confirmados (SOP, endometriose) ou IMC fora da faixa ideal.",
        recomendacao:
          "Reavaliação com especialista em reprodução + abordagem integrativa com endocrinologista e nutricionista funcional.",
      },
    },
  },
  saude_hormonal: {
    label: "Saúde Hormonal",
    emoji: "🧪",
    textos: {
      Alto: {
        analise:
          "Seus hormônios-chave (FSH, AMH, progesterona) estão bem regulados ou dentro de parâmetros esperados para sua idade.",
        recomendacao: "Mantenha seu acompanhamento hormonal periódico.",
      },
      Moderado: {
        analise: "FSH e AMH em níveis médios, possível progesterona baixa na fase lútea.",
        recomendacao: "Ajustes alimentares + fitoterapia + rastreio com endocrino/GO.",
      },
      Baixo: {
        analise: "FSH, AMH ou progesterona estão abaixo do ideal.",
        recomendacao:
          "Suplementação direcionada e estratégia alimentar rica em colina, gorduras boas, vitamina D3, selênio e zinco.",
      },
    },
  },
  qualidade_sono: {
    label: "Qualidade do Sono",
    emoji: "😴",
    textos: {
      Alto: {
        analise:
          "Seu sono é consistente, profundo e restaurador. Poucas interrupções, boa duração (7–9h) e baixa incidência de insônia ou sonhos agitados.",
        recomendacao: "Mantenha sua rotina de higiene do sono: horários regulares e ambiente sem luz azul.",
      },
      Moderado: {
        analise:
          "Você dorme pouco ou acorda muitas vezes à noite, afetando o equilíbrio hormonal (cortisol, melatonina, progesterona).",
        recomendacao: "Rotina de higiene do sono + suplemento natural sob orientação.",
      },
      Baixo: {
        analise: "Sono fragmentado, curto ou agitado.",
        recomendacao: "Estabeleça rotina noturna com luz baixa, evite telas 1h antes de dormir e use infusões calmantes.",
      },
    },
  },
  atividade_fisica: {
    label: "Atividade Física",
    emoji: "🏃",
    textos: {
      Alto: {
        analise: "Você se movimenta regularmente com treinos equilibrados (força + aeróbico), sem excessos.",
        recomendacao: "Continue com seu equilíbrio de exercícios e frequência semanal.",
      },
      Moderado: {
        analise: "Você se movimenta, mas o treino pode não estar bem distribuído ou a frequência é baixa.",
        recomendacao: "3x/semana com equilíbrio entre força e leve cardio (caminhada, dança, funcional leve).",
      },
      Baixo: {
        analise: "Sedentarismo ou exercício isolado e não adaptado.",
        recomendacao: "Comece com caminhadas diárias + alongamento e yoga hormonal.",
      },
    },
  },
  alimentacao: {
    label: "Alimentação",
    emoji: "🍽️",
    textos: {
      Alto: {
        analise: "Dieta rica em fibras, vegetais e proteínas de boa qualidade, com baixo consumo de ultraprocessados.",
        recomendacao: "Mantenha esse padrão e foque em alimentos anti-inflamatórios.",
      },
      Moderado: {
        analise: "Você já tem boas escolhas, mas ainda consome ultraprocessados ou falta fibra e proteína.",
        recomendacao: "Planejamento de refeições férteis (colina, ômega-3, sementes) + regularidade.",
      },
      Baixo: {
        analise: "Alta presença de industrializados e baixo consumo de fibras, vegetais e proteínas.",
        recomendacao: "Dieta anti-inflamatória com vegetais frescos, sementes, ovos caipiras e carnes magras.",
      },
    },
  },
  saude_intestinal: {
    label: "Saúde Intestinal",
    emoji: "💩",
    textos: {
      Alto: {
        analise: "Evacuações regulares, ausência de inchaço e gases. Sem histórico relevante de disbiose.",
        recomendacao: "Mantenha ingestão adequada de fibras e hidratação.",
      },
      Moderado: {
        analise: "Evacuação irregular ou sintomas leves indicam necessidade de reequilíbrio da microbiota.",
        recomendacao: "Pré e probióticos, água e fibras; evite medicamentos que afetem o intestino.",
      },
      Baixo: {
        analise: "Evacuação irregular, gases e histórico de disbiose.",
        recomendacao: "Uso de probióticos, fibras solúveis e redução de FODMAPs; introduza fermentados.",
      },
    },
  },
  figado: {
    label: "Fígado e Detoxificação",
    emoji: "🧬",
    textos: {
      Alto: {
        analise: "Sem sinais de sobrecarga hepática ou uso crônico de medicamentos.",
        recomendacao: "Continue apoio hepático leve: chás amargos e hidratação.",
      },
      Moderado: {
        analise: "Histórico de TPM intensa ou acne indica sobrecarga leve no fígado.",
        recomendacao: "Chás de dente-de-leão, boldo e pausa em estimulantes.",
      },
      Baixo: {
        analise: "Sinais de sobrecarga (TPM intensa, acne, cansaço).",
        recomendacao: "Detox suave, vegetais amargos e suplementos hepáticos.",
      },
    },
  },
  imunidade: {
    label: "Imunidade e Inflamação",
    emoji: "🛡️",
    textos: {
      Alto: {
        analise: "Baixa frequência de infecções e bons marcadores inflamatórios.",
        recomendacao: "Mantenha dieta anti-inflamatória e sono restaurador.",
      },
      Moderado: {
        analise: "Infecções recorrentes ou leves alterações em exames.",
        recomendacao: "Atividade física regular, dieta anti-inflamatória e jejum leve.",
      },
      Baixo: {
        analise: "Inflamação moderada a alta (sintomas ou exames).",
        recomendacao: "Reduza açúcares e ultraprocessados; inclua antioxidantes.",
      },
    },
  },
  estresse: {
    label: "Estresse e Eixo HPA",
    emoji: "😣",
    textos: {
      Alto: {
        analise: "Baixa ansiedade e bom manejo emocional no dia a dia.",
        recomendacao: "Continue práticas de relaxamento e pausas regulares.",
      },
      Moderado: {
        analise: "Estresse frequente, ansiedade ou cansaço mental/físico.",
        recomendacao: "Respiração consciente diária, meditação guiada e pausa digital.",
      },
      Baixo: {
        analise: "Alta exaustão mental, insônia ou ansiedade.",
        recomendacao: "Pausas diárias, terapia e atividades prazerosas.",
      },
    },
  },
  ciclo: {
    label: "Ciclo Menstrual e Ovulação",
    emoji: "🩸",
    textos: {
      Alto: {
        analise: "Ciclos regulares com ovulação confirmada.",
        recomendacao: "Continue monitorando sinais de ovulação regularmente.",
      },
      Moderado: {
        analise: "Ciclo irregular ou fluxo alterado; ovulação incerta.",
        recomendacao: "Diário de ciclo, testes de LH e ajustes alimentares.",
      },
      Baixo: {
        analise: "Ciclo ausente ou sem ovulação confirmada.",
        recomendacao: "Rastreamento com testes de temperatura e mucos; suplementos.",
      },
    },
  },
  tireoide: {
    label: "Tireoide",
    emoji: "🧠",
    textos: {
      Alto: {
        analise: "TSH em faixa ideal (<2,5) sem sinais de disfunção.",
        recomendacao: "Mantenha acompanhamento endócrino e dieta rica em selênio.",
      },
      Moderado: {
        analise: "TSH acima de 2,5 pode interferir na fertilidade.",
        recomendacao: "Reavaliação com endocrino e ajuste de iodo e selênio.",
      },
      Baixo: {
        analise: "TSH alterado (>2,5) indicando disfunção.",
        recomendacao: "Exames completos e suporte nutricional com selênio natural.",
      },
    },
  },
  toxinas: {
    label: "Toxinas Ambientais",
    emoji: "☢️",
    textos: {
      Alto: {
        analise: "Baixa exposição a disruptores endócrinos.",
        recomendacao: "Continue evitando plásticos e usando filtros de água.",
      },
      Moderado: {
        analise: "Exposição moderada a cosméticos e plásticos.",
        recomendacao: "Troque cosméticos e evite plástico em alimentos quentes.",
      },
      Baixo: {
        analise: "Alta exposição a toxinas domésticas.",
        recomendacao: "Detox do lar, cosméticos limpos e utensílios de vidro/inox.",
      },
    },
  },
  historico: {
    label: "Histórico Familiar",
    emoji: "👩‍👩‍👧",
    textos: {
      Alto: {
        analise: "Sem histórico familiar de infertilidade.",
        recomendacao: "Continue exames preventivos periódicos.",
      },
      Moderado: {
        analise: "Casos familiares indicam predisposição genética.",
        recomendacao: "Atenção preventiva e acompanhamento regular.",
      },
      Baixo: {
        analise: "Histórico familiar de infertilidade presente.",
        recomendacao: "Proatividade em exames e compartilhamento de histórico.",
      },
    },
  },
};
