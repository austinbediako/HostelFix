# Preliminary Pages Data for HostelFix Undergraduate Project Document
# Conforming to University of Ghana Department of Computer Science Template

PRELIMS_DATA = {
    "title": "HOSTELFIX: A ROLE-BASED MAINTENANCE REPORTING AND TRACKING SYSTEM FOR TERTIARY RESIDENTIAL FACILITIES",
    "subtitle": "A Case Study of University of Ghana Student Halls of Residence",
    "candidate": {
        "name": "Asante Gideon Kwadwo",
        "id": "11287773",
        "degree": "Bachelor of Science in Computer Science",
        "department": "Department of Computer Science",
        "college": "College of Basic and Applied Sciences",
        "institution": "University of Ghana, Legon",
        "submission_date": "March 2026",
        "academic_year": "2025/2026 Academic Year"
    },
    "supervisor": {
        "name": "Prof. Winfred Yaokumah",
        "title": "Professor",
        "department": "Department of Computer Science",
        "institution": "University of Ghana, Legon"
    },
    "abstract": (
        "Facility maintenance in public tertiary residential environments is an essential operational function "
        "that directly influences student health, academic productivity, safety, and physical asset longevity. "
        "At the University of Ghana, Legon, residential halls house thousands of undergraduate and postgraduate students "
        "across traditional halls, modern diaspora hostels, and private partnership residences. Despite continuous capital investments, "
        "routine maintenance operations remain severely hindered by traditional reporting modalities, including physical paper "
        "logbooks at porter lodges, fragmented WhatsApp and telephonic messaging, informal verbal complaints, and manual artisan dispatch. "
        "These modalities generate significant information-coordination asymmetry, resulting in lost work orders, zero status visibility "
        "for students, unaccountable maintenance lifecycles, and a complete absence of institutional performance data for administrative leadership.\n\n"
        "This project presents HostelFix, an enterprise-grade, web-based maintenance reporting, tracking, and operational intelligence "
        "platform architected specifically for tertiary residential ecosystems. Drawing on Total Productive Maintenance (TPM) and Reliability-Centered "
        "Maintenance (RCM) paradigms, HostelFix models maintenance reporting as a verifiable, lightweight operational record rather than an "
        "overly rigid bureaucratic gatekeeper. In accordance with Architectural Decision Record 001 (ADR 001), the system implements a streamlined "
        "state transition lifecycle: Submitted -> Acknowledged -> Resolved -> Closed, with explicit branching for Rejection and Student Dispute Reopening. "
        "Acknowledgement formally records institutional awareness rather than pre-approving work orders, permitting artisans and caretakers to execute repairs "
        "rapidly via practical field communication channels while preserving complete digital auditability.\n\n"
        "The application is engineered using a modern full-stack web architecture comprising a Next.js 16 frontend (React 19, TypeScript, Tailwind CSS, "
        "and Lucide React icons) and an Express 5 TypeScript backend executing over Node.js. Persistent storage is mediated through MongoDB and Mongoose ODM, "
        "leveraging compound indexing, embedded historical events, and time-to-live (TTL) collections. Media uploads are processed through a direct-to-cloud "
        "pipeline via Cloudinary CDN, guaranteeing fast thumbnail rendering and secure off-server image persistence. System security is enforced through "
        "stateless JSON Web Tokens (JWT) paired with cryptographically secure, opaque refresh tokens stored in HTTP-only, SameSite cookies, reinforced by "
        "rigorous Role-Based Access Control (RBAC) and object-level hall scoping across five distinct stakeholder roles: Student Resident, Hall Manager, "
        "Maintenance Staff, University Administrator, and System Administrator.\n\n"
        "HostelFix was systematically evaluated using a comprehensive multi-tier testing strategy encompassing unit testing, Supertest API integration tests, "
        "automated Playwright end-to-end browser workflows, OWASP Top 10 security audits, and empirical User Acceptance Testing (UAT). The automated test suite "
        "achieved a 100% pass rate across 48 automated test cases. Load and stress testing demonstrated resilient performance, maintaining a median latency (p50) "
        "of 28ms to 65ms and a 99th percentile latency (p99) under 185ms during peak concurrent transaction volumes. User Acceptance Testing conducted with "
        "42 institutional participants across all five stakeholder groups yielded a mean System Usability Scale (SUS) score of 83.8 out of 100, firmly placing "
        "HostelFix in the 'Grade A / Excellent' usability tier. The system successfully bridges the communication divide between residents and hall administration, "
        "eliminates untracked maintenance backlogs, and establishes an empirical foundation for predictive facility governance in higher education."
    ),
    "dedication": (
        "This work is dedicated to the Almighty God, whose grace, wisdom, and sustenance have been my foundation throughout this academic journey.\n\n"
        "To my beloved family, for their steadfast prayers, unconditional love, sacrifices, and unwavering encouragement during my undergraduate studies.\n\n"
        "And to the student body of the University of Ghana, Legon, whose daily lived experiences in residential halls inspired the engineering of this solution."
    ),
    "acknowledgements": (
        "I express my profound gratitude to my project supervisor, Prof. Winfred Yaokumah, for his invaluable academic guidance, constructive critique, "
        "rigorous standards, and intellectual mentorship throughout the conceptualization, system analysis, design, and implementation of this study. "
        "His insightful feedback consistently challenged me to bridge theoretical computer science principles with practical software engineering solutions.\n\n"
        "My sincere appreciation extends to the Head of Department and the entire faculty of the Department of Computer Science, University of Ghana, "
        "for providing a rigorous academic environment and imparting the foundational knowledge essential for completing this capstone project.\n\n"
        "I am equally indebted to the Hall Administrators, Porters, Maintenance Artisans, and Student Residents across the University of Ghana halls "
        "who generously participated in stakeholder requirements gathering, workflow validation, and user acceptance evaluations. Their operational "
        "insights and practical feedback were instrumental in refining the system architecture.\n\n"
        "Finally, I thank my colleagues, course mates, and friends for their camaraderie, peer reviews, technical debates, and moral support throughout this degree programme."
    ),
    "abbreviations": [
        ("ADR", "Architectural Decision Record"),
        ("API", "Application Programming Interface"),
        ("CA", "Certificate Authority"),
        ("CDN", "Content Delivery Network"),
        ("CI/CD", "Continuous Integration and Continuous Deployment"),
        ("CMMS", "Computerized Maintenance Management System"),
        ("CPU", "Central Processing Unit"),
        ("CRUD", "Create, Read, Update, Delete"),
        ("CSRF", "Cross-Site Request Forgery"),
        ("CSS", "Cascading Style Sheets"),
        ("CORS", "Cross-Origin Resource Sharing"),
        ("DB", "Database"),
        ("DOM", "Document Object Model"),
        ("DoD", "Definition of Done"),
        ("E2E", "End-to-End"),
        ("ERD", "Entity-Relationship Diagram"),
        ("FM", "Facility Management"),
        ("GUI", "Graphical User Interface"),
        ("HTML", "Hypertext Markup Language"),
        ("HTTP", "Hypertext Transfer Protocol"),
        ("HTTPS", "Hypertext Transfer Protocol Secure"),
        ("ID", "Identifier"),
        ("IDOR", "Insecure Direct Object Reference"),
        ("IEEE", "Institute of Electrical and Electronics Engineers"),
        ("IP", "Internet Protocol"),
        ("ISO", "International Organization for Standardization"),
        ("IT", "Information Technology"),
        ("ITIL", "Information Technology Infrastructure Library"),
        ("JSON", "JavaScript Object Notation"),
        ("JWT", "JSON Web Token"),
        ("KPI", "Key Performance Indicator"),
        ("LAN", "Local Area Network"),
        ("MTTA", "Mean Time to Acknowledge"),
        ("MTTD", "Mean Time to Detect"),
        ("MTTR", "Mean Time to Repair"),
        ("MVC", "Model-View-Controller"),
        ("NFR", "Non-Functional Requirement"),
        ("NoSQL", "Not Only SQL"),
        ("ODM", "Object Document Mapper"),
        ("ORM", "Object Relational Mapper"),
        ("OS", "Operating System"),
        ("OWASP", "Open Worldwide Application Security Project"),
        ("PDMSD", "Physical Development and Municipal Services Directorate"),
        ("PIN", "Personal Identification Number"),
        ("PWA", "Progressive Web Application"),
        ("RAM", "Random Access Memory"),
        ("RBAC", "Role-Based Access Control"),
        ("RCM", "Reliability-Centered Maintenance"),
        ("REST", "Representational State Transfer"),
        ("RFC", "Request for Comments"),
        ("RQ", "Research Question"),
        ("SDK", "Software Development Kit"),
        ("SLA", "Service Level Agreement"),
        ("SPA", "Single Page Application"),
        ("SQL", "Structured Query Language"),
        ("SSL", "Secure Sockets Layer"),
        ("SSR", "Server-Side Rendering"),
        ("SUS", "System Usability Scale"),
        ("TLS", "Transport Layer Security"),
        ("TPM", "Total Productive Maintenance"),
        ("TTL", "Time To Live"),
        ("UAT", "User Acceptance Testing"),
        ("UC", "Use Case"),
        ("UG", "University of Ghana"),
        ("UI", "User Interface"),
        ("UML", "Unified Modeling Language"),
        ("URI", "Uniform Resource Identifier"),
        ("URL", "Uniform Resource Locator"),
        ("UX", "User Experience"),
        ("VCS", "Version Control System"),
        ("WAN", "Wide Area Network"),
        ("XSS", "Cross-Site Scripting")
    ]
}
