import { User, Company, Person, Blog } from '../models';

/**
 * Seed the database with some sample data
 */
export const seedDatabase = async (): Promise<void> => {
  console.log('Seeding database with sample data...');
  
  try {
    // Models are already imported at the top
    
    // Check if companies already exist
    const companyCount = await Company.count();
    
    // Define companyData outside the if block with proper type
    // Note: We're defining company data without logo field as we'll handle images separately
    const companyData: {
      name: string;
      logo_url: string;
      category: string;
      location: string;
      description: string;
      verified: boolean;
      stage: string;
      website: string;
      founded_year: number;
      employee_count: string;
      funding_stage: string;
      total_funding: string;
      investor_information: string;
      product_description: string;
      business_model: string;
      target_market: string;
      competitive_landscape: string;
      traction_metrics: string;
      tractionScore: number;
      notes: string;
    }[] = [];
    
    if (companyCount === 0) {
      console.log('Creating sample companies...');
      // Sample company data
      const companyData = [
        {
          name: 'Quantum Leader',
          logo_url: '/images/company_img/c1.png',
          category: 'Blockchain & Fintech',
          location: 'California, USA',
          description: 'QuantumLedger is a blockchain-based fintech platform enabling ultra-secure, real-time transaction processing and smart contract execution for global enterprises and digital banks.',
          verified: true,
          stage: 'Venture Stage',
          website: 'https://www.quantumledger.io',
          founded_year: 2018,
          employee_count: '50-100',
          funding_stage: 'Series B',
          total_funding: '$25M',
          investor_information: 'Backed by Andreessen Horowitz, Sequoia Capital',
          product_description: 'QuantumLedger offers a suite of blockchain-powered financial solutions including payment processing, smart contracts, and decentralized finance applications.',
          business_model: 'SaaS with transaction fees',
          target_market: 'Enterprise financial institutions, digital banks, and fintech companies',
          competitive_landscape: 'Competing with traditional financial infrastructure providers and blockchain startups',
          traction_metrics: 'Processing over $100M in monthly transaction volume with 50+ enterprise clients',
          tractionScore: 85,
          notes: 'Strong technical team with ex-Google and ex-PayPal founders. Patented technology.'
        },
        {
          name: 'Apiha Capital Lab',
          logo_url: '/images/company_img/c2.png',
          category: 'AI',
          location: 'New York, USA',
          description: 'Apiha Capital Lab is an AI-powered venture firm that scouts, evaluates, and accelerates early-stage startups in AI, healthtech, and sustainable innovation across North America.',
          verified: true,
          stage: 'Growth Stage',
          website: 'https://www.apihacapital.com',
          founded_year: 2016,
          employee_count: '20-50',
          funding_stage: 'Series A',
          total_funding: '$15M',
          investor_information: 'Backed by Y Combinator, Founders Fund',
          product_description: 'Apiha offers an AI platform that identifies promising startups and provides capital along with strategic guidance.',
          business_model: 'Equity-based investing with management fees',
          target_market: 'Early-stage startups in AI, healthtech, and climate tech',
          competitive_landscape: 'Competing with traditional VC firms and emerging AI-powered investment platforms',
          traction_metrics: 'Portfolio of 35 companies with 3 successful exits',
          tractionScore: 78,
          notes: 'Strong network in Silicon Valley and New York. Proprietary AI algorithms for startup evaluation.'
        },
        {
          name: 'HealthGen Pharmaceuticals',
          logo_url: '/images/company_img/c3.png',
          category: 'HealthTech & AI',
          location: 'Boston, USA',
          description: 'HealthGen AI leverages artificial intelligence to revolutionize personalized medicine and drug discovery, significantly reducing development timelines and improving patient outcomes.',
          verified: true,
          stage: 'Early Stage',
          website: 'https://www.healthgenai.com',
          founded_year: 2020,
          employee_count: '10-20',
          funding_stage: 'Seed',
          total_funding: '$5M',
          investor_information: 'Backed by Khosla Ventures, Biomatics Capital',
          product_description: "HealthGen's platform uses machine learning to analyze genomic data and identify potential drug targets for various diseases.",
          business_model: 'Research partnerships with pharmaceutical companies and licensing fees',
          target_market: 'Pharmaceutical companies, research institutions, and healthcare providers',
          competitive_landscape: 'Competing with traditional drug discovery methods and other AI healthcare startups',
          traction_metrics: 'Two major partnerships with top-10 pharmaceutical companies',
          tractionScore: 65,
          notes: 'Founded by former MIT researchers with strong backgrounds in computational biology.'
        },
        {
          name: 'EcoSync Solutions',
          logo_url: '/images/company_img/c4.png',
          category: 'CleanTech',
          location: 'Seattle, USA',
          description: 'EcoSync Solutions develops smart grid technology that optimizes energy distribution and consumption, enabling businesses and municipalities to reduce carbon footprint while cutting costs.',
          verified: false,
          stage: 'Growth Stage',
          website: 'https://www.ecosyncsolutions.com',
          founded_year: 2017,
          employee_count: '50-100',
          funding_stage: 'Series B',
          total_funding: '$30M',
          investor_information: 'Backed by Breakthrough Energy Ventures, Clean Energy Ventures',
          product_description: "EcoSync's platform integrates with existing power infrastructure to optimize energy flow and reduce waste using AI-powered algorithms.",
          business_model: 'Hardware sales with recurring software subscriptions',
          target_market: 'Utilities, commercial buildings, and municipalities',
          competitive_landscape: 'Competing with traditional energy management systems and emerging smart grid startups',
          traction_metrics: 'Deployed in 15 cities across the US with demonstrable 20% energy savings',
          tractionScore: 82,
          notes: 'Strong partnerships with major utility companies. Patented technology with proven results.'
        },
        {
          name: 'NextGen Robotics',
          logo_url: '/images/company_img/c5.png',
          category: 'Robotics',
          location: 'Austin, USA',
          description: 'NextGen Robotics creates autonomous robotic solutions for warehousing and logistics, helping businesses automate operations, increase efficiency, and reduce labor costs.',
          verified: true,
          stage: 'Late Stage',
          website: 'https://www.nextgenrobotics.com',
          founded_year: 2015,
          employee_count: '100-250',
          funding_stage: 'Series C',
          total_funding: '$75M',
          investor_information: 'Backed by Lux Capital, GV, and Siemens Next47',
          product_description: 'NextGen offers fully autonomous robots for warehouse operations, including picking, packing, and inventory management.',
          business_model: 'Robot-as-a-Service (RaaS) with monthly subscription fees',
          target_market: 'E-commerce companies, warehouse operators, and logistics providers',
          competitive_landscape: 'Competing with traditional warehouse automation solutions and other robotics startups',
          traction_metrics: 'Deployed in over 50 facilities with 200% YoY growth',
          tractionScore: 90,
          notes: 'Industry-leading technology with proven ROI for customers. Strong executive team with experience at Amazon Robotics.'
        }
      ];
      
      // Insert companies
      await Company.bulkCreate(companyData);
      console.log('✅ Sample companies created successfully');
    } else {
      console.log('Companies data already exists, skipping seed');
    }
    
    // Check if people already exist
    const peopleCount = await Person.count();
    
    if (peopleCount === 0) {
      // Get records of existing companies first
      const companies = await Company.findAll({ raw: true });
      
      // Sample people data
      const peopleData = [
        {
          name: 'John Anderson',
          avatar_url: '/images/users_img/u1.png',
          category: 'Fintech',
          location: 'New York, USA',
          description: 'Serial entrepreneur with over 15 years of experience in fintech and blockchain. Founded three successful startups with two exits.',
          verified: true,
          company: 'Quantum Leader',
          position: 'Founder & CEO',
          email: 'john@quantumledger.io',
          linkedin: 'linkedin.com/in/johnanderson',
          twitter: 'twitter.com/johnanderson',
          education: 'MBA from Stanford, BS in Computer Science from MIT',
          experience: 'Previously founded PayTech (acquired by Square) and served as CTO at BlockFin',
          skills: 'Blockchain, Leadership, Product Strategy, Fundraising',
          achievements: 'Forbes 30 Under 30, Raised over $100M in venture funding, Holds 5 patents in blockchain technology',
          notes: 'Strong technical background combined with business acumen. Well-connected in Silicon Valley.'
        },
        {
          name: 'Sarah Williams',
          avatar_url: '/images/users_img/u2.png',
          category: 'AI Research',
          location: 'Boston, USA',
          description: 'AI researcher and entrepreneur specializing in machine learning applications for healthcare. Published in top AI conferences and journals.',
          verified: false,
          company: 'HealthGen AI',
          position: 'Co-founder & CTO',
          email: 'sarah@healthgenai.com',
          linkedin: 'linkedin.com/in/sarahwilliams',
          twitter: 'twitter.com/sarahw_ai',
          education: 'PhD in Computer Science from MIT, MS in Biomedical Engineering from Johns Hopkins',
          experience: 'Former research scientist at Google Brain, Lead AI researcher at Mount Sinai Health System',
          skills: 'Machine Learning, Computer Vision, Computational Biology, Team Leadership',
          achievements: 'Published 20+ papers in top AI journals, Developed patented algorithms for drug discovery',
          notes: 'Deep technical expertise in AI and healthcare. Strong academic network and industry connections.'
        },
        {
          name: 'Michael Chen',
          avatar_url: '/images/users_img/u3.png',
          category: 'CleanTech',
          location: 'Seattle, USA',
          description: 'Experienced executive with a background in renewable energy and smart grid technology. Passionate about sustainability and climate tech.',
          verified: true,
          company: 'EcoSync Solutions',
          position: 'CEO',
          email: 'michael@ecosync.com',
          linkedin: 'linkedin.com/in/michaelchen',
          twitter: 'twitter.com/mchen_cleantech',
          education: 'MBA from Harvard, BS in Electrical Engineering from UC Berkeley',
          experience: 'Former VP of Product at Tesla Energy, Director of Operations at First Solar',
          skills: 'Energy Systems, Business Development, Operations, Fundraising',
          achievements: 'Led development of Tesla Powerwall, Scaled First Solar manufacturing operations by 300%',
          notes: 'Strong operational background with deep knowledge of energy markets. Well-connected with utility companies and regulators.'
        },
        {
          name: 'Elena Rodriguez',
          avatar_url: '/images/users_img/u4.png',
          category: 'Venture Capital',
          location: 'San Francisco, USA',
          description: 'Experienced venture capitalist specializing in early-stage investments in AI, fintech, and enterprise software. Known for identifying promising startups before they gain mainstream attention.',
          verified: true,
          company: 'Apiha Capital Lab',
          position: 'Managing Partner',
          email: 'elena@apihacapital.com',
          linkedin: 'linkedin.com/in/elenarodriguez',
          twitter: 'twitter.com/elena_vc',
          education: 'MBA from Wharton, BA in Economics from Princeton',
          experience: 'Former Partner at Andreessen Horowitz, Investment Banker at Goldman Sachs',
          skills: 'Deal Sourcing, Due Diligence, Portfolio Management, Fundraising',
          achievements: 'Led investments in 3 unicorn companies, Served on the board of 10+ startups',
          notes: 'Exceptional network across Silicon Valley. Known for providing hands-on support to portfolio companies.'
        },
        {
          name: 'David Kim',
          avatar_url: '/images/users_img/u5.png',
          category: 'Robotics',
          location: 'Austin, USA',
          description: 'Robotics engineer and entrepreneur with expertise in autonomous systems and industrial automation. Passionate about making advanced robotics accessible to businesses of all sizes.',
          verified: true,
          company: 'NextGen Robotics',
          position: 'Founder & CTO',
          email: 'david@nextgenrobotics.com',
          linkedin: 'linkedin.com/in/davidkim',
          twitter: 'twitter.com/davidkim_robots',
          education: 'PhD in Robotics from Carnegie Mellon, BS in Mechanical Engineering from Georgia Tech',
          experience: 'Former Lead Engineer at Boston Dynamics, Research Scientist at NASA JPL',
          skills: 'Robotics Design, Computer Vision, Autonomous Navigation, Hardware Engineering',
          achievements: 'Developed robots used in Mars missions, Holds 12 patents in robotic systems',
          notes: 'Deep technical expertise combined with business vision. Well-respected in the robotics community.'
        }
      ];
      
      // Insert people
      await Person.bulkCreate(peopleData);
      console.log('✅ Sample people created successfully');
    } else {
      console.log('People data already exists, skipping people seed');
    }

    // Check if blogs already exist
    const blogCount = await Blog.count();
    if (blogCount === 0) {
      console.log('Creating sample blog posts...');
      // Sample blog data
      const blogData = [
        {
          title: 'The Future of AI in Startup Ecosystems',
          content: '<p>Artificial Intelligence is rapidly transforming the startup landscape. From fundraising to product development, AI tools are enabling founders to move faster and more efficiently than ever before.</p><p>In this article, we explore how startups are leveraging AI to gain competitive advantages, attract investment, and scale their operations.</p><p>The most promising applications include:</p><ul><li>Automated customer service solutions</li><li>Predictive analytics for business intelligence</li><li>AI-powered product recommendations</li><li>Natural language processing for content creation</li></ul><p>As we look ahead, startups that effectively integrate AI into their core offerings will likely see increased valuation multiples and investor interest. However, challenges remain around data privacy, algorithm bias, and the need for specialized talent.</p><p>For founders, the message is clear: embrace AI or risk being left behind in an increasingly competitive marketplace.</p>',
          summary: 'How artificial intelligence is reshaping startup ecosystems and creating new opportunities for founders and investors.',
          image_url: '/images/blog_thumb/b1.png',
          author_id: 1, // Admin user
          category: 'Technology',
          tags: 'AI,Startups,Innovation,Venture Capital',
          published: true,
          publish_date: new Date('2023-10-15')
        },
        {
          title: 'Sustainable Business Models: Profit with Purpose',
          content: '<p>The traditional view that businesses must choose between profitability and sustainability is increasingly being challenged by a new generation of companies that are successfully balancing both objectives.</p><p>This article examines how innovative startups are incorporating sustainability into their core business models, not just as a marketing strategy but as a fundamental operating principle.</p><p>Key approaches include:</p><ul><li>Circular economy practices that eliminate waste</li><li>Supply chain transparency and ethical sourcing</li><li>Carbon-neutral operations and offsetting programs</li><li>Products designed for longevity and recyclability</li></ul><p>Case studies show that companies with strong sustainability credentials are often rewarded with customer loyalty, employee retention, and increasingly, premium valuations from ESG-focused investors.</p><p>The data suggests that sustainable business practices can create long-term competitive advantages while contributing to urgent global environmental and social challenges.</p>',
          summary: 'How companies are incorporating sustainability into their business models to achieve both profit and positive environmental impact.',
          image_url: '/images/blog_thumb/b2.jpg',
          author_id: 1, // Admin user
          category: 'Sustainability',
          tags: 'ESG,Sustainability,Business Models,Social Impact',
          published: true,
          publish_date: new Date('2023-11-03')
        },
        {
          title: 'Fundraising Strategies for Early-Stage Startups in 2023',
          content: '<p>Securing funding for early-stage startups has evolved significantly in the past few years. With changing market conditions and investor preferences, founders need to adapt their fundraising strategies accordingly.</p><p>This comprehensive guide explores effective approaches to raising capital in the current environment, based on interviews with successful founders and active investors.</p><p>We cover:</p><ul><li>Preparing a compelling pitch deck that addresses key investor concerns</li><li>Building relationships with the right investors for your stage and sector</li><li>Alternative funding sources beyond traditional venture capital</li><li>Negotiating favorable terms that protect founder interests</li><li>Timeline expectations and resource allocation during fundraising</li></ul><p>The fundraising landscape may be challenging, but startups with clear traction metrics, defensible market positions, and efficient unit economics are still attracting significant investment. Understanding investor psychology and demonstrating resilience are more important than ever.</p>',
          summary: 'A practical guide to fundraising tactics that work in today\'s competitive investment landscape for early-stage founders.',
          image_url: '/images/blog_thumb/b3.png',
          author_id: 1, // Admin user
          category: 'Fundraising',
          tags: 'Venture Capital,Fundraising,Pitch Deck,Investor Relations',
          published: true,
          publish_date: new Date('2023-12-07')
        },
        {
          title: 'Building a Diverse and Inclusive Startup Culture',
          content: '<p>Diversity and inclusion aren\'t just buzzwords – they\'re business imperatives for startups looking to innovate and scale effectively. Research consistently shows that diverse teams make better decisions and build more successful companies.</p><p>In this article, we outline actionable strategies for founders to build inclusive cultures from day one, avoiding the common pitfall of addressing diversity only after significant growth.</p><p>Key recommendations include:</p><ul><li>Implementing bias-free hiring processes</li><li>Creating inclusive onboarding experiences</li><li>Establishing mentorship and growth opportunities for all team members</li><li>Developing clear communication and feedback channels</li><li>Measuring progress with relevant diversity metrics</li></ul><p>We also explore how investors are increasingly evaluating team diversity and inclusion practices as part of their due diligence process, making this not just an ethical consideration but a strategic one for fundraising success.</p>',
          summary: 'How startups can build diverse and inclusive company cultures that drive innovation and business performance.',
          image_url: '/images/blog_thumb/b4.png',
          author_id: 1, // Admin user
          category: 'Team Building',
          tags: 'Diversity,Inclusion,Company Culture,Hiring',
          published: true,
          publish_date: new Date('2024-01-18')
        },
        {
          title: 'The Role of Community in Product-Led Growth',
          content: '<p>Product-led growth has become a dominant strategy for SaaS startups, but the most successful companies are discovering that community-building amplifies this approach dramatically.</p><p>This exploration of community-centric growth examines how user communities can accelerate product adoption, provide valuable feedback loops, and create powerful network effects.</p><p>We analyze:</p><ul><li>Different community models and their alignment with business objectives</li><li>Tools and platforms for effective community management</li><li>Metrics for measuring community health and business impact</li><li>Resource allocation and team structures for community support</li></ul><p>Through case studies of successful startups, we demonstrate how thoughtfully cultivated communities can reduce customer acquisition costs, improve retention, and even contribute to product development through co-creation models.</p><p>As competition intensifies in digital markets, community may be the most sustainable moat a startup can build.</p>',
          summary: 'Exploring how user communities can enhance product-led growth strategies and create sustainable competitive advantages.',
          image_url: '/assets/images/blog/community-product.jpg',
          author_id: 1, // Admin user
          category: 'Growth',
          tags: 'Community,Product-Led Growth,Customer Acquisition,SaaS',
          published: false, // Draft state
          publish_date: null
        }
      ];
      
      // Insert blogs
      await Blog.bulkCreate(blogData);
      console.log('✅ Sample blog posts created successfully');
    } else {
      console.log('Blog data already exists, skipping blog seed');
    }
    
    console.log('Database seeding completed');
  } catch (error: any) {
    console.error('Error seeding database:', error.message);
    throw error;
  }
};

// If this file is run directly (e.g., `node seed.js`), seed the database
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
