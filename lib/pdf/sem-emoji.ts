/**
 * As fontes padrão do PDF (Helvetica/Times/Courier, os "14 standard fonts")
 * não têm glyphs de emoji — o @react-pdf/renderer simplesmente não desenha
 * nada no lugar (fica um espaço em branco ou o caractere "some").
 *
 * Os textos em lib/conteudo/* são reaproveitados em outros canais também
 * (ex: mensagem de WhatsApp, onde emoji funciona normalmente), então não
 * faz sentido remover o emoji na fonte do conteúdo. Em vez disso, essa
 * função limpa o texto só no momento de desenhar no PDF.
 *
 * Se no futuro vocês quiserem emoji "de verdade" no PDF, dá pra registrar
 * uma fonte color-emoji (ex: Twemoji/Noto Color Emoji) via Font.register()
 * — mas isso aumenta o tamanho do PDF e a complexidade de build, então por
 * ora optei por um visual mais "editorial" (cores e ícones geométricos) em
 * vez de depender de emoji no documento.
 */
const REGEX_EMOJI =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\uFE0F\u200D]/gu;

export function semEmoji(texto: string): string {
  return texto.replace(REGEX_EMOJI, "").replace(/\s{2,}/g, " ").trim();
}
