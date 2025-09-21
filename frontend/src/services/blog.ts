// Blog service for managing blog posts
interface BlogPost {
  id: number;
  title: string;
  imageUrl: string;
  date: string;
  isPinned: boolean;
}

interface BlogResponse {
  posts: BlogPost[];
  totalPages: number;
}

// Mock data for demonstration purposes
const mockBlogPosts: BlogPost[] = Array.from({ length: 20 }, (_, i) => {
  // Cycle through available blog images
  const imageIndex = (i % 4) + 1;
  const imageExtension = imageIndex === 2 ? 'jpg' : 'png';
  
  return {
    id: i + 1,
    title: `Bridging Real-World Assets and Blockchain: OstiumLab's Bold Vision`,
    imageUrl: `/assets/images/blog_thumb/b${imageIndex}.${imageExtension}`,
    date: 'May 05, 2025',
    isPinned: i === 0 || i === 4 // Make a couple posts pinned by default
  };
});

export const blogService = {
  // Get blog posts with pagination
  getBlogPosts: async (page: number, limit: number = 8): Promise<BlogResponse> => {
    // This would be an API call in a real application
    return new Promise((resolve) => {
      setTimeout(() => {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedPosts = mockBlogPosts.slice(startIndex, endIndex);
        const totalPages = Math.ceil(mockBlogPosts.length / limit);
        
        resolve({
          posts: paginatedPosts,
          totalPages
        });
      }, 500);
    });
  },
  
  // Get pinned blog posts for dashboard
  getPinnedBlogPosts: async (): Promise<BlogPost[]> => {
    // This would be an API call in a real application
    return new Promise((resolve) => {
      setTimeout(() => {
        const pinnedPosts = mockBlogPosts.filter(post => post.isPinned);
        resolve(pinnedPosts);
      }, 500);
    });
  },
  
  // Toggle pinned status of a blog post
  togglePinned: async (id: number): Promise<boolean> => {
    // This would be an API call in a real application
    return new Promise((resolve) => {
      setTimeout(() => {
        const postIndex = mockBlogPosts.findIndex(post => post.id === id);
        if (postIndex !== -1) {
          mockBlogPosts[postIndex].isPinned = !mockBlogPosts[postIndex].isPinned;
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  }
};

export type { BlogPost };
