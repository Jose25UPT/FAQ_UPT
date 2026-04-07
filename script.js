// ===== 1. ACORDEÓN FAQ =====
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        document.querySelectorAll('.faq-item').forEach(i => {
            if (i !== item) i.classList.remove('active');
        });
        item.classList.toggle('active');
    });
});

// ===== 2. BUSCADOR =====
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keyup', (e) => {
    const term = e.target.value.toLowerCase().trim();
    document.querySelectorAll('.faq-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(term) ? 'block' : 'none';
    });
});

// ===== 3. MODAL DE IMÁGENES (Lightbox) =====
function openImageModal(src) {
    const modal = document.getElementById('imageModal');
    const img = document.getElementById('imageModalImg');
    const caption = document.getElementById('imageModalCaption');
    
    modal.style.display = 'block';
    img.src = src;
    caption.textContent = 'Imagen ampliada';
    
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Cerrar lightbox con ESC o clic fuera
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeImageModal();
});
document.getElementById('imageModal').addEventListener('click', (e) => {
    if (e.target.id === 'imageModal') closeImageModal();
});

// ===== 4. MODAL DE PDF (con PDF.js) =====
let pdfDoc = null, pageNum = 1, pageRendering = false, pageNumPending = null;
const scale = 1.5, canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

function openPDFModal(url) {
    const modal = document.getElementById('pdfModal');
    const container = document.getElementById('pdfViewerContainer');
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    container.innerHTML = '';
    container.appendChild(canvas);
    
    pageNum = 1;
    renderPage(pageNum, url);
    
    // Event listeners para botones
    document.getElementById('prevPage').onclick = () => {
        if (pageNum <= 1) return;
        pageNum--;
        renderPage(pageNum, url);
    };
    document.getElementById('nextPage').onclick = () => {
        if (!pdfDoc || pageNum >= pdfDoc.numPages) return;
        pageNum++;
        renderPage(pageNum, url);
    };
}

function renderPage(num, url) {
    pageRendering = true;
    
    pdfjsLib.getDocument(url).promise.then(pdf => {
        pdfDoc = pdf;
        document.getElementById('pageNum').textContent = `Página ${num} de ${pdf.numPages}`;
        
        pdf.getPage(num).then(page => {
            const viewport = page.getViewport({ scale });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            const renderContext = { canvasContext: ctx, viewport };
            page.render(renderContext).promise.then(() => {
                pageRendering = false;
                if (pageNumPending !== null) {
                    renderPage(pageNumPending, url);
                    pageNumPending = null;
                }
            });
        });
    });
}

function closePDFModal() {
    document.getElementById('pdfModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    pdfDoc = null;
}

// Cerrar modal PDF con ESC o clic fuera
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePDFModal();
});
document.getElementById('pdfModal').addEventListener('click', (e) => {
    if (e.target.id === 'pdfModal') closePDFModal();
});

// ===== 5. LAZY LOADING PARA IMÁGENES =====
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.removeAttribute('loading');
                observer.unobserve(img);
            }
        });
    });
    document.querySelectorAll('img[loading="lazy"]').forEach(img => observer.observe(img));
}