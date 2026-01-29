-- RFSbase Seed Data
-- Generated from Y Combinator RFS (ycombinator.com/rfs)
-- 57 RFS across 5 seasons

-- Create YC system user for seed ideas
CREATE user:yc SET
  name = 'Y Combinator',
  email = 'rfs@ycombinator.com',
  avatar = 'https://www.ycombinator.com/favicon.ico',
  bio = 'Y Combinator is a startup accelerator that has funded over 4,000 companies.',
  verified = true,
  yc_verified = true,
  created_at = time::now(),
  updated_at = time::now();

-- Create ideas from YC RFS

CREATE idea:retraining-workers-for-the-ai-economy SET
  title = 'Retraining Workers for the AI Economy',
  problem = 'This is a Request for Startup from Y Combinator (Fall 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['F25', 'workforce', 'education'],
  video_url = 'https://youtube.com/watch?v=F40PQKJVWJY',
  author = user:yc,
  votes_problem = 46,
  votes_solution = 8,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:video-generation-as-a-primitive SET
  title = 'Video Generation as a Primitive',
  problem = 'This is a Request for Startup from Y Combinator (Fall 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['F25', 'video', 'generative-ai'],
  video_url = 'https://youtube.com/watch?v=tJ2C9a5GBOs',
  author = user:yc,
  votes_problem = 16,
  votes_solution = 7,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:the-first-10-person-100b-company SET
  title = 'The First 10-person, $100B Company',
  problem = 'This is a Request for Startup from Y Combinator (Fall 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['F25', 'automation', 'lean-startup'],
  video_url = 'https://youtube.com/watch?v=lkFiTvXu9Zw',
  author = user:yc,
  votes_problem = 43,
  votes_solution = 14,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:infrastructure-for-multi-agent-systems SET
  title = 'Infrastructure for Multi-Agent Systems',
  problem = 'This is a Request for Startup from Y Combinator (Fall 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['F25', 'agents', 'infrastructure'],
  video_url = 'https://youtube.com/watch?v=0qGjxsMzuxc',
  author = user:yc,
  votes_problem = 19,
  votes_solution = 22,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:ai-native-enterprise-software SET
  title = 'AI Native Enterprise Software',
  problem = 'This is a Request for Startup from Y Combinator (Fall 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['F25', 'enterprise', 'saas'],
  video_url = 'https://youtube.com/watch?v=amNO1hHARqI',
  author = user:yc,
  votes_problem = 13,
  votes_solution = 31,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:using-llms-instead-of-government-consulting SET
  title = 'Using LLMs Instead of Government Consulting',
  problem = 'This is a Request for Startup from Y Combinator (Fall 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'govtech',
  tags = ['F25', 'govtech', 'llm'],
  video_url = 'https://youtube.com/watch?v=MbFcWCCqImk',
  author = user:yc,
  votes_problem = 25,
  votes_solution = 22,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:full-stack-ai-companies SET
  title = 'Full-stack AI Companies',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['S25', 'vertical-ai', 'full-stack'],
  video_url = 'https://youtube.com/watch?v=s-okz_-pUHo',
  author = user:yc,
  votes_problem = 43,
  votes_solution = 7,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:more-design-founders SET
  title = 'More Design Founders',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['S25', 'design', 'ux'],
  video_url = 'https://youtube.com/watch?v=DvxPuRbeNwY',
  author = user:yc,
  votes_problem = 48,
  votes_solution = 34,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:voice-ai SET
  title = 'Voice AI',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['S25', 'voice', 'conversational-ai'],
  video_url = 'https://youtube.com/watch?v=_NGqEjFjB0U',
  author = user:yc,
  votes_problem = 33,
  votes_solution = 5,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:ai-for-scientific-advancement SET
  title = 'AI for Scientific Advancement',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['S25', 'science', 'research'],
  video_url = 'https://youtube.com/watch?v=NNwoLCGgN7o',
  author = user:yc,
  votes_problem = 49,
  votes_solution = 29,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:ai-personal-assistant SET
  title = 'AI Personal Assistant',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['S25', 'assistant', 'productivity'],
  video_url = 'https://youtube.com/watch?v=-B3j7NtqU5o',
  author = user:yc,
  votes_problem = 31,
  votes_solution = 12,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:healthcare-ai SET
  title = 'Healthcare AI',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'health',
  tags = ['S25', 'healthcare', 'medical'],
  video_url = 'https://youtube.com/watch?v=hJ4L9SseAuE',
  author = user:yc,
  votes_problem = 19,
  votes_solution = 19,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:ai-personal-tutor-for-everyone SET
  title = 'AI Personal Tutor for Everyone',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'education',
  tags = ['S25', 'edtech', 'tutoring'],
  video_url = 'https://youtube.com/watch?v=c0MJdUVYp3w',
  author = user:yc,
  votes_problem = 59,
  votes_solution = 34,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:software-tools-to-make-robots SET
  title = 'Software Tools To Make Robots',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'hardware',
  tags = ['S25', 'robotics', 'dev-tools'],
  video_url = 'https://youtube.com/watch?v=D4yPM52G5_o',
  author = user:yc,
  votes_problem = 23,
  votes_solution = 31,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:the-future-of-education SET
  title = 'The Future of Education',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'education',
  tags = ['S25', 'edtech', 'learning'],
  video_url = 'https://youtube.com/watch?v=trr8NiH1ZQI',
  author = user:yc,
  votes_problem = 34,
  votes_solution = 30,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:ai-residential-security SET
  title = 'AI Residential Security',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['S25', 'security', 'iot'],
  video_url = 'https://youtube.com/watch?v=AteajI2KG2w',
  author = user:yc,
  votes_problem = 25,
  votes_solution = 7,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:internal-agent-builder SET
  title = 'Internal Agent Builder',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['S25', 'agents', 'no-code'],
  video_url = 'https://youtube.com/watch?v=op9g4HjxrGQ',
  author = user:yc,
  votes_problem = 42,
  votes_solution = 13,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:ai-research-labs SET
  title = 'AI Research Labs',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['S25', 'research', 'lab-automation'],
  video_url = 'https://youtube.com/watch?v=Xzu8BuxMHHw',
  author = user:yc,
  votes_problem = 46,
  votes_solution = 6,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:ai-voice-assistants-for-email SET
  title = 'AI Voice Assistants for Email',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['S25', 'email', 'voice'],
  video_url = 'https://youtube.com/watch?v=JNq9eTCi5Xo',
  author = user:yc,
  votes_problem = 25,
  votes_solution = 13,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:ai-for-personal-finance SET
  title = 'AI for Personal Finance',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'fintech',
  tags = ['S25', 'fintech', 'personal-finance'],
  video_url = 'https://youtube.com/watch?v=-6YQTNlIzbQ',
  author = user:yc,
  votes_problem = 19,
  votes_solution = 7,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:a-secure-ai-app-store SET
  title = 'A Secure AI App Store',
  problem = 'This is a Request for Startup from Y Combinator (Spring 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['SP25', 'marketplace', 'security'],
  video_url = 'https://youtube.com/watch?v=TFXPfy7sWG8',
  author = user:yc,
  votes_problem = 46,
  votes_solution = 6,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:datacenters SET
  title = 'Datacenters',
  problem = 'This is a Request for Startup from Y Combinator (Spring 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['SP25', 'infrastructure', 'cloud'],
  video_url = 'https://youtube.com/watch?v=B4KsLeOZcqU',
  author = user:yc,
  votes_problem = 54,
  votes_solution = 8,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:compliance-and-audit SET
  title = 'Compliance and Audit',
  problem = 'This is a Request for Startup from Y Combinator (Spring 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['SP25', 'compliance', 'legal'],
  video_url = 'https://youtube.com/watch?v=Vi4c51aq-SQ',
  author = user:yc,
  votes_problem = 36,
  votes_solution = 22,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:browser-computer-automation SET
  title = 'Browser & Computer Automation',
  problem = 'This is a Request for Startup from Y Combinator (Spring 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['SP25', 'automation', 'rpa'],
  video_url = 'https://youtube.com/watch?v=v73RSJi8-mY',
  author = user:yc,
  votes_problem = 23,
  votes_solution = 30,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:ai-personal-staff-for-everyone SET
  title = 'AI Personal Staff for Everyone',
  problem = 'This is a Request for Startup from Y Combinator (Spring 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['SP25', 'assistant', 'agents'],
  video_url = 'https://youtube.com/watch?v=2S1Z6YEKVoM',
  author = user:yc,
  votes_problem = 35,
  votes_solution = 29,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:devtools-for-ai-agents SET
  title = 'Devtools for AI Agents',
  problem = 'This is a Request for Startup from Y Combinator (Spring 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'dev-tools',
  tags = ['SP25', 'dev-tools', 'agents'],
  video_url = 'https://youtube.com/watch?v=yFcWSvR6c14',
  author = user:yc,
  votes_problem = 29,
  votes_solution = 12,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:the-future-of-software-engineering SET
  title = 'The Future of Software Engineering',
  problem = 'This is a Request for Startup from Y Combinator (Spring 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'dev-tools',
  tags = ['SP25', 'dev-tools', 'coding'],
  video_url = 'https://youtube.com/watch?v=a-O7vv0ZfNg',
  author = user:yc,
  votes_problem = 56,
  votes_solution = 6,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:ai-commercial-open-source-software-aicoss SET
  title = 'AI Commercial Open Source Software (AICOSS)',
  problem = 'This is a Request for Startup from Y Combinator (Spring 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['SP25', 'open-source', 'enterprise'],
  video_url = 'https://youtube.com/watch?v=xkweKRfUb5Y',
  author = user:yc,
  votes_problem = 22,
  votes_solution = 20,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:ai-coding-agents-for-hardware-optimized-code SET
  title = 'AI Coding Agents for Hardware-Optimized Code',
  problem = 'This is a Request for Startup from Y Combinator (Spring 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'dev-tools',
  tags = ['SP25', 'coding', 'optimization'],
  video_url = 'https://youtube.com/watch?v=W3keOVTy2yE',
  author = user:yc,
  votes_problem = 53,
  votes_solution = 15,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:b2a-software-where-the-customers-will-all-be-agent SET
  title = 'B2A: Software Where the Customers Will All Be Agents',
  problem = 'This is a Request for Startup from Y Combinator (Spring 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['SP25', 'b2a', 'agents'],
  video_url = 'https://youtube.com/watch?v=GEcby86ZOVY',
  author = user:yc,
  votes_problem = 15,
  votes_solution = 22,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:vertical-ai-agents SET
  title = 'Vertical AI Agents',
  problem = 'This is a Request for Startup from Y Combinator (Spring 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['SP25', 'vertical-ai', 'agents'],
  video_url = 'https://youtube.com/watch?v=lvmmk85ArWg',
  author = user:yc,
  votes_problem = 35,
  votes_solution = 13,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:inference-ai-infrastructure-in-the-world-of-test-t SET
  title = 'Inference AI Infrastructure in the World of Test-Time Compute',
  problem = 'This is a Request for Startup from Y Combinator (Spring 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['SP25', 'infrastructure', 'inference'],
  video_url = 'https://youtube.com/watch?v=DwgUlVWs5fk',
  author = user:yc,
  votes_problem = 53,
  votes_solution = 20,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:government-software SET
  title = 'Government Software',
  problem = 'This is a Request for Startup from Y Combinator (Winter 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'govtech',
  tags = ['W25', 'govtech', 'public-sector'],
  video_url = 'https://youtube.com/watch?v=kwmaCLAkpwQ',
  author = user:yc,
  votes_problem = 10,
  votes_solution = 28,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:public-safety-technology SET
  title = 'Public Safety Technology',
  problem = 'This is a Request for Startup from Y Combinator (Winter 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'govtech',
  tags = ['W25', 'safety', 'govtech'],
  video_url = 'https://youtube.com/watch?v=tjagGqZ6jjM',
  author = user:yc,
  votes_problem = 50,
  votes_solution = 6,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:manufacture-in-the-usa SET
  title = 'Manufacture in the USA',
  problem = 'This is a Request for Startup from Y Combinator (Winter 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['W25', 'manufacturing', 'reshoring'],
  video_url = 'https://youtube.com/watch?v=PqV28tLnpQo',
  author = user:yc,
  votes_problem = 22,
  votes_solution = 18,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:stablecoins-2-0 SET
  title = 'Stablecoins 2.0',
  problem = 'This is a Request for Startup from Y Combinator (Winter 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'fintech',
  tags = ['W25', 'crypto', 'stablecoins'],
  video_url = 'https://youtube.com/watch?v=woAM_PbnCak',
  author = user:yc,
  votes_problem = 34,
  votes_solution = 19,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:llms-for-chip-design SET
  title = 'LLMs for Chip Design',
  problem = 'This is a Request for Startup from Y Combinator (Winter 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['W25', 'hardware', 'llm'],
  video_url = 'https://youtube.com/watch?v=ZgQPB0qpk2A',
  author = user:yc,
  votes_problem = 35,
  votes_solution = 26,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:fintech-2-0 SET
  title = 'Fintech 2.0',
  problem = 'This is a Request for Startup from Y Combinator (Winter 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'fintech',
  tags = ['W25', 'fintech', 'payments'],
  video_url = 'https://youtube.com/watch?v=jJp13H5a-jE',
  author = user:yc,
  votes_problem = 32,
  votes_solution = 5,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:new-space-companies SET
  title = 'New Space Companies',
  problem = 'This is a Request for Startup from Y Combinator (Winter 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'hardware',
  tags = ['W25', 'space', 'aerospace'],
  video_url = 'https://youtube.com/watch?v=WRcE3IPvLww',
  author = user:yc,
  votes_problem = 56,
  votes_solution = 6,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:ai-aided-engineering-tools SET
  title = 'AI-Aided Engineering Tools',
  problem = 'This is a Request for Startup from Y Combinator (Winter 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['W25', 'engineering', 'cad'],
  video_url = 'https://youtube.com/watch?v=1asr6PkU8HQ',
  author = user:yc,
  votes_problem = 28,
  votes_solution = 25,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:one-million-jobs-2-0 SET
  title = 'One Million Jobs 2.0',
  problem = 'This is a Request for Startup from Y Combinator (Winter 2025). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['W25', 'workforce', 'jobs'],
  video_url = 'https://youtube.com/watch?v=BAeBkS2gBpo',
  author = user:yc,
  votes_problem = 44,
  votes_solution = 9,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:using-machine-learning-to-simulate-the-physical-wo SET
  title = 'Using Machine Learning to Simulate the Physical World',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2024). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'education',
  tags = ['S24', 'simulation', 'physics'],
  video_url = 'https://youtube.com/watch?v=uzyvVFwLD68',
  author = user:yc,
  votes_problem = 37,
  votes_solution = 31,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:new-defense-technology SET
  title = 'New Defense Technology',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2024). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'govtech',
  tags = ['S24', 'defense', 'security'],
  video_url = 'https://youtube.com/watch?v=e2mmfE1juFs',
  author = user:yc,
  votes_problem = 59,
  votes_solution = 24,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:commercial-open-source-companies SET
  title = 'Commercial Open Source Companies',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2024). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['S24', 'open-source', 'enterprise'],
  video_url = 'https://youtube.com/watch?v=Q2X2kAJajs4',
  author = user:yc,
  votes_problem = 33,
  votes_solution = 28,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:spatial-computing SET
  title = 'Spatial Computing',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2024). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['S24', 'ar-vr', 'spatial'],
  video_url = 'https://youtube.com/watch?v=_rq3utSccQk',
  author = user:yc,
  votes_problem = 16,
  votes_solution = 17,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:new-enterprise-resource-planning-software SET
  title = 'New Enterprise Resource Planning Software',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2024). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['S24', 'erp', 'enterprise'],
  video_url = 'https://youtube.com/watch?v=z5kGw1Cy0tY',
  author = user:yc,
  votes_problem = 47,
  votes_solution = 18,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:developer-tools-inspired-by-existing-internal-tool SET
  title = 'Developer Tools Inspired by Existing Internal Tools',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2024). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'dev-tools',
  tags = ['S24', 'dev-tools', 'internal-tools'],
  video_url = 'https://youtube.com/watch?v=0UycVzrZm7E',
  author = user:yc,
  votes_problem = 15,
  votes_solution = 34,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:llms-for-manual-back-office-processes-in-legacy-en SET
  title = 'LLMs for Manual Back Office Processes in Legacy Enterprises',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2024). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['S24', 'enterprise', 'automation'],
  video_url = 'https://youtube.com/watch?v=1CrcTQ2fiEU',
  author = user:yc,
  votes_problem = 42,
  votes_solution = 15,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:ai-to-build-enterprise-software SET
  title = 'AI to Build Enterprise Software',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2024). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['S24', 'enterprise', 'low-code'],
  video_url = 'https://youtube.com/watch?v=fx3mqS_faOQ',
  author = user:yc,
  votes_problem = 29,
  votes_solution = 31,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:stablecoin-finance SET
  title = 'Stablecoin Finance',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2024). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'fintech',
  tags = ['S24', 'crypto', 'fintech'],

  author = user:yc,
  votes_problem = 56,
  votes_solution = 30,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:a-way-to-end-cancer SET
  title = 'A Way to End Cancer',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2024). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'health',
  tags = ['S24', 'biotech', 'healthcare'],

  author = user:yc,
  votes_problem = 17,
  votes_solution = 13,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:foundation-models-for-biological-systems SET
  title = 'Foundation Models for Biological Systems',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2024). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'health',
  tags = ['S24', 'biotech', 'foundation-models'],

  author = user:yc,
  votes_problem = 11,
  votes_solution = 18,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:the-managed-service-organization-model-for-healthc SET
  title = 'The Managed Service Organization Model for Healthcare',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2024). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'health',
  tags = ['S24', 'healthcare', 'mso'],

  author = user:yc,
  votes_problem = 51,
  votes_solution = 28,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:eliminating-middlemen-in-healthcare SET
  title = 'Eliminating Middlemen in Healthcare',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2024). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'health',
  tags = ['S24', 'healthcare', 'marketplace'],

  author = user:yc,
  votes_problem = 18,
  votes_solution = 5,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:small-fine-tuned-models-as-an-alternative-to-giant SET
  title = 'Small Fine-tuned Models as an Alternative to Giant Generic Ones',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2024). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['S24', 'fine-tuning', 'efficiency'],

  author = user:yc,
  votes_problem = 43,
  votes_solution = 19,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:explainable-ai SET
  title = 'Explainable AI',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2024). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'ai',
  tags = ['S24', 'xai', 'interpretability'],

  author = user:yc,
  votes_problem = 55,
  votes_solution = 20,
  created_at = time::now(),
  updated_at = time::now();

CREATE idea:applying-machine-learning-to-robotics SET
  title = 'Applying Machine Learning to Robotics',
  problem = 'This is a Request for Startup from Y Combinator (Summer 2024). Watch the video to learn more about why YC believes this is an important problem to solve.',
  category = 'education',
  tags = ['S24', 'robotics', 'ml'],

  author = user:yc,
  votes_problem = 56,
  votes_solution = 30,
  created_at = time::now(),
  updated_at = time::now();

