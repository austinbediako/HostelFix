---
title: HostelFix University of Ghana Halls Maintenance Platform
document_type: Project Proposal Reference
student_name: Asante Gideon Kwadwo
student_id: "11287773"
date: 18th March 2026
status: Approved project scope reference
---

# HostelFix University of Ghana Halls Maintenance Platform

## Purpose of This Reference

This Markdown document is the canonical project-scope reference for coding agents and project contributors. It defines the intended users, supported residences, technology stack, core features, implementation phases, deliverables, and operational boundaries.

When technical choices are unclear, preserve the institutional scope and requirements in this document. Do not add private hostels or off-campus accommodation without explicit project approval.

## Project Identity

- **Project name:** HostelFix
- **Project title:** HostelFix - A Web Based Maintenance Reporting and Tracking System for University of Ghana Managed Halls and Residences at the Legon Campus
- **Student:** Asante Gideon Kwadwo
- **Student ID:** 11287773
- **Date:** 18th March 2026

## 1. Project Title

**HostelFix - A Web Based Maintenance Reporting and Tracking System for University of Ghana Managed Halls and Residences at the Legon Campus**

## 2. Problem Statement

Students residing in University of Ghana managed halls and residences at the Legon Campus frequently encounter maintenance and facility problems such as broken showers, faulty electrical fittings, poor sanitation, water leaks, and unreliable Wi-Fi. Existing reporting channels, typically verbal complaints, paper logbooks, or informal messages, are slow, unstructured, and offer limited transparency. As a result, many issues can remain unresolved for extended periods, negatively affecting student wellbeing, academic focus, and the campus residential experience.

The need is institutional rather than commercial. The University requires a single maintenance-reporting process for its traditional halls and UGEL halls. Private hostels and off-campus accommodation are outside the proposed system scope because their maintenance operations are not managed by the University.

## 3. Aim and Goal

The aim is to design and develop HostelFix: a responsive web-based maintenance reporting and tracking system for the nine University of Ghana managed student halls and residences at the Legon Campus.

The system will enable authorised student residents to report maintenance issues within their allocated halls. It will enable Hall Management and authorised University maintenance personnel to verify, prioritise, assign, track, and resolve issues in a timely and transparent manner.

The system will provide separate role-based dashboards for:

- Student residents
- Hall Management
- University maintenance personnel

Students can submit reports with a category, description, hall, block, floor, room or common-area location, priority indication, and optional image. Hall Management can verify and route reports. Authorised maintenance personnel can update assignments and work status.

## 4. Institutional Scope

### Included Residences

#### Traditional Halls

1. Akuafo Hall
2. Legon Hall
3. Volta Hall
4. Commonwealth Hall
5. Mensah Sarbah Hall

#### UGEL Halls

1. Hilla Limann Hall
2. Alexander Adum Kwapong Hall
3. Elizabeth Frances Sey Hall
4. Jean Nelson Aka Hall

### Excluded Scope

- Private hostels
- Off-campus accommodation
- Commercial hostel-maintenance services

## 5. Methodology

The project follows an iterative web-development approach.

1. Gather requirements from the maintenance processes of University-managed halls.
2. Translate requirements into user stories for student residents, Hall Management, and maintenance personnel.
3. Design the interface, database model, and API contracts.
4. Implement core features incrementally.
5. Test with representative users from traditional and UGEL halls.
6. Refine the system from feedback.
7. Deploy the responsive web application.

## 6. Tools and Technologies

| Area | Selected Technology and Purpose |
|---|---|
| Frontend | Next.js, TypeScript, and Tailwind CSS for a responsive desktop and mobile browser experience. |
| Backend | Node.js and Express.js for the REST API, business logic, and role-based access control. |
| Database | MongoDB for user accounts, issue reports, categories, status updates, assignments, and audit information. |
| Authentication | JWT-based authentication and password hashing for secure sign-in and distinct user roles. |
| File handling | Cloudinary or equivalent external object storage for optional issue photographs; store image URLs in MongoDB. |
| Design and testing | Figma, Git, GitHub, Postman, unit testing, integration testing, and user acceptance testing. |
| Deployment | Vercel or equivalent for Next.js; managed hosting for Express and MongoDB. |

## 7. Core Features

### 7.1 Authentication and Roles

- Secure registration and login
- Student resident role
- Hall Management role
- University maintenance role
- Role-based access control

### 7.2 Issue Reporting

- Category selection
- Hall selection through controlled residence data
- Block, floor, room, or common-area location
- Description
- Priority level
- Optional photo upload

### 7.3 Student Dashboard

- View submitted reports
- Track report status
- Receive in-app and email status notifications
- Monitor statuses such as Pending, In Progress, and Resolved

### 7.4 Hall Management Dashboard

- Verify reports
- Request clarification
- Filter issues by status, category, and location
- Prioritise issues
- Assign maintenance personnel
- Update report status
- Monitor overdue and recurring issues

### 7.5 University Maintenance Dashboard

- View assigned maintenance work
- Update work progress
- Add repair notes
- Mark work as resolved
- View cross-hall maintenance needs where authorised

### 7.6 Search, Reporting, and Analytics

- Search and filter issue records
- Issue counts by hall, block, category, and status
- Overdue issue monitoring
- Recurring issue identification
- Resolution-time measurement
- Maintenance planning insight

## 8. Implementation Phases

### Phase 1 - Design and Planning

- Define functional and non-functional requirements.
- Create Figma wireframes.
- Plan responsive page layouts.
- Design the MongoDB data model.
- Document API endpoints.
- Configure Next.js, Express.js, and MongoDB development environments.
- Configure the five traditional halls and four UGEL halls in the residence directory.

### Phase 2 - Development

- Build the responsive frontend and Express API.
- Integrate MongoDB.
- Implement authentication, roles, issue reporting, dashboards, assignment workflows, notifications, and analytics.
- Implement controlled hall and location data.
- Implement search, filtering, and summary views.

### Phase 3 - Testing and Deployment

- Conduct unit and integration testing.
- Conduct user acceptance testing with student residents, Hall Management staff, and authorised maintenance personnel.
- Correct usability issues and defects.
- Test responsiveness, security, and accessibility on common desktop and mobile browsers.
- Deploy the application.

## 9. Expected Results and Deliverables

1. A responsive web application covering all five traditional halls and four UGEL halls.
2. Separate dashboards for student residents, Hall Management, and University maintenance personnel.
3. A Next.js frontend and Node.js/Express.js backend connected to MongoDB.
4. Secure role-based access, issue reporting, image upload, controlled location capture, priority classification, and status tracking.
5. A centralised record of reports across University-managed halls.
6. Measurement of average issue-resolution time against the previous manual reporting process.
7. Unit, integration, and user acceptance testing documentation.
8. Final project report, technical documentation, and presentation.

## 10. Relevance and Impact

### Improved Student Wellbeing

Faster and more visible issue resolution can help students live in safer, more comfortable conditions and support academic focus.

### Efficient University Operations

Hall Management and authorised University maintenance personnel receive organised dashboards for receiving, prioritising, assigning, and monitoring reports.

### Accountability and Transparency

Students can track issue status, while authorised staff have a traceable record of updates and actions.

### Data-Driven Maintenance

Issue records reveal recurring categories, locations, and trends across halls, blocks, and common areas, supporting preventive maintenance and resource allocation.

### Institutional Accessibility and Scalability

Because HostelFix is web-based and responsive, authorised residents and staff can use it without installing a mobile application. Subject to University approval, it can later extend to other University-managed residential or campus facilities.

## 11. Non-Negotiable Implementation Constraints

- The initial system covers only the nine approved University-managed residences at Legon.
- Private hostels and off-campus residences must not appear in the residence directory.
- Backend authorization must enforce role, assigned-hall, and ownership limits.
- Every issue must have a controlled location within an approved hall.
- The system must preserve issue status history and audit actions.
- Images must be stored externally; MongoDB stores image metadata and URLs.
- Notification failures must not prevent a maintenance issue from being created.
- The project begins as a modular Express backend, not as microservices.

## 12. Related Technical Documentation

Use this document alongside the backend documentation package:

- `README.md`
- `architecture-tree.md`
- `workflows.md`
- `data-model.md`
- `api-contract.md`
- `technical-decisions.md`
- `blindspots.md`

