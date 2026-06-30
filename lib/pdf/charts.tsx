import React from "react";
import { Svg, Circle, Path, Rect, Text as SvgText, G } from "@react-pdf/renderer";
import { CORES } from "./theme";

/**
 * A tipagem do @react-pdf/renderer para <Text> dentro de <Svg> não declara
 * `fontSize`/`fontFamily` (só os atributos de apresentação SVG "puros"),
 * mas o renderer aceita e respeita os dois normalmente — testado e
 * confirmado nos PDFs de exemplo gerados. Esse wrapper isola o cast de
 * tipo num único lugar em vez de espalhar `as any` pelo arquivo todo.
 */
function Texto(props: {
  x: number;
  y: number;
  fontSize: number;
  fontFamily?: string;
  fill: string;
  textAnchor?: "start" | "middle" | "end";
  children: React.ReactNode;
}) {
  const SvgTextAny = SvgText as unknown as React.ComponentType<Record<string, unknown>>;
  return <SvgTextAny {...props} />;
}

/** Converte um percentual (0-100) num arco de círculo SVG (path) */
function arcoPath(cx: number, cy: number, r: number, percentual: number) {
  const clamped = Math.max(0.001, Math.min(100, percentual));
  const angulo = (clamped / 100) * 360;
  const rad = (Math.PI / 180) * (angulo - 90);
  const x = cx + r * Math.cos(rad);
  const y = cy + r * Math.sin(rad);
  const largeArc = angulo > 180 ? 1 : 0;
  return `M ${cx} ${cy - r} A ${r} ${r} 0 ${largeArc} 1 ${x} ${y}`;
}

/** Gauge circular grande usado na capa: anel de progresso + número no centro */
export function GaugeCircular({
  percentual,
  cor,
  rotulo,
  tamanho = 168,
}: {
  percentual: number;
  cor: string;
  rotulo: string;
  tamanho?: number;
}) {
  const r = tamanho / 2 - 14;
  const cx = tamanho / 2;
  const cy = tamanho / 2;

  return (
    <Svg viewBox={`0 0 ${tamanho} ${tamanho}`} width={tamanho} height={tamanho}>
      <Circle cx={cx} cy={cy} r={r} stroke={CORES.bordaCard} strokeWidth={11} fill="none" />
      <Path d={arcoPath(cx, cy, r, percentual)} stroke={cor} strokeWidth={11} fill="none" strokeLinecap="round" />
      <Texto
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        fontSize={30}
        fontFamily="Helvetica-Bold"
        fill={cor}
      >
        {`${Math.round(percentual)}%`}
      </Texto>
      <Texto x={cx} y={cy + 16} textAnchor="middle" fontSize={9} fontFamily="Helvetica" fill={CORES.cinzaClaro}>
        {rotulo}
      </Texto>
    </Svg>
  );
}

export interface ItemRanking {
  label: string;
  percentual: number;
  cor: string;
}

/**
 * Ranking horizontal das 13 categorias — o "panorama geral" do relatório.
 * Desenhado como uma única tabela SVG (em vez de 13 Views separadas) pra
 * garantir alinhamento perfeito das barras e dos rótulos.
 */
export function RankingCategorias({ itens, largura = 515 }: { itens: ItemRanking[]; largura?: number }) {
  const alturaLinha = 27;
  const altura = itens.length * alturaLinha + 10;
  const colunaLabel = 168;
  const colunaValor = 34;
  const inicioBarra = colunaLabel;
  const larguraBarra = largura - colunaLabel - colunaValor;

  return (
    <Svg viewBox={`0 0 ${largura} ${altura}`} width={largura} height={altura}>
      {itens.map((item, i) => {
        const y = i * alturaLinha;
        const meioY = y + alturaLinha / 2;
        const largPreenchida = (Math.max(0, Math.min(100, item.percentual)) / 100) * larguraBarra;
        return (
          <G key={item.label}>
            <Texto
              x={0}
              y={meioY + 3}
              fontSize={9.5}
              fontFamily="Helvetica"
              fill={CORES.cinzaTexto}
            >
              {item.label}
            </Texto>
            <Rect
              x={inicioBarra}
              y={meioY - 6}
              width={larguraBarra}
              height={12}
              rx={3}
              fill={CORES.bordaCard}
            />
            <Rect
              x={inicioBarra}
              y={meioY - 6}
              width={largPreenchida}
              height={12}
              rx={3}
              fill={item.cor}
            />
            <Texto
              x={largura}
              y={meioY + 3}
              fontSize={9.5}
              fontFamily="Helvetica-Bold"
              fill={item.cor}
              textAnchor="end"
            >
              {`${Math.round(item.percentual)}%`}
            </Texto>
          </G>
        );
      })}
    </Svg>
  );
}
