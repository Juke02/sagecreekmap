import * as THREE from 'three';
import './styles.css';

export function initializePopup(textureLoader, sphereRef) {
    if (document.getElementById('popup')) return;
    
    // Add button to trigger the popup
    const button = document.createElement('button');
    button.innerHTML = 'Show Map';
    button.id = 'popup-trigger'; 
    document.body.appendChild(button);

    const popup = document.createElement('div');
    popup.id = 'popup';
    document.body.appendChild(popup);

    const popupImage = document.createElement('img');
    popupImage.src = '/map1.png';
    popupImage.draggable = false;
    popup.appendChild(popupImage);

    const closeButton = document.createElement('button');
    closeButton.innerHTML = 'Close';
    closeButton.classList.add('shared-font-style');
    popup.appendChild(closeButton);

    const circlesData = [
        { id: 'circle-1', x: 410, y: 93, texture: '6.png', floor: 1 }, 
        { id: 'circle-2', x: 380, y: 93, texture: '7.png', floor: 1 }, 
        { id: 'circle-3', x: 335, y: 93, texture: '10.png', floor: 1 }, 
        { id: 'circle-4', x: 310, y: 93, texture: '11.png', floor: 1 },
        { id: 'circle-5', x: 250, y: 93, texture: '12.png', floor: 1 },
        { id: 'circle-6', x: 250, y: 73, texture: '13.png', floor: 1 },
        { id: 'circle-7', x: 230, y: 93, texture: '14.png', floor: 1 },
        { id: 'circle-8', x: 180, y: 93, texture: '15.png', floor: 1 },
        { id: 'circle-9', x: 335, y: 68, texture: '16.png', floor: 1 },
        { id: 'circle-10', x: 260, y: 25, texture: '17.png', floor: 2 },
        { id: 'circle-11', x: 235, y: 22, texture: '18.png', floor: 2 },
        { id: 'circle-12', x: 218, y: 20, texture: '19.png', floor: 2 }, 
        { id: 'circle-13', x: 275, y: 20, texture: '20.png', floor: 2 },
        { id: 'circle-14', x: 280, y: 80, texture: '21.png', floor: 2 },
        { id: 'circle-15', x: 373, y: 20, texture: '22.png', floor: 2 },
        { id: 'circle-16', x: 292, y: 40, texture: '23.png', floor: 2 },
        { id: 'circle-17', x: 373, y: 60, texture: '24.png', floor: 2 },
        { id: 'circle-18', x: 265, y: 50, texture: '25.png', floor: 2 },
        { id: 'circle-19', x: 362, y: 80, texture: '26.png', floor: 2 },
        { id: 'circle-20', x: 373, y: 40, texture: '27.png', floor: 2 },
        { id: 'circle-21', x: 373, y: 80, texture: '28.png', floor: 2 },
        { id: 'circle-22', x: 340, y: 21, texture: '29.png', floor: 2 },
        { id: 'circle-23', x: 218, y: 65, texture: '30.png', floor: 2 },
        { id: 'circle-24', x: 292, y: 20, texture: '31.png', floor: 2 },
        { id: 'circle-25', x: 218, y: 40, texture: '32.png', floor: 2 }, //fix
        { id: 'circle-26', x: 350, y: 60, texture: '33.png', floor: 2 }, 
        { id: 'circle-27', x: 193, y: 83, texture: '34.png', floor: 2 }, 
        { id: 'circle-28', x: 292, y: 70, texture: '35.png', floor: 2 }, 
        { id: 'circle-29', x: 265, y: 80, texture: '36.png', floor: 2 }, 
        { id: 'circle-30', x: 218, y: 83, texture: '37.png', floor: 2 }, 
        { id: 'circle-31', x: 203, y: 20, texture: '38.png', floor: 2 }, //fix
        { id: 'circle-32', x: 190, y: 60, texture: '39.png', floor: 2 }, //fix
        { id: 'circle-33', x: 292, y: 80, texture: '40.png', floor: 2 }, 
        { id: 'circle-34', x: 190, y: 40, texture: '41.png', floor: 2 }, 
        { id: 'circle-35', x: 350, y: 80, texture: '42.png', floor: 2 }, 
        { id: 'circle-36', x: 362, y: 20, texture: '43.png', floor: 2 }, 
        { id: 'circle-37', x: 190, y: 20, texture: '44.png', floor: 2 }, 
    ];

    const textureManager = new THREE.LoadingManager();
    textureManager.onLoad = () => console.log('All textures loaded.');

    const imageLoader = new THREE.ImageLoader(textureManager);
    const preloadedTextures = {};

    circlesData.forEach(circleData => {
        const texture = new THREE.Texture();
        preloadedTextures[circleData.id] = texture;

        imageLoader.load(circleData.texture, (image) => {
            texture.image = image;
            texture.needsUpdate = true;
        });
    });

    function createCircles() {
        circlesData.forEach(circleData => {
            const circleButton = document.createElement('div');
            circleButton.id = circleData.id;
            circleButton.classList.add('circle-button');
            circleButton.style.display = 'none';
            popup.appendChild(circleButton);

            circleButton.addEventListener('click', () => {
                const newTexture = preloadedTextures[circleData.id];
                if (newTexture && newTexture.image) {
                    const sphere = sphereRef.current; // Access the sphere from the ref
                    sphere.material.map = null;
                    sphere.material.map = newTexture;
                    sphere.material.needsUpdate = true;
                }
            });
        });
    }

    createCircles();

    // Prevent context menu on image (right-click)
    popupImage.addEventListener('contextmenu', function (event) {
        event.preventDefault(); 
    });

    // Function to set the circle positions dynamically based on translation and zoom (dilation from the center)
    function setCirclePositions(translateX, translateY) {
        const imageCenterX = popupImage.offsetWidth / 2; 
        const imageCenterY = popupImage.offsetHeight / 2; 

        // Apply circle positioning for each circle
        circlesData.forEach(circleData => {
            const circleButton = document.getElementById(circleData.id);

            // Calculate distance from the center to the initial circle position
            const deltaX = circleData.x - imageCenterX;
            const deltaY = circleData.y - imageCenterY;

            // Apply dilation based on the zoom level
            const circleX = imageCenterX + (deltaX * zoomLevel) + translateX;
            const circleY = imageCenterY + (deltaY * zoomLevel) + translateY;

            // Set the circle's position
            circleButton.style.left = circleX + 'px';
            circleButton.style.top = circleY + 'px';
        });
    }

    let isDragging = false;
    let startX, startY;
    let currentTranslateX = 0;
    let currentTranslateY = 0;

    let zoomLevel = 1;
    const minZoom = 1;
    const maxZoom = 3;

    // Get the bounds of the popup (container) for boundary calculations
    function getPopupBounds() {
        return {
            width: popup.offsetWidth,
            height: popup.offsetHeight,
        };
    }

    // Restrict translation to prevent seeing whitespace
    function restrictTranslation() {
        const bounds = getPopupBounds();
        const imageWidth = popupImage.offsetWidth * zoomLevel;
        const imageHeight = popupImage.offsetHeight * zoomLevel;

        const maxTranslateX = (imageWidth - bounds.width) / 2;
        const maxTranslateY = (imageHeight - bounds.height) / 2;

        if (imageWidth <= bounds.width) {
            currentTranslateX = 0; // Center image if it's smaller than the container
        } else {
            currentTranslateX = Math.min(Math.max(currentTranslateX, -maxTranslateX), maxTranslateX);
        }

        if (imageHeight <= bounds.height) {
            currentTranslateY = 0; // Center image if it's smaller than the container
        } else {
            currentTranslateY = Math.min(Math.max(currentTranslateY, -maxTranslateY), maxTranslateY);
        }
    }

    // Handle mouse down for dragging
    popupImage.addEventListener('mousedown', function (event) {
        isDragging = true;
        startX = event.clientX - currentTranslateX;
        startY = event.clientY - currentTranslateY;
        popupImage.style.cursor = 'grabbing'; // Change cursor to grabbing
    });

    // Handle mouse move for dragging
    window.addEventListener('mousemove', function (event) {
        if (isDragging) {
            currentTranslateX = event.clientX - startX;
            currentTranslateY = event.clientY - startY;

            restrictTranslation();

            popupImage.style.transform = `translate(${currentTranslateX}px, ${currentTranslateY}px) scale(${zoomLevel})`;

            // Adjust the position of the circles dynamically based on translation and zoom
            setCirclePositions(currentTranslateX, currentTranslateY);
        }
    });

    // Handle mouse up to stop dragging
    window.addEventListener('mouseup', function () {
        if (isDragging) {
            isDragging = false;
            popupImage.style.cursor = 'grab'; 
        }
    });

    // Show the popup when the button is clicked
    button.addEventListener('click', function () {
        popup.style.display = 'block'; 
        setTimeout(function () {
            popup.style.width = 'auto';
            popup.style.height = 'auto'; 
        }, 0); 

        setCirclePositions(0, 0); // No translation initially
        updateVisibleCircles(floorSlider.value); // Show circles for initial floor
    });

    // Close the popup when the close button is clicked
    closeButton.addEventListener('click', function () {
        popup.style.width = '0'; 
        popup.style.height = '0'; 
        setTimeout(function () {
            popup.style.display = 'none'; 
        }, 400); 
    });

    // Add zoom functionality with scroll wheel
    popup.addEventListener('wheel', function (event) {
        event.preventDefault(); // Prevent default scroll behavior

        // Calculate zoom based on scroll direction
        if (event.deltaY < 0) {
            zoomLevel = Math.min(zoomLevel + 0.1, maxZoom); // Zoom in
        } else {
            zoomLevel = Math.max(zoomLevel - 0.1, minZoom); // Zoom out
        }

        restrictTranslation();

        // Apply zoom to the popup image
        popupImage.style.transform = `translate(${currentTranslateX}px, ${currentTranslateY}px) scale(${zoomLevel})`;

        // Adjust the positions of the circles dynamically based on zoom and translation
        setCirclePositions(currentTranslateX, currentTranslateY);
    });

    var floorSlider = document.createElement('input');
    floorSlider.type = 'range';
    floorSlider.min = 1;
    floorSlider.max = 3; 
    floorSlider.value = 1;
    floorSlider.id = 'floor-slider';
    popup.appendChild(floorSlider);

    var floorLabel = document.createElement('label');
    floorLabel.htmlFor = 'floor-slider';
    floorLabel.id = 'floor-label';
    floorLabel.innerText = 'Floor Level: ';
    floorLabel.classList.add('shared-font-style'); 
    popup.appendChild(floorLabel);

    // Function to update the visibility of circles based on the current floor
    function updateVisibleCircles(floor) {
        circlesData.forEach(circleData => {
            const circleButton = document.getElementById(circleData.id);
            if (circleData.floor == floor) {
                circleButton.style.display = 'block';  // Ensure it's visible
                circleButton.style.opacity = '1';      // Fully opaque for the current floor
            } else {
                circleButton.style.display = 'block';  // Keep it visible
                circleButton.style.opacity = '0.5';    // 50% transparency for other floors
            }
        });
    }

    // Update visible circles when the slider value changes
    floorSlider.addEventListener('input', function () {
        updateVisibleCircles(floorSlider.value);
        console.log('changed');
    });
}
