// Helper utilities for handling images from API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const IMAGE_ENDPOINT = `${API_URL}/images`;

// Get the image URL for a blog post
export const getBlogImageUrl = (blogId: number): string => {
  return `${IMAGE_ENDPOINT}/blog/${blogId}`;
};

// Get the image URL for a person
export const getPersonImageUrl = (personId: number): string => {
  return `${IMAGE_ENDPOINT}/person/${personId}`;
};

// Get the image URL for a company
export const getCompanyImageUrl = (companyId: number): string => {
  return `${IMAGE_ENDPOINT}/company/${companyId}`;
};

// Get a fallback image for entities without images
export const getFallbackImageUrl = (_name: string, type: 'person' | 'company' | 'blog' = 'person', id?: number): string => {
  // Use local fallback images instead of external placeholder service
  if (type === 'company') {
    // Default company image - use ID to select different company images if available
    if (id) {
      const companyImgIndex = (id % 7) + 1; // We have c1.png through c7.png
      return `/assets/images/company_img/c${companyImgIndex}.png`;
    }
    return '/assets/images/company_img/c1.png';
  } else if (type === 'blog') {
    // Default blog image - use ID to select different blog images
    if (id) {
      // We have b1.png, b2.jpg, b3.png, b4.png
      const blogImgFiles = ['b1.png', 'b2.jpg', 'b3.png', 'b4.png'];
      const blogImgIndex = id % blogImgFiles.length;
      return `/assets/images/blog_thumb/${blogImgFiles[blogImgIndex]}`;
    }
    return '/assets/images/blog_thumb/b1.png';
  } else {
    // Default person image - use ID to select different user images if available
    if (id) {
      const userImgIndex = (id % 6) + 1; // We have u1.png through u6.jpg
      const extension = userImgIndex === 6 ? 'jpg' : 'png';
      return `/assets/images/users_img/u${userImgIndex}.${extension}`;
    }
    return '/assets/images/users_img/u1.png';
  }
};
