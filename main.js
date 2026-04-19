// CONFIGURACIÓN DIRECTA
const API_KEY = "pub_78fb968934914a9fa50aebc7218a5083"; 
const API_URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&category=technology,science&language=es`;

const newsContainer = document.getElementById('newsContainer');
const downloadBtn = document.getElementById('downloadBtn');

let top10Articles = [];

// 1. Obtener noticias de la API
async function getNews() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            top10Articles = data.results.slice(0, 10);
            renderCards(data.results);
        } else {
            newsContainer.innerHTML = `<p class="text-warning text-center">No se encontraron noticias en este momento.</p>`;
        }
    } catch (error) {
        console.error("Error:", error);
        newsContainer.innerHTML = `<p class="text-danger text-center">Error al conectar con el servidor de noticias.</p>`;
    }
}

// 2. Crear las tarjetas de Bootstrap con diseño "Cyber-Dark"
function renderCards(articles) {
    newsContainer.innerHTML = '';
    const DEFAULT_IMG = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000&auto=format&fit=crop";

    articles.forEach(article => {
        const card = `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card news-card h-100">
                    <img src="${article.image_url || DEFAULT_IMG}" class="card-img-top" alt="Noticia">
                    <div class="card-body d-flex flex-column">
                        <div class="mb-2">
                            <span class="source-tag">🏷️ ${article.source_id}</span>
                        </div>
                        <h5 class="card-title">${article.title}</h5>
                        <p class="small text-secondary">📅 ${article.pubDate || 'Hoy'}</p>
                        <a href="${article.link}" target="_blank" class="mt-auto text-decoration-none text-warning fw-bold">
                            LEER MÁS <i class="fas fa-external-link-alt ms-1"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
        newsContainer.innerHTML += card;
    });
}

// 3. Lógica para el Blog de Notas (.txt) Profesional
function downloadReport() {
    if (top10Articles.length === 0) return alert("No hay noticias cargadas para descargar.");

    let textContent = "🚀 REPORTE TECNOLÓGICO Y CIENTÍFICO - TOP 10\n";
    textContent += `Fecha de generación: ${new Date().toLocaleString()}\n`;
    textContent += "============================================================\n\n";

    top10Articles.forEach((item, index) => {
        // Formateo de los dos párrafos requeridos
        const contextParagraph = item.description 
            ? item.description.split('.').slice(0, 2).join('.') + "." 
            : "Esta noticia presenta avances recientes en el sector, analizando el impacto directo en la industria actual.";

        const detailParagraph = item.content 
            ? item.content.substring(0, 250).replace(/\n/g, ' ') + "..." 
            : "Entre sus características destacan la innovación técnica, la optimización de procesos y una propuesta de valor enfocada en el desarrollo sostenible.";

        textContent += `[NOTICIA #${index + 1}]: ${item.title.toUpperCase()}\n`;
        textContent += `FUENTE: ${item.source_id}\n`;
        textContent += `------------------------------------------------------------\n`;
        textContent += `CONTEXTO: ${contextParagraph}\n\n`;
        textContent += `DETALLES: ${detailParagraph}\n\n`;
        textContent += `LINK: ${item.link}\n`;
        textContent += "============================================================\n\n";
    });

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Resumen_Tech_Top10.txt`;
    link.click();
    URL.revokeObjectURL(url);
}

// Inicializar
downloadBtn.addEventListener('click', downloadReport);
getNews();
