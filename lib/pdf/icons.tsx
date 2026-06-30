import React from "react";
import { Svg, Path, Circle, Ellipse, Line, G } from "@react-pdf/renderer";
import { CategoriaId } from "../types";

/**
 * Ícones monoline desenhados à mão (sem depender de fonte de ícones nem de
 * emoji — nenhuma das duas funciona de forma confiável dentro de um PDF
 * gerado via @react-pdf/renderer). Cada ícone é um componente que recebe a
 * cor (já calculada a partir do nível Alto/Moderado/Baixo) e um tamanho.
 *
 * São desenhos propositalmente simples — o objetivo é dar identidade visual
 * rápida de reconhecer numa lista de 13 itens, não ilustração detalhada.
 */

interface IconeProps {
  cor: string;
  tamanho?: number;
}

const base = { fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function Escudo({ cor, tamanho = 18 }: IconeProps) {
  return (
    <Svg viewBox="0 0 24 24" width={tamanho} height={tamanho}>
      <Path
        d="M12 3 L20 6 V11 C20 16 16.5 19.5 12 21 C7.5 19.5 4 16 4 11 V6 Z"
        stroke={cor}
        strokeWidth={1.6}
        {...base}
      />
    </Svg>
  );
}

function Hexagono({ cor, tamanho = 18 }: IconeProps) {
  return (
    <Svg viewBox="0 0 24 24" width={tamanho} height={tamanho}>
      <Path
        d="M12 3 L20 7.5 V16.5 L12 21 L4 16.5 V7.5 Z"
        stroke={cor}
        strokeWidth={1.6}
        {...base}
      />
      <Circle cx={12} cy={12} r={2.4} stroke={cor} strokeWidth={1.4} fill="none" />
    </Svg>
  );
}

function Lua({ cor, tamanho = 18 }: IconeProps) {
  return (
    <Svg viewBox="0 0 24 24" width={tamanho} height={tamanho}>
      <Path
        d="M16.5 4 C12 4 9 7.6 9 12 C9 16.4 12 20 16.5 20 C13.2 20 10.4 16.5 10.4 12 C10.4 7.5 13.2 4 16.5 4 Z"
        stroke={cor}
        strokeWidth={1.6}
        {...base}
      />
    </Svg>
  );
}

function SetaProgresso({ cor, tamanho = 18 }: IconeProps) {
  return (
    <Svg viewBox="0 0 24 24" width={tamanho} height={tamanho}>
      <Path d="M4 17 L10 10 L14 13 L20 5" stroke={cor} strokeWidth={1.7} {...base} />
      <Path d="M14 5 H20 V11" stroke={cor} strokeWidth={1.7} {...base} />
    </Svg>
  );
}

function Folha({ cor, tamanho = 18 }: IconeProps) {
  return (
    <Svg viewBox="0 0 24 24" width={tamanho} height={tamanho}>
      <Path
        d="M5 19 C5 10 11 4 20 4 C20 13 14 19 5 19 Z"
        stroke={cor}
        strokeWidth={1.6}
        {...base}
      />
      <Path d="M5 19 C9 14 13 10 19 5" stroke={cor} strokeWidth={1.3} {...base} />
    </Svg>
  );
}

function Espiral({ cor, tamanho = 18 }: IconeProps) {
  return (
    <Svg viewBox="0 0 24 24" width={tamanho} height={tamanho}>
      <Path
        d="M12 4 C7 4 4 7.5 4 11.5 C4 15 6.6 17.5 9.8 17.5 C12.3 17.5 14 15.7 14 13.6 C14 11.8 12.8 10.4 11 10.4 C9.6 10.4 8.6 11.4 8.6 12.6"
        stroke={cor}
        strokeWidth={1.6}
        {...base}
      />
    </Svg>
  );
}

function Gota({ cor, tamanho = 18 }: IconeProps) {
  return (
    <Svg viewBox="0 0 24 24" width={tamanho} height={tamanho}>
      <Path
        d="M12 3 C16 9 19 12.5 19 15.5 C19 18.5 15.9 21 12 21 C8.1 21 5 18.5 5 15.5 C5 12.5 8 9 12 3 Z"
        stroke={cor}
        strokeWidth={1.6}
        {...base}
      />
    </Svg>
  );
}

function Cruz({ cor, tamanho = 18 }: IconeProps) {
  return (
    <Svg viewBox="0 0 24 24" width={tamanho} height={tamanho}>
      <Circle cx={12} cy={12} r={9} stroke={cor} strokeWidth={1.5} fill="none" />
      <Line x1={12} y1={8} x2={12} y2={16} stroke={cor} strokeWidth={1.7} strokeLinecap="round" />
      <Line x1={8} y1={12} x2={16} y2={12} stroke={cor} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

function Ondas({ cor, tamanho = 18 }: IconeProps) {
  return (
    <Svg viewBox="0 0 24 24" width={tamanho} height={tamanho}>
      <Path d="M3 8 C6 5 8 11 11 8 C14 5 16 11 19 8 C20 7 20.5 7 21 6.6" stroke={cor} strokeWidth={1.5} {...base} />
      <Path d="M3 14 C6 11 8 17 11 14 C14 11 16 17 19 14 C20 13 20.5 13 21 12.6" stroke={cor} strokeWidth={1.5} {...base} />
      <Path d="M3 20 C6 17 8 23 11 20 C14 17 16 23 19 20 C20 19 20.5 19 21 18.6" stroke={cor} strokeWidth={1.5} {...base} />
    </Svg>
  );
}

function Ciclo({ cor, tamanho = 18 }: IconeProps) {
  return (
    <Svg viewBox="0 0 24 24" width={tamanho} height={tamanho}>
      <Path d="M19 12 A7 7 0 1 1 16.8 6.7" stroke={cor} strokeWidth={1.7} {...base} />
      <Path d="M19 4 V8.5 H14.5" stroke={cor} strokeWidth={1.7} {...base} />
    </Svg>
  );
}

function Borboleta({ cor, tamanho = 18 }: IconeProps) {
  return (
    <Svg viewBox="0 0 24 24" width={tamanho} height={tamanho}>
      <Ellipse cx={7.5} cy={12} rx={4.2} ry={5.4} stroke={cor} strokeWidth={1.5} fill="none" />
      <Ellipse cx={16.5} cy={12} rx={4.2} ry={5.4} stroke={cor} strokeWidth={1.5} fill="none" />
      <Line x1={12} y1={6} x2={12} y2={18} stroke={cor} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

function Alerta({ cor, tamanho = 18 }: IconeProps) {
  return (
    <Svg viewBox="0 0 24 24" width={tamanho} height={tamanho}>
      <Path d="M12 3.5 L21 19.5 H3 Z" stroke={cor} strokeWidth={1.6} {...base} />
      <Line x1={12} y1={10} x2={12} y2={14.5} stroke={cor} strokeWidth={1.7} strokeLinecap="round" />
      <Circle cx={12} cy={17} r={0.9} fill={cor} stroke="none" />
    </Svg>
  );
}

function Geracoes({ cor, tamanho = 18 }: IconeProps) {
  return (
    <Svg viewBox="0 0 24 24" width={tamanho} height={tamanho}>
      <Circle cx={6} cy={8} r={2.4} stroke={cor} strokeWidth={1.5} fill="none" />
      <Circle cx={18} cy={8} r={2.4} stroke={cor} strokeWidth={1.5} fill="none" />
      <Circle cx={12} cy={18} r={2.4} stroke={cor} strokeWidth={1.5} fill="none" />
      <Path d="M7.8 10 L11 16" stroke={cor} strokeWidth={1.3} {...base} />
      <Path d="M16.2 10 L13 16" stroke={cor} strokeWidth={1.3} {...base} />
    </Svg>
  );
}

const ICONES: Record<CategoriaId, (p: IconeProps) => JSX.Element> = {
  fatores_infertilidade: Escudo,
  saude_hormonal: Hexagono,
  qualidade_sono: Lua,
  atividade_fisica: SetaProgresso,
  alimentacao: Folha,
  saude_intestinal: Espiral,
  figado: Gota,
  imunidade: Cruz,
  estresse: Ondas,
  ciclo: Ciclo,
  tireoide: Borboleta,
  toxinas: Alerta,
  historico: Geracoes,
};

export function CategoriaIcone({
  id,
  cor,
  tamanho = 18,
}: {
  id: CategoriaId;
  cor: string;
  tamanho?: number;
}) {
  const Icone = ICONES[id];
  return <Icone cor={cor} tamanho={tamanho} />;
}

export function IconeShield({ cor, tamanho = 14 }: IconeProps) {
  // usado na seção de pontos de atenção (mais "alerta clínico" que os ícones de categoria)
  return (
    <Svg viewBox="0 0 24 24" width={tamanho} height={tamanho}>
      <Path
        d="M12 3 L20 6 V11 C20 16 16.5 19.5 12 21 C7.5 19.5 4 16 4 11 V6 Z"
        stroke={cor}
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1={12} y1={8.5} x2={12} y2={12.5} stroke={cor} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx={12} cy={15.2} r={0.9} fill={cor} stroke="none" />
    </Svg>
  );
}
