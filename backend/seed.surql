-- RFSbase Seed Data
-- Run with: surreal import --conn http://localhost:8000 --ns rfsbase --db rfsbase --user root --pass root backend/seed.surql

-- ============================================
-- USERS (5 sample users)
-- ============================================

-- User 1: Sarah Chen - YC-verified founder
CREATE user:01HQXK8V2N3M4P5R6S7T8U9W0X CONTENT {
    email: 'sarah.chen@example.com',
    name: 'Sarah Chen',
    password_hash: NONE,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    bio: 'Serial founder. Previously built and sold a dev tools startup. YC W21 alum.',
    verified_email: true,
    verified_yc: { batch: 'W21', company: 'DevSync' },
    oauth_provider: 'google',
    oauth_id: 'google_sarah_123',
    created_at: d'2024-01-15T10:30:00Z'
};

-- User 2: Marcus Johnson - Active contributor
CREATE user:01HQXK8V3N4M5P6R7S8T9U0W1X CONTENT {
    email: 'marcus.j@example.com',
    name: 'Marcus Johnson',
    password_hash: NONE,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus',
    bio: 'Full-stack engineer at a fintech startup. Passionate about developer experience.',
    verified_email: true,
    verified_yc: NONE,
    oauth_provider: 'github',
    oauth_id: 'github_marcus_456',
    created_at: d'2024-02-20T14:45:00Z'
};

-- User 3: Emily Rodriguez - Healthcare professional
CREATE user:01HQXK8V4N5M6P7R8S9T0U1W2X CONTENT {
    email: 'emily.r@example.com',
    name: 'Emily Rodriguez',
    password_hash: NONE,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
    bio: 'Healthcare consultant turned tech entrepreneur. Looking to solve real problems in patient care.',
    verified_email: true,
    verified_yc: NONE,
    oauth_provider: 'google',
    oauth_id: 'google_emily_789',
    created_at: d'2024-03-05T09:15:00Z'
};

-- User 4: Alex Kim - YC-verified, AI/ML focus
CREATE user:01HQXK8V5N6M7P8R9S0T1U2W3X CONTENT {
    email: 'alex.kim@example.com',
    name: 'Alex Kim',
    password_hash: NONE,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    bio: 'ML researcher turned founder. Building AI tools for the next generation. YC S22.',
    verified_email: true,
    verified_yc: { batch: 'S22', company: 'NeuralFlow' },
    oauth_provider: 'github',
    oauth_id: 'github_alex_012',
    created_at: d'2024-01-28T16:20:00Z'
};

-- User 5: Jordan Taylor - New user, unverified email
CREATE user:01HQXK8V6N7M8P9R0S1T2U3W4X CONTENT {
    email: 'jordan.t@example.com',
    name: 'Jordan Taylor',
    password_hash: NONE,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jordan',
    bio: 'Product manager exploring startup ideas. Love finding pain points to solve.',
    verified_email: false,
    verified_yc: NONE,
    oauth_provider: 'google',
    oauth_id: 'google_jordan_345',
    created_at: d'2024-04-10T11:00:00Z'
};

-- ============================================
-- IDEAS (18 sample ideas across categories)
-- ============================================

-- Idea 1: AI/ML - Sarah
CREATE idea:01HQXL1A2B3C4D5E6F7G8H9J0K CONTENT {
    author: user:01HQXK8V2N3M4P5R6S7T8U9W0X,
    title: 'AI-Powered Code Review Assistant',
    problem: 'Code reviews are time-consuming and inconsistent. Senior developers spend 20-30% of their time reviewing code, and quality varies based on reviewer fatigue and expertise. Junior developers wait hours or days for feedback.',
    solution: 'An AI assistant that provides instant, comprehensive code reviews. It learns from your team\'s patterns, suggests improvements, catches bugs, and explains reasoning. Integrates with GitHub/GitLab PRs.',
    target_audience: 'Engineering teams at mid-size tech companies (50-500 engineers)',
    category: 'ai-ml',
    tags: ['automation', 'productivity', 'open-source'],
    links: ['https://github.com/example/ai-review'],
    embedding: NONE,
    votes_problem: 42,
    votes_solution: 38,
    votes_total: 80,
    comment_count: 12,
    created_at: d'2024-02-01T08:00:00Z'
};

-- Idea 2: Developer Tools - Marcus
CREATE idea:01HQXL1A3B4C5D6E7F8G9H0J1K CONTENT {
    author: user:01HQXK8V3N4M5P6R7S8T9U0W1X,
    title: 'Universal API Mocking Platform',
    problem: 'Frontend developers waste time waiting for backend APIs. Setting up mock servers is tedious, and mocks quickly become outdated. Testing edge cases requires manual mock data creation.',
    solution: 'A platform that auto-generates realistic mock APIs from OpenAPI specs. Includes scenario builder for edge cases, latency simulation, and auto-syncs when specs change.',
    target_audience: 'Frontend developers and QA engineers at API-first companies',
    category: 'devtools',
    tags: ['api', 'automation', 'productivity'],
    links: [],
    embedding: NONE,
    votes_problem: 35,
    votes_solution: 28,
    votes_total: 63,
    comment_count: 8,
    created_at: d'2024-02-15T14:30:00Z'
};

-- Idea 3: Healthcare - Emily
CREATE idea:01HQXL1A4B5C6D7E8F9G0H1J2K CONTENT {
    author: user:01HQXK8V4N5M6P7R8S9T0U1W2X,
    title: 'Patient Medication Adherence Tracker',
    problem: '50% of patients don\'t take medications as prescribed, leading to $300B in avoidable healthcare costs annually. Current reminder apps are too simple and don\'t address root causes of non-adherence.',
    solution: 'A smart medication companion that understands WHY patients skip doses (side effects, cost, forgetfulness) and provides personalized interventions. Connects with pharmacies and care teams.',
    target_audience: 'Patients with chronic conditions and their healthcare providers',
    category: 'healthcare',
    tags: ['mobile', 'data', 'analytics'],
    links: [],
    embedding: NONE,
    votes_problem: 56,
    votes_solution: 41,
    votes_total: 97,
    comment_count: 15,
    created_at: d'2024-02-20T10:15:00Z'
};

-- Idea 4: Fintech - Alex
CREATE idea:01HQXL1A5B6C7D8E9F0G1H2J3K CONTENT {
    author: user:01HQXK8V5N6M7P8R9S0T1U2W3X,
    title: 'AI Financial Advisor for Freelancers',
    problem: 'Freelancers and gig workers have unpredictable income but traditional financial planning tools assume steady paychecks. They struggle with taxes, retirement savings, and cash flow management.',
    solution: 'An AI-powered financial advisor that understands irregular income patterns. Automatically sets aside taxes, optimizes cash reserves, suggests when to invest, and predicts lean months.',
    target_audience: 'Freelancers, contractors, and gig economy workers earning $50K-$200K',
    category: 'fintech',
    tags: ['automation', 'analytics', 'payments'],
    links: [],
    embedding: NONE,
    votes_problem: 48,
    votes_solution: 35,
    votes_total: 83,
    comment_count: 11,
    created_at: d'2024-03-01T09:45:00Z'
};

-- Idea 5: Climate - Sarah
CREATE idea:01HQXL1A6B7C8D9E0F1G2H3J4K CONTENT {
    author: user:01HQXK8V2N3M4P5R6S7T8U9W0X,
    title: 'Carbon Footprint API for E-commerce',
    problem: 'Consumers want to make sustainable choices but can\'t easily see the carbon impact of online purchases. E-commerce platforms lack simple tools to calculate and display product carbon footprints.',
    solution: 'A simple API that calculates product carbon footprints based on materials, manufacturing location, and shipping. Returns data in consumer-friendly formats with offsetting options.',
    target_audience: 'E-commerce platforms, D2C brands, and sustainability-focused retailers',
    category: 'climate',
    tags: ['api', 'data', 'infrastructure'],
    links: [],
    embedding: NONE,
    votes_problem: 31,
    votes_solution: 22,
    votes_total: 53,
    comment_count: 6,
    created_at: d'2024-03-10T11:20:00Z'
};

-- Idea 6: Consumer - Jordan
CREATE idea:01HQXL1A7B8C9D0E1F2G3H4J5K CONTENT {
    author: user:01HQXK8V6N7M8P9R0S1T2U3W4X,
    title: 'Neighborhood Skill-Sharing Platform',
    problem: 'People have skills they\'d love to teach (cooking, guitar, gardening) and skills they want to learn, but finding local teachers/learners is hard. Existing platforms are too formal or expensive.',
    solution: 'A hyperlocal app for casual skill exchange. Trade an hour of guitar lessons for cooking tips. Simple scheduling, reputation system, and optional payment for asymmetric exchanges.',
    target_audience: 'Urban and suburban residents aged 25-45 interested in lifelong learning',
    category: 'consumer',
    tags: ['mobile', 'collaboration', 'no-code'],
    links: [],
    embedding: NONE,
    votes_problem: 29,
    votes_solution: 18,
    votes_total: 47,
    comment_count: 9,
    created_at: d'2024-03-15T16:00:00Z'
};

-- Idea 7: B2B SaaS - Marcus
CREATE idea:01HQXL1A8B9C0D1E2F3G4H5J6K CONTENT {
    author: user:01HQXK8V3N4M5P6R7S8T9U0W1X,
    title: 'Automated SaaS Spend Optimization',
    problem: 'Companies overspend on SaaS by 25-40% due to unused licenses, duplicate tools, and poor contract negotiation. Finance teams lack visibility into actual usage across hundreds of subscriptions.',
    solution: 'Platform that integrates with SSO and payment systems to track real SaaS usage. Identifies waste, suggests consolidation, and automates license management and renewals.',
    target_audience: 'Finance and IT teams at companies with 100-1000 employees',
    category: 'b2b-saas',
    tags: ['automation', 'analytics', 'productivity'],
    links: [],
    embedding: NONE,
    votes_problem: 44,
    votes_solution: 39,
    votes_total: 83,
    comment_count: 7,
    created_at: d'2024-03-20T13:30:00Z'
};

-- Idea 8: Education - Emily
CREATE idea:01HQXL1A9B0C1D2E3F4G5H6J7K CONTENT {
    author: user:01HQXK8V4N5M6P7R8S9T0U1W2X,
    title: 'Personalized Learning Path Generator',
    problem: 'Online learners waste time on content they already know or skip prerequisites they need. Course platforms offer one-size-fits-all paths that don\'t adapt to individual knowledge gaps.',
    solution: 'AI that assesses your current knowledge through quick diagnostics, then generates personalized learning paths pulling from multiple course platforms. Continuously adapts as you progress.',
    target_audience: 'Self-directed learners pursuing career transitions or skill upgrades',
    category: 'education',
    tags: ['automation', 'productivity', 'data'],
    links: [],
    embedding: NONE,
    votes_problem: 52,
    votes_solution: 43,
    votes_total: 95,
    comment_count: 14,
    created_at: d'2024-03-25T10:00:00Z'
};

-- Idea 9: Marketplace - Alex
CREATE idea:01HQXL2A0B1C2D3E4F5G6H7J8K CONTENT {
    author: user:01HQXK8V5N6M7P8R9S0T1U2W3X,
    title: 'Expert-on-Demand for Niche Problems',
    problem: 'When you have a specific technical problem (tax question, legal edge case, obscure programming issue), finding a qualified expert quickly is nearly impossible. Existing platforms are too slow or generic.',
    solution: 'Marketplace connecting people with niche problems to verified experts for quick 15-30 minute calls. AI matches problems to expert specialties. Pay-per-minute with satisfaction guarantee.',
    target_audience: 'Professionals and small business owners with urgent, specific questions',
    category: 'marketplace',
    tags: ['collaboration', 'video', 'productivity'],
    links: [],
    embedding: NONE,
    votes_problem: 38,
    votes_solution: 31,
    votes_total: 69,
    comment_count: 10,
    created_at: d'2024-04-01T14:15:00Z'
};

-- Idea 10: Hardware - Sarah
CREATE idea:01HQXL2A1B2C3D4E5F6G7H8J9K CONTENT {
    author: user:01HQXK8V2N3M4P5R6S7T8U9W0X,
    title: 'Smart Home Energy Monitor with AI Insights',
    problem: 'Homeowners can\'t identify which devices waste energy. Smart meters show total usage but not appliance-level breakdown. Energy bills are confusing and actionable savings unclear.',
    solution: 'A non-invasive device that clips to your electrical panel and uses ML to disaggregate total consumption into individual appliances. Mobile app shows real-time usage and personalized savings tips.',
    target_audience: 'Homeowners interested in reducing energy costs and environmental impact',
    category: 'hardware',
    tags: ['data', 'analytics', 'mobile'],
    links: [],
    embedding: NONE,
    votes_problem: 41,
    votes_solution: 29,
    votes_total: 70,
    comment_count: 8,
    created_at: d'2024-04-05T09:30:00Z'
};

-- Idea 11: Infrastructure - Marcus
CREATE idea:01HQXL2A2B3C4D5E6F7G8H9J0K CONTENT {
    author: user:01HQXK8V3N4M5P6R7S8T9U0W1X,
    title: 'One-Click Database Branching for Development',
    problem: 'Developers need production-like data for testing but creating database copies is slow and expensive. Teams share staging environments causing conflicts, or use unrealistic mock data.',
    solution: 'Instant database branching using copy-on-write technology. Spin up isolated database branches from production data in seconds. Integrates with PR workflows for automatic branch creation.',
    target_audience: 'Development teams at companies with complex data-dependent applications',
    category: 'infrastructure',
    tags: ['infrastructure', 'automation', 'api'],
    links: ['https://docs.example.com/db-branch'],
    embedding: NONE,
    votes_problem: 67,
    votes_solution: 58,
    votes_total: 125,
    comment_count: 19,
    created_at: d'2024-04-10T11:45:00Z'
};

-- Idea 12: Security - Alex
CREATE idea:01HQXL2A3B4C5D6E7F8G9H0J1K CONTENT {
    author: user:01HQXK8V5N6M7P8R9S0T1U2W3X,
    title: 'Automated Privacy Policy Compliance Scanner',
    problem: 'Companies struggle to keep privacy policies compliant with GDPR, CCPA, and new regulations. Legal review is expensive and policies quickly become outdated as products evolve.',
    solution: 'AI tool that scans your codebase and product to identify data collection practices, then generates and maintains compliant privacy policies. Alerts when code changes require policy updates.',
    target_audience: 'Startups and mid-size companies handling user data',
    category: 'security',
    tags: ['automation', 'security', 'data'],
    links: [],
    embedding: NONE,
    votes_problem: 55,
    votes_solution: 42,
    votes_total: 97,
    comment_count: 13,
    created_at: d'2024-04-15T15:20:00Z'
};

-- Idea 13: AI/ML - Emily
CREATE idea:01HQXL2A4B5C6D7E8F9G0H1J2K CONTENT {
    author: user:01HQXK8V4N5M6P7R8S9T0U1W2X,
    title: 'AI Scribe for Patient Consultations',
    problem: 'Doctors spend 2+ hours daily on documentation, leading to burnout and less patient face time. Current transcription tools don\'t understand medical context or create structured notes.',
    solution: 'AI that listens to patient consultations and automatically generates structured clinical notes, ICD codes, and follow-up tasks. Integrates with major EHR systems. HIPAA compliant.',
    target_audience: 'Primary care physicians and specialists in private practice',
    category: 'ai-ml',
    tags: ['automation', 'productivity', 'data'],
    links: [],
    embedding: NONE,
    votes_problem: 71,
    votes_solution: 54,
    votes_total: 125,
    comment_count: 21,
    created_at: d'2024-04-20T10:30:00Z'
};

-- Idea 14: Developer Tools - Jordan
CREATE idea:01HQXL2A5B6C7D8E9F0G1H2J3K CONTENT {
    author: user:01HQXK8V6N7M8P9R0S1T2U3W4X,
    title: 'Visual Debugging for CSS Layouts',
    problem: 'CSS debugging is painful. Developers spend hours figuring out why layouts break, why elements overflow, or why flexbox/grid isn\'t behaving as expected. Browser devtools are powerful but overwhelming.',
    solution: 'A browser extension that visualizes CSS layout relationships. Shows flex/grid containers, explains why elements have certain sizes, suggests fixes for common layout bugs.',
    target_audience: 'Frontend developers of all skill levels',
    category: 'devtools',
    tags: ['productivity', 'open-source', 'web3'],
    links: [],
    embedding: NONE,
    votes_problem: 33,
    votes_solution: 24,
    votes_total: 57,
    comment_count: 5,
    created_at: d'2024-04-25T14:00:00Z'
};

-- Idea 15: Fintech - Marcus
CREATE idea:01HQXL2A6B7C8D9E0F1G2H3J4K CONTENT {
    author: user:01HQXK8V3N4M5P6R7S8T9U0W1X,
    title: 'Instant Invoice Factoring for SMBs',
    problem: 'Small businesses wait 30-90 days to get paid on invoices, creating cash flow crunches. Traditional factoring is expensive, slow, and requires long-term commitments.',
    solution: 'Platform that instantly advances 90% of invoice value for a transparent flat fee. Uses AI to assess customer creditworthiness. No contracts, factor single invoices on demand.',
    target_audience: 'Small businesses with B2B clients and $500K-$10M annual revenue',
    category: 'fintech',
    tags: ['payments', 'automation', 'data'],
    links: [],
    embedding: NONE,
    votes_problem: 39,
    votes_solution: 32,
    votes_total: 71,
    comment_count: 6,
    created_at: d'2024-05-01T09:00:00Z'
};

-- Idea 16: Consumer - Sarah
CREATE idea:01HQXL2A7B8C9D0E1F2G3H4J5K CONTENT {
    author: user:01HQXK8V2N3M4P5R6S7T8U9W0X,
    title: 'Personalized News Digest with Multiple Perspectives',
    problem: 'People are stuck in news filter bubbles, seeing only viewpoints that match their existing beliefs. Current news aggregators optimize for engagement, not understanding.',
    solution: 'AI-curated daily news digest that presents stories from multiple political/ideological perspectives. Highlights areas of factual agreement and disagreement. Promotes media literacy.',
    target_audience: 'News consumers who want to be better informed, not just validated',
    category: 'consumer',
    tags: ['automation', 'mobile', 'data'],
    links: [],
    embedding: NONE,
    votes_problem: 45,
    votes_solution: 28,
    votes_total: 73,
    comment_count: 16,
    created_at: d'2024-05-05T12:30:00Z'
};

-- Idea 17: B2B SaaS - Alex
CREATE idea:01HQXL2A8B9C0D1E2F3G4H5J6K CONTENT {
    author: user:01HQXK8V5N6M7P8R9S0T1U2W3X,
    title: 'AI Meeting Insights and Action Tracker',
    problem: 'Important decisions and action items get lost in meeting recordings nobody rewatches. Teams waste time in follow-up meetings clarifying what was decided or assigned.',
    solution: 'AI that joins meetings (Zoom, Teams, Meet), extracts key decisions, action items, and deadlines. Auto-creates tasks in your project management tool and sends personalized summaries.',
    target_audience: 'Remote and hybrid teams at companies with 50-500 employees',
    category: 'b2b-saas',
    tags: ['automation', 'collaboration', 'productivity'],
    links: [],
    embedding: NONE,
    votes_problem: 58,
    votes_solution: 51,
    votes_total: 109,
    comment_count: 17,
    created_at: d'2024-05-10T15:45:00Z'
};

-- Idea 18: Other - Jordan
CREATE idea:01HQXL2A9B0C1D2E3F4G5H6J7K CONTENT {
    author: user:01HQXK8V6N7M8P9R0S1T2U3W4X,
    title: 'Pet Health Monitoring Collar',
    problem: 'Pet owners can\'t easily track their pet\'s health metrics. By the time symptoms are visible, conditions are often advanced. Vet visits for routine checks are expensive and stressful for pets.',
    solution: 'Smart collar that monitors activity, sleep, heart rate, and temperature. AI detects anomalies early and alerts owners. Shares data with vets for more informed consultations.',
    target_audience: 'Dog and cat owners who consider pets as family members',
    category: 'other',
    tags: ['mobile', 'data', 'analytics'],
    links: [],
    embedding: NONE,
    votes_problem: 36,
    votes_solution: 22,
    votes_total: 58,
    comment_count: 11,
    created_at: d'2024-05-15T10:00:00Z'
};

-- ============================================
-- VOTES (Using RELATE graph syntax)
-- ============================================

-- Votes on Idea 1 (AI Code Review)
RELATE user:01HQXK8V3N4M5P6R7S8T9U0W1X->voted->idea:01HQXL1A2B3C4D5E6F7G8H9J0K SET vote_type = 'problem', created_at = d'2024-02-02T09:00:00Z';

RELATE user:01HQXK8V4N5M6P7R8S9T0U1W2X->voted->idea:01HQXL1A2B3C4D5E6F7G8H9J0K SET vote_type = 'solution', created_at = d'2024-02-02T11:30:00Z';

RELATE user:01HQXK8V5N6M7P8R9S0T1U2W3X->voted->idea:01HQXL1A2B3C4D5E6F7G8H9J0K SET vote_type = 'problem', created_at = d'2024-02-03T14:00:00Z';

-- Votes on Idea 3 (Medication Adherence)
RELATE user:01HQXK8V2N3M4P5R6S7T8U9W0X->voted->idea:01HQXL1A4B5C6D7E8F9G0H1J2K SET vote_type = 'problem', created_at = d'2024-02-21T08:00:00Z';

RELATE user:01HQXK8V3N4M5P6R7S8T9U0W1X->voted->idea:01HQXL1A4B5C6D7E8F9G0H1J2K SET vote_type = 'problem', created_at = d'2024-02-21T10:30:00Z';

RELATE user:01HQXK8V5N6M7P8R9S0T1U2W3X->voted->idea:01HQXL1A4B5C6D7E8F9G0H1J2K SET vote_type = 'solution', created_at = d'2024-02-22T15:00:00Z';

-- Votes on Idea 11 (Database Branching)
RELATE user:01HQXK8V2N3M4P5R6S7T8U9W0X->voted->idea:01HQXL2A2B3C4D5E6F7G8H9J0K SET vote_type = 'problem', created_at = d'2024-04-11T09:00:00Z';

RELATE user:01HQXK8V4N5M6P7R8S9T0U1W2X->voted->idea:01HQXL2A2B3C4D5E6F7G8H9J0K SET vote_type = 'solution', created_at = d'2024-04-11T11:30:00Z';

RELATE user:01HQXK8V5N6M7P8R9S0T1U2W3X->voted->idea:01HQXL2A2B3C4D5E6F7G8H9J0K SET vote_type = 'problem', created_at = d'2024-04-12T14:00:00Z';

RELATE user:01HQXK8V6N7M8P9R0S1T2U3W4X->voted->idea:01HQXL2A2B3C4D5E6F7G8H9J0K SET vote_type = 'solution', created_at = d'2024-04-12T16:30:00Z';

-- Votes on Idea 13 (AI Scribe)
RELATE user:01HQXK8V2N3M4P5R6S7T8U9W0X->voted->idea:01HQXL2A4B5C6D7E8F9G0H1J2K SET vote_type = 'problem', created_at = d'2024-04-21T09:00:00Z';

RELATE user:01HQXK8V3N4M5P6R7S8T9U0W1X->voted->idea:01HQXL2A4B5C6D7E8F9G0H1J2K SET vote_type = 'problem', created_at = d'2024-04-21T11:30:00Z';

RELATE user:01HQXK8V5N6M7P8R9S0T1U2W3X->voted->idea:01HQXL2A4B5C6D7E8F9G0H1J2K SET vote_type = 'solution', created_at = d'2024-04-22T14:00:00Z';

-- Votes on Idea 17 (Meeting Insights)
RELATE user:01HQXK8V2N3M4P5R6S7T8U9W0X->voted->idea:01HQXL2A8B9C0D1E2F3G4H5J6K SET vote_type = 'solution', created_at = d'2024-05-11T09:00:00Z';

RELATE user:01HQXK8V3N4M5P6R7S8T9U0W1X->voted->idea:01HQXL2A8B9C0D1E2F3G4H5J6K SET vote_type = 'problem', created_at = d'2024-05-11T11:30:00Z';

RELATE user:01HQXK8V4N5M6P7R8S9T0U1W2X->voted->idea:01HQXL2A8B9C0D1E2F3G4H5J6K SET vote_type = 'problem', created_at = d'2024-05-12T14:00:00Z';

-- ============================================
-- COMMENTS (Sample comments on ideas)
-- ============================================

-- Comments on Idea 1 (AI Code Review)
CREATE comment:01HQXC1A0B1C2D3E4F5G6H7J8K CONTENT {
    author: user:01HQXK8V3N4M5P6R7S8T9U0W1X,
    idea: idea:01HQXL1A2B3C4D5E6F7G8H9J0K,
    parent: NONE,
    content: 'This is exactly what my team needs. We spend so much time on code reviews, and the quality is inconsistent depending on who reviews. Have you thought about how to handle false positives?',
    upvotes: 5,
    created_at: d'2024-02-02T10:00:00Z'
};

CREATE comment:01HQXC1A1B2C3D4E5F6G7H8J9K CONTENT {
    author: user:01HQXK8V2N3M4P5R6S7T8U9W0X,
    idea: idea:01HQXL1A2B3C4D5E6F7G8H9J0K,
    parent: comment:01HQXC1A0B1C2D3E4F5G6H7J8K,
    content: 'Great question! The plan is to have a feedback loop where developers can dismiss suggestions, and the model learns from team-specific patterns over time.',
    upvotes: 3,
    created_at: d'2024-02-02T10:30:00Z'
};

CREATE comment:01HQXC1A2B3C4D5E6F7G8H9J0K CONTENT {
    author: user:01HQXK8V5N6M7P8R9S0T1U2W3X,
    idea: idea:01HQXL1A2B3C4D5E6F7G8H9J0K,
    parent: NONE,
    content: 'I\'ve tried a few AI code review tools and they often miss context-specific issues. How would this handle company-specific coding standards and architectural patterns?',
    upvotes: 8,
    created_at: d'2024-02-03T09:15:00Z'
};

-- Comments on Idea 3 (Medication Adherence)
CREATE comment:01HQXC1A3B4C5D6E7F8G9H0J1K CONTENT {
    author: user:01HQXK8V2N3M4P5R6S7T8U9W0X,
    idea: idea:01HQXL1A4B5C6D7E8F9G0H1J2K,
    parent: NONE,
    content: 'The $300B stat is compelling. What\'s the go-to-market strategy? Would you partner with insurers or go direct to consumers?',
    upvotes: 4,
    created_at: d'2024-02-21T11:00:00Z'
};

CREATE comment:01HQXC1A4B5C6D7E8F9G0H1J2K CONTENT {
    author: user:01HQXK8V4N5M6P7R8S9T0U1W2X,
    idea: idea:01HQXL1A4B5C6D7E8F9G0H1J2K,
    parent: comment:01HQXC1A3B4C5D6E7F8G9H0J1K,
    content: 'Thinking B2B2C through healthcare providers initially. They have direct patient relationships and are incentivized to improve outcomes. Insurers are a longer sales cycle.',
    upvotes: 6,
    created_at: d'2024-02-21T11:45:00Z'
};

-- Comments on Idea 11 (Database Branching)
CREATE comment:01HQXC1A5B6C7D8E9F0G1H2J3K CONTENT {
    author: user:01HQXK8V5N6M7P8R9S0T1U2W3X,
    idea: idea:01HQXL2A2B3C4D5E6F7G8H9J0K,
    parent: NONE,
    content: 'This would be a game-changer for our CI/CD pipeline. Currently we reset test databases from scratch which takes 20 minutes. What databases would you support initially?',
    upvotes: 12,
    created_at: d'2024-04-11T10:00:00Z'
};

CREATE comment:01HQXC1A6B7C8D9E0F1G2H3J4K CONTENT {
    author: user:01HQXK8V3N4M5P6R7S8T9U0W1X,
    idea: idea:01HQXL2A2B3C4D5E6F7G8H9J0K,
    parent: comment:01HQXC1A5B6C7D8E9F0G1H2J3K,
    content: 'Starting with PostgreSQL since it has the best copy-on-write support at the storage layer. MySQL and MongoDB on the roadmap based on demand.',
    upvotes: 7,
    created_at: d'2024-04-11T10:30:00Z'
};

CREATE comment:01HQXC1A7B8C9D0E1F2G3H4J5K CONTENT {
    author: user:01HQXK8V4N5M6P7R8S9T0U1W2X,
    idea: idea:01HQXL2A2B3C4D5E6F7G8H9J0K,
    parent: NONE,
    content: 'How would you handle data privacy? If branches contain production data, developers might see PII they shouldn\'t have access to.',
    upvotes: 9,
    created_at: d'2024-04-12T09:00:00Z'
};

CREATE comment:01HQXC1A8B9C0D1E2F3G4H5J6K CONTENT {
    author: user:01HQXK8V3N4M5P6R7S8T9U0W1X,
    idea: idea:01HQXL2A2B3C4D5E6F7G8H9J0K,
    parent: comment:01HQXC1A7B8C9D0E1F2G3H4J5K,
    content: 'Great point. The plan includes a data masking layer that automatically anonymizes PII during branch creation. You define masking rules once and they apply to all branches.',
    upvotes: 11,
    created_at: d'2024-04-12T09:45:00Z'
};

-- Comments on Idea 17 (Meeting Insights)
CREATE comment:01HQXC1A9B0C1D2E3F4G5H6J7K CONTENT {
    author: user:01HQXK8V4N5M6P7R8S9T0U1W2X,
    idea: idea:01HQXL2A8B9C0D1E2F3G4H5J6K,
    parent: NONE,
    content: 'We tried Otter.ai but the action item extraction wasn\'t reliable enough. What makes your AI approach different?',
    upvotes: 6,
    created_at: d'2024-05-11T10:00:00Z'
};

CREATE comment:01HQXC2A0B1C2D3E4F5G6H7J8K CONTENT {
    author: user:01HQXK8V5N6M7P8R9S0T1U2W3X,
    idea: idea:01HQXL2A8B9C0D1E2F3G4H5J6K,
    parent: comment:01HQXC1A9B0C1D2E3F4G5H6J7K,
    content: 'Two key differences: 1) We fine-tune on your company\'s meeting transcripts to understand your terminology and common action patterns. 2) Integration with project management tools means action items are verified against real tasks.',
    upvotes: 8,
    created_at: d'2024-05-11T10:45:00Z'
};

-- ============================================
-- COMMENT UPVOTES (Using RELATE graph syntax)
-- ============================================

RELATE user:01HQXK8V5N6M7P8R9S0T1U2W3X->upvoted->comment:01HQXC1A0B1C2D3E4F5G6H7J8K SET created_at = d'2024-02-02T11:00:00Z';

RELATE user:01HQXK8V4N5M6P7R8S9T0U1W2X->upvoted->comment:01HQXC1A0B1C2D3E4F5G6H7J8K SET created_at = d'2024-02-02T12:30:00Z';

RELATE user:01HQXK8V2N3M4P5R6S7T8U9W0X->upvoted->comment:01HQXC1A5B6C7D8E9F0G1H2J3K SET created_at = d'2024-04-11T11:00:00Z';

RELATE user:01HQXK8V6N7M8P9R0S1T2U3W4X->upvoted->comment:01HQXC1A5B6C7D8E9F0G1H2J3K SET created_at = d'2024-04-11T12:00:00Z';

-- ============================================
-- FOLLOWS (Using RELATE graph syntax)
-- ============================================

-- Sarah follows Marcus and Alex
RELATE user:01HQXK8V2N3M4P5R6S7T8U9W0X->follows->user:01HQXK8V3N4M5P6R7S8T9U0W1X SET created_at = d'2024-02-25T10:00:00Z';

RELATE user:01HQXK8V2N3M4P5R6S7T8U9W0X->follows->user:01HQXK8V5N6M7P8R9S0T1U2W3X SET created_at = d'2024-03-01T11:30:00Z';

-- Marcus follows Sarah, Emily, and Alex
RELATE user:01HQXK8V3N4M5P6R7S8T9U0W1X->follows->user:01HQXK8V2N3M4P5R6S7T8U9W0X SET created_at = d'2024-02-26T09:00:00Z';

RELATE user:01HQXK8V3N4M5P6R7S8T9U0W1X->follows->user:01HQXK8V4N5M6P7R8S9T0U1W2X SET created_at = d'2024-03-10T14:00:00Z';

RELATE user:01HQXK8V3N4M5P6R7S8T9U0W1X->follows->user:01HQXK8V5N6M7P8R9S0T1U2W3X SET created_at = d'2024-03-15T16:30:00Z';

-- Emily follows Sarah
RELATE user:01HQXK8V4N5M6P7R8S9T0U1W2X->follows->user:01HQXK8V2N3M4P5R6S7T8U9W0X SET created_at = d'2024-03-12T10:00:00Z';

-- Alex follows Sarah, Marcus, and Emily
RELATE user:01HQXK8V5N6M7P8R9S0T1U2W3X->follows->user:01HQXK8V2N3M4P5R6S7T8U9W0X SET created_at = d'2024-02-01T08:00:00Z';

RELATE user:01HQXK8V5N6M7P8R9S0T1U2W3X->follows->user:01HQXK8V3N4M5P6R7S8T9U0W1X SET created_at = d'2024-02-20T09:30:00Z';

RELATE user:01HQXK8V5N6M7P8R9S0T1U2W3X->follows->user:01HQXK8V4N5M6P7R8S9T0U1W2X SET created_at = d'2024-03-08T11:00:00Z';

-- Jordan follows Sarah and Alex (the YC-verified users)
RELATE user:01HQXK8V6N7M8P9R0S1T2U3W4X->follows->user:01HQXK8V2N3M4P5R6S7T8U9W0X SET created_at = d'2024-04-12T15:00:00Z';

RELATE user:01HQXK8V6N7M8P9R0S1T2U3W4X->follows->user:01HQXK8V5N6M7P8R9S0T1U2W3X SET created_at = d'2024-04-15T10:30:00Z';

-- ============================================
-- SAMPLE NOTIFICATIONS
-- ============================================

CREATE notification:01HQXN1A0B1C2D3E4F5G6H7J8K CONTENT {
    user: user:01HQXK8V2N3M4P5R6S7T8U9W0X,
    notification_type: 'new_comment',
    data: {
        idea_id: 'idea:01HQXL1A2B3C4D5E6F7G8H9J0K',
        idea_title: 'AI-Powered Code Review Assistant',
        commenter_name: 'Marcus Johnson',
        comment_preview: 'This is exactly what my team needs...'
    },
    read: true,
    created_at: d'2024-02-02T10:05:00Z'
};

CREATE notification:01HQXN1A1B2C3D4E5F6G7H8J9K CONTENT {
    user: user:01HQXK8V2N3M4P5R6S7T8U9W0X,
    notification_type: 'new_vote',
    data: {
        idea_id: 'idea:01HQXL1A2B3C4D5E6F7G8H9J0K',
        idea_title: 'AI-Powered Code Review Assistant',
        vote_type: 'problem',
        voter_name: 'Alex Kim'
    },
    read: true,
    created_at: d'2024-02-03T14:05:00Z'
};

CREATE notification:01HQXN1A2B3C4D5E6F7G8H9J0K CONTENT {
    user: user:01HQXK8V3N4M5P6R7S8T9U0W1X,
    notification_type: 'new_follower',
    data: {
        follower_id: 'user:01HQXK8V2N3M4P5R6S7T8U9W0X',
        follower_name: 'Sarah Chen'
    },
    read: false,
    created_at: d'2024-02-25T10:05:00Z'
};

CREATE notification:01HQXN1A3B4C5D6E7F8G9H0J1K CONTENT {
    user: user:01HQXK8V4N5M6P7R8S9T0U1W2X,
    notification_type: 'comment_reply',
    data: {
        idea_id: 'idea:01HQXL1A4B5C6D7E8F9G0H1J2K',
        idea_title: 'Patient Medication Adherence Tracker',
        replier_name: 'Emily Rodriguez',
        comment_preview: 'Thinking B2B2C through healthcare providers...'
    },
    read: false,
    created_at: d'2024-02-21T11:50:00Z'
};
