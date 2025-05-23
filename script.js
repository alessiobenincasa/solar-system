class SolarSystem {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.planets = [];
        this.planetLabels = [];
        this.orbitLines = [];
        this.animationSpeed = 1;
        this.showLabels = false;
        this.showOrbits = true;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.planetData = {
            sun: { 
                radius: 5, 
                distance: 0, 
                speed: 0, 
                color: 0xFFD700, 
                emissive: 0xFFA500,
                name: "Sun", 
                description: "Notre étoile - une boule massive de plasma chaud qui fournit l'énergie pour toute vie sur Terre." 
            },
            mercury: { 
                radius: 0.4, 
                distance: 15, 
                speed: 0.047, 
                color: 0xC0C0C0, 
                name: "Mercure", 
                description: "La plus petite planète et la plus proche du Soleil. Un jour sur Mercure dure plus longtemps que son année !" 
            },
            venus: { 
                radius: 0.9, 
                distance: 20, 
                speed: 0.035, 
                color: 0xFFE4B5, 
                emissive: 0x332211,
                name: "Vénus", 
                description: "La planète la plus chaude avec d'épais nuages d'acide sulfurique. Elle tourne à l'envers par rapport à la Terre !" 
            },
            earth: { 
                radius: 1, 
                distance: 25, 
                speed: 0.029, 
                color: 0x4169E1, 
                secondaryColor: 0x32CD32,
                cloudColor: 0xFFFFFF,
                name: "Terre", 
                description: "Notre planète natale - la seule planète connue avec la vie. 71% de sa surface est couverte d'eau." 
            },
            mars: { 
                radius: 0.5, 
                distance: 30, 
                speed: 0.024, 
                color: 0xFF4500, 
                name: "Mars", 
                description: "La Planète Rouge - nommée pour sa couleur rouillée d'oxyde de fer. Abrite le plus grand volcan du système solaire !" 
            },
            jupiter: { 
                radius: 3, 
                distance: 40, 
                speed: 0.013, 
                color: 0xDAA520, 
                secondaryColor: 0xF4A460,
                name: "Jupiter", 
                description: "La plus grande planète - une géante gazeuse avec une Grande Tache Rouge plus grande que la Terre !" 
            },
            saturn: { 
                radius: 2.5, 
                distance: 50, 
                speed: 0.009, 
                color: 0xF5DEB3, 
                ringColor: 0xDAA520,
                name: "Saturne", 
                description: "Célèbre pour ses magnifiques anneaux faits de particules de glace et de roche. Elle est moins dense que l'eau !" 
            },
            uranus: { 
                radius: 1.8, 
                distance: 60, 
                speed: 0.006, 
                color: 0x40E0D0, 
                name: "Uranus", 
                description: "Une géante de glace qui tourne sur le côté. Elle a de faibles anneaux et 27 lunes connues !" 
            },
            neptune: { 
                radius: 1.7, 
                distance: 70, 
                speed: 0.005, 
                color: 0x4169E1, 
                name: "Neptune", 
                description: "La planète la plus venteuse avec des vitesses jusqu'à 2000 km/h. Il faut 165 années terrestres pour orbiter le Soleil !" 
            }
        };
        
        this.init();
    }
    
    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createControls();
        this.createLights();
        this.createStarField();
        this.createPlanets();
        this.createOrbitLines();
        this.setupEventListeners();
        this.animate();
        this.hideLoadingScreen();
    }
    
    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000011);
    }
    
    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 30, 80);
    }
    
    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('scene-container').appendChild(this.renderer.domElement);
    }
    
    createControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 10;
        this.controls.maxDistance = 200;
        this.controls.maxPolarAngle = Math.PI;
    }
    
    createLights() {
        const ambientLight = new THREE.AmbientLight(0x404040, 1.2);
        this.scene.add(ambientLight);
        
        const sunLight = new THREE.PointLight(0xffffff, 6, 300);
        sunLight.position.set(0, 0, 0);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        this.scene.add(sunLight);
        
        // Ajouter une deuxième lumière pour éclairer uniformément
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(50, 50, 50);
        this.scene.add(fillLight);
    }
    
    createStarField() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 5000;
        const starPositions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount * 3; i += 3) {
            starPositions[i] = (Math.random() - 0.5) * 500;
            starPositions[i + 1] = (Math.random() - 0.5) * 500;
            starPositions[i + 2] = (Math.random() - 0.5) * 500;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        
        // Créer une texture circulaire pour les étoiles
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const context = canvas.getContext('2d');
        
        // Dessiner un cercle blanc avec un dégradé doux
        const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(16, 16, 16, 0, Math.PI * 2);
        context.fill();
        
        const starTexture = new THREE.CanvasTexture(canvas);
        
        const starMaterial = new THREE.PointsMaterial({
            size: 1.0,
            color: 0x888888, // Gris uniforme
            transparent: true,
            opacity: 0.8,
            map: starTexture,
            alphaTest: 0.1,
            sizeAttenuation: true
        });
        
        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
    }
    
    createRealisticTexture(planetName, data) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        
        switch(planetName) {
            case 'earth':
                this.createEarthTexture(context, canvas);
                break;
            case 'mars':
                this.createMarsTexture(context, canvas);
                break;
            case 'jupiter':
                this.createJupiterTexture(context, canvas);
                break;
            case 'saturn':
                this.createSaturnTexture(context, canvas);
                break;
            case 'venus':
                this.createVenusTexture(context, canvas);
                break;
            case 'mercury':
                this.createMercuryTexture(context, canvas);
                break;
            case 'uranus':
                this.createUranusTexture(context, canvas);
                break;
            case 'neptune':
                this.createNeptuneTexture(context, canvas);
                break;
            default:
                context.fillStyle = `#${data.color.toString(16).padStart(6, '0')}`;
                context.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        return new THREE.CanvasTexture(canvas);
    }
    
    createEarthTexture(context, canvas) {
        // Base océanique bleue plus vive et éclatante
        const oceanGradient = context.createRadialGradient(canvas.width/2, canvas.height/2, 0, 
                                                          canvas.width/2, canvas.height/2, canvas.width/2);
        oceanGradient.addColorStop(0, '#00BFFF'); // DeepSkyBlue
        oceanGradient.addColorStop(0.5, '#4169E1'); // RoyalBlue  
        oceanGradient.addColorStop(1, '#0066FF'); // Bleu océan éclatant
        context.fillStyle = oceanGradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Créer des formes de continents plus réalistes
        // Amérique du Nord/Sud (côté gauche)
        context.fillStyle = '#228B22';
        context.beginPath();
        context.moveTo(0, canvas.height * 0.2);
        context.quadraticCurveTo(canvas.width * 0.15, canvas.height * 0.1, canvas.width * 0.25, canvas.height * 0.3);
        context.quadraticCurveTo(canvas.width * 0.2, canvas.height * 0.5, canvas.width * 0.15, canvas.height * 0.7);
        context.quadraticCurveTo(canvas.width * 0.1, canvas.height * 0.9, 0, canvas.height * 0.8);
        context.closePath();
        context.fill();
        
        // Europe/Afrique (centre)
        context.fillStyle = '#8B4513';
        context.beginPath();
        context.moveTo(canvas.width * 0.4, canvas.height * 0.15);
        context.quadraticCurveTo(canvas.width * 0.5, canvas.height * 0.1, canvas.width * 0.6, canvas.height * 0.2);
        context.quadraticCurveTo(canvas.width * 0.55, canvas.height * 0.4, canvas.width * 0.5, canvas.height * 0.6);
        context.quadraticCurveTo(canvas.width * 0.45, canvas.height * 0.8, canvas.width * 0.4, canvas.height * 0.9);
        context.quadraticCurveTo(canvas.width * 0.35, canvas.height * 0.5, canvas.width * 0.4, canvas.height * 0.15);
        context.closePath();
        context.fill();
        
        // Asie (côté droit)
        context.fillStyle = '#228B22';
        context.beginPath();
        context.moveTo(canvas.width * 0.7, canvas.height * 0.1);
        context.quadraticCurveTo(canvas.width * 0.9, canvas.height * 0.2, canvas.width, canvas.height * 0.3);
        context.lineTo(canvas.width, canvas.height * 0.6);
        context.quadraticCurveTo(canvas.width * 0.8, canvas.height * 0.7, canvas.width * 0.7, canvas.height * 0.5);
        context.quadraticCurveTo(canvas.width * 0.65, canvas.height * 0.3, canvas.width * 0.7, canvas.height * 0.1);
        context.closePath();
        context.fill();
        
        // Calottes polaires
        context.fillStyle = 'rgba(255, 255, 255, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height * 0.08);
        context.fillRect(0, canvas.height * 0.92, canvas.width, canvas.height * 0.08);
        
        // Quelques îles
        for (let i = 0; i < 12; i++) {
            context.fillStyle = '#32CD32';
            context.beginPath();
            context.arc(Math.random() * canvas.width, Math.random() * canvas.height, 
                       Math.random() * 5 + 2, 0, Math.PI * 2);
            context.fill();
        }
    }
    
    createMarsTexture(context, canvas) {
        // Base rouge éclatante comme la vraie Mars
        const gradient = context.createRadialGradient(canvas.width/2, canvas.height/2, 0, 
                                                     canvas.width/2, canvas.height/2, canvas.width/2);
        gradient.addColorStop(0, '#FF6347'); // Tomato
        gradient.addColorStop(0.3, '#FF4500'); // OrangeRed
        gradient.addColorStop(0.6, '#DC143C'); // Crimson
        gradient.addColorStop(1, '#B22222'); // FireBrick
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Ajouter des régions plus sombres (bassins d'impact)
        for (let i = 0; i < 25; i++) {
            context.fillStyle = 'rgba(139, 69, 19, 0.4)';
            context.beginPath();
            context.arc(Math.random() * canvas.width, Math.random() * canvas.height, 
                       Math.random() * 20 + 8, 0, Math.PI * 2);
            context.fill();
        }
        
        // Cratères d'impact
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = Math.random() * 10 + 5;
            
            context.fillStyle = '#8B4513';
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2);
            context.fill();
            
            // Bord du cratère plus clair
            context.strokeStyle = '#CD853F';
            context.lineWidth = 2;
            context.beginPath();
            context.arc(x, y, radius * 1.1, 0, Math.PI * 2);
            context.stroke();
        }
        
        // Calottes polaires blanches
        context.fillStyle = 'rgba(255, 255, 255, 0.9)';
        // Calotte polaire nord
        context.beginPath();
        context.arc(canvas.width/2, 0, canvas.width * 0.15, 0, Math.PI);
        context.fill();
        // Calotte polaire sud
        context.beginPath();
        context.arc(canvas.width/2, canvas.height, canvas.width * 0.12, Math.PI, 2 * Math.PI);
        context.fill();
        
        // Valles Marineris (canyon géant)
        context.strokeStyle = '#654321';
        context.lineWidth = 4;
        context.beginPath();
        context.moveTo(canvas.width * 0.3, canvas.height * 0.4);
        context.quadraticCurveTo(canvas.width * 0.5, canvas.height * 0.45, canvas.width * 0.7, canvas.height * 0.5);
        context.stroke();
        
        // Zones de poussière plus claires
        for (let i = 0; i < 15; i++) {
            context.fillStyle = 'rgba(205, 133, 63, 0.3)';
            context.beginPath();
            context.arc(Math.random() * canvas.width, Math.random() * canvas.height, 
                       Math.random() * 15 + 10, 0, Math.PI * 2);
            context.fill();
        }
    }
    
    createJupiterTexture(context, canvas) {
        // Créer des bandes atmosphériques plus réalistes
        const bandColors = [
            '#F4A460', // Sandy brown
            '#D2691E', // Chocolate
            '#CD853F', // Peru
            '#DEB887', // Burlywood
            '#DAA520', // Goldenrod
            '#B8860B', // Dark goldenrod
            '#8B7355', // Dark tan
            '#A0522D'  // Sienna
        ];
        
        const bandHeight = canvas.height / bandColors.length;
        
        for (let i = 0; i < bandColors.length; i++) {
            const y = i * bandHeight;
            
            // Bande principale
            context.fillStyle = bandColors[i];
            context.fillRect(0, y, canvas.width, bandHeight);
            
            // Ajouter des turbulences dans chaque bande
            for (let x = 0; x < canvas.width; x += 20) {
                const turbulence = Math.sin(x * 0.02 + i) * 5;
                context.fillStyle = bandColors[i];
                context.fillRect(x, y + turbulence, 20, bandHeight - turbulence);
            }
            
            // Ajouter des tourbillons
            for (let j = 0; j < 3; j++) {
                const swirl_x = Math.random() * canvas.width;
                const swirl_y = y + Math.random() * bandHeight;
                
                context.fillStyle = 'rgba(255, 255, 255, 0.2)';
                context.beginPath();
                context.arc(swirl_x, swirl_y, Math.random() * 8 + 4, 0, Math.PI * 2);
                context.fill();
            }
        }
        
        // La Grande Tache Rouge (plus grande et plus détaillée)
        const grsX = canvas.width * 0.65;
        const grsY = canvas.height * 0.55;
        const grsWidth = 40;
        const grsHeight = 25;
        
        // Ombre de la tache
        context.fillStyle = 'rgba(139, 0, 0, 0.8)';
        context.beginPath();
        context.ellipse(grsX + 2, grsY + 2, grsWidth, grsHeight, 0, 0, 2 * Math.PI);
        context.fill();
        
        // Tache principale
        const grsGradient = context.createRadialGradient(grsX, grsY, 0, grsX, grsY, grsWidth);
        grsGradient.addColorStop(0, '#FF6347');
        grsGradient.addColorStop(0.5, '#DC143C');
        grsGradient.addColorStop(1, '#8B0000');
        context.fillStyle = grsGradient;
        context.beginPath();
        context.ellipse(grsX, grsY, grsWidth, grsHeight, 0, 0, 2 * Math.PI);
        context.fill();
        
        // Centre plus clair de la tache
        context.fillStyle = 'rgba(255, 99, 71, 0.6)';
        context.beginPath();
        context.ellipse(grsX - 5, grsY - 3, grsWidth * 0.6, grsHeight * 0.6, 0, 0, 2 * Math.PI);
        context.fill();
        
        // Ajouter quelques petites tempêtes
        for (let i = 0; i < 8; i++) {
            context.fillStyle = 'rgba(255, 255, 255, 0.4)';
            context.beginPath();
            context.arc(Math.random() * canvas.width, Math.random() * canvas.height, 
                       Math.random() * 6 + 3, 0, Math.PI * 2);
            context.fill();
        }
    }
    
    createSaturnTexture(context, canvas) {
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#F5DEB3');
        gradient.addColorStop(0.3, '#DEB887');
        gradient.addColorStop(0.7, '#D2B48C');
        gradient.addColorStop(1, '#BC9A6A');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    createVenusTexture(context, canvas) {
        // Base crème/jaune pâle comme la vraie Vénus
        const gradient = context.createRadialGradient(canvas.width/2, canvas.height/2, 0, 
                                                     canvas.width/2, canvas.height/2, canvas.width/2);
        gradient.addColorStop(0, '#FFF8DC');
        gradient.addColorStop(0.3, '#F5DEB3');
        gradient.addColorStop(0.6, '#DDBF94');
        gradient.addColorStop(1, '#D2B48C');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Créer des patterns de nuages tourbillonnants
        for (let i = 0; i < 15; i++) {
            const centerX = Math.random() * canvas.width;
            const centerY = Math.random() * canvas.height;
            
            // Nuages en spirale
            for (let j = 0; j < 20; j++) {
                const angle = (j / 20) * Math.PI * 4 + i;
                const radius = j * 3;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                
                context.fillStyle = 'rgba(255, 255, 255, 0.2)';
                context.beginPath();
                context.arc(x, y, Math.random() * 8 + 4, 0, Math.PI * 2);
                context.fill();
            }
        }
        
        // Ajouter des bandes de nuages plus sombres
        for (let y = 0; y < canvas.height; y += 40) {
            context.fillStyle = 'rgba(210, 180, 140, 0.3)';
            context.fillRect(0, y + Math.sin(y * 0.1) * 10, canvas.width, 15);
        }
        
        // Quelques zones plus brillantes (réflexion du soleil)
        for (let i = 0; i < 8; i++) {
            context.fillStyle = 'rgba(255, 248, 220, 0.4)';
            context.beginPath();
            context.arc(Math.random() * canvas.width, Math.random() * canvas.height, 
                       Math.random() * 20 + 10, 0, Math.PI * 2);
            context.fill();
        }
    }
    
    createMercuryTexture(context, canvas) {
        // Base grise comme la vraie Mercure
        const gradient = context.createRadialGradient(canvas.width/2, canvas.height/2, 0, 
                                                     canvas.width/2, canvas.height/2, canvas.width/2);
        gradient.addColorStop(0, '#B8B8B8');
        gradient.addColorStop(0.3, '#A0A0A0');
        gradient.addColorStop(0.6, '#808080');
        gradient.addColorStop(1, '#606060');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Ajouter de nombreux cratères comme sur la vraie Mercure
        for (let i = 0; i < 35; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = Math.random() * 12 + 3;
            
            // Cratère principal
            context.fillStyle = '#555555';
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2);
            context.fill();
            
            // Bord plus clair du cratère
            context.fillStyle = '#999999';
            context.beginPath();
            context.arc(x, y, radius * 1.2, 0, Math.PI * 2);
            context.stroke();
        }
        
        // Ajouter quelques zones plus sombres (plaines)
        for (let i = 0; i < 8; i++) {
            context.fillStyle = 'rgba(96, 96, 96, 0.3)';
            context.beginPath();
            context.arc(Math.random() * canvas.width, Math.random() * canvas.height, 
                       Math.random() * 25 + 15, 0, Math.PI * 2);
            context.fill();
        }
    }
    
    createUranusTexture(context, canvas) {
        // Base bleu-vert pâle caractéristique d'Uranus
        const gradient = context.createRadialGradient(canvas.width/2, canvas.height/2, 0, 
                                                     canvas.width/2, canvas.height/2, canvas.width/2);
        gradient.addColorStop(0, '#AFEEEE');
        gradient.addColorStop(0.3, '#87CEEB');
        gradient.addColorStop(0.6, '#4FD0C3');
        gradient.addColorStop(1, '#008B8B');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Uranus a une atmosphère très uniforme, donc peu de détails
        // Ajouter quelques subtiles variations de couleur
        for (let i = 0; i < 8; i++) {
            context.fillStyle = 'rgba(175, 238, 238, 0.2)';
            context.beginPath();
            context.arc(Math.random() * canvas.width, Math.random() * canvas.height, 
                       Math.random() * 20 + 10, 0, Math.PI * 2);
            context.fill();
        }
        
        // Bandes atmosphériques très subtiles (Uranus tourne sur le côté)
        for (let x = 0; x < canvas.width; x += 40) {
            context.fillStyle = 'rgba(64, 224, 208, 0.15)';
            context.fillRect(x + Math.sin(x * 0.1) * 5, 0, 20, canvas.height);
        }
        
        // Quelques zones plus sombres (nuages de méthane)
        for (let i = 0; i < 6; i++) {
            context.fillStyle = 'rgba(0, 139, 139, 0.2)';
            context.beginPath();
            context.arc(Math.random() * canvas.width, Math.random() * canvas.height, 
                       Math.random() * 15 + 8, 0, Math.PI * 2);
            context.fill();
        }
        
        // Zones plus brillantes
        for (let i = 0; i < 5; i++) {
            context.fillStyle = 'rgba(224, 255, 255, 0.3)';
            context.beginPath();
            context.arc(Math.random() * canvas.width, Math.random() * canvas.height, 
                       Math.random() * 12 + 6, 0, Math.PI * 2);
            context.fill();
        }
        
        // Ajouter un effet de brillance uniforme (atmosphère de méthane)
        const shineGradient = context.createRadialGradient(canvas.width * 0.3, canvas.height * 0.3, 0, 
                                                          canvas.width * 0.3, canvas.height * 0.3, canvas.width * 0.4);
        shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        context.fillStyle = shineGradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    createNeptuneTexture(context, canvas) {
        // Base bleu profond comme Neptune
        const gradient = context.createRadialGradient(canvas.width/2, canvas.height/2, 0, 
                                                     canvas.width/2, canvas.height/2, canvas.width/2);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.3, '#4169E1');
        gradient.addColorStop(0.6, '#1E90FF');
        gradient.addColorStop(1, '#191970');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Bandes atmosphériques subtiles
        for (let y = 0; y < canvas.height; y += 30) {
            context.fillStyle = 'rgba(70, 130, 180, 0.3)';
            context.fillRect(0, y + Math.sin(y * 0.1) * 8, canvas.width, 15);
        }
        
        // La Grande Tache Sombre (équivalent à la Grande Tache Rouge de Jupiter)
        const darkSpotX = canvas.width * 0.3;
        const darkSpotY = canvas.height * 0.4;
        
        // Ombre de la tache
        context.fillStyle = 'rgba(25, 25, 112, 0.9)';
        context.beginPath();
        context.ellipse(darkSpotX + 1, darkSpotY + 1, 18, 12, 0, 0, 2 * Math.PI);
        context.fill();
        
        // Tache principale
        const spotGradient = context.createRadialGradient(darkSpotX, darkSpotY, 0, darkSpotX, darkSpotY, 15);
        spotGradient.addColorStop(0, '#191970');
        spotGradient.addColorStop(0.5, '#0F0F50');
        spotGradient.addColorStop(1, '#000080');
        context.fillStyle = spotGradient;
        context.beginPath();
        context.ellipse(darkSpotX, darkSpotY, 15, 10, 0, 0, 2 * Math.PI);
        context.fill();
        
        // Tempêtes et tourbillons atmosphériques
        for (let i = 0; i < 12; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            
            // Tourbillons blancs (nuages de méthane)
            context.fillStyle = 'rgba(135, 206, 235, 0.4)';
            context.beginPath();
            context.arc(x, y, Math.random() * 8 + 4, 0, Math.PI * 2);
            context.fill();
            
            // Petits tourbillons autour
            for (let j = 0; j < 4; j++) {
                const angle = (j / 4) * Math.PI * 2;
                const radius = 15;
                const sx = x + Math.cos(angle) * radius;
                const sy = y + Math.sin(angle) * radius;
                
                context.fillStyle = 'rgba(100, 149, 237, 0.3)';
                context.beginPath();
                context.arc(sx, sy, Math.random() * 4 + 2, 0, Math.PI * 2);
                context.fill();
            }
        }
        
        // Bandes de vent à haute vitesse
        for (let i = 0; i < 6; i++) {
            const y = (i / 6) * canvas.height;
            context.strokeStyle = 'rgba(176, 196, 222, 0.2)';
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(0, y);
            for (let x = 0; x < canvas.width; x += 10) {
                context.lineTo(x, y + Math.sin(x * 0.1 + i) * 5);
            }
            context.stroke();
        }
        
        // Zones plus brillantes (réflexion du soleil)
        for (let i = 0; i < 5; i++) {
            context.fillStyle = 'rgba(173, 216, 230, 0.3)';
            context.beginPath();
            context.arc(Math.random() * canvas.width, Math.random() * canvas.height, 
                       Math.random() * 12 + 6, 0, Math.PI * 2);
            context.fill();
        }
    }
    
    createPlanets() {
        Object.keys(this.planetData).forEach(planetName => {
            const data = this.planetData[planetName];
            const planetGroup = new THREE.Group();
            
            const geometry = new THREE.SphereGeometry(data.radius, 64, 32);
            let material;
            
            if (planetName === 'sun') {
                material = new THREE.MeshBasicMaterial({ 
                    color: data.color,
                    emissive: data.emissive || data.color,
                    emissiveIntensity: 0.6
                });
                
                const glowGeometry = new THREE.SphereGeometry(data.radius * 1.3, 32, 16);
                const glowMaterial = new THREE.MeshBasicMaterial({
                    color: 0xFFAA00,
                    transparent: true,
                    opacity: 0.2,
                    side: THREE.BackSide
                });
                const glow = new THREE.Mesh(glowGeometry, glowMaterial);
                planetGroup.add(glow);
            } else {
                const texture = this.createRealisticTexture(planetName, data);
                material = new THREE.MeshLambertMaterial({ 
                    map: texture,
                    color: data.color,
                    emissive: new THREE.Color(data.color).multiplyScalar(0.1),
                    transparent: false
                });
            }
            
            if (planetName === 'saturn') {
                const ringGeometry = new THREE.RingGeometry(data.radius * 1.2, data.radius * 2.2, 64);
                const ringTexture = this.createSaturnRingTexture();
                const ringMaterial = new THREE.MeshBasicMaterial({
                    map: ringTexture,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.8
                });
                const rings = new THREE.Mesh(ringGeometry, ringMaterial);
                rings.rotation.x = Math.PI / 2;
                planetGroup.add(rings);
            }
            
            if (planetName === 'earth') {
                const cloudGeometry = new THREE.SphereGeometry(data.radius * 1.01, 32, 16);
                const cloudTexture = this.createCloudTexture();
                const cloudMaterial = new THREE.MeshLambertMaterial({
                    map: cloudTexture,
                    transparent: true,
                    opacity: 0.4
                });
                const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
                planetGroup.add(clouds);
                planetGroup.userData.clouds = clouds;
            }
            
            const planet = new THREE.Mesh(geometry, material);
            planet.castShadow = true;
            planet.receiveShadow = true;
            planet.userData = { name: planetName, data: data };
            
            planetGroup.add(planet);
            planetGroup.position.x = data.distance;
            planetGroup.userData = { 
                name: planetName, 
                data: data, 
                angle: Math.random() * Math.PI * 2,
                planet: planet
            };
            
            this.scene.add(planetGroup);
            this.planets.push(planetGroup);
        });
    }
    
    createSaturnRingTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        
        const gradient = context.createRadialGradient(128, 128, 50, 128, 128, 128);
        gradient.addColorStop(0, 'rgba(218, 165, 32, 0)');
        gradient.addColorStop(0.3, 'rgba(218, 165, 32, 0.8)');
        gradient.addColorStop(0.5, 'rgba(160, 82, 45, 0.6)');
        gradient.addColorStop(0.7, 'rgba(139, 69, 19, 0.4)');
        gradient.addColorStop(1, 'rgba(139, 69, 19, 0)');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        return new THREE.CanvasTexture(canvas);
    }
    
    createCloudTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        
        context.fillStyle = 'rgba(255, 255, 255, 0)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < 20; i++) {
            context.fillStyle = 'rgba(255, 255, 255, 0.3)';
            context.beginPath();
            context.arc(Math.random() * canvas.width, Math.random() * canvas.height, 
                       Math.random() * 15 + 5, 0, Math.PI * 2);
            context.fill();
        }
        
        return new THREE.CanvasTexture(canvas);
    }
    
    createPlanetLabel(planetGroup, name) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.fillStyle = 'rgba(0, 0, 0, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = '#FFD700';
        context.font = 'Bold 24px Arial';
        context.textAlign = 'center';
        context.fillText(name, canvas.width / 2, canvas.height / 2 + 8);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(8, 2, 1);
        sprite.position.y = planetGroup.userData.data.radius + 3;
        
        planetGroup.add(sprite);
        this.planetLabels.push(sprite);
    }
    
    createOrbitLines() {
        Object.keys(this.planetData).forEach(planetName => {
            const data = this.planetData[planetName];
            if (data.distance > 0) {
                const curve = new THREE.EllipseCurve(
                    0, 0,
                    data.distance, data.distance,
                    0, 2 * Math.PI,
                    false,
                    0
                );
                
                const points = curve.getPoints(100);
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const material = new THREE.LineBasicMaterial({ 
                    color: 0x444444, 
                    transparent: true, 
                    opacity: 0.3 
                });
                
                const orbit = new THREE.Line(geometry, material);
                orbit.rotation.x = Math.PI / 2;
                this.scene.add(orbit);
                this.orbitLines.push(orbit);
            }
        });
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        this.renderer.domElement.addEventListener('click', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(
                this.planets.map(p => p.userData.planet)
            );
            
            if (intersects.length > 0) {
                const clickedPlanet = intersects[0].object;
                this.showPlanetInfo(clickedPlanet.userData.name, clickedPlanet.userData.data);
            }
        });
        
        document.getElementById('toggle-labels').addEventListener('click', () => {
            this.toggleLabels();
        });
        
        document.getElementById('toggle-orbits').addEventListener('click', () => {
            this.toggleOrbits();
        });
        
        document.getElementById('speed-control').addEventListener('click', (e) => {
            this.cycleSpeed(e.target);
        });
        
        document.getElementById('reset-camera').addEventListener('click', () => {
            this.resetCamera();
        });
        
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                event.preventDefault();
                this.toggleLabels();
            }
        });
    }
    
    showPlanetInfo(planetName, data) {
        document.getElementById('planet-name').textContent = data.name;
        document.getElementById('planet-description').textContent = data.description;
    }
    
    toggleLabels() {
        this.showLabels = !this.showLabels;
        this.planetLabels.forEach(label => {
            label.visible = this.showLabels;
        });
    }
    
    toggleOrbits() {
        this.showOrbits = !this.showOrbits;
        this.orbitLines.forEach(orbit => {
            orbit.visible = this.showOrbits;
        });
    }
    
    cycleSpeed(button) {
        const speeds = [0.5, 1, 2, 5];
        const currentSpeed = parseFloat(button.dataset.speed);
        const currentIndex = speeds.indexOf(currentSpeed);
        const nextIndex = (currentIndex + 1) % speeds.length;
        const newSpeed = speeds[nextIndex];
        
        this.animationSpeed = newSpeed;
        button.dataset.speed = newSpeed;
        button.textContent = `Speed: ${newSpeed}x`;
    }
    
    resetCamera() {
        this.camera.position.set(0, 30, 80);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.planets.forEach(planetGroup => {
            const data = planetGroup.userData.data;
            if (data.distance > 0) {
                planetGroup.userData.angle += data.speed * this.animationSpeed * 0.01;
                planetGroup.position.x = Math.cos(planetGroup.userData.angle) * data.distance;
                planetGroup.position.z = Math.sin(planetGroup.userData.angle) * data.distance;
            }
            
            planetGroup.userData.planet.rotation.y += 0.01 * this.animationSpeed;
            
            if (planetGroup.userData.clouds) {
                planetGroup.userData.clouds.rotation.y += 0.005 * this.animationSpeed;
            }
        });
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading');
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 2000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SolarSystem();
}); 