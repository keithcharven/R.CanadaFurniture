const PLACEHOLDER = 'https://placehold.co/400x400/FFE4E9/FF7A9C?text=No+Image';

export function getImageUrl(imagePath, placeholder = PLACEHOLDER) {
  if (!imagePath) return placeholder;
  if (imagePath.startsWith('http')) return imagePath;
  return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
}

export { PLACEHOLDER };
