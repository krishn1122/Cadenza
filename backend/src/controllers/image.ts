import { Request, Response } from 'express';
import { Blog, Person, Company } from '../models';

// Get image URL for a blog post - This is now just a redirect
export const getBlogImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findByPk(id, {
      attributes: ['image_url']
    });
    
    if (!blog || !blog.image_url) {
      // Redirect to a default/placeholder image
      res.redirect('/images/blog_thumb/b1.png');
      return;
    }
    
    // Redirect to the static image URL
    res.redirect(blog.image_url);
  } catch (error: any) {
    console.error('Error fetching blog image URL:', error.message);
    res.status(500).send('Server error');
  }
};

// Get image URL for a person - This is now just a redirect
export const getPersonImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const person = await Person.findByPk(id, {
      attributes: ['avatar_url']
    });
    
    if (!person || !person.avatar_url) {
      // Redirect to a default/placeholder image
      res.redirect('/images/users_img/u1.png');
      return;
    }
    
    // Redirect to the static image URL
    res.redirect(person.avatar_url);
  } catch (error: any) {
    console.error('Error fetching person image URL:', error.message);
    res.status(500).send('Server error');
  }
};

// Get image URL for a company - This is now just a redirect
export const getCompanyImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const company = await Company.findByPk(id, {
      attributes: ['logo_url']
    });
    
    if (!company || !company.logo_url) {
      // Redirect to a default/placeholder image
      res.redirect('/images/company_img/c1.png');
      return;
    }
    
    // Redirect to the static image URL
    res.redirect(company.logo_url);
  } catch (error: any) {
    console.error('Error fetching company image URL:', error.message);
    res.status(500).send('Server error');
  }
};
