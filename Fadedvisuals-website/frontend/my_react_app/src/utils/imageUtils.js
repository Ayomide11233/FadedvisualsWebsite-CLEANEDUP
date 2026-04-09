export const getProductImage = (product) => {
    if (!product) return '/placeholder.png';
  
    // Get the raw value from either field
    const rawPath = product.image_url || product.image;
  
    if (!rawPath) return '/placeholder.png';
  
    // 1. If it's already a full external URL, return it
    if (rawPath.startsWith('http')) {
      return rawPath;
    }
  
    // 2. If it ALREADY contains the static path, just add the domain
    if (rawPath.includes('/static/uploads/')) {
      // Remove leading slashes to prevent "localhost:8000//static..."
      const cleanPath = rawPath.startsWith('/') ? rawPath.slice(1) : rawPath;
      return `http://localhost:8000/${cleanPath}`;
    }
  
    // 3. If it's just a filename (e.g. "design.png"), add the full path
    return `http://localhost:8000/static/uploads/${rawPath}`;
  };