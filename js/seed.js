

// /* ============================================================
//       --- BOOKS ---
//    ============================================================ */

//  const dv_books = [
//   {
//     "id": "b_001",
//     "name": "JavaScript: The Good Parts",
//     "author": "Douglas Crockford",
//     "category": "Frontend",
//     "description": "Crockford distills the essence of JavaScript down to its most reliable, readable, and maintainable features, helping developers avoid the bad parts of the language.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_002",
//     "name": "CSS: The Definitive Guide",
//     "author": "Eric A. Meyer",
//     "category": "Frontend",
//     "description": "The most comprehensive guide to CSS available, covering everything from the basics of selectors and properties to advanced layout techniques and animations.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_003",
//     "name": "Learning React",
//     "author": "Alex Banks & Eve Porcello",
//     "category": "Frontend",
//     "description": "A hands-on guide to building web applications with React and related tools in the JavaScript ecosystem, covering hooks, context, and modern patterns.",
//     "isAvailable": false,
//     "borrowedBy": "u_003",
//     "borrowedAt": "2026-03-20"
//   },
//   {
//     "id": "b_004",
//     "name": "Design Systems",
//     "author": "Alla Kholmatova",
//     "category": "Frontend",
//     "description": "A practical guide to creating design languages for digital products. Covers how to create reusable UI components and build coherent design systems.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_005",
//     "name": "HTML and CSS: Design and Build Websites",
//     "author": "Jon Duckett",
//     "category": "Frontend",
//     "description": "A visually stunning introduction to web development. Uses full-color spreads and clear explanations to teach HTML and CSS from the ground up.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_006",
//     "name": "The Clean Coder",
//     "author": "Robert C. Martin",
//     "category": "Backend",
//     "description": "A code of conduct for professional programmers. Covers techniques and tools of true software craftsmanship including estimation, debugging, and handling pressure.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_007",
//     "name": "Node.js Design Patterns",
//     "author": "Mario Casciaro",
//     "category": "Backend",
//     "description": "Master best practices and design patterns for building efficient and scalable server-side applications with Node.js, covering async patterns and microservices.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_008",
//     "name": "Python Crash Course",
//     "author": "Eric Matthes",
//     "category": "Backend",
//     "description": "A fast-paced, thorough introduction to Python that will have you writing programs, solving problems, and making things that work in no time.",
//     "isAvailable": false,
//     "borrowedBy": "u_005",
//     "borrowedAt": "2026-03-22"
//   },
//   {
//     "id": "b_009",
//     "name": "Designing Data-Intensive Applications",
//     "author": "Martin Kleppmann",
//     "category": "Backend",
//     "description": "A thorough examination of the principles, algorithms, and trade-offs of modern data systems including databases, distributed systems, and stream processing.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_010",
//     "name": "RESTful Web APIs",
//     "author": "Leonard Richardson",
//     "category": "Backend",
//     "description": "A thorough guide to building and consuming RESTful APIs. Covers hypermedia, HTTP, and the principles of REST architecture with real-world examples.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_011",
//     "name": "Clean Architecture",
//     "author": "Robert C. Martin",
//     "category": "Architecture",
//     "description": "A craftsman's guide to software structure and design. Martin distills decades of experience into a set of rules that describe what good software architecture looks like.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_012",
//     "name": "Design Patterns",
//     "author": "Gang of Four",
//     "category": "Architecture",
//     "description": "The classic catalog of 23 software design patterns. An essential reference for any developer who wants to write reusable, maintainable, and elegant code.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_013",
//     "name": "Patterns of Enterprise Application Architecture",
//     "author": "Martin Fowler",
//     "category": "Architecture",
//     "description": "A catalog of patterns for enterprise application development, covering architecture, layering, domain logic, and data source patterns with real-world guidance.",
//     "isAvailable": false,
//     "borrowedBy": "u_007",
//     "borrowedAt": "2026-03-18"
//   },
//   {
//     "id": "b_014",
//     "name": "Building Microservices",
//     "author": "Sam Newman",
//     "category": "Architecture",
//     "description": "Covers how to design, build, and maintain microservices architectures. Explores service decomposition, communication patterns, and operational concerns.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_015",
//     "name": "Domain-Driven Design",
//     "author": "Eric Evans",
//     "category": "Architecture",
//     "description": "The foundational book on DDD. Covers how to tackle complexity in the heart of software by connecting implementation to an evolving model of the domain.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_016",
//     "name": "The Phoenix Project",
//     "author": "Gene Kim",
//     "category": "DevOps",
//     "description": "A novel about IT, DevOps, and helping your business win. Follows an IT manager who discovers DevOps principles by trying to save a failing company project.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_017",
//     "name": "Docker Deep Dive",
//     "author": "Nigel Poulton",
//     "category": "DevOps",
//     "description": "A clear and concise guide to Docker. Covers containers, images, volumes, networking, and Docker Compose, making containerization accessible to all developers.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_018",
//     "name": "Site Reliability Engineering",
//     "author": "Google SRE Team",
//     "category": "DevOps",
//     "description": "How Google runs production systems. Covers SRE principles, on-call practices, postmortems, and the tools Google uses to keep its services running at scale.",
//     "isAvailable": false,
//     "borrowedBy": "u_003",
//     "borrowedAt": "2026-03-25"
//   },
//   {
//     "id": "b_019",
//     "name": "Continuous Delivery",
//     "author": "Jez Humble & David Farley",
//     "category": "DevOps",
//     "description": "The definitive guide to deploying software faster and more reliably. Covers automated testing, deployment pipelines, and infrastructure as code.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_020",
//     "name": "Kubernetes in Action",
//     "author": "Marko Luksa",
//     "category": "DevOps",
//     "description": "A comprehensive guide to running applications in Kubernetes. Covers pods, services, deployments, stateful sets, and production-ready cluster management.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_021",
//     "name": "Hands-On Machine Learning",
//     "author": "Aurélien Géron",
//     "category": "Data Science",
//     "description": "A practical guide to machine learning using Scikit-Learn, Keras, and TensorFlow. Covers classification, regression, neural networks, and deep learning.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_022",
//     "name": "Python for Data Analysis",
//     "author": "Wes McKinney",
//     "category": "Data Science",
//     "description": "The definitive guide to manipulating, processing, cleaning, and crunching datasets in Python using pandas, NumPy, and Jupyter, written by the creator of pandas.",
//     "isAvailable": false,
//     "borrowedBy": "u_009",
//     "borrowedAt": "2026-03-21"
//   },
//   {
//     "id": "b_023",
//     "name": "Deep Learning",
//     "author": "Ian Goodfellow",
//     "category": "Data Science",
//     "description": "The comprehensive textbook on deep learning, covering mathematical foundations, neural network architectures, optimization algorithms, and practical applications.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_024",
//     "name": "The Data Warehouse Toolkit",
//     "author": "Ralph Kimball",
//     "category": "Data Science",
//     "description": "The definitive guide to dimensional modeling. Covers how to design and build data warehouses and data marts using the Kimball methodology.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_025",
//     "name": "Storytelling with Data",
//     "author": "Cole Nussbaumer Knaflic",
//     "category": "Data Science",
//     "description": "A data visualization guide for business professionals. Teaches how to choose the right charts, eliminate clutter, and tell compelling stories with data.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_026",
//     "name": "The Web Application Hacker's Handbook",
//     "author": "Dafydd Stuttard",
//     "category": "Security",
//     "description": "The most comprehensive guide to finding and exploiting security flaws in web applications. Covers SQL injection, XSS, CSRF, and advanced attack techniques.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_027",
//     "name": "Hacking: The Art of Exploitation",
//     "author": "Jon Erickson",
//     "category": "Security",
//     "description": "A deep dive into the technical aspects of hacking. Covers programming, networking, and cryptography from an attacker's perspective with real exploit code.",
//     "isAvailable": false,
//     "borrowedBy": "u_011",
//     "borrowedAt": "2026-03-19"
//   },
//   {
//     "id": "b_028",
//     "name": "Cryptography Engineering",
//     "author": "Bruce Schneier",
//     "category": "Security",
//     "description": "A practical guide to building cryptographic systems. Covers principles, protocols, and real-world applications of modern cryptography.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_029",
//     "name": "The Tangled Web",
//     "author": "Michal Zalewski",
//     "category": "Security",
//     "description": "A guide to securing modern web applications. Covers the quirks of browsers, HTTP, HTML, and JavaScript that create security vulnerabilities.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_030",
//     "name": "OWASP Testing Guide",
//     "author": "OWASP Foundation",
//     "category": "Security",
//     "description": "The comprehensive guide to web application security testing. Covers all OWASP Top 10 vulnerabilities with detailed testing methodologies and remediation guidance.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_031",
//     "name": "Deep Work",
//     "author": "Cal Newport",
//     "category": "Productivity",
//     "description": "Rules for focused success in a distracted world. Newport argues that the ability to perform deep work is becoming increasingly rare and increasingly valuable.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_032",
//     "name": "Atomic Habits",
//     "author": "James Clear",
//     "category": "Productivity",
//     "description": "Tiny changes, remarkable results. An easy and proven way to build good habits and break bad ones through the power of small 1% improvements.",
//     "isAvailable": false,
//     "borrowedBy": "u_005",
//     "borrowedAt": "2026-03-24"
//   },
//   {
//     "id": "b_033",
//     "name": "The Pragmatic Programmer",
//     "author": "David Thomas & Andrew Hunt",
//     "category": "Productivity",
//     "description": "From journeyman to master. A collection of tips, techniques, and wisdom for software developers who want to improve their craft and career.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_034",
//     "name": "A Mind for Numbers",
//     "author": "Barbara Oakley",
//     "category": "Productivity",
//     "description": "How to excel at math and science even if you flunked algebra. Covers powerful learning techniques based on cognitive science and neuroscience research.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_035",
//     "name": "So Good They Can't Ignore You",
//     "author": "Cal Newport",
//     "category": "Productivity",
//     "description": "Why skills trump passion in the quest for work you love. Newport argues that career capital — rare and valuable skills — is the foundation of a compelling career.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_036",
//     "name": "Introduction to Algorithms",
//     "author": "Cormen, Leiserson, Rivest & Stein",
//     "category": "Computer Science",
//     "description": "The definitive textbook on algorithms. Covers sorting, data structures, graph algorithms, dynamic programming, and NP-completeness with rigorous analysis.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_037",
//     "name": "Structure and Interpretation of Computer Programs",
//     "author": "Harold Abelson",
//     "category": "Computer Science",
//     "description": "The classic MIT textbook on computer science. Covers abstraction, recursion, interpreters, and metalinguistic abstraction using Scheme.",
//     "isAvailable": false,
//     "borrowedBy": "u_007",
//     "borrowedAt": "2026-03-17"
//   },
//   {
//     "id": "b_038",
//     "name": "Computer Networks",
//     "author": "Andrew S. Tanenbaum",
//     "category": "Computer Science",
//     "description": "A thorough textbook on computer networking. Covers the physical layer, data link, network, transport, and application layers with clear explanations.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_039",
//     "name": "Operating System Concepts",
//     "author": "Abraham Silberschatz",
//     "category": "Computer Science",
//     "description": "The Dinosaur Book — the standard OS textbook. Covers processes, threads, scheduling, memory management, file systems, and I/O.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   },
//   {
//     "id": "b_040",
//     "name": "The Art of Computer Programming",
//     "author": "Donald E. Knuth",
//     "category": "Computer Science",
//     "description": "Knuth's monumental multi-volume work covering fundamental algorithms, data structures, and the mathematical analysis of algorithms.",
//     "isAvailable": true,
//     "borrowedBy": null,
//     "borrowedAt": null
//   }
// ]


// /* ============================================================
//       --- USERS ---
//    ============================================================ */

// const dv_users = [
//   {
//     "id": "u_001",
//     "username": "admin",
//     "email": "admin@devverse.com",
//     "password": "admin123",
//     "isAdmin": true,
//     "borrowedBooks": [],
//     "createdAt": "2026-01-01"
//   },
//   {
//     "id": "u_002",
//     "username": "superadmin",
//     "email": "superadmin@devverse.com",
//     "password": "admin456",
//     "isAdmin": true,
//     "borrowedBooks": [],
//     "createdAt": "2026-01-01"
//   },
//   {
//     "id": "u_003",
//     "username": "alex_dev",
//     "email": "alex@example.com",
//     "password": "pass123",
//     "isAdmin": false,
//     "borrowedBooks": [
//       { "bookId": "b_003", "borrowedAt": "2026-03-20" },
//       { "bookId": "b_018", "borrowedAt": "2026-03-25" }
//     ],
//     "createdAt": "2026-02-10"
//   },
//   {
//     "id": "u_004",
//     "username": "sarah_tech",
//     "email": "sarah@example.com",
//     "password": "pass123",
//     "isAdmin": false,
//     "borrowedBooks": [],
//     "createdAt": "2026-02-14"
//   },
//   {
//     "id": "u_005",
//     "username": "omar_coder",
//     "email": "omar@example.com",
//     "password": "pass123",
//     "isAdmin": false,
//     "borrowedBooks": [
//       { "bookId": "b_008", "borrowedAt": "2026-03-22" },
//       { "bookId": "b_032", "borrowedAt": "2026-03-24" }
//     ],
//     "createdAt": "2026-02-20"
//   },
//   {
//     "id": "u_006",
//     "username": "lena_js",
//     "email": "lena@example.com",
//     "password": "pass123",
//     "isAdmin": false,
//     "borrowedBooks": [],
//     "createdAt": "2026-03-01"
//   },
//   {
//     "id": "u_007",
//     "username": "mike_arch",
//     "email": "mike@example.com",
//     "password": "pass123",
//     "isAdmin": false,
//     "borrowedBooks": [
//       { "bookId": "b_013", "borrowedAt": "2026-03-18" },
//       { "bookId": "b_037", "borrowedAt": "2026-03-17" }
//     ],
//     "createdAt": "2026-03-05"
//   },
//   {
//     "id": "u_008",
//     "username": "nina_ui",
//     "email": "nina@example.com",
//     "password": "pass123",
//     "isAdmin": false,
//     "borrowedBooks": [],
//     "createdAt": "2026-03-08"
//   },
//   {
//     "id": "u_009",
//     "username": "yusuf_data",
//     "email": "yusuf@example.com",
//     "password": "pass123",
//     "isAdmin": false,
//     "borrowedBooks": [
//       { "bookId": "b_022", "borrowedAt": "2026-03-21" }
//     ],
//     "createdAt": "2026-03-10"
//   },
//   {
//     "id": "u_010",
//     "username": "rana_devops",
//     "email": "rana@example.com",
//     "password": "pass123",
//     "isAdmin": false,
//     "borrowedBooks": [],
//     "createdAt": "2026-03-12"
//   },
//   {
//     "id": "u_011",
//     "username": "karim_sec",
//     "email": "karim@example.com",
//     "password": "pass123",
//     "isAdmin": false,
//     "borrowedBooks": [
//       { "bookId": "b_027", "borrowedAt": "2026-03-19" }
//     ],
//     "createdAt": "2026-03-15"
//   },
//   {
//     "id": "u_012",
//     "username": "hana_reads",
//     "email": "hana@example.com",
//     "password": "pass123",
//     "isAdmin": false,
//     "borrowedBooks": [],
//     "createdAt": "2026-03-18"
//   }
// ]


// /* ============================================================================================================
//        Seed function to initialize localStorage with dv_books and dv_users if not already present
//     ============================================================================================================ */

// function seedIfEmpty()  {
//     // Check if dv_books is empty, seed if so
//     if (!localStorage.getItem("dv_books")) {
//         localStorage.setItem("dv_books", JSON.stringify(dv_books));
//     }

//     // Check if dv_users is empty, seed if so
//     if (!localStorage.getItem("dv_users")) {
//         localStorage.setItem("dv_users", JSON.stringify(dv_users));
//     }
// } 

// const keyName = 'dv_books'; 
// const value = localStorage.getItem(keyName);


// seedIfEmpty();