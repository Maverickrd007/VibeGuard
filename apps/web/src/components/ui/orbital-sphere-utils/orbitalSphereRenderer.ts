export type OrbitalSphereOptions = {
  hue: number;
};

export const ORBITAL_SPHERE_DEFAULTS: OrbitalSphereOptions = {
  hue: 250,
};

export function createOrbitalSphereRenderer(
  canvas: HTMLCanvasElement,
  getOptions: () => OrbitalSphereOptions
) {
  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let time = 0;
  
  // Generate particles using a Fibonacci sphere distribution for an even 3D globe
  const particles: {x: number, y: number, z: number, size: number}[] = [];
  const numParticles = 800; // Dense particle cloud
  
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < numParticles; i++) {
    const y = 1 - (i / (numParticles - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = phi * i;
    
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    
    particles.push({ x, y, z, size: Math.random() * 1.5 + 0.5 });
  }

  return {
    resize: (w: number, h: number) => {
      // Handle high DPI displays for crisp rendering
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      if (ctx) ctx.scale(dpr, dpr);
      width = w;
      height = h;
    },
    render: () => {
      if (!ctx) return;
      time += 0.003; // Rotation speed
      
      // Dark background 
      ctx.fillStyle = "#05030a"; 
      ctx.fillRect(0, 0, width, height);
      
      const centerX = width / 2;
      const centerY = height / 2;
      // Adjust sphere size based on screen
      const sphereRadius = Math.min(width, height) * 0.35; 
      
      particles.forEach((p) => {
        // Rotate around Y axis
        const rotY_x = p.x * Math.cos(time) - p.z * Math.sin(time);
        const rotY_z = p.x * Math.sin(time) + p.z * Math.cos(time);
        
        // Rotate around X axis for a tilted orbital look
        const tilt = time * 0.4;
        const rotX_y = p.y * Math.cos(tilt) - rotY_z * Math.sin(tilt);
        const rotX_z = p.y * Math.sin(tilt) + rotY_z * Math.cos(tilt);
        
        // 3D to 2D projection
        const scale = 300 / (300 + rotX_z * 100);
        const projX = centerX + rotY_x * sphereRadius * scale;
        const projY = centerY + rotX_y * sphereRadius * scale;
        
        // Fade particles based on their Z depth (particles in back are dimmer)
        const depth = (rotX_z + 1) / 2; // 0 to 1
        const alpha = Math.max(0.05, depth);
        
        ctx.beginPath();
        ctx.arc(projX, projY, p.size * scale, 0, Math.PI * 2);
        
        // Draw the particles in base RED so the CSS hue-rotate(250) turns them violet
        ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
        if (depth > 0.8) {
           ctx.shadowBlur = 10;
           ctx.shadowColor = "rgba(255, 0, 0, 0.8)";
        } else {
           ctx.shadowBlur = 0;
        }
        ctx.fill();
      });
    },
    dispose: () => {
      // Cleanup if necessary
    }
  };
}
