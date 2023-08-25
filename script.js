document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("converter-form");
    const imageInput = document.getElementById("image-input");
    const conversionFormat = document.getElementById("conversion-format");
    const downloadLink = document.getElementById("download-link");
    const cropPreview = document.getElementById("crop-preview");
    const cropButton = document.getElementById("crop-button");
    const resetButton = document.getElementById("reset-button");
    const filtersContainer = document.getElementById("filters-container");
    const rotateLeftButton = document.getElementById("rotate-left-button");
    const rotateRightButton = document.getElementById("rotate-right-button");

    let cropper;

    imageInput.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                cropPreview.src = event.target.result;
                cropper = new Cropper(cropPreview, {
                    aspectRatio: 1,
                    viewMode: 1,
                });
            };
            reader.readAsDataURL(file);
        }
    });

    cropButton.addEventListener("click", function() {
        if (cropper) {
            const canvas = cropper.getCroppedCanvas();
            cropPreview.src = canvas.toDataURL();
            applyFilters(canvas);
        }
    });

    resetButton.addEventListener("click", function() {
        if (cropper) {
            cropper.reset();
            cropPreview.src = "";
        }
    });

    rotateLeftButton.addEventListener("click", function() {
        if (cropper) {
            cropper.rotate(-90);
        }
    });

    rotateRightButton.addEventListener("click", function() {
        if (cropper) {
            cropper.rotate(90);
        }
    });

    filtersContainer.addEventListener("click", function(event) {
        if (cropper) {
            const filterName = event.target.getAttribute("data-filter");
            if (filterName) {
                applyFilter(filterName);
            }
        }
    });

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const file = imageInput.files[0];
        if (!file) {
            alert("Please select a file to convert.");
            return;
        }

        const format = conversionFormat.value;
        const croppedCanvas = cropper ? cropper.getCroppedCanvas() : null;
        convertAndDownload(file, format, croppedCanvas);
    });

    function applyFilters(canvas) {
        Caman(canvas, function() {
            // Apply filters here using CamanJS API
            // Example: this.brightness(10);
            // Apply any filters you want
            
            this.render();
        });
    }

    function applyFilter(filterName) {
        if (cropper) {
            cropper.clear();
            cropper.crop();
            const canvas = cropper.getCroppedCanvas();
            Caman(canvas, function() {
                // Apply the selected filter
                this[filterName]();
                this.render();
            });
        }
    }

    function convertAndDownload(file, format, croppedCanvas) {
        if (croppedCanvas) {
            const downloadCanvas = document.createElement("canvas");
            downloadCanvas.width = croppedCanvas.width;
            downloadCanvas.height = croppedCanvas.height;
            const ctx = downloadCanvas.getContext("2d");
            ctx.drawImage(croppedCanvas, 0, 0);

            const extension = format === "webp" ? ".webp" : "." + format;
            const downloadURL = downloadCanvas.toDataURL("image/" + format);
            downloadLink.href = downloadURL;
            downloadLink.download = file.name.replace(/\.[^/.]+$/, "") + extension;
            downloadLink.click();
        }
    }
});
