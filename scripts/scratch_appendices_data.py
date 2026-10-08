# Appendices A through F for HostelFix 150+ Page Thesis

APPENDICES_DATA = {
    "Appendix A": {
        "title": "Appendix A: Complete REST API Contract Specifications",
        "description": "Comprehensive specification of all RESTful API endpoints exposed by the HostelFix Express 5 backend server on base URL http://localhost:5001/api/v1:",
        "endpoints": [
            ("POST /auth/login", "Public", "Authenticates user using ID and 5-digit PIN. Returns JWT access token and sets HTTP-only refresh token cookie.", "Request: { id: '11287773', pin: '12345' }\nResponse: 200 OK { user: { _id, studentId, name, role, assignedHallIds }, accessToken: 'jwt...' }"),
            ("POST /auth/refresh", "Public (Cookie)", "Issues a new 15-minute access token using the HTTP-only refresh cookie.", "Request: Cookie: refreshToken=...\nResponse: 200 OK { accessToken: 'jwt...' }"),
            ("POST /auth/logout", "Authenticated", "Clears the refresh token cookie and invalidates user session.", "Response: 200 OK { message: 'Logged out successfully' }"),
            ("GET /issues", "Authenticated", "Queries maintenance issues with role-based and hall-tenancy scoping. Supports status, category, priority, and pagination query params.", "Query: ?status=submitted&page=1&limit=20\nResponse: 200 OK { data: [Issue], pagination: { total, pages } }"),
            ("POST /issues", "Student / Hall Manager", "Creates a new maintenance issue report. Enforces location directory verification and optional Cloudinary media URLs.", "Request: { title, description, category, priority, hallId, locationId, images: [{ url, publicId }] }\nResponse: 201 Created { issue }"),
            ("GET /issues/:id", "Authenticated (Scoped)", "Retrieves full details of a specific issue including chronological lifecycle events from issue_events collection.", "Response: 200 OK { issue, events: [IssueEvent] }"),
            ("PATCH /issues/:id/acknowledge", "Hall Manager", "Records institutional awareness of a submitted issue, transitioning status to 'acknowledged'.", "Response: 200 OK { message: 'Issue acknowledged', issue }"),
            ("PATCH /issues/:id/resolve", "Maintenance / Manager", "Records that physical repairs have been completed, transitioning status to 'resolved' and initiating 48h dispute timer.", "Request: { notes: 'Replaced ball valve and washer' }\nResponse: 200 OK { message: 'Issue resolved', issue }"),
            ("PATCH /issues/:id/reopen", "Student Reporter Only", "Disputes a resolution within the 48-hour dispute window, returning the ticket to 'reopened'.", "Request: { reason: 'Tap continues to drip after repair' }\nResponse: 200 OK { message: 'Issue reopened', issue }"),
            ("PATCH /issues/:id/assignee", "Hall Manager", "Assigns an artisan to an issue as operational metadata without blocking physical labor.", "Request: { assigneeId: 'ObjectId' }\nResponse: 200 OK { issue }"),
            ("GET /halls", "Authenticated", "Retrieves list of all nine approved traditional and UGEL halls.", "Response: 200 OK [Hall]"),
            ("GET /locations", "Authenticated", "Retrieves verified blocks, floors, and rooms for a specific hallId.", "Query: ?hallId=66dd... \nResponse: 200 OK [Location]"),
            ("GET /analytics/overview", "University / System Admin", "Provides cross-hall aggregate metrics on defect volume, average resolution hours, and category breakdown.", "Response: 200 OK { totalIssues, resolutionRate, hallBreakdown: [...] }"),
            ("PATCH /users/:id/roles", "System Admin Only", "Updates user role or assigned hall boundaries. Logs critical security event to audit_logs collection.", "Request: { role: 'hall_manager', assignedHallIds: ['...'] }\nResponse: 200 OK { user }")
        ]
    },
    "Appendix B": {
        "title": "Appendix B: Complete Database DDL and Mongoose Model Schemas",
        "description": "Production TypeScript source code for the core Mongoose schemas enforcing database validation, indexing, and lifecycle hooks:",
        "schemas": [
            ("Issue Model (issue.model.ts)", "import mongoose, { Schema, Document } from 'mongoose';\n\nexport interface IIssue extends Document {\n  referenceNumber: string;\n  title: string;\n  description: string;\n  category: 'plumbing' | 'electrical' | 'carpentry' | 'masonry' | 'appliance' | 'pest' | 'other';\n  priority: 'low' | 'medium' | 'high' | 'emergency';\n  status: 'submitted' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed' | 'rejected' | 'reopened';\n  hallId: mongoose.Types.ObjectId;\n  locationId: mongoose.Types.ObjectId;\n  reporterId: mongoose.Types.ObjectId;\n  assigneeId?: mongoose.Types.ObjectId;\n  images: Array<{ url: string; publicId: string }>;\n  disputeWindowExpiresAt?: Date;\n  createdAt: Date;\n  updatedAt: Date;\n}\n\nconst IssueSchema = new Schema<IIssue>({\n  referenceNumber: { type: String, required: true, unique: true, index: true },\n  title: { type: String, required: true, trim: true, maxlength: 120 },\n  description: { type: String, required: true, trim: true, maxlength: 2000 },\n  category: { type: String, required: true, enum: ['plumbing','electrical','carpentry','masonry','appliance','pest','other'] },\n  priority: { type: String, required: true, enum: ['low','medium','high','emergency'], default: 'medium' },\n  status: { type: String, required: true, enum: ['submitted','acknowledged','in_progress','resolved','closed','rejected','reopened'], default: 'submitted' },\n  hallId: { type: Schema.Types.ObjectId, ref: 'Hall', required: true, index: true },\n  locationId: { type: Schema.Types.ObjectId, ref: 'Location', required: true },\n  reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },\n  assigneeId: { type: Schema.Types.ObjectId, ref: 'User' },\n  images: [{ url: String, publicId: String }],\n  disputeWindowExpiresAt: { type: Date, index: true }\n}, { timestamps: true });\n\nIssueSchema.index({ hallId: 1, status: 1, createdAt: -1 });\nIssueSchema.index({ status: 1, disputeWindowExpiresAt: 1 });\nexport const Issue = mongoose.model<IIssue>('Issue', IssueSchema);"),
            ("User Model (user.model.ts)", "import mongoose, { Schema, Document } from 'mongoose';\n\nexport interface IUser extends Document {\n  studentId: string;\n  name: string;\n  email: string;\n  role: 'student' | 'hall_manager' | 'maintenance' | 'university_admin' | 'system_admin';\n  passwordHash: string;\n  assignedHallIds: mongoose.Types.ObjectId[];\n}\n\nconst UserSchema = new Schema<IUser>({\n  studentId: { type: String, required: true, unique: true, index: true },\n  name: { type: String, required: true, trim: true },\n  email: { type: String, required: true, unique: true, lowercase: true },\n  role: { type: String, required: true, enum: ['student','hall_manager','maintenance','university_admin','system_admin'], default: 'student' },\n  passwordHash: { type: String, required: true, select: false },\n  assignedHallIds: [{ type: Schema.Types.ObjectId, ref: 'Hall' }]\n}, { timestamps: true });\n\nexport const User = mongoose.model<IUser>('User', UserSchema);")
        ]
    },
    "Appendix C": {
        "title": "Appendix C: Automated Test Suite Source Code",
        "description": "Production test scripts verifying security isolation and Playwright browser journeys:",
        "tests": [
            ("Playwright E2E Test Suite (frontend/tests/e2e/workflow.spec.ts)", "import { test, expect } from '@playwright/test';\n\ntest.describe('HostelFix End-to-End Suite', () => {\n  test('TC-01: Authentication page loads with accessible elements', async ({ page }) => {\n    await page.goto('/login');\n    await expect(page).toHaveTitle(/HostelFix|Login/i);\n    await expect(page.locator('#id')).toBeVisible();\n    await expect(page.locator('#pin')).toBeVisible();\n  });\n\n  test('TC-02: Authentication rejects invalid pin format', async ({ page }) => {\n    await page.goto('/login');\n    await page.fill('#id', '11287773');\n    await page.fill('#pin', '123');\n    await page.click('button[type=\"submit\"]');\n    await expect(page.locator('#pin-error')).toContainText('PIN must be exactly 5 digits');\n  });\n\n  test('TC-03: Student logs in and navigates to issue reporting', async ({ page }) => {\n    await page.goto('/login');\n    await page.fill('#id', '11287773');\n    await page.fill('#pin', '12345');\n    await page.click('button[type=\"submit\"]');\n    await expect(page).toHaveURL(/.*dashboard/);\n    await page.goto('/dashboard/issues/new');\n    await expect(page).toHaveURL(/.*dashboard\\/issues\\/new/);\n  });\n});"),
            ("Security Policy Isolation Test (backend/tests/permission/hall-scope.test.ts)", "import { describe, it, expect } from 'vitest';\nimport request from 'supertest';\nimport app from '../../src/app';\nimport { createTestUser, createTestHall } from '../helpers';\n\ndescribe('Hall Scope Isolation Policy', () => {\n  it('prevents hall manager from accessing another halls dashboard', async () => {\n    const hallA = await createTestHall('Akuafo Hall');\n    const hallB = await createTestHall('Legon Hall');\n    const managerA = await createTestUser('hall_manager', [hallA._id]);\n\n    const res = await request(app)\n      .get(`/api/v1/issues?hallId=${hallB._id}`)\n      .set('Authorization', `Bearer ${managerA.token}`);\n\n    expect(res.status).toBe(403);\n    expect(res.body.error.code).toBe('FORBIDDEN');\n  });\n});")
        ]
    },
    "Appendix D": {
        "title": "Appendix D: System Deployment and Administration Guide",
        "content": [
            "1. Infrastructure Provisioning: The platform is deployed on Linux Ubuntu 22.04 LTS servers featuring 4 vCPUs, 8GB RAM, and 50GB NVMe storage. Node.js 22 LTS, MongoDB 7.0 Community Edition, and Redis 7.0 are installed via native package repositories.",
            "2. Environmental Configuration: Environment variables are managed via .env files. Backend requires PORT=5001, MONGODB_URI, JWT_SECRET, JWT_EXPIRES_IN=15m, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES_IN=7d, REDIS_HOST=127.0.0.1, REDIS_PORT=6379, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.",
            "3. Seed Initialization: Database seeding is executed using pnpm run seed:dev, creating the nine university halls, standard block and room locations, and default administrative test accounts with PIN 12345.",
            "4. Reverse Proxy and Process Supervision: Nginx acts as the reverse proxy handling SSL/TLS termination on port 443 with Let's Encrypt certificates. PM2 manages application process supervision, auto-restarting services on unexpected failure."
        ]
    },
    "Appendix E": {
        "title": "Appendix E: Seeded Test User Directory & Credentials Matrix",
        "content": [
            "Table B.1 lists the provisioned test accounts configured in the development and oral-defense environment. All test accounts utilize the uniform development PIN '12345' for demonstration accessibility."
        ]
    },
    "Appendix F": {
        "title": "Appendix F: Audit Log Event Catalogue and State Transitions",
        "content": [
            "Table F.1 enumerates all discrete event types recorded by the issue_events and audit_logs collections, detailing initiating actor roles, trigger conditions, and audit payload structures."
        ]
    }
}

print("Appendices Data defined successfully.")
