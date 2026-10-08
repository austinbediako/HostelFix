# Expanded Appendices Data for HostelFix Undergraduate Project Document
# Conforming strictly to Project Template - Undergraduate.docx

APPENDICES_DATA = {
    "appendix_a": {
        "title": "APPENDIX A: COMPLETE REST API SPECIFICATION",
        "description": "Comprehensive specification of all RESTful API endpoints implemented in HostelFix, detailing HTTP verbs, URIs, authentication requirements, query parameters, request payloads, and status codes.",
        "endpoints": [
            {
                "method": "POST",
                "path": "/api/v1/auth/login",
                "auth": "Public",
                "desc": "Authenticates user credentials and returns JWT access token with HTTP-only refresh cookie.",
                "request_body": "{\n  \"identifier\": \"10982341\",\n  \"password\": \"pass123\"\n}",
                "response": "200 OK\n{\n  \"success\": true,\n  \"accessToken\": \"eyJhbGciOiJIUzI1NiIs...\",\n  \"user\": {\n    \"_id\": \"65b12a...\",\n    \"identifier\": \"10982341\",\n    \"name\": \"Kofi Mensah\",\n    \"role\": \"student\",\n    \"residence\": { \"_id\": \"65b10...\", \"name\": \"Legon Hall\" }\n  }\n}"
            },
            {
                "method": "POST",
                "path": "/api/v1/auth/refresh",
                "auth": "Public (Requires Cookie)",
                "desc": "Rotates refresh token and generates fresh 15-minute JWT access token.",
                "request_body": "None (Extracted from HTTP-only cookie 'refreshToken')",
                "response": "200 OK\n{\n  \"success\": true,\n  \"accessToken\": \"eyJhbGciOiJIUzI1NiIs...\"\n}"
            },
            {
                "method": "POST",
                "path": "/api/v1/auth/logout",
                "auth": "Authenticated",
                "desc": "Revokes refresh token in database and clears HTTP-only cookie.",
                "request_body": "None",
                "response": "200 OK\n{\n  \"success\": true,\n  \"message\": \"Successfully logged out\"\n}"
            },
            {
                "method": "GET",
                "path": "/api/v1/issues",
                "auth": "Bearer JWT (Role Scoped)",
                "desc": "Retrieves paginated issues queue. Filtered by reporter for students; filtered by residence for hall managers.",
                "request_body": "Query Params: page=1&limit=20&status=submitted&category=plumbing",
                "response": "200 OK\n{\n  \"success\": true,\n  \"count\": 1,\n  \"total\": 14,\n  \"data\": [\n    {\n      \"_id\": \"65b20...\",\n      \"ticketNumber\": \"HF-2026-0012\",\n      \"title\": \"Broken Washroom Pipe\",\n      \"category\": \"plumbing\",\n      \"priority\": \"urgent\",\n      \"status\": \"submitted\",\n      \"createdAt\": \"2026-03-10T14:22:00.000Z\"\n    }\n  ]\n}"
            },
            {
                "method": "POST",
                "path": "/api/v1/issues",
                "auth": "Bearer JWT (Student / Manager)",
                "desc": "Creates a new maintenance ticket in the user assigned residential hall.",
                "request_body": "{\n  \"title\": \"Faulty Ceiling Fan in Room 204\",\n  \"description\": \"The ceiling fan regulator sparks upon rotation and does not spin.\",\n  \"category\": \"electrical\",\n  \"priority\": \"high\",\n  \"location\": {\n    \"block\": \"Main Hall Annex\",\n    \"floor\": \"2nd Floor\",\n    \"room\": \"Room 204\"\n  },\n  \"images\": [\"https://res.cloudinary.com/.../fan.jpg\"]\n}",
                "response": "201 Created\n{\n  \"success\": true,\n  \"ticketNumber\": \"HF-2026-0043\",\n  \"issue\": { \"_id\": \"65b35...\", \"status\": \"submitted\" }\n}"
            },
            {
                "method": "GET",
                "path": "/api/v1/issues/:id",
                "auth": "Bearer JWT (Ownership / Hall Scoped)",
                "desc": "Retrieves complete issue details, assigned artisan profile, and full audit event timeline.",
                "request_body": "None",
                "response": "200 OK\n{\n  \"success\": true,\n  \"data\": {\n    \"_id\": \"65b35...\",\n    \"ticketNumber\": \"HF-2026-0043\",\n    \"title\": \"Faulty Ceiling Fan in Room 204\",\n    \"status\": \"acknowledged\",\n    \"events\": [\n      { \"eventType\": \"CREATED\", \"createdAt\": \"2026-03-12T08:10:00Z\" },\n      { \"eventType\": \"ACKNOWLEDGED\", \"createdAt\": \"2026-03-12T09:30:00Z\" }\n    ]\n  }\n}"
            },
            {
                "method": "PATCH",
                "path": "/api/v1/issues/:id/ack",
                "auth": "Bearer JWT (Hall Manager / Admin)",
                "desc": "Transitions ticket status from SUBMITTED to ACKNOWLEDGED (ADR 001).",
                "request_body": "{\n  \"notes\": \"Confirmed awareness. Inspection scheduled.\"\n}",
                "response": "200 OK\n{\n  \"success\": true,\n  \"status\": \"acknowledged\",\n  \"acknowledgedAt\": \"2026-03-12T09:30:00Z\"\n}"
            },
            {
                "method": "PATCH",
                "path": "/api/v1/issues/:id/reject",
                "auth": "Bearer JWT (Hall Manager / Admin)",
                "desc": "Rejects illegitimate or non-actionable ticket with mandatory reason note.",
                "request_body": "{\n  \"reason\": \"Private appliance fault. Resident must repair personal iron independently.\"\n}",
                "response": "200 OK\n{\n  \"success\": true,\n  \"status\": \"rejected\"\n}"
            },
            {
                "method": "POST",
                "path": "/api/v1/issues/:id/assign",
                "auth": "Bearer JWT (Hall Manager / Admin)",
                "desc": "Assigns acknowledged work order to an internal hall maintenance artisan.",
                "request_body": "{\n  \"artisanId\": \"65b11c...\",\n  \"instructions\": \"Please check fuse box in Annex B before replacing switch.\"\n}",
                "response": "200 OK\n{\n  \"success\": true,\n  \"assignedTo\": \"65b11c...\",\n  \"status\": \"acknowledged\"\n}"
            },
            {
                "method": "PATCH",
                "path": "/api/v1/issues/:id/status",
                "auth": "Bearer JWT (Artisan / Manager)",
                "desc": "Updates status to in_progress when artisan arrives at site.",
                "request_body": "{\n  \"status\": \"in_progress\",\n  \"notes\": \"Arrived at room. Work started.\"\n}",
                "response": "200 OK\n{\n  \"success\": true,\n  \"status\": \"in_progress\"\n}"
            },
            {
                "method": "PATCH",
                "path": "/api/v1/issues/:id/resolve",
                "auth": "Bearer JWT (Artisan / Manager)",
                "desc": "Marks work order resolved, records completion notes, and starts 48-hour student dispute timer.",
                "request_body": "{\n  \"notes\": \"Replaced ceiling fan capacitor and regulator switch. Operational.\",\n  \"completionPhoto\": \"https://res.cloudinary.com/.../resolved_fan.jpg\"\n}",
                "response": "200 OK\n{\n  \"success\": true,\n  \"status\": \"resolved\",\n  \"resolvedAt\": \"2026-03-13T11:15:00Z\",\n  \"disputeWindowClosesAt\": \"2026-03-15T11:15:00Z\"\n}"
            },
            {
                "method": "POST",
                "path": "/api/v1/issues/:id/reopen",
                "auth": "Bearer JWT (Reporting Student Owner)",
                "desc": "Disputes resolution within active 48-hour window and rolls back ticket status to REOPENED.",
                "request_body": "{\n  \"notes\": \"Fan hums loudly and shakes violently upon turning on. Problem not fixed.\"\n}",
                "response": "200 OK\n{\n  \"success\": true,\n  \"status\": \"reopened\"\n}"
            },
            {
                "method": "GET",
                "path": "/api/v1/analytics/halls",
                "auth": "Bearer JWT (University Admin / SysAdmin)",
                "desc": "Aggregates macro-level operational metrics across all campus halls.",
                "request_body": "None",
                "response": "200 OK\n{\n  \"success\": true,\n  \"totalIssues\": 248,\n  \"overallResolutionRate\": 88.4,\n  \"halls\": [\n    { \"name\": \"Commonwealth Hall\", \"total\": 45, \"mttrHours\": 18.2 },\n    { \"name\": \"Legon Hall\", \"total\": 38, \"mttrHours\": 14.5 }\n  ]\n}"
            },
            {
                "method": "GET",
                "path": "/api/v1/admin/users",
                "auth": "Bearer JWT (System Admin)",
                "desc": "Retrieves paginated user directory with role and hall filters.",
                "request_body": "Query Params: page=1&limit=25&role=hall_manager",
                "response": "200 OK\n{\n  \"success\": true,\n  \"users\": [\n    { \"_id\": \"65b11...\", \"name\": \"Grace Mensah\", \"role\": \"hall_manager\", \"isActive\": true }\n  ]\n}"
            },
            {
                "method": "POST",
                "path": "/api/v1/admin/users",
                "auth": "Bearer JWT (System Admin)",
                "desc": "Provisions new institutional user account with designated role and hall.",
                "request_body": "{\n  \"identifier\": \"11002345\",\n  \"name\": \"Peter Osei\",\n  \"email\": \"posei@ug.edu.gh\",\n  \"role\": \"maintenance\",\n  \"residence\": \"65b10...\",\n  \"trade\": \"plumbing\"\n}",
                "response": "201 Created\n{\n  \"success\": true,\n  \"user\": { \"_id\": \"65b99...\", \"identifier\": \"11002345\", \"role\": \"maintenance\" }\n}"
            }
        ]
    },
    "appendix_b": {
        "title": "APPENDIX B: DATABASE SCHEMAS AND MONGOOSE DATA MODEL DEFINITIONS",
        "description": "Full uncompressed TypeScript code listings defining the core Mongoose schemas for User, Issue, IssueEvent, and Assignment aggregates.",
        "user_model_code": (
            "import { Schema, model, Document, Types } from 'mongoose';\n\n"
            "export interface IUser extends Document {\n"
            "  identifier: string;\n"
            "  name: string;\n"
            "  email: string;\n"
            "  phone?: string;\n"
            "  passwordHash: string;\n"
            "  role: 'student' | 'hall_manager' | 'maintenance' | 'university_admin' | 'system_admin';\n"
            "  residence?: Types.ObjectId;\n"
            "  room?: string;\n"
            "  trade?: 'plumbing' | 'electrical' | 'carpentry' | 'masonry' | 'other';\n"
            "  isActive: boolean;\n"
            "  createdAt: Date;\n"
            "  updatedAt: Date;\n"
            "}\n\n"
            "const UserSchema = new Schema<IUser>({\n"
            "  identifier: { type: String, required: true, unique: true, trim: true, index: true },\n"
            "  name: { type: String, required: true, trim: true },\n"
            "  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },\n"
            "  phone: { type: String, trim: true },\n"
            "  passwordHash: { type: String, required: true },\n"
            "  role: {\n"
            "    type: String,\n"
            "    required: true,\n"
            "    enum: ['student', 'hall_manager', 'maintenance', 'university_admin', 'system_admin'],\n"
            "    default: 'student'\n"
            "  },\n"
            "  residence: { type: Schema.Types.ObjectId, ref: 'Residence', index: true },\n"
            "  room: { type: String, trim: true },\n"
            "  trade: { type: String, enum: ['plumbing', 'electrical', 'carpentry', 'masonry', 'other'] },\n"
            "  isActive: { type: Boolean, default: true, required: true }\n"
            "}, { timestamps: true });\n\n"
            "export const UserModel = model<IUser>('User', UserSchema);"
        ),
        "issue_model_code": (
            "import { Schema, model, Document, Types } from 'mongoose';\n\n"
            "export interface IIssue extends Document {\n"
            "  ticketNumber: string;\n"
            "  title: string;\n"
            "  description: string;\n"
            "  category: 'plumbing' | 'electrical' | 'carpentry' | 'masonry' | 'other';\n"
            "  priority: 'low' | 'medium' | 'high' | 'urgent';\n"
            "  status: 'submitted' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed' | 'rejected' | 'reopened';\n"
            "  residence: Types.ObjectId;\n"
            "  location: {\n"
            "    block: string;\n"
            "    floor: string;\n"
            "    room: string;\n"
            "  };\n"
            "  reporter: Types.ObjectId;\n"
            "  assignedTo?: Types.ObjectId;\n"
            "  images: string[];\n"
            "  rejectionReason?: string;\n"
            "  resolutionNotes?: string;\n"
            "  isOverdue: boolean;\n"
            "  resolvedAt?: Date;\n"
            "  disputeWindowClosesAt?: Date;\n"
            "  closedAt?: Date;\n"
            "  createdAt: Date;\n"
            "  updatedAt: Date;\n"
            "}\n\n"
            "const IssueSchema = new Schema<IIssue>({\n"
            "  ticketNumber: { type: String, required: true, unique: true, index: true },\n"
            "  title: { type: String, required: true, trim: true, maxlength: 100 },\n"
            "  description: { type: String, required: true, trim: true, maxlength: 2000 },\n"
            "  category: {\n"
            "    type: String,\n"
            "    required: true,\n"
            "    enum: ['plumbing', 'electrical', 'carpentry', 'masonry', 'other'],\n"
            "    index: true\n"
            "  },\n"
            "  priority: {\n"
            "    type: String,\n"
            "    required: true,\n"
            "    enum: ['low', 'medium', 'high', 'urgent'],\n"
            "    default: 'medium'\n"
            "  },\n"
            "  status: {\n"
            "    type: String,\n"
            "    required: true,\n"
            "    enum: ['submitted', 'acknowledged', 'in_progress', 'resolved', 'closed', 'rejected', 'reopened'],\n"
            "    default: 'submitted',\n"
            "    index: true\n"
            "  },\n"
            "  residence: { type: Schema.Types.ObjectId, ref: 'Residence', required: true, index: true },\n"
            "  location: {\n"
            "    block: { type: String, required: true, trim: true },\n"
            "    floor: { type: String, required: true, trim: true },\n"
            "    room: { type: String, required: true, trim: true }\n"
            "  },\n"
            "  reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },\n"
            "  assignedTo: { type: Schema.Types.ObjectId, ref: 'User', index: true },\n"
            "  images: [{ type: String }],\n"
            "  rejectionReason: { type: String, trim: true },\n"
            "  resolutionNotes: { type: String, trim: true },\n"
            "  isOverdue: { type: Boolean, default: false },\n"
            "  resolvedAt: { type: Date },\n"
            "  disputeWindowClosesAt: { type: Date },\n"
            "  closedAt: { type: Date }\n"
            "}, { timestamps: true });\n\n"
            "IssueSchema.index({ residence: 1, status: 1, createdAt: -1 });\n"
            "IssueSchema.index({ reporter: 1, createdAt: -1 });\n"
            "IssueSchema.index({ title: 'text', description: 'text' });\n\n"
            "export const IssueModel = model<IIssue>('Issue', IssueSchema);"
        ),
        "issue_event_model_code": (
            "import { Schema, model, Document, Types } from 'mongoose';\n\n"
            "export interface IIssueEvent extends Document {\n"
            "  issue: Types.ObjectId;\n"
            "  eventType: 'CREATED' | 'ACKNOWLEDGED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'REOPENED' | 'CLOSED' | 'REJECTED';\n"
            "  previousStatus?: string;\n"
            "  newStatus: string;\n"
            "  triggeredBy: Types.ObjectId;\n"
            "  notes?: string;\n"
            "  createdAt: Date;\n"
            "}\n\n"
            "const IssueEventSchema = new Schema<IIssueEvent>({\n"
            "  issue: { type: Schema.Types.ObjectId, ref: 'Issue', required: true, index: true },\n"
            "  eventType: {\n"
            "    type: String,\n"
            "    required: true,\n"
            "    enum: ['CREATED', 'ACKNOWLEDGED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REOPENED', 'CLOSED', 'REJECTED']\n"
            "  },\n"
            "  previousStatus: { type: String },\n"
            "  newStatus: { type: String, required: true },\n"
            "  triggeredBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },\n"
            "  notes: { type: String, trim: true }\n"
            "}, { timestamps: { createdAt: true, updatedAt: false } });\n\n"
            "export const IssueEventModel = model<IIssueEvent>('IssueEvent', IssueEventSchema);"
        ),
        "assignment_model_code": (
            "import { Schema, model, Document, Types } from 'mongoose';\n\n"
            "export interface IAssignment extends Document {\n"
            "  issue: Types.ObjectId;\n"
            "  artisan: Types.ObjectId;\n"
            "  assignedBy: Types.ObjectId;\n"
            "  instructions?: string;\n"
            "  status: 'active' | 'completed' | 'reassigned' | 'cancelled';\n"
            "  createdAt: Date;\n"
            "  updatedAt: Date;\n"
            "}\n\n"
            "const AssignmentSchema = new Schema<IAssignment>({\n"
            "  issue: { type: Schema.Types.ObjectId, ref: 'Issue', required: true, index: true },\n"
            "  artisan: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },\n"
            "  assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },\n"
            "  instructions: { type: String, trim: true },\n"
            "  status: {\n"
            "    type: String,\n"
            "    required: true,\n"
            "    enum: ['active', 'completed', 'reassigned', 'cancelled'],\n"
            "    default: 'active'\n"
            "  }\n"
            "}, { timestamps: true });\n\n"
            "export const AssignmentModel = model<IAssignment>('Assignment', AssignmentSchema);"
        )
    },
    "appendix_c": {
        "title": "APPENDIX C: AUTOMATED TEST SUITE IMPLEMENTATION CODE",
        "description": "Representative TypeScript implementation code for Jest integration tests verifying authentication, scoped role authorization, and state transitions.",
        "test_code": (
            "import request from 'supertest';\n"
            "import { app } from '../src/app';\n"
            "import { UserModel } from '../src/modules/users/user.model';\n"
            "import { IssueModel } from '../src/modules/issues/issue.model';\n\n"
            "describe('Issue Lifecycle & Scoped Authorization (ADR 001)', () => {\n"
            "  let studentToken: string;\n"
            "  let managerTokenLegon: string;\n"
            "  let managerTokenCommonwealth: string;\n"
            "  let testIssueId: string;\n\n"
            "  beforeAll(async () => {\n"
            "    studentToken = await loginAs('student', '65b10...LegonHall');\n"
            "    managerTokenLegon = await loginAs('hall_manager', '65b10...LegonHall');\n"
            "    managerTokenCommonwealth = await loginAs('hall_manager', '65b20...CommonwealthHall');\n"
            "  });\n\n"
            "  it('TC-ISSUE-01: should allow student to submit an issue', async () => {\n"
            "    const res = await request(app)\n"
            "      .post('/api/v1/issues')\n"
            "      .set('Authorization', `Bearer ${studentToken}`)\n"
            "      .send({\n"
            "        title: 'Burst Water Pipe',\n"
            "        description: 'Water spraying from main pipe under basin.',\n"
            "        category: 'plumbing',\n"
            "        priority: 'urgent',\n"
            "        location: { block: 'Annex A', floor: '1st', room: '104' }\n"
            "      });\n"
            "    expect(res.status).toBe(201);\n"
            "    expect(res.body.issue.status).toBe('submitted');\n"
            "    testIssueId = res.body.issue._id;\n"
            "  });\n\n"
            "  it('TC-MGR-02: should block Commonwealth manager from acknowledging Legon Hall issue', async () => {\n"
            "    const res = await request(app)\n"
            "      .patch(`/api/v1/issues/${testIssueId}/ack`)\n"
            "      .set('Authorization', `Bearer ${managerTokenCommonwealth}`)\n"
            "      .send({ notes: 'Cross hall attempt' });\n"
            "    expect(res.status).toBe(403);\n"
            "  });\n\n"
            "  it('TC-MGR-03: should allow Legon Hall manager to acknowledge issue', async () => {\n"
            "    const res = await request(app)\n"
            "      .patch(`/api/v1/issues/${testIssueId}/ack`)\n"
            "      .set('Authorization', `Bearer ${managerTokenLegon}`)\n"
            "      .send({ notes: 'Awareness confirmed' });\n"
            "    expect(res.status).toBe(200);\n"
            "    expect(res.body.status).toBe('acknowledged');\n"
            "  });\n"
            "});"
        )
    },
    "appendix_d": {
        "title": "APPENDIX D: SYSTEM DEPLOYMENT AND ENVIRONMENT CONFIGURATION GUIDE",
        "description": "Environment variables configuration, Dockerfile container specification, and PM2 process ecosystem script.",
        "env_config": (
            "# HostelFix Production Environment Configuration\n"
            "NODE_ENV=production\n"
            "PORT=5001\n"
            "CLIENT_URL=https://hostelfix.ug.edu.gh\n"
            "MONGO_URI=mongodb+srv://admin:secure_pass@cluster0.mongodb.net/hostelfix?retryWrites=true&w=majority\n"
            "JWT_ACCESS_SECRET=c28f9d0e14a74b28a9b31d5823761e0f84a1e9c2b3d4f5\n"
            "JWT_ACCESS_EXPIRES_IN=15m\n"
            "JWT_REFRESH_SECRET=7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d\n"
            "JWT_REFRESH_EXPIRES_IN=7d\n"
            "CLOUDINARY_CLOUD_NAME=ug-hostelfix\n"
            "CLOUDINARY_API_KEY=892341829384712\n"
            "CLOUDINARY_API_SECRET=k9J2mP1qR8sT4vW7xZ0\n"
            "DISPUTE_WINDOW_HOURS=48\n"
            "SLA_URGENT_HOURS=12\n"
            "SLA_HIGH_HOURS=24\n"
            "SLA_MEDIUM_HOURS=48\n"
            "SLA_LOW_HOURS=96"
        ),
        "docker_config": (
            "FROM node:20-alpine AS builder\n"
            "WORKDIR /app\n"
            "RUN npm install -g pnpm\n"
            "COPY package.json pnpm-lock.yaml ./\n"
            "RUN pnpm install --frozen-lockfile\n"
            "COPY . .\n"
            "RUN pnpm build\n\n"
            "FROM node:20-alpine AS runner\n"
            "WORKDIR /app\n"
            "ENV NODE_ENV=production\n"
            "COPY --from=builder /app/dist ./dist\n"
            "COPY --from=builder /app/node_modules ./node_modules\n"
            "COPY package.json ./\n"
            "EXPOSE 5001\n"
            "USER node\n"
            "CMD [\"node\", \"dist/server.js\"]"
        ),
        "nginx_config": (
            "# Nginx Production Configuration for HostelFix\n"
            "server {\n"
            "    listen 80;\n"
            "    server_name hostelfix.ug.edu.gh;\n"
            "    return 301 https://$host$request_uri;\n"
            "}\n\n"
            "server {\n"
            "    listen 443 ssl http2;\n"
            "    server_name hostelfix.ug.edu.gh;\n"
            "    ssl_certificate /etc/letsencrypt/live/hostelfix.ug.edu.gh/fullchain.pem;\n"
            "    ssl_certificate_key /etc/letsencrypt/live/hostelfix.ug.edu.gh/privkey.pem;\n"
            "    ssl_protocols TLSv1.2 TLSv1.3;\n"
            "    ssl_ciphers HIGH:!aNULL:!MD5;\n\n"
            "    location /api/ {\n"
            "        proxy_pass http://localhost:5001;\n"
            "        proxy_http_version 1.1;\n"
            "        proxy_set_header Upgrade $http_upgrade;\n"
            "        proxy_set_header Connection 'upgrade';\n"
            "        proxy_set_header Host $host;\n"
            "        proxy_set_header X-Real-IP $remote_addr;\n"
            "        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n"
            "        proxy_set_header X-Forwarded-Proto $scheme;\n"
            "    }\n\n"
            "    location / {\n"
            "        proxy_pass http://localhost:3000;\n"
            "        proxy_http_version 1.1;\n"
            "        proxy_set_header Upgrade $http_upgrade;\n"
            "        proxy_set_header Connection 'upgrade';\n"
            "        proxy_set_header Host $host;\n"
            "    }\n"
            "}"
        )
    },
    "appendix_e": {
        "title": "APPENDIX E: USER ACCEPTANCE TESTING EVALUATION INSTRUMENT (SUS)",
        "description": "Standardized 10-Item System Usability Scale (SUS) instrument administered to 42 institutional participants.",
        "survey_items": [
            "1. I think that I would like to use the HostelFix platform frequently.",
            "2. I found the HostelFix platform unnecessarily complex.",
            "3. I thought the HostelFix platform was easy to use.",
            "4. I think that I would need the support of a technical person to be able to use this system.",
            "5. I found the various functions in the HostelFix platform were well integrated.",
            "6. I thought there was too much inconsistency in this system.",
            "7. I would imagine that most people would learn to use this system very quickly.",
            "8. I found the HostelFix platform very cumbersome or awkward to use.",
            "9. I felt very confident using the HostelFix platform.",
            "10. I needed to learn a lot of things before I could get going with this system."
        ]
    },
    "appendix_f": {
        "title": "APPENDIX F: AUDIT TRAIL AND SECURITY EVENT LOG SCHEMA",
        "description": "System event catalog, severity classifications, and compliance audit trail specification.",
        "events": [
            {"code": "AUTH_LOGIN_SUCCESS", "severity": "INFO", "desc": "User successfully authenticated credentials."},
            {"code": "AUTH_LOGIN_FAILURE", "severity": "WARN", "desc": "Failed login attempt with incorrect credentials."},
            {"code": "AUTH_TOKEN_ROTATED", "severity": "DEBUG", "desc": "Refresh token rotated and new JWT issued."},
            {"code": "AUTH_REPLAY_DETECTED", "severity": "CRITICAL", "desc": "Reused revoked refresh token detected. User sessions revoked."},
            {"code": "ISSUE_CREATED", "severity": "INFO", "desc": "New maintenance ticket logged in system."},
            {"code": "ISSUE_ACKNOWLEDGED", "severity": "INFO", "desc": "Hall manager confirmed awareness of ticket."},
            {"code": "ISSUE_REJECTED", "severity": "WARN", "desc": "Ticket rejected by manager with explanation note."},
            {"code": "ISSUE_ASSIGNED", "severity": "INFO", "desc": "Ticket assigned to maintenance staff member."},
            {"code": "ISSUE_RESOLVED", "severity": "INFO", "desc": "Artisan marked work order resolved. Dispute window open."},
            {"code": "ISSUE_REOPENED", "severity": "WARN", "desc": "Student resident disputed resolution within window."},
            {"code": "ISSUE_AUTO_CLOSED", "severity": "INFO", "desc": "Cron daemon closed ticket following dispute window lapse."},
            {"code": "SLA_BREACH_ESCALATED", "severity": "WARN", "desc": "Ticket exceeded SLA time limit. Escalation triggered."},
            {"code": "RBAC_ACCESS_DENIED", "severity": "WARN", "desc": "User attempted unauthorized cross-hall action."}
        ]
    }
}
