# Blind Spots and Failure Modes

> **Implementation status:** Mitigations are implemented in `/Users/kaeytee/Desktop/Joenick/HostelFix/backend`. Permission-denial tests covering the riskiest cases live in [`backend/tests/permission/`](../backend/tests/permission/).

## 1. Login Is Not Authorization

A valid session proves identity. It does not prove the user may read, assign, update, or close a particular issue.

**Required control:** Every issue lookup must apply ownership or assigned-hall policy checks.

## 2. Never Trust Client-Supplied Identifiers

A student can modify a browser request and submit another hall ID, reporter ID, or status.

**Required control:** Derive user identity from the server session and derive hall context from server-side allocation/location records.

## 3. Resolved Is Not Closed

Maintenance completion is a claim. The resident may disagree, or the problem may return.

**Required control:** Use `Resolved` before `Closed`, with a confirmation or timed closure step.

## 4. Free-Text Locations Destroy Reporting Quality

“Near the old bathroom” and “outside block B” are not reliable analytical locations.

**Required control:** Controlled hall, block, floor, room, and common-area records.

## 5. Emergency Reports Need a Human Escalation Rule

An app notification cannot be the only response to a safety emergency.

**Required control:** Display emergency contact instructions in the interface and send high-priority alerts to designated Hall Management staff.

## 6. Images May Contain Personal Information

Photos can show faces, student rooms, belongings, or location evidence.

**Required control:** File type/size checks, authorised access, retention rules, signed uploads, and an image-removal process.

## 7. Notifications Are Not Guaranteed Delivery

Email may bounce and browser notifications may be disabled.

**Required control:** Treat notifications as delivery attempts; store in-app notifications and show them on the dashboard.

## 8. Role Changes Are Security Events

Changing a person from student to Hall Management can expose an entire hall’s data.

**Required control:** Restrict role changes, log them, and require administrator review.

## 9. Data Retention Is a Policy Question

Issue history is useful, but keeping data forever is unnecessary risk.

**Required control:** Define how long to retain closed issues, images, notification logs, and audit logs before launch.

## 10. Do Not Build Microservices Too Early

Multiple services introduce authentication forwarding, distributed tracing, message failures, deployment coordination, and data consistency problems.

**Required control:** Keep modules separate in one deployable API until there is a real operational reason to split them.

## 11. Test the Permission Matrix

Most “happy path” tests will pass even when the system leaks data.

**Required control:** Write negative tests: student A cannot read student B’s issue; Hall A manager cannot access Hall B; maintenance worker cannot assign themselves to arbitrary jobs.

## 12. Private Hostel Scope Creep

Adding private or off-campus residences later changes governance, data ownership, and maintenance responsibility.

**Required control:** Keep the initial directory restricted to University-managed halls. Treat external expansion as a separately approved programme.

