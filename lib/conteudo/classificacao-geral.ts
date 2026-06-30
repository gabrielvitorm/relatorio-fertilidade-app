import { NivelGeral } from "../types";

interface TextoClassificacaoGeral {
  titulo: string;
  paragrafos: string[];
}

/**
 * Textos copiados literalmente dos grupos "Etapa 2" do Typebot
 * (um grupo para cada classificação geral: Alta / Moderada / Baixa).
 */
export const CLASSIFICACAO_GERAL: Record<NivelGeral, TextoClassificacaoGeral> = {
  Alta: {
    titulo: "🎉 Resultado do seu Mapa da Fertilidade: FERTILIDADE ALTA",
    paragrafos: [
      "Parabéns! Seu corpo está dando sinais muito positivos de que está pronto para gerar.",
      "Você demonstrou um ótimo equilíbrio entre os principais pilares da saúde reprodutiva. Isso não significa perfeição — significa preparo, vitalidade e abertura fisiológica para conceber.",
    ],
  },
  Moderada: {
    titulo: "🎉 Resultado do seu Mapa da Fertilidade: FERTILIDADE MODERADA",
    paragrafos: [
      "Você está enraizada. Isso significa que muita coisa já está funcionando bem no seu corpo, mas alguns marcadores ainda pedem atenção, ajustes e fortalecimento.",
      "A boa notícia? Você já tem um terreno fértil. Agora é hora de nutrir, organizar e remover os obstáculos silenciosos para permitir que a vida floresça.",
    ],
  },
  Baixa: {
    titulo: "⚠️ Classificação: FERTILIDADE BAIXA",
    paragrafos: [
      "Seu corpo não está falhando. Ele está falando. E agora você pode finalmente ouvir com clareza onde estão os bloqueios que precisam ser cuidados.",
      "Este é o seu mapa. E ele vai te guiar na reconstrução.",
    ],
  },
};
