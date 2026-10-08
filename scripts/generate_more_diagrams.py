import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

out_dir = "/Users/kaeytee/Desktop/Joenick/HostelFix/docs/diagrams"
os.makedirs(out_dir, exist_ok=True)

def generate_use_case():
    fig, ax = plt.subplots(figsize=(11, 8.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    fig.patch.set_facecolor('#FFFFFF')

    # System boundary
    boundary = patches.FancyBboxPatch((28, 4), 48, 92, boxstyle="square,pad=0", ec="#2B6CB0", fc="#F7FAFC", lw=2)
    ax.add_patch(boundary)
    ax.text(52, 93, "HostelFix Maintenance System Boundary", ha='center', va='center', fontsize=11, fontweight='bold', color="#2B6CB0")

    # Actors on Left
    actors_left = [
        ("Student Resident", 12, 70),
        ("Hall Manager", 12, 35)
    ]
    for name, x, y in actors_left:
        # stick figure head
        c = patches.Circle((x, y + 4), 2, fc="#ED8936", ec="#C05621", lw=1.5)
        ax.add_patch(c)
        ax.plot([x, x], [y + 2, y - 3], color="#C05621", lw=2)
        ax.plot([x - 3, x + 3], [y, y], color="#C05621", lw=2)
        ax.plot([x, x - 2.5], [y - 3, y - 7], color="#C05621", lw=2)
        ax.plot([x, x + 2.5], [y - 3, y - 7], color="#C05621", lw=2)
        ax.text(x, y - 10, name, ha='center', va='center', fontsize=9, fontweight='bold', color="#2D3748")

    # Actors on Right
    actors_right = [
        ("Maintenance Staff", 90, 70),
        ("University Admin", 90, 42),
        ("System Admin", 90, 18)
    ]
    for name, x, y in actors_right:
        c = patches.Circle((x, y + 3), 1.8, fc="#4299E1", ec="#2B6CB0", lw=1.5)
        ax.add_patch(c)
        ax.plot([x, x], [y + 1.2, y - 3], color="#2B6CB0", lw=2)
        ax.plot([x - 2.5, x + 2.5], [y, y], color="#2B6CB0", lw=2)
        ax.plot([x, x - 2], [y - 3, y - 6.5], color="#2B6CB0", lw=2)
        ax.plot([x, x + 2], [y - 3, y - 6.5], color="#2B6CB0", lw=2)
        ax.text(x, y - 9, name, ha='center', va='center', fontsize=8.5, fontweight='bold', color="#2D3748")

    # Use Cases (Ellipses)
    use_cases = [
        ("UC-01: Authenticate with ID & PIN", 52, 86, ["Student", "Hall Manager", "Maintenance", "Uni Admin", "Sys Admin"]),
        ("UC-02: Submit Maintenance Ticket", 52, 76, ["Student", "Hall Manager"]),
        ("UC-03: View Personal Issue History", 52, 66, ["Student"]),
        ("UC-04: Dispute Resolution (Reopen)", 52, 57, ["Student"]),
        ("UC-05: Acknowledge Submitted Issue", 52, 48, ["Hall Manager", "Sys Admin"]),
        ("UC-06: Assign Artisan to Issue", 52, 39, ["Hall Manager", "Sys Admin"]),
        ("UC-07: Update Status to Resolved", 52, 30, ["Maintenance", "Hall Manager", "Sys Admin"]),
        ("UC-08: View Cross-Hall Analytics", 52, 21, ["Uni Admin", "Sys Admin"]),
        ("UC-09: Manage Users & Hall Roles", 52, 12, ["Sys Admin"]),
        ("UC-10: Automated Auto-Closure Job", 52, 5.5, ["System Worker"])
    ]

    for uc_text, x, y, _ in use_cases:
        ellipse = patches.FancyBboxPatch((x - 17, y - 3), 34, 6, boxstyle="round,pad=0.5", ec="#319795", fc="#E6FFFA", lw=1.2)
        ax.add_patch(ellipse)
        ax.text(x, y, uc_text, ha='center', va='center', fontsize=7.8, fontweight='semibold', color="#234E52")

    # Association lines
    # Student connections
    for uc_y in [86, 76, 66, 57]:
        ax.plot([14, 35], [67, uc_y], color="#CBD5E0", lw=1.2, ls="--")

    # Hall Manager connections
    for uc_y in [86, 76, 48, 39, 30]:
        ax.plot([14, 35], [32, uc_y], color="#CBD5E0", lw=1.2, ls="--")

    # Maintenance connections
    for uc_y in [86, 30]:
        ax.plot([88, 69], [67, uc_y], color="#CBD5E0", lw=1.2, ls="--")

    # Uni Admin connections
    for uc_y in [86, 21]:
        ax.plot([88, 69], [39, uc_y], color="#CBD5E0", lw=1.2, ls="--")

    # Sys Admin connections
    for uc_y in [86, 48, 39, 30, 21, 12]:
        ax.plot([88, 69], [15, uc_y], color="#CBD5E0", lw=1.2, ls="--")

    path = os.path.join(out_dir, "fig_3_3_use_case_diagram.png")
    plt.tight_layout()
    plt.savefig(path, dpi=300, facecolor='#FFFFFF')
    plt.close()
    print("Saved:", path)

def generate_component_diagram():
    fig, ax = plt.subplots(figsize=(11, 7.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    fig.patch.set_facecolor('#FFFFFF')

    # Subsystems
    # 1. Frontend Subsystem
    p_fe = patches.FancyBboxPatch((4, 52), 42, 42, boxstyle="round,pad=1", ec="#3182CE", fc="#EBF8FF", lw=2)
    ax.add_patch(p_fe)
    ax.text(25, 91, "<<Component>> Frontend Subsystem (Next.js 16)", ha='center', va='center', fontsize=9.5, fontweight='bold', color="#2B6CB0")
    
    fe_comps = [
        ("Auth Client (Login / JWT Cookie)", 25, 82),
        ("Student Portal (Form / List / Detail)", 25, 73),
        ("Manager & Admin Dashboards", 25, 64),
        ("TanStack React Query Cache", 25, 55)
    ]
    for text, cx, cy in fe_comps:
        b = patches.FancyBboxPatch((cx - 18, cy - 3), 36, 6, boxstyle="square,pad=0", ec="#63B3ED", fc="#FFFFFF", lw=1)
        ax.add_patch(b)
        ax.text(cx, cy, text, ha='center', va='center', fontsize=8, color="#2D3748")

    # 2. API Gateway & Backend Subsystem
    p_be = patches.FancyBboxPatch((54, 30), 42, 64, boxstyle="round,pad=1", ec="#2C7A7B", fc="#E6FFFA", lw=2)
    ax.add_patch(p_be)
    ax.text(75, 91, "<<Component>> Backend API (Express 5 & TypeScript)", ha='center', va='center', fontsize=9.5, fontweight='bold', color="#234E52")

    be_comps = [
        ("Auth Controller & Service", 75, 82),
        ("Issues Controller & Service", 75, 73),
        ("Residences Controller & Service", 75, 64),
        ("Policy & Authorization Middleware", 75, 55),
        ("Audit Logging Service", 75, 46),
        ("BullMQ Job Queue Processor", 75, 37)
    ]
    for text, cx, cy in be_comps:
        b = patches.FancyBboxPatch((cx - 18, cy - 3), 36, 6, boxstyle="square,pad=0", ec="#4FD1C5", fc="#FFFFFF", lw=1)
        ax.add_patch(b)
        ax.text(cx, cy, text, ha='center', va='center', fontsize=8, color="#2D3748")

    # Inter-component arrow (Frontend -> Backend)
    ax.annotate("", xy=(54, 73), xytext=(46, 73), arrowprops=dict(arrowstyle="->", lw=2, color="#2B6CB0"))
    ax.text(50, 76, "REST / JSON\n(Cookies)", ha='center', va='center', fontsize=7.5, color="#2B6CB0", fontweight='bold')

    # 3. Persistence & Infrastructure Layer
    p_inf = patches.FancyBboxPatch((4, 4), 92, 22, boxstyle="round,pad=1", ec="#805AD5", fc="#FAF5FF", lw=2)
    ax.add_patch(p_inf)
    ax.text(50, 23.5, "<<Infrastructure>> Persistence, Caching & Cloud Media", ha='center', va='center', fontsize=9.5, fontweight='bold', color="#553C9A")

    inf_boxes = [
        ("MongoDB Primary Database\n(Mongoose ODM)", 20, 12, "#9B2C2C", "#FFF5F5"),
        ("Redis Memory Broker\n(BullMQ Crons)", 50, 12, "#C05621", "#FFFAF0"),
        ("Cloudinary Cloud Media\n(Photo CDN)", 80, 12, "#2B6CB0", "#EBF8FF")
    ]
    for title, cx, cy, col_ec, col_fc in inf_boxes:
        b = patches.FancyBboxPatch((cx - 12, cy - 5), 24, 10, boxstyle="square,pad=0", ec=col_ec, fc=col_fc, lw=1.2)
        ax.add_patch(b)
        ax.text(cx, cy, title, ha='center', va='center', fontsize=7.5, fontweight='bold', color=col_ec)

    # Connections down to infrastructure
    ax.annotate("", xy=(20, 17), xytext=(65, 30), arrowprops=dict(arrowstyle="->", lw=1.5, color="#718096"))
    ax.annotate("", xy=(50, 17), xytext=(75, 30), arrowprops=dict(arrowstyle="->", lw=1.5, color="#718096"))
    ax.annotate("", xy=(80, 17), xytext=(85, 30), arrowprops=dict(arrowstyle="->", lw=1.5, color="#718096"))

    path = os.path.join(out_dir, "fig_3_2_component_diagram.png")
    plt.tight_layout()
    plt.savefig(path, dpi=300, facecolor='#FFFFFF')
    plt.close()
    print("Saved:", path)

def generate_class_diagram():
    fig, ax = plt.subplots(figsize=(11, 8.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    fig.patch.set_facecolor('#FFFFFF')

    classes = [
        ("User", 5, 55, 26, 40, [
            "+ idNumber: String",
            "+ name: String",
            "+ email: String",
            "+ role: UserRole",
            "+ passwordHash: String",
            "+ assignedHallIds: ObjectId[]"
        ], [
            "+ verifyPin(pin: String): Boolean",
            "+ generateJwt(): String",
            "+ canAccessHall(hallId): Boolean"
        ]),
        ("Hall", 38, 70, 24, 25, [
            "+ name: String",
            "+ code: String",
            "+ classification: String",
            "+ isActive: Boolean"
        ], [
            "+ getLocations(): Location[]",
            "+ getActiveIssues(): Issue[]"
        ]),
        ("Location", 70, 68, 26, 27, [
            "+ hallId: ObjectId",
            "+ block: String",
            "+ floor: Number",
            "+ room: String",
            "+ isCommonArea: Boolean"
        ], [
            "+ getFormattedName(): String"
        ]),
        ("Issue", 36, 12, 30, 48, [
            "+ referenceNumber: String",
            "+ title: String",
            "+ description: String",
            "+ category: CategoryEnum",
            "+ priority: PriorityEnum",
            "+ status: StatusEnum",
            "+ reporterId: ObjectId",
            "+ hallId: ObjectId",
            "+ locationId: ObjectId",
            "+ disputeExpiresAt: Date"
        ], [
            "+ acknowledge(actorId): Void",
            "+ resolve(actorId, notes): Void",
            "+ reopen(studentId, reason): Void",
            "+ autoClose(): Void"
        ]),
        ("IssueEvent", 72, 16, 25, 35, [
            "+ issueId: ObjectId",
            "+ actorId: ObjectId",
            "+ eventType: String",
            "+ previousValue: String",
            "+ newValue: String",
            "+ createdAt: Date"
        ], [
            "+ formatAuditEntry(): String"
        ]),
        ("AuditLog", 4, 12, 26, 32, [
            "+ actorId: ObjectId",
            "+ action: String",
            "+ targetResource: String",
            "+ ipAddress: String",
            "+ userAgent: String",
            "+ createdAt: Date"
        ], [
            "+ logSecurityEvent(): Void"
        ])
    ]

    for name, x, y, w, h, attrs, methods in classes:
        # Title bar
        hdr = patches.FancyBboxPatch((x, y + h - 5.5), w, 5.5, boxstyle="square,pad=0", ec="#2B6CB0", fc="#2B6CB0", lw=1.5)
        ax.add_patch(hdr)
        ax.text(x + w/2, y + h - 2.8, name, ha='center', va='center', fontsize=9, fontweight='bold', color="#FFFFFF")

        # Outer body
        body = patches.FancyBboxPatch((x, y), w, h - 5.5, boxstyle="square,pad=0", ec="#A0AEC0", fc="#FFFFFF", lw=1.2)
        ax.add_patch(body)

        # Attribute section
        cur_y = y + h - 8
        for attr in attrs:
            ax.text(x + 1.2, cur_y, attr, ha='left', va='center', fontsize=6.8, color="#2D3748")
            cur_y -= 2.6

        # Divider line
        div_y = cur_y - 0.5
        ax.plot([x, x + w], [div_y, div_y], color="#CBD5E0", lw=1)

        # Methods section
        cur_y = div_y - 2.2
        for m in methods:
            ax.text(x + 1.2, cur_y, m, ha='left', va='center', fontsize=6.8, color="#2B6CB0", fontfamily='monospace')
            cur_y -= 2.6

    # Relationships
    # Hall -> Location (1 to *)
    ax.annotate("", xy=(70, 80), xytext=(62, 80), arrowprops=dict(arrowstyle="->", lw=1.5, color="#4A5568"))
    ax.text(66, 82, "1..*", ha='center', va='center', fontsize=7.5, color="#4A5568")

    # Location -> Issue (1 to *)
    ax.annotate("", xy=(58, 55), xytext=(78, 68), arrowprops=dict(arrowstyle="->", lw=1.5, color="#4A5568"))
    ax.text(70, 60, "1..*", ha='center', va='center', fontsize=7.5, color="#4A5568")

    # User -> Issue (1 to * Reporter)
    ax.annotate("", xy=(36, 42), xytext=(31, 62), arrowprops=dict(arrowstyle="->", lw=1.5, color="#4A5568"))
    ax.text(32, 50, "1..*", ha='right', va='center', fontsize=7.5, color="#4A5568")

    # Issue -> IssueEvent (1 to *)
    ax.annotate("", xy=(72, 30), xytext=(66, 30), arrowprops=dict(arrowstyle="->", lw=1.5, color="#4A5568"))
    ax.text(69, 32, "1..*", ha='center', va='center', fontsize=7.5, color="#4A5568")

    path = os.path.join(out_dir, "fig_3_4_class_diagram.png")
    plt.tight_layout()
    plt.savefig(path, dpi=300, facecolor='#FFFFFF')
    plt.close()
    print("Saved:", path)

def generate_sequence_lifecycle():
    fig, ax = plt.subplots(figsize=(11, 7.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    fig.patch.set_facecolor('#FFFFFF')

    # Lifelines
    lifelines = [
        ("Student", 12),
        ("Next.js Client", 32),
        ("Express API", 54),
        ("Issue Service", 72),
        ("MongoDB", 90)
    ]

    for name, x in lifelines:
        b = patches.FancyBboxPatch((x - 8, 92), 16, 5, boxstyle="square,pad=0", ec="#2B6CB0", fc="#EBF8FF", lw=1.2)
        ax.add_patch(b)
        ax.text(x, 94.5, name, ha='center', va='center', fontsize=8, fontweight='bold', color="#2B6CB0")
        ax.plot([x, x], [92, 8], color="#CBD5E0", lw=1, ls="--")

    # Messages
    msgs = [
        (86, 12, 32, "1. Select hall, room, category & enter description", "#2B6CB0"),
        (78, 32, 54, "2. POST /api/v1/issues (with Bearer Token)", "#2B6CB0"),
        (70, 54, 72, "3. validateRequest(createIssueSchema)", "#2D3748"),
        (62, 72, 90, "4. Issue.create({ status: 'submitted' })", "#9B2C2C"),
        (54, 90, 72, "5. Return saved issue document & referenceNumber", "#9B2C2C"),
        (46, 72, 90, "6. IssueEvent.create({ eventType: 'created' })", "#9B2C2C"),
        (38, 72, 54, "7. Return populated issue entity", "#2D3748"),
        (30, 54, 32, "8. HTTP 201 Created (JSON Response)", "#276749"),
        (22, 32, 12, "9. Render toast & redirect to Issue Detail", "#276749")
    ]

    for y, x1, x2, text, col in msgs:
        ax.annotate("", xy=(x2, y), xytext=(x1, y), arrowprops=dict(arrowstyle="->", lw=1.5, color=col))
        mid_x = (x1 + x2) / 2
        ax.text(mid_x, y + 1.8, text, ha='center', va='bottom', fontsize=7.2, fontweight='semibold', color=col)

    path = os.path.join(out_dir, "fig_3_5_sequence_issue_lifecycle.png")
    plt.tight_layout()
    plt.savefig(path, dpi=300, facecolor='#FFFFFF')
    plt.close()
    print("Saved:", path)

def generate_sequence_auth():
    fig, ax = plt.subplots(figsize=(11, 7.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    fig.patch.set_facecolor('#FFFFFF')

    lifelines = [
        ("User (Browser)", 15),
        ("Auth Controller", 40),
        ("Auth Service", 65),
        ("MongoDB (User Model)", 90)
    ]
    for name, x in lifelines:
        b = patches.FancyBboxPatch((x - 10, 92), 20, 5, boxstyle="square,pad=0", ec="#C05621", fc="#FFFAF0", lw=1.2)
        ax.add_patch(b)
        ax.text(x, 94.5, name, ha='center', va='center', fontsize=8, fontweight='bold', color="#C05621")
        ax.plot([x, x], [92, 8], color="#CBD5E0", lw=1, ls="--")

    msgs = [
        (85, 15, 40, "1. POST /api/v1/auth/login { id: '11287773', pin: '12345' }", "#C05621"),
        (76, 40, 65, "2. login(id, pin)", "#2D3748"),
        (67, 65, 90, "3. User.findOne({ studentId }).select('+passwordHash')", "#9B2C2C"),
        (58, 90, 65, "4. Return user document with passwordHash", "#9B2C2C"),
        (49, 65, 65, "5. bcrypt.compare(pin, user.passwordHash) -> true", "#276749"),
        (40, 65, 40, "6. Generate JWT (15m) & opaque Refresh Token (7d)", "#2B6CB0"),
        (31, 40, 15, "7. Set-Cookie: refreshToken (HttpOnly, SameSite=Strict)", "#276749"),
        (22, 40, 15, "8. HTTP 200 OK { user, accessToken }", "#276749")
    ]

    for y, x1, x2, text, col in msgs:
        if x1 == x2:
            # self call
            ax.annotate("", xy=(x1 + 3, y - 3), xytext=(x1, y), arrowprops=dict(arrowstyle="->", lw=1.5, color=col, connectionstyle="arc3,rad=-0.5"))
            ax.text(x1 + 5, y - 1.5, text, ha='left', va='center', fontsize=7.2, color=col, fontweight='semibold')
        else:
            ax.annotate("", xy=(x2, y), xytext=(x1, y), arrowprops=dict(arrowstyle="->", lw=1.5, color=col))
            mid_x = (x1 + x2) / 2
            ax.text(mid_x, y + 1.8, text, ha='center', va='bottom', fontsize=7.2, fontweight='semibold', color=col)

    path = os.path.join(out_dir, "fig_3_6_sequence_auth_jwt.png")
    plt.tight_layout()
    plt.savefig(path, dpi=300, facecolor='#FFFFFF')
    plt.close()
    print("Saved:", path)

def generate_network_topology():
    fig, ax = plt.subplots(figsize=(11, 7.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    fig.patch.set_facecolor('#FFFFFF')

    # Clients
    p_cli = patches.FancyBboxPatch((4, 60), 20, 28, boxstyle="round,pad=1", ec="#2B6CB0", fc="#EBF8FF", lw=1.5)
    ax.add_patch(p_cli)
    ax.text(14, 84, "END-USER CLIENTS", ha='center', va='center', fontsize=9.5, fontweight='bold', color="#2B6CB0")
    ax.text(14, 76, "Mobile Smartphones\n(UG Wi-Fi / 4G)", ha='center', va='center', fontsize=8, color="#2D3748")
    ax.text(14, 66, "Desktop Workstations\n(Hall Offices)", ha='center', va='center', fontsize=8, color="#2D3748")

    # Cloudflare / Reverse Proxy
    p_edge = patches.FancyBboxPatch((32, 60), 18, 28, boxstyle="round,pad=1", ec="#DD6B20", fc="#FFFAF0", lw=1.5)
    ax.add_patch(p_edge)
    ax.text(41, 84, "EDGE / REVERSE PROXY", ha='center', va='center', fontsize=9, fontweight='bold', color="#C05621")
    ax.text(41, 74, "TLS Termination\n(HTTPS Port 443)\nDDoS Mitigation\nStatic Asset Caching", ha='center', va='center', fontsize=7.5, color="#2D3748")

    # Application Server
    p_app = patches.FancyBboxPatch((58, 48), 38, 46, boxstyle="round,pad=1", ec="#2C7A7B", fc="#E6FFFA", lw=1.8)
    ax.add_patch(p_app)
    ax.text(77, 90, "APPLICATION HOST ENVIRONMENT", ha='center', va='center', fontsize=10, fontweight='bold', color="#234E52")

    p_next = patches.FancyBboxPatch((60, 70), 34, 15, boxstyle="square,pad=0", ec="#3182CE", fc="#FFFFFF", lw=1.2)
    ax.add_patch(p_next)
    ax.text(77, 81, "Next.js 16 Web Server (Port 3000)", ha='center', va='center', fontsize=8.5, fontweight='bold', color="#2B6CB0")
    ax.text(77, 74, "Server-Side Rendering & Hydration", ha='center', va='center', fontsize=7.5, color="#718096")

    p_node = patches.FancyBboxPatch((60, 51), 34, 15, boxstyle="square,pad=0", ec="#2C7A7B", fc="#FFFFFF", lw=1.2)
    ax.add_patch(p_node)
    ax.text(77, 62, "Express 5 TypeScript API (Port 5001)", ha='center', va='center', fontsize=8.5, fontweight='bold', color="#234E52")
    ax.text(77, 55, "REST Controllers, Policy Engine, BullMQ", ha='center', va='center', fontsize=7.5, color="#718096")

    # Infrastructure Services (Bottom)
    p_mongo = patches.FancyBboxPatch((10, 10), 24, 26, boxstyle="round,pad=1", ec="#9B2C2C", fc="#FFF5F5", lw=1.5)
    ax.add_patch(p_mongo)
    ax.text(22, 31, "MONGODB CLUSTER", ha='center', va='center', fontsize=9, fontweight='bold', color="#9B2C2C")
    ax.text(22, 21, "Port 27017\nWiredTiger Engine\nReplication & Backup", ha='center', va='center', fontsize=7.5, color="#2D3748")

    p_redis = patches.FancyBboxPatch((42, 10), 22, 26, boxstyle="round,pad=1", ec="#C05621", fc="#FFFAF0", lw=1.5)
    ax.add_patch(p_redis)
    ax.text(53, 31, "REDIS INSTANCE", ha='center', va='center', fontsize=9, fontweight='bold', color="#C05621")
    ax.text(53, 21, "Port 6379\nIn-Memory Store\nBullMQ Queues", ha='center', va='center', fontsize=7.5, color="#2D3748")

    p_cld = patches.FancyBboxPatch((72, 10), 24, 26, boxstyle="round,pad=1", ec="#4C51BF", fc="#EBF4FF", lw=1.5)
    ax.add_patch(p_cld)
    ax.text(84, 31, "CLOUDINARY CDN", ha='center', va='center', fontsize=9, fontweight='bold', color="#4C51BF")
    ax.text(84, 21, "Cloud Media API\nGlobal Edge Caching\nImage Transformations", ha='center', va='center', fontsize=7.5, color="#2D3748")

    # Network Arrows
    ax.annotate("", xy=(32, 74), xytext=(24, 74), arrowprops=dict(arrowstyle="<->", lw=2, color="#4A5568"))
    ax.annotate("", xy=(58, 74), xytext=(50, 74), arrowprops=dict(arrowstyle="<->", lw=2, color="#4A5568"))
    ax.annotate("", xy=(77, 66), xytext=(77, 70), arrowprops=dict(arrowstyle="<->", lw=2, color="#4A5568"))

    ax.annotate("", xy=(22, 36), xytext=(65, 51), arrowprops=dict(arrowstyle="<->", lw=1.5, color="#9B2C2C"))
    ax.annotate("", xy=(53, 36), xytext=(75, 51), arrowprops=dict(arrowstyle="<->", lw=1.5, color="#C05621"))
    ax.annotate("", xy=(84, 36), xytext=(85, 51), arrowprops=dict(arrowstyle="<->", lw=1.5, color="#4C51BF"))

    path = os.path.join(out_dir, "fig_3_13_network_topology.png")
    plt.tight_layout()
    plt.savefig(path, dpi=300, facecolor='#FFFFFF')
    plt.close()
    print("Saved:", path)

def generate_flowcharts():
    # 1. Student Flowchart
    fig, ax = plt.subplots(figsize=(8, 10), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    fig.patch.set_facecolor('#FFFFFF')

    nodes = [
        ("Start: Discovers Defect", 50, 93, "oval", "#2D3748", "#EDF2F7"),
        ("Authenticate via Student ID & PIN", 50, 83, "rect", "#2B6CB0", "#EBF8FF"),
        ("Select Hall, Block, Floor, & Room", 50, 72, "rect", "#2B6CB0", "#EBF8FF"),
        ("Select Category & Urgency Priority", 50, 61, "rect", "#2B6CB0", "#EBF8FF"),
        ("Attach Photo of Defect? (Optional)", 50, 50, "diamond", "#DD6B20", "#FFFAF0"),
        ("Upload Image to Cloudinary CDN", 22, 40, "rect", "#4C51BF", "#EBF4FF"),
        ("Submit Report to Express API", 50, 31, "rect", "#2C7A7B", "#E6FFFA"),
        ("Receive Reference (HF-XXX-YYYYMMDD-XXXX)", 50, 20, "rect", "#276749", "#F0FFF4"),
        ("End: Monitor Status on Dashboard", 50, 9, "oval", "#2D3748", "#EDF2F7")
    ]

    for text, x, y, shape, ec, fc in nodes:
        if shape == "oval":
            p = patches.FancyBboxPatch((x - 20, y - 3), 40, 6, boxstyle="round,pad=1", ec=ec, fc=fc, lw=1.5)
        elif shape == "diamond":
            p = patches.FancyBboxPatch((x - 22, y - 3.5), 44, 7, boxstyle="round,pad=0.5", ec=ec, fc=fc, lw=1.5)
        else:
            p = patches.FancyBboxPatch((x - 20, y - 3), 40, 6, boxstyle="square,pad=0", ec=ec, fc=fc, lw=1.2)
        ax.add_patch(p)
        ax.text(x, y, text, ha='center', va='center', fontsize=8, fontweight='bold', color=ec)

    # Arrows
    ax.annotate("", xy=(50, 86), xytext=(50, 90), arrowprops=dict(arrowstyle="->", lw=1.5, color="#4A5568"))
    ax.annotate("", xy=(50, 75), xytext=(50, 80), arrowprops=dict(arrowstyle="->", lw=1.5, color="#4A5568"))
    ax.annotate("", xy=(50, 64), xytext=(50, 69), arrowprops=dict(arrowstyle="->", lw=1.5, color="#4A5568"))
    ax.annotate("", xy=(50, 53.5), xytext=(50, 58), arrowprops=dict(arrowstyle="->", lw=1.5, color="#4A5568"))

    # Diamond branches
    ax.annotate("", xy=(22, 43), xytext=(32, 50), arrowprops=dict(arrowstyle="->", lw=1.5, color="#DD6B20"))
    ax.text(26, 48, "Yes", ha='center', va='center', fontsize=7.5, color="#DD6B20", fontweight='bold')

    ax.annotate("", xy=(50, 34), xytext=(50, 46.5), arrowprops=dict(arrowstyle="->", lw=1.5, color="#4A5568"))
    ax.text(52, 41, "No", ha='left', va='center', fontsize=7.5, color="#4A5568")

    ax.annotate("", xy=(40, 31), xytext=(22, 37), arrowprops=dict(arrowstyle="->", lw=1.5, color="#4C51BF"))

    ax.annotate("", xy=(50, 23), xytext=(50, 28), arrowprops=dict(arrowstyle="->", lw=1.5, color="#4A5568"))
    ax.annotate("", xy=(50, 12), xytext=(50, 17), arrowprops=dict(arrowstyle="->", lw=1.5, color="#4A5568"))

    path = os.path.join(out_dir, "fig_3_8_flowchart_student_reporting.png")
    plt.tight_layout()
    plt.savefig(path, dpi=300, facecolor='#FFFFFF')
    plt.close()
    print("Saved:", path)

if __name__ == "__main__":
    generate_use_case()
    generate_component_diagram()
    generate_class_diagram()
    generate_sequence_lifecycle()
    generate_sequence_auth()
    generate_network_topology()
    generate_flowcharts()
