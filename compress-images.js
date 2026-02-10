const sharp = require('sharp');
const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');

// --- Configurações ---
const INPUT_DIR = 'images_optimized'; // Pasta onde você colocará as imagens originais para otimizar
const OUTPUT_DIR = 'portfolio/odontologia/images'; // Pasta de destino para as imagens otimizadas (onde suas imagens finais já estão)
const MAX_WIDTH = 1920; // Largura máxima para as imagens (em pixels)
const QUALITY = 80; // Qualidade da compressão (0 a 100)

async function compressImages() {
    console.log('🚀 Iniciando a otimização de imagens...');

    // Garante que o diretório de saída exista, mas NÃO o limpa.
    // Os arquivos otimizados serão salvos ao lado dos arquivos existentes.
    await fs.mkdirp(OUTPUT_DIR);

    // Encontra todas as imagens (jpg, jpeg, png, webp) na pasta de entrada
    const files = glob.sync(`${INPUT_DIR}/**/*.{jpg,jpeg,png,webp}`);

    if (files.length === 0) {
        console.log('🤔 Nenhuma imagem encontrada para otimizar.');
        return;
    }

    console.log(`🔎 Encontradas ${files.length} imagens. Processando...`);

    // Processa cada arquivo em paralelo
    await Promise.all(
        files.map(async (file) => {
            const inputPath = path.resolve(file);
            const relativePath = path.relative(INPUT_DIR, inputPath);
            const outputPath = path.resolve(OUTPUT_DIR, relativePath);

            // Garante que o subdiretório de saída exista
            await fs.mkdirp(path.dirname(outputPath));

            try {
                const image = sharp(inputPath);
                const metadata = await image.metadata();

                // Redimensiona se a imagem for maior que MAX_WIDTH, mantendo a proporção
                if (metadata.width > MAX_WIDTH) {
                    image.resize({ width: MAX_WIDTH });
                }

                // Converte para WebP com a qualidade definida
                await image
                    .webp({ quality: QUALITY })
                    .toFile(outputPath.replace(/\.(jpe?g|png|webp)$/i, '.webp'));

                console.log(`✅ Otimizada: ${relativePath}`);
            } catch (err) {
                console.error(`❌ Erro ao otimizar ${file}:`, err);
            }
        })
    );

    console.log('\n🎉 Otimização concluída! As imagens foram processadas e salvas.');
    console.log(`👉 Imagens originais lidas de: /${INPUT_DIR}`);
    console.log(`👉 Imagens otimizadas salvas em: /${OUTPUT_DIR}`);
    console.log('👉 Lembre-se de que as imagens otimizadas (em .webp) foram adicionadas ou sobrescritas na pasta de destino. Verifique se os nomes de arquivo e extensões estão corretos em seus arquivos HTML, CSS e JS.');
}

compressImages();
