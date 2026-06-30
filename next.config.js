/** @type {import('next').NextConfig} */
const nextConfig = {
  // @react-pdf/renderer tenta importar 'canvas' internamente; esse alias
  // evita que o webpack quebre no build por não encontrar o módulo.
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  // Gera uma pasta .next/standalone — usada pelo Dockerfile para criar
  // uma imagem mínima sem node_modules completo.
  output: "standalone",
};

module.exports = nextConfig;
