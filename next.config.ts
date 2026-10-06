import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // fotos do venue em AVIF/WebP (VENUE-TEMPLATE §1, item 7: LCP < 2,5s)
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90], // 90 = fotos (lib/imagem.ts QUALIDADE); 75 = padrão (logo)
  },
};

export default nextConfig;
