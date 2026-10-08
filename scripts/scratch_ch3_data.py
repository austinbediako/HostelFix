# Chapter 3 Content Dictionary for HostelFix 150+ Page Thesis
# System Analysis and Design, Requirements, UML, ERD, State Machine, Algorithmic Pseudocode

CH3_DATA = {
    "title": "CHAPTER THREE: SYSTEM ANALYSIS AND DESIGN",
    "sections": [
        {
            "id": "3.1",
            "heading": "3.1 Software Development Methodology (Agile Scrum Execution)",
            "content": [
                "The engineering of HostelFix was governed by the Agile Scrum software development methodology. Agile Scrum was selected over traditional linear models (such as the Waterfall methodology or the V-Model) due to the dynamic, socio-technical nature of university residential maintenance. In tertiary facility administration, operational constraints are frequently discovered through practical engagement with porters, hall managers, and artisans rather than static upfront specification documents.",
                "Scrum Framework Implementation: Development was executed across four time-boxed, two-week sprints. The project team established standard Scrum ceremonies: Sprint Planning (defining sprint goals and backlog selection), Daily Standups (tracking impediment removal and progress), Sprint Reviews (demonstrating working software increments to university stakeholders), and Sprint Retrospectives (evaluating architectural and process improvements).",
                "Sprint 1 (Weeks 1 to 2) - Domain Modeling and Persistence Infrastructure: Focused on domain analysis, formalizing requirements across traditional and UGEL halls, compiling the controlled residence directory for the nine halls, designing Mongoose schema models, configuring MongoDB compound indexes, and establishing Docker container environments for local database and Redis services.",
                "Sprint 2 (Weeks 3 to 4) - Core Backend API and Security Engine: Centered on constructing the Express 5 and TypeScript RESTful API. Key milestones included the implementation of dual-token JWT authentication (15-minute access token and 7-day HTTP-only refresh cookie), bcrypt password hashing, Zod payload validation middleware, and fine-grained object-level authorization policies enforcing hall tenancy boundaries.",
                "Sprint 3 (Weeks 5 to 6) - Client-Side Architecture and Interactive Dashboards: Focused on developing the Next.js 16 frontend web application. Milestones included building responsive user interfaces with Tailwind CSS v4, implementing the multi-step issue logging form with dynamic cascading dropdowns, integrating Cloudinary direct media uploads, engineering role-specific dashboards for students, hall managers, maintenance technicians, and university executives, and client state caching with TanStack React Query.",
                "Sprint 4 (Weeks 7 to 8) - Asynchronous Task Engine, Automated Testing, and System Hardening: Focused on integrating BullMQ background job queues with Redis for automated dispute window sweeps, writing the automated testing pyramid (Vitest unit and integration suites), implementing Playwright browser automation tests, optimizing query performance, and executing local defense readiness runs."
            ]
        },
        {
            "id": "3.2",
            "heading": "3.2 Requirements Engineering and Specifications",
            "content": [
                "Requirements engineering was conducted through structured interviews with hall managers, porters, caretakers, and student residents, supplemented by operational logbook reviews. Requirements were formalized and prioritized using the MoSCoW framework (Must-have, Should-have, Could-have, Won't-have):",
                "3.2.1 Functional Requirements Specifications",
                "FR-01 (Must-Have): Secure Institutional Authentication. The system must authenticate students and staff using their institutional identifier (student or staff ID) and a 5-digit PIN, issuing a short-lived JWT and an opaque refresh token in an HTTP-only cookie.",
                "FR-02 (Must-Have): Controlled Residence Location Selection. The system must enforce that issue locations are selected exclusively from a pre-seeded directory of verified halls, blocks, floors, and rooms, strictly prohibiting unvalidated free-text location entries.",
                "FR-03 (Must-Have): Multi-Category Maintenance Reporting. The system must allow student residents to submit defect reports across standardized trade categories (plumbing, electrical, carpentry, masonry, appliance, pest control, other) with an initial urgency rating.",
                "FR-04 (Must-Have): Photographic Defect Attachment. The system must support optional uploading of up to 5 photographs per report, transferring media directly to Cloudinary CDN and storing validated HTTPS URLs and metadata in the database.",
                "FR-05 (Must-Have): Single-Action Institutional Acknowledgment. The system must enable Hall Managers to acknowledge incoming student reports in a single action, recording institutional awareness without blocking physical work.",
                "FR-06 (Must-Have): Flexible and Direct Issue Resolution. The system must permit authorized personnel (maintenance technicians or hall managers) to record an issue as resolved, allowing direct transitions from 'Submitted' to 'Resolved' for offline emergency repairs.",
                "FR-07 (Must-Have): 48-Hour Student Dispute Verification Window. Upon transition to 'Resolved', the system must automatically initiate a 48-hour verification window during which the student reporter can dispute the repair and return the ticket to 'Reopened'.",
                "FR-08 (Must-Have): Automated Lifecycle Queue Closure. The system must execute an automated hourly background worker that inspects resolved issues and transitions those with expired dispute windows to 'Closed'.",
                "FR-09 (Must-Have): Object-Level Multi-Tenant Scoping. The system must restrict Hall Managers to records matching their assigned halls, restrict students to their own reported tickets, and permit university executives cross-hall read-only visibility.",
                "FR-10 (Must-Have): Immutable Event Sourcing and Audit Trail. Every lifecycle transition, priority modification, and administrative assignment must append an immutable record to the issue events and security audit log collections.",
                "FR-11 (Should-Have): Cross-Campus Maintenance Analytics. The system should provide central administrators with aggregate metrics on defect volumes, category distribution, and average resolution times across all nine halls.",
                "FR-12 (Should-Have): Artisan Operational Assignment. The system should allow hall managers to assign specific maintenance personnel to issues as operational metadata without turning assignment into a blocking gating state.",
                "3.2.2 Non-Functional Requirements Specifications",
                "NFR-01: Performance and Query Latency. All core REST API endpoints must respond within 200 milliseconds under standard load, supported by compound database indexing.",
                "NFR-02: Security and Horizontal Isolation. The API must reject unauthorized horizontal access across halls or students with HTTP 403 Forbidden, validated by regression tests.",
                "NFR-03: Responsive Usability. The web portal must deliver seamless, responsive user experiences across mobile viewports (360px), tablets (768px), and desktop monitors (1440px).",
                "NFR-04: Availability and Asynchronous Resilience. External network latencies from email delivery or Cloudinary uploads must be decoupled via message queues to prevent API timeouts.",
                "NFR-05: Data Integrity and Schema Validation. Every incoming HTTP payload must be strictly validated at the API boundary using Zod schemas before database insertion.",
                "NFR-06: Testability and Maintainability. The backend must achieve 100% automated test pass rates across unit, integration, and security test suites using Vitest and Playwright.",
                "NFR-07: Portability and Cloud Agnosticism. The application must operate across standard containerized environments using Node.js 22, MongoDB 7, and Redis 7.",
                "NFR-08: Accessibility and Standards Compliance. The client interface must adhere to WCAG 2.1 Level AA standards, featuring proper ARIA labeling, keyboard navigation, and high contrast."
            ]
        },
        {
            "id": "3.3",
            "heading": "3.3 Input Design and Client-Side Data Validation",
            "content": [
                "Input design in HostelFix is engineered around the principle of proactive error prevention. In high-density communal living, ambiguous free-text input (such as entering 'near the broken tap by the corner') destroys operational traceability. Input design enforces strict syntactic and semantic constraints at both client and server boundaries.",
                "Client-Side Validation Architecture: All forms are managed using React Hook Form coupled with Zod runtime schema validation resolvers. When a student enters data, validation occurs dynamically before network transmission, providing instantaneous inline feedback and eliminating unnecessary API round-trips.",
                "Input Constraints and Specifications:",
                "1. User Authentication Form: Student or Staff ID must be a numeric string of at least 8 digits. PIN must be an exact 5-digit numeric string (/^\\d{5}$/).",
                "2. Issue Creation Form: Title must be between 5 and 120 characters. Description must be between 10 and 2000 characters. Category must match an approved trade enum (plumbing, electrical, carpentry, masonry, appliance, pest, other). Priority must match an approved urgency enum (low, medium, high, emergency).",
                "3. Controlled Location Selectors: Location selection is strictly hierarchical: Hall Selection -> Block Selection -> Floor Selection -> Room Selection. All inputs are mapped to valid BSON ObjectIds pre-verified in the database.",
                "4. Image File Upload Constraints: Image attachments are restricted to valid image MIME types (image/jpeg, image/png, image/webp) with a maximum individual file size ceiling of 5 megabytes and a maximum limit of 5 attachments per submission.",
                "5. Dispute Form: When reopening a resolved issue, the student must provide a mandatory dispute justification narrative of at least 10 characters detailing why the physical repair was inadequate."
            ]
        },
        {
            "id": "3.4",
            "heading": "3.4 Output Design, Dashboards, and Reporting Specifications",
            "content": [
                "Output design in HostelFix is tailored to the cognitive requirements of each distinct operational constituency. Rather than exposing a uniform interface, the system renders tailored role-specific dashboards:",
                "1. Student Resident Output Interface: Presents a clean, card-based interface highlighting current issue counts (Reported, Acknowledged, In Progress, Resolved). The Issues List displays color-coded status badges with high contrast. The Issue Detail view showcases an interactive visual audit timeline depicting every status transition with exact timestamps and actor designations.",
                "2. Hall Manager Operational Console: Designed for rapid triage. The dashboard highlights submitted tickets requiring acknowledgment, outstanding high-urgency repairs, and active artisan assignments within the manager's assigned hall. One-tap action controls allow instant acknowledgment or priority elevation.",
                "3. Maintenance Personnel Work Order Queue: Streamlined for mobile field use. Highlights assigned tasks, room location details, reported category, and student descriptions. Features clear action buttons to mark repairs as resolved with completion notes.",
                "4. Central University Executive Overview: Displays high-level cross-hall comparative charts (powered by Recharts). Visualizes defect volume distributions across the nine traditional and UGEL halls, average resolution duration in hours, category breakdown pies, and monthly failure trends.",
                "5. System Administrator Governance Portal: Exposes global user directory tables with search and role management capabilities, database health indicators, and immutable system-wide security audit logs with IP address and user-agent metadata.",
                "6. Real-Time Toast Notifications: System feedback is communicated via asynchronous Sonner toast notifications, confirming ticket submission, acknowledgment, or status updates without disrupting user workflows."
            ]
        },
        {
            "id": "3.5",
            "heading": "3.5 Database Design and Persistence Architecture",
            "content": [
                "The persistence architecture of HostelFix is implemented using MongoDB, a high-performance document-oriented NoSQL database, accessed via the Mongoose Object Document Mapper (ODM) in TypeScript.",
                "3.5.1 Conceptual, Logical, and Physical Schema Design",
                "The database comprises six core collections: users, halls, locations, issues, issue_events, and audit_logs. The design balances document embedding for atomic sub-resources (such as Cloudinary image arrays) with normalized references (using BSON ObjectIds) for domain entities to prevent data redundancy and maintain consistency.",
                "3.5.2 Database Normalization Analysis (1NF, 2NF, 3NF)",
                "Although MongoDB is a NoSQL database, the relational integrity of domain entities was analyzed through classical normalization theory:",
                "First Normal Form (1NF): All attributes contain atomic values, and each collection possesses a distinct primary key (_id). Multi-valued attributes like image arrays are represented as structured sub-document arrays with unique identifiers.",
                "Second Normal Form (2NF): All non-key attributes are fully functionally dependent on the document primary key. Partial functional dependencies are eliminated by separating halls and locations into dedicated collections rather than repeating hall metadata in location documents.",
                "Third Normal Form (3NF): Transitive dependencies are eliminated. For instance, an issue references a locationId and a hallId; location attributes (block, floor, room) are not duplicated inside the issue document, ensuring that structural hall updates do not cause data anomalies.",
                "3.5.3 Complete Data Dictionary",
                "Tables 3.4 through 3.9 document the comprehensive data dictionary for all six database collections, detailing field names, BSON types, validation rules, indexing, and functional descriptions.",
                "3.5.4 Compound Indexing Strategy and Query Optimization",
                "To guarantee sub-200ms query latency as ticket volumes scale into the tens of thousands, strategic compound and unique indexes were implemented (documented in Table 3.10). Key indexes include { referenceNumber: 1 } (unique lookup), { hallId: 1, status: 1, createdAt: -1 } (hall manager dashboard acceleration), { reporterId: 1, createdAt: -1 } (student history optimization), and { status: 1, disputeWindowExpiresAt: 1 } (BullMQ hourly cron optimization)."
            ]
        },
        {
            "id": "3.6",
            "heading": "3.6 UML Modeling and System Design",
            "content": [
                "To provide an exhaustive blueprint of the system's behavioral, structural, and interactional characteristics, the system was modeled using standard Unified Modeling Language (UML) specifications:",
                "3.6.1 Use Case Modeling: Details the functional interactions between the five primary actors (Student Resident, Hall Manager, Maintenance Staff, University Administrator, System Administrator) and the system boundary across ten primary use cases (UC-01 to UC-10), illustrated in Figure 3.3.",
                "3.6.2 Activity Flowcharts: Depicts the step-by-step decision workflows for Student Issue Discovery and Reporting (Figure 3.8), Hall Manager Triage and Allocation, Maintenance Execution, and Automated Lifecycle Closure.",
                "3.6.3 Domain Class Modeling: Figure 3.4 illustrates the structural class model, detailing attributes, visibility specifiers (+ for public, - for private), methods, return types, and multiplicity associations between User, Hall, Location, Issue, IssueEvent, and AuditLog entities.",
                "3.6.4 Interaction Sequence Modeling: Figures 3.5 and 3.6 capture the chronological message exchanges between client, API controller, domain service, ODM, and database for the End-to-End Issue Lifecycle and the Dual-Token JWT Authentication Handshake.",
                "3.6.5 Component Modeling: Figure 3.2 illustrates the high-level subsystem decomposition, showing interfaces and communication protocols connecting the Next.js Client, Express API, Redis Broker, MongoDB Cluster, and Cloudinary Media CDN.",
                "3.6.6 Core Algorithmic Logic and Pseudocode: Formulates the algorithmic specifications for Unique Reference Number Generation, Dynamic Query Scoping Engine, BullMQ Scheduled Dispute Scanner, and Bcrypt Token Verification."
            ]
        },
        {
            "id": "3.7",
            "heading": "3.7 System Architecture, State Machine, and Network Topology",
            "content": [
                "3.7.1 Multi-Tier Modular Monolith Architecture: Figure 3.1 illustrates the architectural topology, highlighting the Presentation Layer, Express 5 Modular Backend, and Persistence Layer.",
                "3.7.2 Operational Workflow Design (ADR 001): Figure 3.7 presents the simplified state machine, showing the four core states (Submitted, Acknowledged, Resolved, Closed), direct resolution curves, and 48-hour dispute paths.",
                "3.7.3 Physical Network Deployment and Infrastructure Topology: Figure 3.10 illustrates the production network topology, detailing TLS termination at the reverse proxy edge, internal port mappings (Next.js on 3000, Express on 5001, MongoDB on 27017, Redis on 6379), and outbound Cloudinary CDN integrations.",
                "Table 3.11 defines the complete Role-Based Access Control and Capability Matrix across all five user roles."
            ]
        },
        {
            "id": "3.8",
            "heading": "3.8 Hardware and Software Specifications",
            "content": [
                "Table 3.12 documents the development, server hosting, and client hardware and software specifications required to operate and maintain the HostelFix platform."
            ]
        }
    ]
}

print("Chapter 3 Data dictionary defined successfully.")
