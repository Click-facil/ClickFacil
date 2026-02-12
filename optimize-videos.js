const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const glob = require('glob');
const fs = require('fs-extra');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegPath);

// --- Configurações ---
const INPUT_DIR = 'videos_optimized'; // Pasta com seus vídeos pesados de IA ou banco
const OUTPUT_DIR = 'portfolio/energiasolar/images'; // Pasta de destino no seu projeto
const MAX_WIDTH = 1280; // 720p é excelente para fundo de card, evita lentidão
const BITRATE = '1500k'; // Controla o peso final do arquivo

async function optimizeVideos() {
    console.log('🎬 Iniciando a otimização de vídeos para a Click Fácil...');

    // Garante que o diretório de saída exista, mas NÃO o limpa (conforme seu pedido)
    await fs.mkdirp(OUTPUT_DIR);

    // Encontra vídeos (mp4, mov, avi, webm)
    const files = glob.sync(`${INPUT_DIR}/**/*.{mp4,mov,avi,webm}`);

    if (files.length === 0) {
        console.log('🤔 Nenhum vídeo encontrado em /' + INPUT_DIR);
        return;
    }

    console.log(`🔎 Encontrados ${files.length} vídeos. Isso pode levar alguns minutos...`);

    for (const file of files) {
        const inputPath = path.resolve(file);
        const relativePath = path.relative(INPUT_DIR, inputPath);
        
        // Vamos converter tudo para .webm para performance máxima no seu HTML
        const outputFileName = relativePath.replace(/\.[^.]+$/, '.webm');
        const outputPath = path.resolve(OUTPUT_DIR, outputFileName);

        // Garante que o subdiretório de saída exista
        await fs.mkdirp(path.dirname(outputPath));

        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .videoCodec('libvpx-vp9') // Codec moderno e leve para WebM
                .size(`${MAX_WIDTH}x?`)   // Redimensiona mantendo a proporção
                .videoBitrate(BITRATE)    // Comprime para economizar banda
                .noAudio()                // Remove áudio (essencial para background videos)
                .on('end', () => {
                    console.log(`✅ Vídeo Otimizado: ${outputFileName}`);
                    resolve();
                })
                .on('error', (err) => {
                    console.error(`❌ Erro em ${file}:`, err);
                    reject(err);
                })
                .save(outputPath);
        });
    }

    console.log('\n🎉 Missão cumprida! Seus vídeos estão prontos para o site.');
    console.log(`👉 Destino: /${OUTPUT_DIR}`);
}

optimizeVideos();