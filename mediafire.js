const axios = require('axios');
const cheerio = require('cheerio');

const mediafireDl = async (url) => {
    try {
        if (!url.includes('mediafire.com')) throw new Error('❌ Enlace inválido. Asegúrate de que sea un enlace de MediaFire.');

        const res = await axios.get(url);
        const $ = cheerio.load(res.data);
        
        let link = $('a#downloadButton').attr('href');
        if (!link) throw new Error('❌ No se pudo obtener el enlace de descarga.');

        let size = $('div.download_file_size').text().trim();
        if (!size) size = "Tamaño desconocido"; 

        let fileName = $('div.filename').text().trim();
        if (!fileName) {
            const parts = link.split('/');
            fileName = parts[parts.length - 1];
        }

        let mime = fileName.split('.').pop();

        return [{ nama: fileName, mime, size, link }];
    } catch (error) {
        console.error('Error en mediafireDl:', error);
        return null; // Devolver null si hay un error
    }
};

module.exports = { mediafireDl };