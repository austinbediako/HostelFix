# PHASE 0: INVESTIGATION AND PLANNING

I have completed the initial investigation of the repository. Below are the findings, proposed structure, mapping, and the execution plan for the final documentation.

## 1. Understanding of the Template

**Important Note on the Template:** You mentioned a "PDF template," but I searched the entire repository and there is no PDF template. There are exactly three PDFs (`HostelFix-Test-Logins.pdf`, `logs.pdf`, and `HostelFix_Final_Report.pdf` which is a compiled version of the 1355-line `final.md` document). However, I did find **`template/Project Template - Undergraduate.docx`**. 

Assuming this `.docx` file is the template you meant, here is my understanding of its requirements:
- **Structure**: A standard 5-chapter academic format (Introduction, Literature Review, System Analysis & Design, Implementation & Evaluation, Conclusion & Future Works).
- **Preliminary Pages**: Expected standard university preliminaries (though not fully detailed in the docx, they include Abstract, TOC, etc.).
- **Specifics**: 
  - **Chapter 2** requires reviewing 2-3 similar systems and locating primary/secondary literature.
  - **Chapter 3** requires specific diagrams (Use Cases, Flowcharts, Class/Sequence diagrams) and database design.
  - **Chapter 4** requires presenting testing data and justification of analyses.
- **Referencing**: APA style.

## 2. Understanding of the Project

The project, **HostelFix**, is a web-based maintenance reporting and tracking system for 9 university-managed halls at the University of Ghana. 

- **Core Problem Solved**: Eliminates fragmented, unrecorded, and unaccountable maintenance reporting (paper logbooks, verbal complaints) by providing a unified operational record.
- **Key Innovation**: Simplifies the traditional rigid six-stage workflow into a realistic 4-stage operational record: `Submitted -> Acknowledged -> Resolved -> Closed`. It acknowledges that actual repair work often happens informally and does not forcefully block the system while waiting for "assigned" statuses.
- **Stakeholders**: Students (reporters), Hall Managers (acknowledgers), Maintenance Personnel, University Admins, and System Admins.
- **Tech Stack**: 
  - Frontend: Next.js 16 (App Router), React, Tailwind CSS, TypeScript.
  - Backend: Express 5, Node.js, TypeScript.
  - Database & Storage: MongoDB (via Mongoose), Cloudinary for images.
  - Auth: Short-lived JWTs + HTTP-only refresh tokens, Role-Based Access Control (RBAC).

## 3. Proposed Report Structure

Based on the `.docx` template, the report will be structured as follows:

* **Preliminary Pages**: Title Page, Declaration, Certification, Dedication, Acknowledgements, Abstract, Table of Contents, List of Figures, List of Tables, List of Abbreviations.
* **Chapter 1: Introduction**: Background to the study, Research Problem Statement, Research Questions, Aims & Objectives, Scope of Study, Brief Methodology, Organization of the project.
* **Chapter 2: Literature Review**: Overview of facility management systems, traditional paper processes, review of 2-3 similar maintenance systems (e.g., existing university portals, generic CMMS like Fiix or UpKeep), and gaps addressed by HostelFix.
* **Chapter 3: System Analysis and Design**: Agile methodology description, Functional/Non-functional requirements, Input/Output design, Database design (ERD), System Architecture, and UML Diagrams (Use Case, Sequence).
* **Chapter 4: Implementation and Evaluation**: Technology stack justification, implementation details (frontend/backend), testing methodology (Vitest automated tests + manual UI verification), and presentation of the working system (screenshots).
* **Chapter 5: Conclusion & Future Works**: Summary of results, Limitations, Recommendations, Future Work.
* **References**: APA Style.
* **Appendices**: Setup instructions, sample API payloads, test logs.

## 4. Project-to-Template Mapping

| Template Section | Project Content / Evidence | Status |
| :--- | :--- | :--- |
| **Ch 1: Introduction** | `README.md`, problem domain in `final.md` | Ready |
| **Ch 2: Lit Review** | Needs real academic sources and system comparisons | **Needs Input** |
| **Ch 3: Analysis & Design** | `data-model.md`, `architecture-tree.md`, `workflows.md` | Ready |
| **Ch 4: Implementation** | Source code, `package.json`, vitest logs, UI | Ready (needs UI screenshots) |
| **Ch 5: Conclusion** | `blindspots.md`, limitations in `final.md` | Ready |

## 5. Missing Information `[INFORMATION REQUIRED FROM USER]`

Before we proceed, please provide the following details so I do not fabricate them:
1. **Student Details**: Name, Student ID, Programme, Department, Supervisor Name.
2. **Template Confirmation**: Please confirm that `Project Template - Undergraduate.docx` is the template you meant. (If there is an actual PDF I missed, please provide its exact path).
3. **Literature Review**: Are there specific academic papers or competing systems you want me to cite? (Otherwise, I will use factual, well-known generic systems like standard CMMS tools, but I cannot invent specific survey statistics or academic quotes).
4. **Methodology**: The template asks for the adopted methodology. I will assume Agile/Iterative prototyping based on the tech stack, unless you specify otherwise.

## 6. Proposed Figures and Tables

**Figures:**
- Figure 3.1: High-Level System Architecture Diagram
- Figure 3.2: Use Case Diagram for Core Actors
- Figure 3.3: Issue Lifecycle State Machine (Workflow)
- Figure 3.4: Entity Relationship Diagram (ERD)
- Figure 3.5: Sequence Diagram (Issue Creation & Authentication)
- Figure 4.1 - 4.x: Screenshots (Login page, Student Dashboard, Issue Detail view, Manager Dashboard)

**Tables:**
- Table 3.1: Functional Requirements 
- Table 3.2: Non-Functional Requirements
- Table 3.3: User Roles and Permissions
- Table 3.4: Database Entities (Users, Issues, Events)
- Table 4.1: Technology Stack Summary
- Table 4.2: Automated Test Coverage Summary

## 7. Risks or Uncertainties

- **Template Discrepancy**: The repository contains a massive 20-chapter `final.md` document, but the `.docx` template requests a 5-chapter document. Following the `.docx` template means aggressively condensing or restructuring `final.md`. 
- **Fabrication of Academic Sources**: I am strictly forbidden from hallucinating academic references. I will write Chapter 2 conceptually, but real APA citations will require your input.
- **Testing Results**: I will report actual test passing results from the codebase, but I cannot invent user acceptance test (UAT) statistics (e.g., "95% of students liked it") without your explicit data.

## 8. Step-by-Step Execution Plan

* **Step 1:** You review this plan and provide the missing information (student details, template confirmation).
* **Step 2:** I will write the Preliminary Pages and Chapters 1-2 based on the verified information.
* **Step 3:** I will generate Mermaid diagrams and write Chapter 3 (Analysis & Design).
* **Step 4:** I will take screenshots of the running local applications and write Chapter 4 (Implementation & Evaluation).
* **Step 5:** I will write Chapter 5, References, and Appendices.
* **Step 6:** I will perform a final academic, consistency, and template-conformance audit before presenting the final deliverable.

**Please review this plan and provide the missing information so we can proceed to Document Generation.**
