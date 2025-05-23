Interactive 3D Solar System

An impressive Three.js-powered interactive solar system that brings the cosmos to your browser. This project demonstrates advanced 3D graphics programming, orbital mechanics simulation, and interactive web design.

Features

Core Functionality:
- Realistic Solar System: All 8 planets plus the Sun with accurate relative sizes and distances
- Orbital Animation: Planets orbit the Sun at realistic relative speeds
- Interactive Controls: Full 3D navigation with mouse and keyboard controls
- Planet Information: Click on any planet to learn fascinating facts about it

Visual Effects:
- Particle Star Field: 3000+ randomly placed stars for realistic space atmosphere
- Dynamic Lighting: Point light source from the Sun illuminates all planets
- Shadow Mapping: Realistic shadows cast by planets
- Special Planet Features:
  - Sun: Glowing effect with emissive materials
  - Saturn: Beautiful ring system
  - All planets: Realistic colors and materials

Interactive Features:
- Mouse Controls:
  - Left Click + Drag: Rotate camera around the solar system
  - Right Click + Drag: Pan the view
  - Scroll Wheel: Zoom in/out
- Keyboard Controls:
  - Space: Toggle planet labels on/off
- UI Controls:
  - Toggle Labels: Show/hide planet names
  - Toggle Orbits: Show/hide orbital paths
  - Speed Control: Adjust animation speed (0.5x, 1x, 2x, 5x)
  - Reset View: Return camera to default position

Responsive Design:
- Fully responsive layout that works on desktop, tablet, and mobile
- Touch-friendly controls for mobile devices
- Adaptive UI elements for different screen sizes

Technical Implementation

Technologies Used:
- Three.js: 3D graphics rendering and animation
- Vanilla JavaScript: Core application logic and interactivity
- HTML5: Modern semantic markup
- CSS3: Advanced styling with gradients, animations, and responsive design

Key Three.js Features Demonstrated:
- Scene management and rendering
- Perspective camera with orbital controls
- Mesh creation with various geometries (spheres, rings)
- Material systems (Phong, Basic, Point materials)
- Lighting systems (ambient, point lights)
- Particle systems for star field
- Animation loops and frame rate management
- Ray casting for object interaction
- Group hierarchies for planet systems

Code Architecture:
- Object-Oriented Design: Clean class-based structure
- Modular Functions: Separated concerns for different features
- Event-Driven: Responsive to user interactions
- Performance Optimized: Efficient rendering and memory management

Getting Started

Quick Start:
1. Clone or Download this repository
2. Open index.html in any modern web browser or type  python3 -m http.server 8000
3. Explore the solar system!

No Build Process Required:
This project uses vanilla JavaScript and CDN-hosted Three.js, so no installation or build process is needed. Simply open the HTML file in your browser and start exploring!

Recommended Browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

How to Use

Navigation:
1. Rotate View: Click and drag with left mouse button to orbit around the solar system
2. Pan View: Right-click and drag to move the view left/right/up/down
3. Zoom: Use mouse wheel to zoom in for close-up views or zoom out for full system view

Interaction:
1. Learn About Planets: Click on any planet to see information about it in the side panel
2. Toggle Features: Use the control buttons to show/hide labels and orbits
3. Control Speed: Change animation speed to observe orbital mechanics at different rates
4. Reset View: Return to the default viewing angle anytime

Educational Features:
- Each planet includes real astronomical facts
- Orbital speeds are proportionally accurate
- Planet sizes are scaled for visibility while maintaining relative proportions
- Colors represent actual planetary appearances

Portfolio Highlights

This project demonstrates proficiency in:

- 3D Graphics Programming: Advanced Three.js implementation
- Mathematical Concepts: Orbital mechanics and 3D transformations
- User Experience Design: Intuitive controls and responsive interface
- Performance Optimization: Smooth 60fps animation with thousands of objects
- Educational Technology: Combining learning with interactive entertainment
- Modern Web Development: ES6+ JavaScript, responsive CSS, semantic HTML

Customization

Adding New Celestial Bodies:
Extend the planetData object in script.js:

```javascript
newPlanet: { 
    radius: 1.2, 
    distance: 35, 
    speed: 0.020, 
    color: 0xFF5733, 
    name: "New Planet", 
    description: "Your custom planet description" 
}
```

Modifying Visual Effects:
- Star Field: Adjust starCount in createStarField() method
- Lighting: Modify light intensity and colors in createLights() method
- Materials: Change planet colors and properties in the planetData object

Performance Tuning:
- Reduce star count for better performance on older devices
- Adjust shadow map resolution in the lighting setup
- Modify sphere geometry detail level for performance vs. quality trade-offs

Performance Metrics

- 60 FPS smooth animation on modern devices
- 3000+ particles in the star field
- Real-time shadows and lighting calculations
- Responsive design supporting screen sizes from 320px to 4K+

Contributing

Feel free to fork this project and submit pull requests for improvements! Some ideas for enhancements:

- Add moons for planets that have them
- Implement realistic planet textures
- Add asteroid belt visualization
- Include comet animations
- Add sound effects and ambient music

License

This project is open source and available under the MIT License. Feel free to use it in your own projects!

Showcase

This project is perfect for demonstrating:
- Frontend development skills
- 3D graphics programming
- Interactive design capabilities
- Educational technology development
- Modern web standards implementation

Built with JavaScript for the love of space exploration! 