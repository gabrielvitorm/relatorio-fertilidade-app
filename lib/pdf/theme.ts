export const CORES = {
  // identidade da marca — ajuste para a paleta real do Mapa da Fertilidade
  rosa: "#C9788E",
  rosaClaro: "#F6E8EC",
  verdeAlto: "#3E8E5C",
  verdeAltoBg: "#E7F3EC",
  amareloModerado: "#B8862A",
  amareloModeradoBg: "#FBF1DF",
  vermelhoBaixo: "#B6433E",
  vermelhoBaixoBg: "#FBEAE9",
  cinzaTexto: "#3A3A3A",
  cinzaClaro: "#7A7A7A",
  fundoCard: "#FAF7F5",
  bordaCard: "#E8E0DC",
  branco: "#FFFFFF",
};

export function corPorNivel(nivel: "Alto" | "Moderado" | "Baixo" | "Alta" | "Moderada" | "Baixa") {
  if (nivel === "Alto" || nivel === "Alta") return { cor: CORES.verdeAlto, fundo: CORES.verdeAltoBg };
  if (nivel === "Moderado" || nivel === "Moderada")
    return { cor: CORES.amareloModerado, fundo: CORES.amareloModeradoBg };
  return { cor: CORES.vermelhoBaixo, fundo: CORES.vermelhoBaixoBg };
}
