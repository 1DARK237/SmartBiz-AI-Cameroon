document.addEventListener('DOMContentLoaded', () => {
    // State: Load from localStorage or initialize empty array
    let images = JSON.parse(localStorage.getItem('admin_gallery_images')) || [];

    // DOM Elements
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const galleryGrid = document.getElementById('galleryGrid');
    const imageCount = document.getElementById('imageCount');

    // Initialize
    renderGallery();

    // Event Listeners for Drag & Drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });

    // Make the whole dropzone clickable
    dropZone.addEventListener('click', (e) => {
        // Prevent clicking if they clicked the button directly
        if (e.target.tagName !== 'BUTTON') {
            fileInput.click();
        }
    });

    // Event Listener for File Input
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    });

    // Process Files
    function handleFiles(files) {
        Array.from(files).forEach(file => {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert(`File ${file.name} is not an image.`);
                return;
            }

            // Validate file size (5MB limit to prevent localStorage quota issues)
            if (file.size > 5 * 1024 * 1024) {
                alert(`File ${file.name} is too large. Maximum size is 5MB.`);
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const newImage = {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                    url: e.target.result,
                    name: file.name,
                    date: new Date().toISOString(),
                    size: (file.size / 1024).toFixed(1) + ' KB'
                };

                // Add to beginning of array
                images.unshift(newImage);
                saveAndRender();
            };
            reader.readAsDataURL(file);
        });
        
        // Reset input so the same file can be uploaded again if needed
        fileInput.value = '';
    }

    // Delete Image (Attached to window so inline onclick handlers can access it)
    window.deleteImage = function(id) {
        if(confirm('Are you sure you want to delete this image?')) {
            images = images.filter(img => img.id !== id);
            saveAndRender();
        }
    };

    // Save to LocalStorage and Render
    function saveAndRender() {
        try {
            localStorage.setItem('admin_gallery_images', JSON.stringify(images));
            renderGallery();
        } catch (e) {
            alert('Storage quota exceeded. Please delete some images first.');
            // Revert state if quota exceeded
            images = JSON.parse(localStorage.getItem('admin_gallery_images')) || [];
        }
    }

    // Render Gallery
    function renderGallery() {
        imageCount.textContent = images.length;
        
        if (images.length === 0) {
            galleryGrid.innerHTML = `
                <div class="empty-state">
                    <i class="ph ph-image-square"></i>
                    <h3>No images uploaded yet</h3>
                    <p>Upload your first image using the drop zone above.</p>
                </div>
            `;
            return;
        }

        galleryGrid.innerHTML = images.map(img => `
            <div class="image-card">
                <img src="${img.url}" alt="${img.name}">
                <button class="delete-btn" onclick="deleteImage('${img.id}')" title="Delete image">
                    <i class="ph ph-trash"></i>
                </button>
                <div class="image-info">
                    <h4>${img.name}</h4>
                    <p>${new Date(img.date).toLocaleDateString()} • ${img.size}</p>
                </div>
            </div>
        `).join('');
    }
});
