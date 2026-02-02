const sharp = require('sharp');
const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');

// --- Configurações ---
const INPUT_DIR = 'images'; // Pasta onde estão suas imagens originais
const OUTPUT_DIR = 'images_optimized'; // Pasta para salvar as imagens otimizadas
const MAX_WIDTH = 1920; // Largura máxima para as imagens (em pixels)
const QUALITY = 80; // Qualidade da compressão (0 a 100)

async function compressImages() {
    console.log('🚀 Iniciando a otimização de imagens...');

    // Garante que o diretório de saída exista e esteja limpo
    if (fs.existsSync(OUTPUT_DIR)) {
        await fs.emptyDir(OUTPUT_DIR);
    } else {
        await fs.mkdirp(OUTPUT_DIR);
    }

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

    console.log('\n🎉 Otimização concluída!');
    console.log(`👉 Suas imagens otimizadas estão em: /${OUTPUT_DIR}`);
    console.log('👉 Agora, substitua as imagens antigas pelas novas e atualize as extensões para .webp nos seus arquivos HTML, CSS e JS.');
}

compressImages();
