-- RFSbase Seed Data
-- Generated from Y Combinator RFS (ycombinator.com/rfs)
-- 57 RFS across 5 seasons
-- Auto-generated on 2026-01-29

-- Create YC Partner users
CREATE user:harj_taggar SET
  name = 'Harj Taggar',
  email = 'harj_taggar@ycombinator.com',
  verified_email = true,
  yc_type = 'partner',
  created_at = time::now(),
  updated_at = time::now();

CREATE user:david_lieb SET
  name = 'David Lieb',
  email = 'david_lieb@ycombinator.com',
  verified_email = true,
  yc_type = 'partner',
  created_at = time::now(),
  updated_at = time::now();

CREATE user:aaron_epstein SET
  name = 'Aaron Epstein',
  email = 'aaron_epstein@ycombinator.com',
  verified_email = true,
  yc_type = 'partner',
  created_at = time::now(),
  updated_at = time::now();

CREATE user:pete_koomen SET
  name = 'Pete Koomen',
  email = 'pete_koomen@ycombinator.com',
  verified_email = true,
  yc_type = 'partner',
  created_at = time::now(),
  updated_at = time::now();

CREATE user:andrew_miklas SET
  name = 'Andrew Miklas',
  email = 'andrew_miklas@ycombinator.com',
  verified_email = true,
  yc_type = 'partner',
  created_at = time::now(),
  updated_at = time::now();

CREATE user:gustaf_alstromer SET
  name = 'Gustaf Alstromer',
  email = 'gustaf_alstromer@ycombinator.com',
  verified_email = true,
  yc_type = 'partner',
  created_at = time::now(),
  updated_at = time::now();

CREATE user:jared_friedman SET
  name = 'Jared Friedman',
  email = 'jared_friedman@ycombinator.com',
  verified_email = true,
  yc_type = 'partner',
  created_at = time::now(),
  updated_at = time::now();

CREATE user:gustaf_alstr_mer SET
  name = 'Gustaf Alströmer',
  email = 'gustaf_alstr_mer@ycombinator.com',
  verified_email = true,
  yc_type = 'partner',
  created_at = time::now(),
  updated_at = time::now();

CREATE user:diana_hu SET
  name = 'Diana Hu',
  email = 'diana_hu@ycombinator.com',
  verified_email = true,
  yc_type = 'partner',
  created_at = time::now(),
  updated_at = time::now();

CREATE user:tom_blomfield SET
  name = 'Tom Blomfield',
  email = 'tom_blomfield@ycombinator.com',
  verified_email = true,
  yc_type = 'partner',
  created_at = time::now(),
  updated_at = time::now();

CREATE user:tyler_bosmeny SET
  name = 'Tyler Bosmeny',
  email = 'tyler_bosmeny@ycombinator.com',
  verified_email = true,
  yc_type = 'partner',
  created_at = time::now(),
  updated_at = time::now();

CREATE user:garry_tan SET
  name = 'Garry Tan',
  email = 'garry_tan@ycombinator.com',
  verified_email = true,
  yc_type = 'partner',
  created_at = time::now(),
  updated_at = time::now();

CREATE user:nicolas_dessaigne SET
  name = 'Nicolas Dessaigne',
  email = 'nicolas_dessaigne@ycombinator.com',
  verified_email = true,
  yc_type = 'partner',
  created_at = time::now(),
  updated_at = time::now();

CREATE user:dalton_caldwell SET
  name = 'Dalton Caldwell',
  email = 'dalton_caldwell@ycombinator.com',
  verified_email = true,
  yc_type = 'partner',
  created_at = time::now(),
  updated_at = time::now();

CREATE user:brad_flora SET
  name = 'Brad Flora',
  email = 'brad_flora@ycombinator.com',
  verified_email = true,
  yc_type = 'partner',
  created_at = time::now(),
  updated_at = time::now();

CREATE user:surbhi_sarna SET
  name = 'Surbhi Sarna',
  email = 'surbhi_sarna@ycombinator.com',
  verified_email = true,
  yc_type = 'partner',
  created_at = time::now(),
  updated_at = time::now();


-- Create ideas from YC RFS

CREATE idea:retraining_workers_for_the_ai_economy_c67a SET
  title = 'Retraining Workers for the AI Economy',
  problem = 'We talk a lot about the AI revolution in terms of models, chips, and software. But to make it a reality, there needs to be a huge buildout of physical infrastructure like data centers and semiconductor fabs.\n\nAnd that\'s where we have a problem. While we\'re focused on the race for AI talent, we also have a shortage of skilled tradespeople—the electricians, the HVAC technicians, the welders—who are essential to building this physical infrastructure.\n\nThe government\'s new AI Action plan creates a forcing function to solve this. There\'s a big emphasis on a "worker-first" agenda, and directions to the Departments of Labor and Commerce to fund new rapid retraining programs for exactly these kinds of physical labor jobs.\n\nThis creates opportunities for startups. We want to fund startups building a new kind of vocational school for the AI economy to train people for these jobs. We think you could use AI to create personalized training programs to get people job-ready in months, not years.\n\nThe challenge is, how do you teach someone to weld or fix pipes via AI? Unlike coding, you can\'t learn these skills by typing on a keyboard — you need to learn by practicing them in the real world.\n\nThis is where multimodal AI could create opportunities — for example, maybe a voice AI could coach someone through these tasks. Or perhaps some combination of AR/VR could let people practice the work in simulation with an AI tutor using vision models to watch them and give feedback.\n\nIt\'s clear how you\'d make money from this business — employers would pay to hire your well-trained workers. In the past, these types of training businesses — like coding bootcamps — have struggled to expand because it\'s hard to scale the quality of human tutors, but AI might solve this problem too. If you can make one effective AI teacher, it\'ll scale infinitely.\n\nThis is a chance to build a huge business that lets everyone benefit from and participate in the new AI economy that\'s changing the world. If you want to work on this, we\'d love to hear from you.',
  category = 'government',
  tags = ['F25', 'voice', 'education', 'infrastructure'],
  video_url = 'https://youtube.com/watch?v=F40PQKJVWJY',
  author = user:harj_taggar,
  votes_problem = 30,
  votes_solution = 10,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-09-03T09:00:00.000Z',
  updated_at = '2025-09-03T09:00:00.000Z';

CREATE idea:video_generation_as_a_primitive_fea4 SET
  title = 'Video Generation as a Primitive',
  problem = 'Video generation models are getting really good. Google\'s Veo 3 already produces 8-second, photorealistic, sound-on clips for just a few dollars per video, often indistinguishable from reality. Soon, you\'ll be able to generate near-perfect footage of anything, on the fly, for a marginal cost approaching 0, and video will become a new basic building block for software.\n\nWhen this happens, a lot of new ideas become possible.\n\nIt\'s definitely going to change media and entertainment:\n\nImagine being able to create a brand new season of your favorite canceled TV series. Or a personalized kids cartoon starring your own family as the characters. Or an AI-native successor to TikTok, where every video is made for exactly one viewer.\n\nVideo generation will also change how we buy things:\n\nImagine you\'re shopping online, you\'ll be able to see yourself wearing the clothes or using the products you\'re browsing. And when you\'re apartment hunting, your stuff will be auto-staged in every listing you click on.\n\nThis new primitive also opens up major changes to gaming and simulation:\n\nWe\'ll have video games built with no game engine. We\'ll have APIs that return infinite robotic training data. And we\'ll definitely be able to have video calls with loved ones long after they\'re gone.\n\nAnd these are just the obvious ideas we can imagine today.\nWe\'re interested in founders who treat generative video as a new computing primitive—not an output—and build new apps, tooling, and infrastructure for a world with limitless, low-latency video.',
  category = 'education',
  tags = ['F25', 'video', 'robotics', 'infrastructure'],
  video_url = 'https://youtube.com/watch?v=tJ2C9a5GBOs',
  author = user:david_lieb,
  votes_problem = 49,
  votes_solution = 14,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-09-03T09:00:00.000Z',
  updated_at = '2025-09-03T09:00:00.000Z';

CREATE idea:the_first_10person_100b_company_2c69 SET
  title = 'The First 10-person, $100B Company',
  problem = 'Thanks to new AI tools, we believe it\'s now possible for small, high-agency teams – even solo founders – to build multi-billion dollar companies with as little as just $500k in funding from YC.\n\n15 years ago, cloud computing came along and eliminated the need for spending tons of money on physical server infrastructure, making it easier to build a big company with way less capital. This is happening again now, with new AI tools that make it easier for ambitious founders to scale with far fewer people.\n\nThat\'s why the best high-agency startups of the future will all optimize for one metric: revenue per employee.\n\nThese small teams have incredible advantages over bloated incumbents, too. With smaller, efficient teams at scale, they won\'t get bogged down with the politics, excessive meetings, and lack of focus that grinds huge companies to a halt. They can just focus on winning with better speed and execution.\n\nWe want to fund these high-agency founders to help them build the first 10-person, $100b dollar company.',
  category = 'infrastructure',
  tags = ['F25', 'infrastructure'],
  video_url = 'https://youtube.com/watch?v=lkFiTvXu9Zw',
  author = user:aaron_epstein,
  votes_problem = 32,
  votes_solution = 34,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-09-04T09:00:00.000Z',
  updated_at = '2025-09-04T09:00:00.000Z';

CREATE idea:infrastructure_for_multiagent_systems_d757 SET
  title = 'Infrastructure for Multi-Agent Systems',
  problem = 'AI agents are evolving from single-threaded loops into distributed workflows that fan out many sub‑agent calls in a single run. These multi-agent systems are useful for everything from long-running workflows to agentic mapreduce jobs where hundreds of thousands of subagents apply human-level judgment to filter and search through large amounts of data in parallel.\n\nThese systems are difficult to build. They require solving traditional distributed systems problems to ensure high throughput and reliability while controlling costs.\n\nThey also introduce new problems that look familiar but can be solved at a higher level of abstraction, like:\n\n- how to write effective agent and subagent prompts\n- how to handle untrusted context\n- how to monitor and debug these agents\n\nWe\'re looking for builders who have felt this pain in production and want to build tools to make these systems easier to build and maintain. If you want to make operating fleets of agents as routine and reliable as deploying a web service or running a Spark job, we\'d love to hear from you.',
  category = 'infrastructure',
  tags = ['F25', 'agents', 'infrastructure'],
  video_url = 'https://youtube.com/watch?v=0qGjxsMzuxc',
  author = user:pete_koomen,
  votes_problem = 10,
  votes_solution = 8,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-09-05T09:00:00.000Z',
  updated_at = '2025-09-05T09:00:00.000Z';

CREATE idea:ai_native_enterprise_software_f1c2 SET
  title = 'AI Native Enterprise Software',
  problem = 'Salesforce and ServiceNow are two of the world\'s largest enterprise software vendors, each making more than $10B a year in revenue, and each with a market cap of more than $200B. Both produce software needed to run the world\'s biggest businesses.\n\nInterestingly, both were founded about 25 years ago. Coincidence? I don\'t think so! Salesforce built the first cloud-native CRM, and ServiceNow built the first cloud-native ITSM system. Both rode the cloud computing wave to victory over their respective incumbents.\n\nThe story is much the same for Netsuite, Successfactors, and a host of other B2B startups from the early two thousands. The founders of these businesses realized that SaaS offered a way to build a ten times better product. Just as important, these founders knew the incumbents would struggle to adapt to the new world of cloud computing, giving them the edge they needed to go up against them and win.\n\nAI presents the same once-in-a-generation opportunity for today\'s founders. Tomorrow\'s enterprise software systems won\'t just be the "system of record" for work done by humans. They\'ll have AI embedded deeply and thoughtfully throughout, and will help employees do their work faster and more accurately. Think Cursor for sales, HR, and accounting.\n\nJust as before, today\'s incumbents will struggle to rebuild their product around this new technology, giving today\'s startups the time they need to win. History doesn\'t repeat itself, but it sure does rhyme.\n\nInterested in building AI-native enterprise software? If so, we should chat.',
  category = 'enterprise',
  tags = ['F25', 'enterprise'],
  video_url = 'https://youtube.com/watch?v=amNO1hHARqI',
  author = user:andrew_miklas,
  votes_problem = 12,
  votes_solution = 19,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-09-07T09:00:00.000Z',
  updated_at = '2025-09-07T09:00:00.000Z';

CREATE idea:using_llms_instead_of_government_consult_4b7a SET
  title = 'Using LLMs Instead of Government Consulting',
  problem = 'The U.S. government spends over $100 billion a year on consulting. As you might imagine, this isn\'t the most efficient or innovative part of our economy.\n\nBut over the last couple of years, there have been a few big reasons we believe this will change. Most importantly, today, there is political pressure to cut wasteful consulting and spending. Every part of the government now runs on software, but usually custom software built by a consulting company, and anyone who has used this software knows we can do a lot better. Finally, LLMs today are so good that they can already do the jobs of many consulting firms.\n\nWe\'ve recently funded companies that help companies get approved to sell to the government, called FedRAMP. We\'ve also recently funded companies that help the government cut regulation and use LLMs to help make sure the laws and policies coming out of the government are actually legal.\n\nWe think there is a lot more work that government consulting firms like Deloitte and Accenture do for the government today, and we want to fund startups that build LLM software to do that work.',
  category = 'government',
  tags = ['F25', 'llm'],
  video_url = 'https://youtube.com/watch?v=MbFcWCCqImk',
  author = user:gustaf_alstromer,
  votes_problem = 26,
  votes_solution = 7,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-09-08T09:00:00.000Z',
  updated_at = '2025-09-08T09:00:00.000Z';

CREATE idea:fullstack_ai_companies_32dc SET
  title = 'Full-stack AI Companies',
  problem = 'At YC, I would like to fund more founders working on full-stack AI companies. What is a full-stack AI company, you ask? Let me give an example.  \n\nSuppose you believe that LLMs are now able to automate a lot of legal work. There are two things you might do with that idea. You could build an AI agent and sell it to law firms. That\'s what most people do. \n\nOr, you could start your own law firm, staff it with AI agents, and compete with the existing law firms.  \n\nThat, my friends, is going full-stack. You could do this for any industry, especially one dominated by slow-moving incumbents.  Instead of selling to the dinosaurs, you could make them extinct.',
  category = 'ai',
  tags = ['S25', 'agents', 'llm'],
  video_url = 'https://youtube.com/watch?v=s-okz_-pUHo',
  author = user:jared_friedman,
  votes_problem = 32,
  votes_solution = 21,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-04-04T09:00:00.000Z',
  updated_at = '2025-04-04T09:00:00.000Z';

CREATE idea:more_design_founders_4b5f SET
  title = 'More Design Founders',
  problem = 'More designers should be founders.\n\nOver the next decade, as new coding tools make it easier than ever to build and ship products quickly, great design is going to matter even more.\n\nEspecially as many designers are worried about AI replacing their jobs, the real opportunity is for designers to use AI themselves to launch their own products and build their own companies. The design job of the future will be "founder".\n\nDesigners already have so many of the skills needed to be great – strong user empathy, a focus on solving problems, a high bar for quality, and taste. These are a must for every founding team.\n\nThat\'s why it\'s no accident that some of the biggest YC companies, like Airbnb and Stripe, are known for their exceptional design.  Without it, users wouldn\'t have trusted staying in a stranger\'s Airbnb, or trusted securely processing billions in credit card transactions through Stripe. These companies simply wouldn\'t have worked without first class design.\n\nSo we\'d love to see more designers take the leap and start companies, and hope to fund teams with strong design and taste embedded in their core from the earliest days.',
  category = 'ai',
  tags = ['S25'],
  video_url = 'https://youtube.com/watch?v=DvxPuRbeNwY',
  author = user:aaron_epstein,
  votes_problem = 30,
  votes_solution = 19,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-04-05T09:00:00.000Z',
  updated_at = '2025-04-05T09:00:00.000Z';

CREATE idea:voice_ai_ddfd SET
  title = 'Voice AI',
  problem = 'Humans interact with businesses in many ways, but one way hasn\'t changed much in almost 100 years—and that\'s phone calls. You probably have experienced long wait times, voice trees, the press star or pound. In the end, we always want to talk to a human agent because the alternatives are just not that great. \n\nBut the new voice models and conversational LLMs are now incredibly good. And startups who take advantage of them are are now making voice AI bots that are indistinguishable from humans. It\'s pretty amazing and the unlock was the quality of these models. \n\nToday, over a trillion calls exist between a business and a customer. What we like to do at YC is to peek into the future, and talking to a voice AI bot feels like experiencing the future - similar to how it felt to ride an autonomous car for the first time - it just works.',
  category = 'ai',
  tags = ['S25', 'agents', 'voice', 'llm'],
  video_url = 'https://youtube.com/watch?v=_NGqEjFjB0U',
  author = user:gustaf_alstr_mer,
  votes_problem = 53,
  votes_solution = 17,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-04-05T09:00:00.000Z',
  updated_at = '2025-04-05T09:00:00.000Z';

CREATE idea:ai_for_scientific_advancement_da29 SET
  title = 'AI for Scientific Advancement',
  problem = 'A lot of the software tools used for scientific applications in chemistry, biology, materials science, or operations research haven\'t changed much in decades. These rely on standard methods along PhDs to solve complex problems in drug discovery, chemical process optimization, metals & mining, or power grid optimization. \n\nIn particular, test-time compute is unlocking new types of startups that can solve these scientific problems. \n\nWe\'d love to see more startups get created that use AI to transform how physical things are made faster and more efficiently.',
  category = 'ai',
  tags = ['S25'],
  video_url = 'https://youtube.com/watch?v=NNwoLCGgN7o',
  author = user:diana_hu,
  votes_problem = 35,
  votes_solution = 16,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-04-07T09:00:00.000Z',
  updated_at = '2025-04-07T09:00:00.000Z';

CREATE idea:ai_personal_assistant_6a42 SET
  title = 'AI Personal Assistant',
  problem = 'Despite decades of productivity apps, emails still pile up, calendars get full, and tasks remain undone. Even the best organizational tools only help us keep track of what needs to get done—they don\'t actually do it. With recent advances in LLMs, we now have the potential to go from "to-do" lists to "done" lists"\n\nI\'d love to work with startups building the next generation of AI personal assistant: an LLM-powered system that deeply understands your work, routines, communication history, and personal preferences. Imagine an AI that has perfect memory of your personal correspondence, projects, and scheduling preferences— and can take action on your behalf.\n\nThink of an assistant that knows how you typically respond to certain kinds of emails and can draft those responses for you—or even send them with your approval. It understands which meetings you usually accept and which you decline, and that can auto-schedule your week in a way that optimises your productivity and minimises travel. It keeps track of tasks you\'ve completed in the past and how you approach new ones, so it can handle recurring processes without your constant input.\n\nThis is more than just filtering messages or auto-filling your calendar. I want to see a system that truly does the tasks a human personal assistant or chief of staff might otherwise do, allowing you to focus on the work that matters most.',
  category = 'ai',
  tags = ['S25', 'llm'],
  video_url = 'https://youtube.com/watch?v=-B3j7NtqU5o',
  author = user:tom_blomfield,
  votes_problem = 30,
  votes_solution = 11,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-04-08T09:00:00.000Z',
  updated_at = '2025-04-08T09:00:00.000Z';

CREATE idea:healthcare_ai_c199 SET
  title = 'Healthcare AI',
  problem = 'The US healthcare system is over 17% of GDP or over 4 trillion dollars. There are estimates that one-third of that, or over 1 trillion, is just spent on administrative tasks. We have one of the best healthcare systems in the world, but sadly, a lot of this spending is just unnecessary administration that exists because different health systems are not interoperable, don\'t have APIs, or simply the only way of doing a workflow or task if a human manually extracts data from one system to another. \n\nIn the last two years, there is an entire set of new startups building infrastructure to extract data from PDF or other systems, organize it, and allow it to be easily entered with an agent into a different system. Many of the tasks that led to high administrative healthcare costs are now fully possible to automate because the arrival of great LLMs happened in just the last 12 months of the companies. You can help make the US healthcare system be more efficient by solving these issues',
  category = 'health',
  tags = ['S25', 'agents', 'llm', 'healthcare', 'infrastructure'],
  video_url = 'https://youtube.com/watch?v=hJ4L9SseAuE',
  author = user:gustaf_alstr_mer,
  votes_problem = 14,
  votes_solution = 7,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-04-08T09:00:00.000Z',
  updated_at = '2025-04-08T09:00:00.000Z';

CREATE idea:ai_personal_tutor_for_everyone_25b8 SET
  title = 'AI Personal Tutor for Everyone',
  problem = 'The idea of using computers to help people learn things has been a dream of computer nerds going back to the 1940\'s with Vannevar Bush\'s Memex idea, JCR Licklider\'s "Man-Computer Symbiosis" paper in the 60\'s, and Alan Kay\'s Dynabook proposal in the 70\'s.\n\nThe holy grail has been to build a personalized learning experience for everyone but in practice, that\'s been hard to build. Most online education products deliver the same content to everyone who signs up for a course.\n\nAnd today, with AI, we think it\'s finally possible to build a truly personal tutor for everyone. The latest reasoning capabilities let them break down complex topics step by step, in a way that should help explain even the most complicated subjects in a straightforward way.\n\nWith the latest foundation models being multimodal, they can now present these concepts by generating animations, manipulating 3D objects, and explaining concepts with voice.\n\nWe\'ve already seen the impact that one great teacher, like Grant Sanderson and his 3blue1brown YouTube videos, can have on making it easy to understand complex ideas using beautiful visualizations and animations. Now imagine having that same quality of explanation available for every topic, personalized to each learner\'s needs, with an interactive AI tutor. This could really change the world.\n\nIf you\'re working on using AI to create personalized learning tools for anything, we\'d love to hear from you.',
  category = 'education',
  tags = ['S25', 'voice', 'video', 'education'],
  video_url = 'https://youtube.com/watch?v=c0MJdUVYp3w',
  author = user:harj_taggar,
  votes_problem = 23,
  votes_solution = 32,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-04-10T09:00:00.000Z',
  updated_at = '2025-04-10T09:00:00.000Z';

CREATE idea:software_tools_to_make_robots_0dfa SET
  title = 'Software Tools To Make Robots',
  problem = 'Robotics hasn\'t had its ChatGPT moment yet, but we think it\'s almost here.\n\nEveryone has known that robots are the future - But that proved elusive because previous generations of robots were expensive, brittle, and only worked in controlled conditions.\n\nWith the rapid improvements in foundation models, it\'s finally possible to make robots that have human-level perception and judgment. That\'s been the missing piece.\n\nWhile consumer use cases feature heavily in science fiction, some of the overlooked and most immediately addressable applications for robots are B2B.\n\nSpecifically, we think promising areas are industrial use cases like Gecko Robotics, which builds inspection robots, and farming use cases like Bear Flag Robotics, which builds autonomous tractors and was acquired by John Deere.\n\nWe\'re interested in funding people building software tools to help others make robots. If you\'re bullish that robots are about to have their ChatGPT moment, we\'d love to hear from you!',
  category = 'hardware',
  tags = ['S25', 'robotics'],
  video_url = 'https://youtube.com/watch?v=D4yPM52G5_o',
  author = user:diana_hu,
  votes_problem = 44,
  votes_solution = 31,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-04-11T09:00:00.000Z',
  updated_at = '2025-04-11T09:00:00.000Z';

CREATE idea:the_future_of_education_73c7 SET
  title = 'The Future of Education',
  problem = 'Education is one of the world\'s largest and most important industries, yet it\'s also one of the most difficult to disrupt. About 100 million people are employed in education today, and about 1.5bn students are being educated every year. Traditional ways of teaching and learning have remained largely unchanged for decades, but things might be starting to shift.\n\nThe rise of AI—particularly large language models—promises to reshape how we teach, learn, and measure outcomes. These technologies have the potential to significantly improve educational access, personalize instruction, and free both teachers and learners from drudgery.\n\nWe\'re just starting to see new personalized study tools for students and grading platforms for teachers, but we\'re still very early in figuring out what AI can truly achieve here. One big challenge is figuring out the business model - while more than a billion people are engaged in education, budgets are notoriously tight, and purchasing cycles are horrendously slow.\n\nIf you fast-forward 10 or 20 years, it\'s impossible to believe that education is still going to be done in the same way it is today.',
  category = 'education',
  tags = ['S25', 'llm', 'education'],
  video_url = 'https://youtube.com/watch?v=trr8NiH1ZQI',
  author = user:tom_blomfield,
  votes_problem = 27,
  votes_solution = 28,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-04-11T09:00:00.000Z',
  updated_at = '2025-04-11T09:00:00.000Z';

CREATE idea:ai_residential_security_4aba SET
  title = 'AI Residential Security',
  problem = 'Consumers spend $20B year on home security. And the biggest players are legacy companies whose features haven\'t changed in decades.\n\nMeanwhile, AI is taking the world of commercial security by storm. Companies like Verkada, Lumana are showing just how powerful AI can be. In commercial buildings, doors are unlocked with facial recognition. Video cameras detect suspicious behavior and send push notifications to building managers. Virtual AI guards will even come on loudspeakers and scare away criminals – to prevent crime before it happens.\n\nRing was acquired for $1 billion dollars for making video doorbells and magnetic door sensors.\nImagine how big the opportunity is for the company that uses AI to make people feel actually safe in their homes.',
  category = 'ai',
  tags = ['S25', 'video', 'security'],
  video_url = 'https://youtube.com/watch?v=AteajI2KG2w',
  author = user:tyler_bosmeny,
  votes_problem = 55,
  votes_solution = 16,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-04-12T09:00:00.000Z',
  updated_at = '2025-04-12T09:00:00.000Z';

CREATE idea:internal_agent_builder_7343 SET
  title = 'Internal Agent Builder',
  problem = 'Soon, all companies will have one thing in common: every employee will build their own agents to automate the repetitive parts of their jobs. \n\nWe\'d like to fund founders working on the infrastructure they\'ll use to do that: internal agent builders.\n\nAn internal agent builder is a tool that I can use to create an agent to handle mundane tasks I don\'t like doing. This infrastructure will need to access every other piece of software I use in my day-to-day. It\'ll need to manage permissions, and send sensitive data securely to the latest generation of LLMs. \n\nWe\'ve built a version of this at YC and we\'re already using it to reduce the time we spend on everything from reviewing term sheets to repetitive accounting workflows. It frees us from the mundane so that we can spend more time on the tasks that we humans are uniquely good at. In my case that\'s working with founders!\n\nIf you\'re interested in building the foundational infrastructure for AI native companies, we\'d love to hear from you.',
  category = 'infrastructure',
  tags = ['S25', 'agents', 'llm', 'infrastructure'],
  video_url = 'https://youtube.com/watch?v=op9g4HjxrGQ',
  author = user:pete_koomen,
  votes_problem = 26,
  votes_solution = 23,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-04-12T09:00:00.000Z',
  updated_at = '2025-04-12T09:00:00.000Z';

CREATE idea:ai_research_labs_68fb SET
  title = 'AI Research Labs',
  problem = 'At YC, we want to fund more AI Research Labs. Many people don\'t realize this, but YC was the first investor in OpenAI. In fact, OpenAI began life as YC Research, our in-house research lab. OpenAI pioneered the concept of independent AI Research labs, and we have had a front-row seat to the entire journey.\n\nOpenAI is doing incredible work, but there are many unsolved problems in AI and still plenty of opportunity for new research labs.\n\nSometimes people think that to do YC you have to be able to ship a product in 3 months. But actually, we\'re excited to back deep, open-ended research that may takes years to commercialize just like OpenAI did. We\'ve seen that when top researchers follow their interests, it often leads somewhere interesting.',
  category = 'ai',
  tags = ['S25'],
  video_url = 'https://youtube.com/watch?v=Xzu8BuxMHHw',
  author = user:jared_friedman,
  votes_problem = 53,
  votes_solution = 17,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-04-15T09:00:00.000Z',
  updated_at = '2025-04-15T09:00:00.000Z';

CREATE idea:ai_voice_assistants_for_email_c84f SET
  title = 'AI Voice Assistants for Email',
  problem = 'I want to meet teams who can help me process my inbox – with just my voice.\n\nYou see, every day I drive to work for 20 minutes, and every day I wish I could be using that time to triage emails, draft replies, delegate scheduling. What if we could all arrive at work each day already at Inbox Zero?\n\nIf you\'ve used things like Vapi, Retell, or even ChatGPT Advanced Voice Mode, you know how good these voice agents are today. The use cases are far bigger than just driving. I know firsthand - It took me experiencing nerve damage in my arms to realize how much we still rely on keyboards for even the most basic tasks.\n\nAnd email just might be the perfect starting place to build the most useful all-purpose assistant. Anyone with access to my inbox instantly knows my friends, my plans, my writing style, and so much more.\n\nIf you\'re an ambitious team interested in working on this, I\'m interested in working with you.',
  category = 'ai',
  tags = ['S25', 'agents', 'voice'],
  video_url = 'https://youtube.com/watch?v=JNq9eTCi5Xo',
  author = user:tyler_bosmeny,
  votes_problem = 54,
  votes_solution = 33,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-04-15T09:00:00.000Z',
  updated_at = '2025-04-15T09:00:00.000Z';

CREATE idea:ai_for_personal_finance_b3fd SET
  title = 'AI for Personal Finance',
  problem = 'Most humans are not rational about their finances. But just being alive comes with a set of decisions you need to make about your finances. How much should I save for the future, where should I invest my money to take the right risk, and how should I think about debt and taxes? How you answer these questions today will impact your freedom to do the things you want in the future.\n\nUntil today, the answers have generally been asking friends, googling, hiring a financial advisor or maybe even asking your bank.\n\nThese options aren\'t great. They are filled with bias and don\'t have the full picture of your financial situation and goals. And hiring a great financial advisor is very expensive.\n\nWith LLMs, there is a unique opportunity to build software that gives every person access to personalized finance, investment, and tax advice at near-zero cost. They would use API\'s to access your complete financial situation and give completely personal unbiased advice.\n\nIf this is something you are thinking about building, you should consider applying to the YC Summer batch.',
  category = 'fintech',
  tags = ['S25', 'llm', 'fintech'],
  video_url = 'https://youtube.com/watch?v=-6YQTNlIzbQ',
  author = user:gustaf_alstr_mer,
  votes_problem = 19,
  votes_solution = 31,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-04-01T09:00:00.000Z',
  updated_at = '2025-04-01T09:00:00.000Z';

CREATE idea:a_secure_ai_app_store_dd28 SET
  title = 'A Secure AI App Store',
  problem = 'We want a new kind of AI App Store and OS layer that sits on your computer or phone. It should:\n\n1. Protect User Data\nUsers control what info each app can see—like your calendar, files, or browsing—but only if the user says so.\n\n2. Offer One Shared Memory\nAll your personal details (preferences, past actions, context) stay in this layer, not scattered across a dozen apps.\n\n3. Help users find the best AI apps\nThis App Store reviews and vets each AI tool so users can discover and install them safely.\n\n4. Help Developers Build\nDevelopers get infrastructure that help them avoid reinventing the wheel provided in simple APIs (like computer use, local LLaMA versioning, and app-level access control).\n\n5. Handle Payments\nMake it easy to pay for paid apps or services.\n\nImagine a travel AI that\'s great at finding flights that knows you usually travel with your nine-year-old who loves staring out the window, or an AI helper that recommends the original text an idea appeared in when you\'re reading essays or books. Apps built on this app store would have just a sliver of data you, the user, allows.\n\nWe need a system like this so AI can be both powerful and private. Some might say the major big tech companies will build this, but there is a time right now where instead, it might be you.\n\nDone right, this will create more opportunity for startups and founders: their apps will be smarter with shared memory, and this will turn into a new marketplace that solves both distribution and monetization. If you\'re building it, please apply. We\'d love to help you do it right.',
  category = 'infrastructure',
  tags = ['Sp25', 'devtools', 'infrastructure'],
  video_url = 'https://youtube.com/watch?v=TFXPfy7sWG8',
  author = user:garry_tan,
  votes_problem = 51,
  votes_solution = 34,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-01-02T09:00:00.000Z',
  updated_at = '2025-01-02T09:00:00.000Z';

CREATE idea:datacenters_eed5 SET
  title = 'Datacenters',
  problem = 'We need more data centers that can be built faster and at a lower cost to support the infrastructure needed for AI progress. Hyperscale datacenter projects take years to complete, and with the current interest and funding, we need new companies and more innovative solutions to accelerate this buildout—whether in power infrastructure, cooling, material procurement, or project management.\n\nWe can envision what the future will look like: software will handle every aspect of planning and constructing new datacenters or warehouses, from site selection and construction to setup and ongoing management. These applications will be "lights out," with robots operating autonomously 24/7 without human intervention.\n\nWe want to fund new startups to help create this vision.',
  category = 'hardware',
  tags = ['Sp25', 'robotics', 'infrastructure'],
  video_url = 'https://youtube.com/watch?v=B4KsLeOZcqU',
  author = user:diana_hu,
  votes_problem = 33,
  votes_solution = 34,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-01-03T09:00:00.000Z',
  updated_at = '2025-01-03T09:00:00.000Z';

CREATE idea:compliance_and_audit_acb4 SET
  title = 'Compliance and Audit',
  problem = 'Almost 4 million people in the US and Europe (roughly 1% of the entire workforce) work in compliance and audit. And compliance costs are only rising. From GDPR to Dodd-Frank, from financial AML/KYC to ESG reporting—the regulatory environment keeps expanding.\n\nTraditional compliance tasks require reading dense regulations, cross-checking internal policy and procedure documents, manually sampling front-line work done and producing repetitive reports. Auditors often sift through large amounts of unstructured data to detect issues. These manual, time-consuming workflows beg for automation.\n\nLLMs excel at this. They can parse regulatory documents, corporate policies, or financial statements and highlight issues, saving human review. These tools will automate much of the testing that auditors currently do by hand: spotting anomalies in data, identifying incomplete records, or highlighting contradictory policies.\n\nInstead of sampling a few documents, a well-trained model can look at everything, all at once - "continuously auditing" every company in the world.',
  category = 'ai',
  tags = ['Sp25', 'llm'],
  video_url = 'https://youtube.com/watch?v=Vi4c51aq-SQ',
  author = user:tom_blomfield,
  votes_problem = 13,
  votes_solution = 23,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-01-06T09:00:00.000Z',
  updated_at = '2025-01-06T09:00:00.000Z';

CREATE idea:browser_computer_automation_3faf SET
  title = 'Browser & Computer Automation',
  problem = 'AI agents can now browse the web and use desktop applications. OpenAI\'s Operator and Anthropic\'s Computer Use showed this is possible, and there are a number of great open-source options too.\n\nLetting AI agents use the web is like taking a brain in a jar and giving it hands. It can now do things.\n\nIt means that every website and every app now effectively has an API. It means that any workflow that people can do on a computer can be automated.\n\nThis probably 10x\'s the addressable use cases for AI agents. We can\'t wait to see what people build with it.',
  category = 'ai',
  tags = ['Sp25', 'agents'],
  video_url = 'https://youtube.com/watch?v=v73RSJi8-mY',
  author = user:jared_friedman,
  votes_problem = 39,
  votes_solution = 10,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-01-05T09:00:00.000Z',
  updated_at = '2025-01-05T09:00:00.000Z';

CREATE idea:ai_personal_staff_for_everyone_bffa SET
  title = 'AI Personal Staff for Everyone',
  problem = 'Software is a proven way to bring to everyone what only the rich could afford before. As recently as 2009, only the world\'s richest people could afford a private driver, but today, Uber, and now Waymo, have brought that to everyone. Another example: when I first started working on what would become Google Photos, I was surprised to learn that rich people hired actual human beings to go through all their photos and edit, label, and organize them. We built AI to automate that for billions of people.\n\nDespite the explosion of software in the last decade, wealthy people still employ lots of human staff to provide personal services. These are things like tax accountants, personal lawyers, and money managers, but also personal trainers, private tutors, and even personal doctors. The list goes on and on. Why can only the rich afford this? Because software hasn\'t been able to replace these types of personalized knowledge work tasks…until now.\n\nOver the next few years, we expect AI to get good enough to do most of these jobs. So if you are working to bring a part of this "personal AI staff" to every human on the planet, we\'d love to hear from you.',
  category = 'education',
  tags = ['Sp25', 'education'],
  video_url = 'https://youtube.com/watch?v=2S1Z6YEKVoM',
  author = user:david_lieb,
  votes_problem = 57,
  votes_solution = 28,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-01-08T09:00:00.000Z',
  updated_at = '2025-01-08T09:00:00.000Z';

CREATE idea:devtools_for_ai_agents_8d30 SET
  title = 'Devtools for AI Agents',
  problem = 'In the past 2 years, we have funded many startups using AI to disrupt legacy players.\n\nWe are now witnessing the emergence of the next wave: AI agents that go beyond assisting humans and can autonomously make decisions. With the release of o1, and soon o3, these agents are getting significantly better at reasoning, allowing them to fully replicate and even improve upon tasks performed by humans.\n\nAI agents will become ubiquitous across industries and in our daily lives. Imagine a world where every person is empowered by a team of specialized AI agents, working seamlessly in the background to amplify their productivity and creativity.\n\nTo accelerate this future, we are looking to fund startups building devtools for AI agents. These can include:\n\n• Agent builders: Companies enabling their customers to easily create and deploy custom agents, like Wordware (YC S24) or Stack AI (YC W23).\n\n• Agent building blocks: Tools, APIs, or platforms that enhance agent capabilities, enabling them to perform more complex actions and achieve greater impact.\n\nIf you\'re building in this space, we\'d love to hear from you and help you shape the future of software.',
  category = 'infrastructure',
  tags = ['Sp25', 'agents', 'devtools'],
  video_url = 'https://youtube.com/watch?v=yFcWSvR6c14',
  author = user:nicolas_dessaigne,
  votes_problem = 31,
  votes_solution = 32,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-01-07T09:00:00.000Z',
  updated_at = '2025-01-07T09:00:00.000Z';

CREATE idea:the_future_of_software_engineering_daec SET
  title = 'The Future of Software Engineering',
  problem = 'Language models can already write code better than most humans. This is going to bring the cost of building software down to zero.\n\nSo will agents kill the job of software developer? No! We\'ll need more human software engineers in the future because software is going to run almost everything.\n\nThese humans won\'t write much code directly. Instead, they\'ll manage teams of agents that build software for them. In addition to writing code, agents will perform most of the other specialized tasks required to build software: QA, deployment, security & compliance audits, translations, operations, etc.\n\nWe\'d like to fund startups that enable small groups of generalist software developers to manage large teams of agents working together to build and ship lots of software.\n\nIf you\'re interested in building tools for the future of software engineering, we\'d love to hear from you.',
  category = 'ai',
  tags = ['Sp25', 'agents', 'llm', 'security', 'devtools'],
  video_url = 'https://youtube.com/watch?v=a-O7vv0ZfNg',
  author = user:pete_koomen,
  votes_problem = 23,
  votes_solution = 30,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-01-09T09:00:00.000Z',
  updated_at = '2025-01-09T09:00:00.000Z';

CREATE idea:ai_commercial_open_source_software_aicos_8684 SET
  title = 'AI Commercial Open Source Software (AICOSS)',
  problem = 'There is a pattern with open source and open source startups. First we had proprietary Unix, then we had Linux, then we had RedHat. First, we had BitKeeper, then we had Git, then we had Github and Gitlab.\n\nThere is a huge opportunity to build startups that offer support and services to help people use open source AI.\n\nIt\'s not uncommon for the organization that releases the open source code to not want to focus on providing commercial support. For instance, Google and Facebook have open sourced a number of tools but aren\'t always in the business of providing commercial support for businesses to use those tools— which has yielded an opportunity for startups.\n\nThere are going to be many winners in the space of open source AI, but the launch of DeepSeek should provide ample new ground that a founder might want to cover to help businesses make use of these systems.\n\nIf you are interested in building in Open Source AI for the enterprise, we would like to hear from you.',
  category = 'infrastructure',
  tags = ['Sp25', 'enterprise', 'opensource'],
  video_url = 'https://youtube.com/watch?v=xkweKRfUb5Y',
  author = user:dalton_caldwell,
  votes_problem = 31,
  votes_solution = 13,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-01-09T09:00:00.000Z',
  updated_at = '2025-01-09T09:00:00.000Z';

CREATE idea:ai_coding_agents_for_hardwareoptimized_c_3fc5 SET
  title = 'AI Coding Agents for Hardware-Optimized Code',
  problem = 'AI hardware is still constrained by software. Nvidia dominates largely because CUDA\'s hand-optimized code is used in AI models. Competing hardware—AMD, custom silicon—often underperforms not just because of inferior chips but because writing system-level code (kernels, drivers) is very difficult, and not enough software engineers are working on it.\n\nHowever, now with reasoning models like Deepseek R1 or OpenAI o1 and o3, these could generate hardware-optimized code that rivals—or surpasses—human CUDA code.\n\nWe\'d love to see more founders work on AI-generated kernels that make more hardware alternatives work for AI.\n\nThis isn\'t just about performance. It\'s about breaking dependencies. Founders working on this could reshape the hardware ecosystem.',
  category = 'hardware',
  tags = ['Sp25', 'agents'],
  video_url = 'https://youtube.com/watch?v=W3keOVTy2yE',
  author = user:diana_hu,
  votes_problem = 33,
  votes_solution = 13,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-01-11T09:00:00.000Z',
  updated_at = '2025-01-11T09:00:00.000Z';

CREATE idea:b2a_software_where_the_customers_will_al_af95 SET
  title = 'B2A: Software Where the Customers Will All Be Agents',
  problem = 'A significant percentage of internet traffic consists of non-humans scraping and looking for information. These programs often end up impersonating humans to fill out forms or look for changes, most people build websites with human users in mind rather than scrapers.\n\nWith the advent of AI and agents, it seems like it\'s a good idea to build software and services where agents as customers are actively supported and documented rather than an edge case.\n\nFor example, APIs to help agents pay for hosting credits, or book travel, or engage into contracts with other parties. In the stock market, it\'s well understood that humans and programs are trading together, and in the future, this will only increase.\n\nIf you want to build services specifically aimed at best serving agents, we want to hear from you.',
  category = 'ai',
  tags = ['Sp25', 'agents'],
  video_url = 'https://youtube.com/watch?v=GEcby86ZOVY',
  author = user:dalton_caldwell,
  votes_problem = 14,
  votes_solution = 13,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-01-11T09:00:00.000Z',
  updated_at = '2025-01-11T09:00:00.000Z';

CREATE idea:vertical_ai_agents_089b SET
  title = 'Vertical AI Agents',
  problem = 'From 2005-2020, the invention of the interactive web application enabled a massive wave of B2B SaaS companies. Over 100 B2B SaaS unicorns were started, and nearly half of all venture funding went to this category.\n\nIt seems likely that for the next decade, we will see a parallel wave of companies building vertical AI agents.\n\nWhat is a vertical AI agent? It\'s software that\'s built on top of LLMs that\'s been carefully tuned to be able to automate some kind of real, important work. In recent batches, we\'ve had YC companies build an AI tax accountant, an AI medical biller, an AI phone support agent, an AI compliance agent, an AI quality assurance tester.\n\nSome people previously derided ideas like this as "ChatGPT wrappers" but no one who has tried to deploy a system like this to production thinks so. Building systems like this that work in real-world conditions requires real agentic architectures, integrations with legacy systems, and deep domain understanding.\n\nIt\'s hard to get systems like this working right, but once you do, the growth can be phenomenal. The value prop of B2B SaaS was to make human workers incrementally more efficient. The value prop of vertical AI agents is to automate the work entirely. Vertical AI agents that reach human-level performance grow extremely quickly.\n\nIt\'s entirely possible this opportunity is big enough to mint another 100 unicorns. For every category with a successful B2B SaaS company, you could imagine an ever larger vertical AI company being built.\n\nWhile many founders are already working on these ideas in the most obvious categories, we think it\'s still relatively undiscovered compared to the size of the opportunity, and there are many large categories still untouched.',
  category = 'health',
  tags = ['Sp25', 'agents', 'llm', 'healthcare'],
  video_url = 'https://youtube.com/watch?v=lvmmk85ArWg',
  author = user:jared_friedman,
  votes_problem = 47,
  votes_solution = 22,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-01-14T09:00:00.000Z',
  updated_at = '2025-01-14T09:00:00.000Z';

CREATE idea:inference_ai_infrastructure_in_the_world_a4a6 SET
  title = 'Inference AI Infrastructure in the World of Test-Time Compute',
  problem = 'Until recently compute spend went into pre-training foundation models. But now with Deepseek R1 and OpenAI o1 and o3, there is a new scaling trend that suggests we\'ll need far more compute at inference time when AI apps actually use these models.\n\nAs AI apps 10x or even 100x the number of API calls to complex reasoning models, the infrastructure costs will become a real problem.\n\nThat\'s where new startups come in. There\'s room to rebuild the stack here: better software at inference-layer tooling, cheaper ways to handle GPU workloads, and optimizations that let AI apps scale without bleeding money.\n\nIt\'s the kind of unsexy-but-critical problem that often creates big opportunities.',
  category = 'education',
  tags = ['Sp25', 'infrastructure'],
  video_url = 'https://youtube.com/watch?v=DwgUlVWs5fk',
  author = user:diana_hu,
  votes_problem = 23,
  votes_solution = 33,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-01-15T09:00:00.000Z',
  updated_at = '2025-01-15T09:00:00.000Z';

CREATE idea:government_software_144e SET
  title = 'Government Software',
  problem = 'Selling software to the government is notoriously hard and not something most builders would even think about doing. Still, the prize is huge if you can figure it out. Palantir is one of the only startups that managed to figure it out and their market cap today is $125 billion.\n\nNow might be a uniquely good moment to give it a shot. The deficit is running high and there is hope the government will find ways to reduce spending and operate more efficiently. At the same time, AI is now powerful enough to automate many types of administrative work the government spends billions of dollars per year on.\n\nIf you combine those ideas, building AI software to automate work done by the government would both reduce spending and make the government more efficient. In particular, we\'ve seen that LLMs are especially good at automating rote repetitive admin tasks like filling out forms, reviewing applications or summarizing documents. As consumers of government services, we\'d all benefit from more efficiency, imagine never having to wait in line at the DMV again.\n\nIt\'s hard to think of something that sounds less appealing as a place to look for startup ideas than the government but if you\'re up for digging in that space we\'d love to hear from you.',
  category = 'government',
  tags = ['W25', 'llm'],
  video_url = 'https://youtube.com/watch?v=kwmaCLAkpwQ',
  author = user:harj_taggar,
  votes_problem = 41,
  votes_solution = 34,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-01-02T09:00:00.000Z',
  updated_at = '2025-01-02T09:00:00.000Z';

CREATE idea:public_safety_technology_30cf SET
  title = 'Public Safety Technology',
  problem = 'We all deserve to be safe in our homes, and while walking around on our streets. This is a basic thing civilization should afford its citizens. Startups are already on the case. License plate cameras built by Flock Safety (YC S17) now help solve 10% of reported crimes in the USA and they\'re aiming to get to 25% of all crime by next year. Abel Police (YC S24) cuts the amount of time police officers spend filling out paperwork from hours to minutes, giving them up to 25% more hours per day to do real police work.\n\nPublic safety tech can and will make a real difference. We are especially interested in hearing from you if you\'re working on these ideas:\n\nAdvanced Computer Vision: Your startup could develop technology that uses computer vision to enhance safety—identifying suspicious activities or people in distress from video feeds, without compromising individual privacy.\n\nEmergency Response Enhancements: Technologies that improve the speed and coordination of emergency responses are lifesavers. If you have an idea that can get help to where it\'s needed faster, we want to help you make it happen.\n\nCommunity Safety Tools: We are looking for tools that improve how communities and law enforcement interact. Your solution could make it easier for neighbors to watch out for each other and stay informed about their safety.\n\nEfficient Law Enforcement Technologies: We\'re interested in technologies that help law enforcement do their jobs more effectively and fairly, from workload management to increasing accuracy in their operations.\n\nIf your startup is ready to be part of this movement, we want to hear from you.',
  category = 'government',
  tags = ['W25', 'video'],
  video_url = 'https://youtube.com/watch?v=tjagGqZ6jjM',
  author = user:garry_tan,
  votes_problem = 31,
  votes_solution = 31,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-01-04T09:00:00.000Z',
  updated_at = '2025-01-04T09:00:00.000Z';

CREATE idea:manufacture_in_the_usa_93a9 SET
  title = 'Manufacture in the USA',
  problem = 'The UK became the world\'s richest country in the 19th century by being the workshop of the world. The US did the same in the 20th century. But in recent decades, we\'ve given up this role. The hollowing out of US manufacturing has led to social and political division and left us in a precarious place geopolitically.\n\nBringing manufacturing back to America is one of the biggest areas of bipartisan agreement. Elon has shown us it is possible to do it by building Tesla Gigafactories in Austin and Nevada. We think other changes in the world have made it easier for new builders to follow his example.\n\nNew ML-based robotics systems will make it possible to automate far more, which will reduce the cost-of-labor arbitrage that pushed manufacturing to other countries in the first place. Companies like SpaceX and Tesla have trained an entire generation of engineers in how to build an American company that makes physical products but operates like a startup.\n\nWe know this works because we\'ve had experience working with some of the leading companies in this space. Astranis (W16) is building telecommunications satellites in the heart of San Francisco, in a building that used to build warships for the US Navy during WWII. Gecko Robotics (W16), based in America\'s old industrial heartland of Pittsburgh, builds robots that do industrial inspections. Solugen (W17) makes industrial chemicals from a large-scale plant in Houston.',
  category = 'hardware',
  tags = ['W25', 'robotics'],
  video_url = 'https://youtube.com/watch?v=PqV28tLnpQo',
  author = user:jared_friedman,
  votes_problem = 24,
  votes_solution = 6,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-01-06T09:00:00.000Z',
  updated_at = '2025-01-06T09:00:00.000Z';

CREATE idea:stablecoins_20_ec68 SET
  title = 'Stablecoins 2.0',
  problem = 'At the start of this year, we posted a request for more stablecoin startups and since then things have only gotten better for stablecoins. The black cloud over stablecoins has always been regulation, with several efforts to pass regulation in the US failing. The regulatory future for stablecoins in the US now looks more promising and we expect sensible legislation is on its way soon.\n\nStablecoin payment volumes have surged this year and are now over a fifth of Mastercard\'s volume. Almost 30% of global remittances are now facilitated through stablecoins and traditional finance institutions like Visa are offering platforms for banks to issue their own stablecoins. Also Stripe recently acquired a stablecoin startup, Bridge, for $1 billion, which will only attract more investor interest and capital into the space.\n\nThis makes it a better time than ever to start a stablecoin startup. We are especially interested in hearing about ideas that target businesses, helping them to hold and manage stables and also services that make it easy for developers to integrate with them.\n\nIf you\'re working on stablecoin ideas we\'d love to hear from you.',
  category = 'fintech',
  tags = ['W25', 'devtools', 'fintech'],
  video_url = 'https://youtube.com/watch?v=woAM_PbnCak',
  author = user:brad_flora,
  votes_problem = 46,
  votes_solution = 15,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-01-05T09:00:00.000Z',
  updated_at = '2025-01-05T09:00:00.000Z';

CREATE idea:llms_for_chip_design_7b27 SET
  title = 'LLMs for Chip Design',
  problem = 'Each breakthrough in AI creates demand for more powerful chips to train larger models. No country wants to fall behind in this arms race. Domestic chip design and manufacture is not just about economics anymore, it\'s about survival in a post AI world. OpenAI O1 showed us that LLMs with reasoning can power breakthroughs in science and engineering and we\'re interested in talking to anyone using LLMs to improve chip design.\n\nWe are especially interested in anyone focusing on designing ASICs and FPGAs. Design of customized digital systems whether through FPGAs (field programmable gate arrays) or ASICs (application-specific integrated circuits) has typically been costly because of the amount of custom design, development and testing necessary to bring such a system online. With the advent of large language models, these costs are coming down significantly, such that ever more specialized types of computation could be done.\n\nOur normal computing environment assumes Von Neumann architecture using CPUs that we are familiar with: single shared memory for programs and data, arithmetic unit and a program control unit, operating through fetching and execution cycles serially. Most computers and computation use this because it\'s very easy to reprogram such systems.\n\nWe know there is a clear engineering trade-off: it is possible to optimize especially specialized algorithms or calculations such as cryptocurrency mining, data compression, or special-purpose encryption tasks such that the same computation would happen faster (5x to 100x), and using less energy (10x to 100x). This is a diagram (credit: Taner Sadikoglu) showing the differences in how data flows an optimized FPGA system versus a normal CPU.\n\nGiven the order of magnitude improvements possible with specialized FPGAs and ASICs, use of LLMs to optimize this process is likely to produce extremely useful results and great opportunities for startups.',
  category = 'hardware',
  tags = ['W25', 'llm'],
  video_url = 'https://youtube.com/watch?v=ZgQPB0qpk2A',
  author = user:garry_tan,
  votes_problem = 53,
  votes_solution = 20,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-01-07T09:00:00.000Z',
  updated_at = '2025-01-07T09:00:00.000Z';

CREATE idea:fintech_20_b605 SET
  title = 'Fintech 2.0',
  problem = 'The last two years have been a rough time for fintech startups. The collapse of Silicon Valley Bank led to regulators clamping down on new startups and investors fled the space. We\'re optimistic this is about to change and now is a great time to start a fintech startup.\n\nHistorically the hardest thing about starting a new financial startup was the difficulty of getting a deal with a bank or other regulated partner. We are now in a new era where this keeps becoming easier with the advent of providers like Stripe and new core technologies like stablecoins.\n\nAI tools will inevitably cause the financial industry to change rapidly and we believe there could be a structural advantage for a small startup without any legacy systems or processes to quickly build global financial products of the future.\n\nWe believe this is the perfect time to start a new generation of financial technology companies built on top of the infrastructure now available. We would like to see ideas around insurance, investment banking, wealth management, international payments and more.',
  category = 'fintech',
  tags = ['W25', 'fintech', 'infrastructure'],
  video_url = 'https://youtube.com/watch?v=jJp13H5a-jE',
  author = user:dalton_caldwell,
  votes_problem = 20,
  votes_solution = 26,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-01-09T09:00:00.000Z',
  updated_at = '2025-01-09T09:00:00.000Z';

CREATE idea:new_space_companies_4d44 SET
  title = 'New Space Companies',
  problem = 'The cost to reach orbit is falling fast, having fallen over 10x since SpaceX\'s first launch in 2006. A startup can now build and launch a satellite on just a seed round.\n\nIf you think about how many kilograms of payload get launched into space today, imagine how many will be sent up in one year, in five years, in ten years, and so on.\n\nIf we are entering a future with access to space being as routine and inexpensive as commercial air travel, shipping or trucking… what new businesses does that unlock?\n\nBuilding a space company might scare founders by seeming too ambitious, but surprisingly, it is not necessarily harder than building a software company. YC has funded many space companies — Astranis, Relativity Space, Stoke, and many others — and their success rate has been no lower, and maybe higher, than our other companies.',
  category = 'infrastructure',
  tags = ['W25'],
  video_url = 'https://youtube.com/watch?v=WRcE3IPvLww',
  author = user:jared_friedman,
  votes_problem = 51,
  votes_solution = 34,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-01-09T09:00:00.000Z',
  updated_at = '2025-01-09T09:00:00.000Z';

CREATE idea:aiaided_engineering_tools_1d41 SET
  title = 'AI-Aided Engineering Tools',
  problem = 'Engineering tools for the physical world have barely evolved in decades. The CAD/CAM software that mechanical engineers use, the EDA tools for circuit and chip design that electrical engineers use, and the CFD tools for fluid and thermal analysis that aerospace engineers use — All still rely on complex numerical solvers and physics simulations. These are computationally expensive and also require deep training and at times even a PhD to use effectively.\n\nWe believe the next generation of AI-powered tools will change that.\n\nWith reasoning capabilities built into the new AI models that solve math and physics, we can unleash engineers to design and build physical systems like —planes, buildings, circuits, chips, satellites—faster and better than ever before.\n\nWe\'re eager to see founders build the AI-aided engineering tools that will drive this transformation as the new generation of Computer-aided Engineering.',
  category = 'education',
  tags = ['W25'],
  video_url = 'https://youtube.com/watch?v=1asr6PkU8HQ',
  author = user:diana_hu,
  votes_problem = 14,
  votes_solution = 22,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-01-11T09:00:00.000Z',
  updated_at = '2025-01-11T09:00:00.000Z';

CREATE idea:one_million_jobs_20_6641 SET
  title = 'One Million Jobs 2.0',
  problem = 'We would like to fund startups that have a useful need to employ a million workers in a way that uniquely needs humans to do the job and there will be no structural need for the job to be done with AI.\n\nIn the past, when massive technological change came about, people have ended up doing different types of work than they did in the past. For example, a lot of people used to be farmers, and then because of machinery a lot fewer people were farmers. The same goes for careers like elevator operators and typists.\n\nOften the types of new careers that are created have better working conditions and are more helpful to humanity. In this new AI driven world, these might be tools for more people to run their own local businesses, or be able to earn a living by providing services to other humans either online or offline.\n\nMany AI futurists are unsure what the careers of the future are, and we want to fund founders with an answer to that question.',
  category = 'ai',
  tags = ['W25'],
  video_url = 'https://youtube.com/watch?v=BAeBkS2gBpo',
  author = user:dalton_caldwell,
  votes_problem = 55,
  votes_solution = 5,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2025-01-12T09:00:00.000Z',
  updated_at = '2025-01-12T09:00:00.000Z';

CREATE idea:using_machine_learning_to_simulate_the_p_59dc SET
  title = 'Using Machine Learning to Simulate the Physical World',
  problem = 'Many essential software tools work by simulating the world using known principles of physics and chemistry. Weather prediction, computational fluid dynamics for designing rockets and airplanes, and tools for drug discovery that predict the interactions of molecules — today many of these are based on running a full physics simulation of the world. These are very computationally heavy since they are solving complex multivariate mathematical equations.\n\nIt turns out that AI models are general functional approximators that can also solve and predict problems like these without needing to explicitly know about physics. This results in predictions that are much less computationally expensive and can be completed in minutes or seconds on much smaller computers rather than taking days/weeks and super computers.\n\nWe\'re interested in companies replacing existing simulations with ML-based ones, along with companies using ML-based simulations to open new markets currently unaddressable.',
  category = 'education',
  tags = ['S24'],
  video_url = 'https://youtube.com/watch?v=uzyvVFwLD68',
  author = user:diana_hu,
  votes_problem = 17,
  votes_solution = 14,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2024-06-03T09:00:00.000Z',
  updated_at = '2024-06-03T09:00:00.000Z';

CREATE idea:new_defense_technology_d5b0 SET
  title = 'New Defense Technology',
  problem = 'The US is now engaged in large-scale conflicts in several regions that threaten to change our world. While the US has historically led the world in defense technology, the defense contractors it depends on have grown slow and inefficient, bloated by decades of cost-plus contracts.\n\nSpaceX showed the world that a private space company could be vastly more effective than the publicly-funded United Launch Alliance. New companies that sell to the DoD like Palantir and Anduril are showing that the same thing is true for defense tech.\n\nSilicon Valley was born in the early 20th century as an R&D area for the US military. Early Silicon Valley companies were largely funded by the DoD and played a key role in WWII by building military radar, code-breaking equipment, and components for the atomic bomb.\n\nThis decade is the time to return Silicon Valley to these roots.',
  category = 'government',
  tags = ['S24'],
  video_url = 'https://youtube.com/watch?v=e2mmfE1juFs',
  author = user:jared_friedman,
  votes_problem = 49,
  votes_solution = 7,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2024-06-05T09:00:00.000Z',
  updated_at = '2024-06-05T09:00:00.000Z';

CREATE idea:commercial_open_source_companies_8a0f SET
  title = 'Commercial Open Source Companies',
  problem = 'Open source companies move more quickly than closed source companies. For developer tools, being open source is a powerful way to gain developer adoption. But it\'s also a great way for startups to become mature and sell to enterprises a lot sooner. Ultimately, open source companies succeed when they become the standard choice for software engineers.\n\nVery technical founders are at a strong advantage here, as the sales motion relies more on the technical merits of the project rather than strong sales tactics. It\'s more natural for technical founders to talk to users who are engineers just like them, and they can iterate faster since they\'ll get feedback from the open source community.\n\nYC has funded over 150 open source companies including Gitlab (W15), Docker (S10), Apollo (S11), Supabase (S20) to name a few, and we want to fund more.',
  category = 'enterprise',
  tags = ['S24', 'enterprise', 'devtools', 'opensource'],
  video_url = 'https://youtube.com/watch?v=Q2X2kAJajs4',
  author = user:nicolas_dessaigne,
  votes_problem = 19,
  votes_solution = 30,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2024-06-05T09:00:00.000Z',
  updated_at = '2024-06-05T09:00:00.000Z';

CREATE idea:spatial_computing_e5ac SET
  title = 'Spatial Computing',
  problem = 'Spatial computing is the use of technology to create experiences that merge the physical and digital worlds. It\'s a broad term that encompasses augmented reality (AR), virtual reality (VR), and mixed reality (MR).\n\nWe\'re interested in startups that are building applications, tools, and infrastructure for spatial computing. This includes applications for consumers and enterprises, as well as tools for developers to build spatial applications.\n\nWe believe that spatial computing will be the next major computing platform after mobile, and we want to fund the companies that will define this new era.',
  category = 'infrastructure',
  tags = ['S24', 'enterprise', 'devtools', 'infrastructure'],
  video_url = 'https://youtube.com/watch?v=_rq3utSccQk',
  author = user:diana_hu,
  votes_problem = 19,
  votes_solution = 29,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2024-06-07T09:00:00.000Z',
  updated_at = '2024-06-07T09:00:00.000Z';

CREATE idea:new_enterprise_resource_planning_softwar_2067 SET
  title = 'New Enterprise Resource Planning Software',
  problem = 'As companies get larger they end up adopting some software suite to help run their business. This piece of software is widely known as an "ERP", or Enterprise Resource Planning software. You can think of this software as the operating system that a business runs on.\n\nERPs are usually known to be expensive, painful to implement, and disliked by users, yet are absolutely necessary and the very definition of business critical to its customers.\n\nWe would like to see new startups that build software that helps businesses run. Ideally that software would be loved by its customers for its flexibility and ease of use. This type of software is so valuable and important that we can imagine that there is the opportunity for dozens of new massively successful vendors.',
  category = 'enterprise',
  tags = ['S24', 'enterprise'],
  video_url = 'https://youtube.com/watch?v=z5kGw1Cy0tY',
  author = user:dalton_caldwell,
  votes_problem = 20,
  votes_solution = 26,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2024-06-06T09:00:00.000Z',
  updated_at = '2024-06-06T09:00:00.000Z';

CREATE idea:developer_tools_inspired_by_existing_int_a707 SET
  title = 'Developer Tools Inspired by Existing Internal Tools',
  problem = 'If a developer has worked at a company with some amount of success, they have likely encountered tools or frameworks that were built by programmers at the company to help solve their own particularly painful or repetitive problems. These tools tend to have funny internal nicknames and for the most part never see the light of day.\n\nWhen aspiring founders try to come up with new startup ideas they often don\'t realize that the internal tools they had at prior jobs are a great place to get inspiration from.\n\nWe would like to see more startups created that are inspired by these types of homegrown tools, because it\'s likely that if it\'s very useful at one company, it\'s very useful at others. The lineage of all software tools can often be traced back to something a programmer built to get their job done, and there is no reason to doubt this won\'t continue to be true.',
  category = 'ai',
  tags = ['S24', 'devtools'],
  video_url = 'https://youtube.com/watch?v=0UycVzrZm7E',
  author = user:dalton_caldwell,
  votes_problem = 24,
  votes_solution = 24,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2024-06-08T09:00:00.000Z',
  updated_at = '2024-06-08T09:00:00.000Z';

CREATE idea:llms_for_manual_back_office_processes_in_f54c SET
  title = 'LLMs for Manual Back Office Processes in Legacy Enterprises',
  problem = 'Legacy enterprises have many manual back office processes that are ripe for automation with LLMs. These processes are often repetitive, rule-based, and involve unstructured data. Examples include processing invoices, reviewing contracts, and handling customer service requests.\n\nLLMs are particularly well-suited for these tasks because they can understand and generate natural language, which is the format of much of the data in these processes. They can also be trained on specific domains and company data to improve their performance.\n\nWe\'re interested in startups that are applying LLMs to automate these processes in legacy enterprises. We believe there is a massive opportunity to improve efficiency and reduce costs in these organizations.',
  category = 'enterprise',
  tags = ['S24', 'voice', 'llm', 'enterprise'],
  video_url = 'https://youtube.com/watch?v=1CrcTQ2fiEU',
  author = user:tom_blomfield,
  votes_problem = 14,
  votes_solution = 24,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2024-06-09T09:00:00.000Z',
  updated_at = '2024-06-09T09:00:00.000Z';

CREATE idea:ai_to_build_enterprise_software_4431 SET
  title = 'AI to Build Enterprise Software',
  problem = 'Enterprise software has a reputation among smart programmers as being boring to work on. You have to do sales and because each potential customer wants something slightly different, you end up writing bloated software to try and please them all.\n\nBut what if AI could change how enterprise software gets built and sold? The core of what every customer wants is the same — they just want it customized around the edges.\n\nAI is good at writing code — especially when you give it an existing codebase to learn from. So what if instead of long enterprise sales cycles you just give customers a simple starter product and have them tell your AI how they want it customized? In the future, every enterprise could have their own custom ERP, CRM or HRIS that is continually updating itself as the company itself is changing.\n\nA product based on this premise would be highly disruptive to large incumbents, because now they can\'t win by just copying you and adding another feature to their bloated software. Now they would have to completely change their whole conceptual approach to building software.\n\nMaybe the AI will get so good at this that it can think up new types of enterprise software that don\'t even exist yet. Building this AI would be an interesting technical challenge and if you\'re excited about building AI that can code, enterprise software is the most profitable software to build.',
  category = 'enterprise',
  tags = ['S24', 'enterprise'],
  video_url = 'https://youtube.com/watch?v=fx3mqS_faOQ',
  author = user:harj_taggar,
  votes_problem = 46,
  votes_solution = 8,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2024-06-09T09:00:00.000Z',
  updated_at = '2024-06-09T09:00:00.000Z';

CREATE idea:stablecoin_finance_2b8f SET
  title = 'Stablecoin Finance',
  problem = 'Stablecoins are digital currencies that peg their value to some external reference. This is typically the U.S. dollar, but it can be other fiat currencies, assets, or even other digital currencies. Their transactions are recorded on a digital ledger, usually a blockchain. This means they can be traded at any time of day between any two wallets on the same network, transactions settle in seconds, and fees are a fraction of what you see in traditional finance.\n\nThere\'s been much debate about the utility of blockchain technology, but it seems clear that stablecoins will be a big part of the future of money. We know this because YC companies have been effectively incorporating stablecoins into their operations for years now – for cross-border payments, to reduce transaction fees and fraud, to help users protect savings from hyperinflation. This utility is so straightforward it seems inevitable traditional finance will follow suit.\n\nIn fact we\'re seeing signs of this. PayPal recently issued its own stablecoin. Major banks have started offering custody services and making noise about issuing their own.\n\nIt all looks a bit like digital music\'s transition from the realm of outlaw file sharing in the early 2000s to becoming the norm as players like Apple entered the market. Importantly, those major players were all outmatched in the end by Spotify, a startup founded during that same transition moment.\n\n$136b worth of stablecoins have been issued to date but the opportunity seems much more immense still. Only about seven million people have transacted with stablecoins to date, while more than half a billion live in countries with 30%+ inflation. U.S. banks hold $17T in customer deposits which are all up for grabs as well.  And yet the major stablecoin issuers can be counted on one hand and the major liquidity providers with just a few fingers.\n\nWe would like to fund great teams building B2B and consumer products on top of stablecoins, tools and platforms that enable stablecoin finance and more stablecoin protocols themselves.',
  category = 'fintech',
  tags = ['S24', 'fintech'],
  video_url = NONE,
  author = user:brad_flora,
  votes_problem = 18,
  votes_solution = 17,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2024-06-12T09:00:00.000Z',
  updated_at = '2024-06-12T09:00:00.000Z';

CREATE idea:a_way_to_end_cancer_57df SET
  title = 'A Way to End Cancer',
  problem = 'The technology to diagnose cancer at an early stage already exists. Since most cancers are now treatable if caught early enough, this technology would dramatically reduce cancer deaths if rolled out widely and affordably.\n\nThe technology we\'re talking about is an MRI. Modern MRIs are sensitive enough to detect cancer masses as small as a millimeter.\n\nSome companies are already having success on a small scale offering MRIs to patients for a high cash price. However, there is backlash from the medical community as MRIs also create incidental findings (or false positives), that cost our healthcare system valuable time and money to investigate.\n\nFor this to work, the world would need to scale up the number of MRI scans it does by at least 100x. Doing that will require innovations in the MRI hardware, the AI algorithms to interpret scans and reduce false positives, and the business models and consumer marketing to make it a viable business.  We\'re interested in funding companies looking to tackle this multifaceted problem.\n\nWhile much exciting progress is being made on cancer therapeutics, finding cancer early enough for our existing therapeutics to be curative might be the opportunity with the greatest potential impact.',
  category = 'health',
  tags = ['S24', 'healthcare'],
  video_url = NONE,
  author = user:surbhi_sarna,
  votes_problem = 45,
  votes_solution = 31,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2024-06-12T09:00:00.000Z',
  updated_at = '2024-06-12T09:00:00.000Z';

CREATE idea:foundation_models_for_biological_systems_bb87 SET
  title = 'Foundation Models for Biological Systems',
  problem = 'The vast majority of scientific innovation fails – either on the bench during early experimentation or while in clinical trials.\n\nFoundation models built around the vast amount of data we now have will not only enable scientists to know what path to pursue much quicker than before, but have the potential to unlock new scientific approaches to disease. Foundation models built around text and images are enabling the next-generation of consumer products; we believe foundation models built around biological systems will do the same for healthcare.\n\nWe are interested in funding highly technical founders building foundational models from scratch in any part of biology or medicine.',
  category = 'health',
  tags = ['S24', 'healthcare'],
  video_url = NONE,
  author = user:surbhi_sarna,
  votes_problem = 17,
  votes_solution = 30,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2024-06-13T09:00:00.000Z',
  updated_at = '2024-06-13T09:00:00.000Z';

CREATE idea:the_managed_service_organization_model_f_35e2 SET
  title = 'The Managed Service Organization Model for Healthcare',
  problem = 'Private equity is consuming small and large private clinics all over the country. By the time more junior healthcare workers are paid, they only make a fraction of what they are billing. This causes them to be overworked but underpaid, as much of the revenue goes to overhead and the private equity owner of the clinic.\n\nA new startup model has emerged as an alternative to PE ownership: the MSO (Managed Service Organizations) model.\n\nThe MSO model enables doctors to run their own clinics by (1) providing them software that can handle back office tasks such as billing and scheduling and (2) channeling patients to them.\n\nThese functions are largely what PE ownership provides. Doctors who are part of an MSO model can continue to run small, physician-owned practices while competing successfully with large, PE-owned conglomerates.\n\nYC has funded several companies doing this in different verticals: Nourish (nutritionists), LunaJoy (mental health for women), Finni Health (autism care for children), and others.\n\nWe are interested in investing in this MSO (Managed Service Organizations) model across every vertical in healthcare.',
  category = 'health',
  tags = ['S24', 'healthcare'],
  video_url = NONE,
  author = user:surbhi_sarna,
  votes_problem = 27,
  votes_solution = 7,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2024-06-13T09:00:00.000Z',
  updated_at = '2024-06-13T09:00:00.000Z';

CREATE idea:eliminating_middlemen_in_healthcare_13db SET
  title = 'Eliminating Middlemen in Healthcare',
  problem = 'The US spends more money per person on healthcare than any other developed nation, yet our patient outcomes are no better.  Much of our spend goes to paying middlemen — which in our view includes everyone not directly providing care to patients.\n\nA recent report on medicare spending on drugs found that 70% of spend went to middlemen (primarily PBMs, wholesalers, and pharmacies) and only 30% to the pharmaceutical companies who make the drugs.  Similar dynamics exist in every other vertical — hospital care, medical equipment, insurance, etc.\n\nThere are many ways startups could attack these inefficiencies, from using AI to automate repetitive human jobs to exploring new and better business models for providing care.  In the spirit of Jeff Bezos\' "your margin is my opportunity", we believe it\'s possible to build a highly profitable business and make the system more efficient at the same time.',
  category = 'health',
  tags = ['S24', 'healthcare'],
  video_url = NONE,
  author = user:surbhi_sarna,
  votes_problem = 29,
  votes_solution = 26,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2024-06-15T09:00:00.000Z',
  updated_at = '2024-06-15T09:00:00.000Z';

CREATE idea:small_finetuned_models_as_an_alternative_86c8 SET
  title = 'Small Fine-tuned Models as an Alternative to Giant Generic Ones',
  problem = 'Giant generic models with a lot of parameters are very impressive. But they are also very costly and often come with latency and privacy challenges. Fortunately, smaller open-source models like Llama2 and Mistral have already demonstrated that, when finely tuned with appropriate data, they can yield comparable results at a fraction of the cost.\n\nMoreover, as new hardware continues to be integrated into our phones and laptops, the prospect of running these models at the edge becomes increasingly feasible, unlocking a multitude of new use cases.\n\nWe are eager to support companies engaged in developing or fine-tuning such specialized models or creating tools to facilitate their construction.',
  category = 'hardware',
  tags = ['S24'],
  video_url = NONE,
  author = user:nicolas_dessaigne,
  votes_problem = 25,
  votes_solution = 15,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2024-06-03T09:00:00.000Z',
  updated_at = '2024-06-03T09:00:00.000Z';

CREATE idea:explainable_ai_223e SET
  title = 'Explainable AI',
  problem = 'Would you trust an AI to diagnose you? Would you swear that a model is unbiased? Or more simply, how can we be sure that a model doesn\'t hallucinate an answer?\n\nUnderstanding model behavior is very challenging, but we believe that in contexts where trust is paramount it is essential for an AI model to be interpretable. Its responses need to be explainable.\n\nFor society to reap the full benefits of AI, more work needs to be done on explainable AI. We are interested in funding people building new interpretable models or tools to explain the output of existing models.',
  category = 'ai',
  tags = ['S24'],
  video_url = NONE,
  author = user:diana_hu,
  votes_problem = 12,
  votes_solution = 13,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2024-06-02T09:00:00.000Z',
  updated_at = '2024-06-02T09:00:00.000Z';

CREATE idea:applying_machine_learning_to_robotics_1eee SET
  title = 'Applying Machine Learning to Robotics',
  problem = 'Robotics hasn\'t yet had its GPT moment, but we think it\'s close.\n\nYC has followed robotics closely for two decades. In fact, one of YC\'s founders, Trevor Blackwell, is a pioneering roboticist who built the first dynamically balancing bipedal robot.\n\nFor decades, everyone has known that robots are the future, as any science fiction novel will show. But that future proved elusive because previous generations of robots were expensive and brittle, requiring controlled conditions. With the rapid improvements in foundation models, it\'s finally possible to make robots that have human-level perception and judgment. That\'s been the missing piece.\n\nWhile consumer use-cases feature heavily in science fiction, some of the overlooked and most immediately addressable applications for robots are B2B. Specifically, we think promising areas are industrial use-cases like Gecko Robotics (W16), which builds inspection robots, and farm use-cases like Bear Flag Robotics (W18), which builds autonomous tractors and was acquired by John Deere.\n\nWe\'re interested in funding people building software tools to help other people to make robots, along with people building the robots themselves.',
  category = 'education',
  tags = ['S24', 'robotics'],
  video_url = NONE,
  author = user:diana_hu,
  votes_problem = 38,
  votes_solution = 31,
  votes_total = 0,
  comment_count = 0,
  solution_count = 0,
  created_at = '2024-06-03T09:00:00.000Z',
  updated_at = '2024-06-03T09:00:00.000Z';

-- Calculate total votes
UPDATE idea SET votes_total = votes_problem + votes_solution;
