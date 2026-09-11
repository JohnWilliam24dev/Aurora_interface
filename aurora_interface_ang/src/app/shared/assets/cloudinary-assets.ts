/**
 * Assets migrados do repositório para a Cloudinary (commit `85a0cd8`,
 * "deletando imagens" — os binários pesavam demais no repo Git).
 *
 * Os nomes de arquivo aqui são os MESMOS usados no projeto legado
 * (`assets/icon/*`, `assets/imagens/imagens_editadas/*`,
 * `assets/imagens/imagens_originais/*`), só a origem que mudou. Isso permite
 * consultar este mapa usando o nome que já aparece nos HTMLs/CSS antigos.
 *
 * ⚠️ Pendências (não vieram na leva de URLs — usar placeholder até chegar):
 *   - Aurora-logo-500x500.png (logo do header, usado em TODAS as páginas)
 *   - mulher_1.jpg .. mulher_5.jpg, mulher-6.jpg, mulher_7.png, mulher_8.png
 *     (não referenciados em nenhum HTML/JS encontrado até agora — possíveis
 *     sobras de mockup; ignorados por ora)
 */
const CLOUDINARY_ASSETS: Record<string, string> = {
  // --- assets/icon ---
  'Aurora-logo.png': 'https://res.cloudinary.com/vqit8s00/image/upload/v1789021220/Aurora-logo.png',
  'apoio-suporte_100x100.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021219/apoio-suporte_100x100.png',
  'arrow-2.png': 'https://res.cloudinary.com/vqit8s00/image/upload/v1789021218/arrow-2.png',
  'arrow_50x50.png': 'https://res.cloudinary.com/vqit8s00/image/upload/v1789021219/arrow_50x50.png',
  'bem_vindo.png': 'https://res.cloudinary.com/vqit8s00/image/upload/v1789021220/bem_vindo.png',
  'caneta_edicao.png': 'https://res.cloudinary.com/vqit8s00/image/upload/v1789021219/caneta_edicao.png',
  'carrinho_100x100.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021220/carrinho_100x100.png',
  'carrinho_112x112.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021219/carrinho_112x112.png',
  'carrinho_212x212.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021220/carrinho_212x212.png',
  'carrinho_512x512.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021222/carrinho_512x512.png',
  'cloud-computing.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021222/cloud-computing.png',
  'cloud-computing_212.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021222/cloud-computing_212.png',
  'delete_24dp_000000_FILL0_wght400_GRAD0_opsz24.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021222/delete_24dp_000000_FILL0_wght400_GRAD0_opsz24.png',
  'down-arrow.png': 'https://res.cloudinary.com/vqit8s00/image/upload/v1789021222/down-arrow.png',
  'em_alta_titulo.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021223/em_alta_titulo.png',
  'instagram_50x50.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021223/instagram_50x50.png',
  'leveza_em_titulo.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021223/leveza_em_titulo.png',
  'new-moon.png': 'https://res.cloudinary.com/vqit8s00/image/upload/v1789021224/new-moon.png',
  'search_50x50.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021223/search_50x50.png',
  'search_black.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021223/search_black.png',
  'seu_mood_titulo.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021226/seu_mood_titulo.png',
  'twitter_50x50.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021226/twitter_50x50.png',
  'user_100x100.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021224/user_100x100.png',
  'whatsapp_50x50.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021225/whatsapp_50x50.png',

  // --- assets/imagens/imagens_editadas ---
  'Aurora-logo-100x100.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021037/Aurora-logo-100x100.png',
  'banner_tela_inicial_1_1420.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021088/banner_tela_inicial_1_1420.png',
  'banner_tela_inicial_2.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021118/banner_tela_inicial_2.png',
  'banner_tela_inicial_3.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021064/banner_tela_inicial_3.png',
  'campo-de-girassol-bonito-com-um-ceu-azul-claro.jpg':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021107/campo-de-girassol-bonito-com-um-ceu-azul-claro.jpg',
  'estrela_avaliacao.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021042/estrela_avaliacao.png',
  'logo_amazon.png': 'https://res.cloudinary.com/vqit8s00/image/upload/v1789021039/logo_amazon.png',
  'logo_hem._176.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021039/logo_hem._176.png',
  'logo_lacoste.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021042/logo_lacoste.png',
  'logo_levi.png': 'https://res.cloudinary.com/vqit8s00/image/upload/v1789021044/logo_levi.png',
  'logo_obey.png': 'https://res.cloudinary.com/vqit8s00/image/upload/v1789021045/logo_obey.png',
  'logo_shopify.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021046/logo_shopify.png',
  'woman.jpg': 'https://res.cloudinary.com/vqit8s00/image/upload/v1789021789/woman.jpg',

  // --- assets/imagens/imagens_originais ---
  // ⚠️ PLACEHOLDER: URL real do Aurora-logo-500x500.png ainda não recebida.
  // Usando a versão 100x100 como substituto temporário (mesmo logo, menor
  // resolução) para não travar o Header. Trocar assim que a URL definitiva
  // chegar — é só atualizar esta linha.
  'Aurora-logo-500x500.png':
    'https://res.cloudinary.com/vqit8s00/image/upload/v1789021037/Aurora-logo-100x100.png',
};

/**
 * Retorna a URL da Cloudinary para o nome de arquivo original do legado.
 * Loga um aviso (sem quebrar a tela) se o nome não estiver mapeado, pra
 * facilitar achar assets faltantes durante a migração.
 */
export function assetUrl(fileName: string): string {
  const url = CLOUDINARY_ASSETS[fileName];
  if (!url) {
    console.warn(`[assetUrl] Nenhuma URL da Cloudinary mapeada para "${fileName}".`);
    return '';
  }
  return url;
}
