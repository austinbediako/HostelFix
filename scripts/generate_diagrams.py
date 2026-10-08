import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

out_dir = "/Users/kaeytee/Desktop/Joenick/HostelFix/docs/diagrams"
os.makedirs(out_dir, exist_ok=True)

def generate_architecture():
    fig, ax = plt.subplots(figsize=(10, 7), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Background canvas
    fig.patch.set_facecolor('#FFFFFF')
    ax.set_facecolor('#FFFFFF')

    # Layer 1: Client Presentation Layer
    p1 = patches.FancyBboxPatch((5, 78), 90, 16, boxstyle="round,pad=1.5", ec="#2B6CB0", fc="#EBF8FF", lw=2)
    ax.add_patch(p1)
    ax.text(50, 90, "CLIENT PRESENTATION LAYER", ha='center', va='center', fontsize=12, fontweight='bold', color="#2B6CB0", fontfamily='DejaVu Sans')
    ax.text(50, 83, "Next.js 16 (App Router) | React 19 Server Components | Tailwind CSS | Zustand | Sonner", ha='center', va='center', fontsize=9.5, color="#2D3748", fontfamily='DejaVu Sans')

    # Arrow 1 to 2
    ax.annotate("", xy=(50, 68), xytext=(50, 78), arrowprops=dict(arrowstyle="->", lw=2, color="#4A5568"))
    ax.text(51.5, 73, "HTTPS / REST API (HTTP-only Session Cookies)", ha='left', va='center', fontsize=8.5, color="#4A5568", fontweight='semibold')

    # Layer 2: API Backend Layer
    p2 = patches.FancyBboxPatch((5, 30), 90, 38, boxstyle="round,pad=1.5", ec="#2C7A7B", fc="#E6FFFA", lw=2)
    ax.add_patch(p2)
    ax.text(50, 64, "EXPRESS 5 & TYPESCRIPT MODULAR BACKEND", ha='center', va='center', fontsize=12, fontweight='bold', color="#234E52", fontfamily='DejaVu Sans')

    # Sub-modules inside backend
    modules = [
        ("Authentication Module", "JWT & Refresh Token Engine\nBcrypt Password Hashing", 8, 44),
        ("Issues Module", "Operational State Machine\nIssue Event Dispatcher", 38, 44),
        ("Residences Module", "Halls & Locations Directory\nTenant Boundary Enforcement", 68, 44),
        ("Audit Logs Module", "Security Event Logging\nImmutable Audit Trail", 8, 33),
        ("Notification Engine", "Email Delivery Service\nIn-App Alert Publisher", 38, 33),
        ("Background Jobs", "BullMQ Task Queue Manager\nAutomated 48h Dispute Cron", 68, 33)
    ]

    for title, desc, x, y in modules:
        box = patches.FancyBboxPatch((x, y), 24, 8.5, boxstyle="round,pad=0.8", ec="#319795", fc="#FFFFFF", lw=1.2)
        ax.add_patch(box)
        ax.text(x + 12, y + 5.5, title, ha='center', va='center', fontsize=8, fontweight='bold', color="#285E61")
        ax.text(x + 12, y + 2.2, desc, ha='center', va='center', fontsize=6.8, color="#4A5568")

    # Arrow 2 to 3
    ax.annotate("", xy=(22, 17), xytext=(22, 30), arrowprops=dict(arrowstyle="->", lw=2, color="#4A5568"))
    ax.text(23, 23.5, "Mongoose ODM", ha='left', va='center', fontsize=8, color="#4A5568")

    ax.annotate("", xy=(50, 17), xytext=(50, 30), arrowprops=dict(arrowstyle="->", lw=2, color="#4A5568"))
    ax.text(51, 23.5, "BullMQ Queue", ha='left', va='center', fontsize=8, color="#4A5568")

    ax.annotate("", xy=(78, 17), xytext=(78, 30), arrowprops=dict(arrowstyle="->", lw=2, color="#4A5568"))
    ax.text(79, 23.5, "Media API", ha='left', va='center', fontsize=8, color="#4A5568")

    # Layer 3: Persistence & External Services
    p_db = patches.FancyBboxPatch((7, 3), 30, 14, boxstyle="round,pad=1", ec="#9B2C2C", fc="#FFF5F5", lw=1.8)
    ax.add_patch(p_db)
    ax.text(22, 12, "MONGODB CLUSTER", ha='center', va='center', fontsize=10, fontweight='bold', color="#742A2A")
    ax.text(22, 6.5, "Users, Halls, Locations,\nIssues, Events, AuditLogs", ha='center', va='center', fontsize=7.5, color="#4A5568")

    p_redis = patches.FancyBboxPatch((40, 3), 20, 14, boxstyle="round,pad=1", ec="#C05621", fc="#FFFAF0", lw=1.8)
    ax.add_patch(p_redis)
    ax.text(50, 12, "REDIS BROKER", ha='center', va='center', fontsize=10, fontweight='bold', color="#7B341E")
    ax.text(50, 6.5, "Job Queue Persistence\nScheduled Cron Timers", ha='center', va='center', fontsize=7.5, color="#4A5568")

    p_cld = patches.FancyBboxPatch((67, 3), 26, 14, boxstyle="round,pad=1", ec="#4C51BF", fc="#EBF4FF", lw=1.8)
    ax.add_patch(p_cld)
    ax.text(80, 12, "CLOUDINARY CDN", ha='center', va='center', fontsize=10, fontweight='bold', color="#3C366B")
    ax.text(80, 6.5, "Issue Photo Uploads\nCDN Image Optimization", ha='center', va='center', fontsize=7.5, color="#4A5568")

    path = os.path.join(out_dir, "fig_3_1_architecture.png")
    plt.tight_layout()
    plt.savefig(path, dpi=300, facecolor='#FFFFFF')
    plt.close()
    print("Saved:", path)

def generate_state_machine():
    fig, ax = plt.subplots(figsize=(10, 6.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    fig.patch.set_facecolor('#FFFFFF')

    # States
    # Start node
    c_start = patches.Circle((10, 80), 3, fc="#2D3748", ec="#1A202C")
    ax.add_patch(c_start)
    ax.annotate("", xy=(22, 80), xytext=(13, 80), arrowprops=dict(arrowstyle="->", lw=2, color="#2D3748"))

    # SUBMITTED
    b_sub = patches.FancyBboxPatch((22, 73), 20, 14, boxstyle="round,pad=1", ec="#3182CE", fc="#EBF8FF", lw=2)
    ax.add_patch(b_sub)
    ax.text(32, 82, "SUBMITTED", ha='center', va='center', fontsize=10, fontweight='bold', color="#2B6CB0")
    ax.text(32, 77, "Student logs ticket\nvia web portal", ha='center', va='center', fontsize=7.5, color="#4A5568")

    # ACKNOWLEDGED
    b_ack = patches.FancyBboxPatch((22, 43), 20, 14, boxstyle="round,pad=1", ec="#DD6B20", fc="#FFFAF0", lw=2)
    ax.add_patch(b_ack)
    ax.text(32, 52, "ACKNOWLEDGED", ha='center', va='center', fontsize=10, fontweight='bold', color="#C05621")
    ax.text(32, 47, "Hall Manager confirms\ninstitutional awareness", ha='center', va='center', fontsize=7.5, color="#4A5568")

    # RESOLVED
    b_res = patches.FancyBboxPatch((22, 13), 20, 14, boxstyle="round,pad=1", ec="#38A169", fc="#F0FFF4", lw=2)
    ax.add_patch(b_res)
    ax.text(32, 22, "RESOLVED", ha='center', va='center', fontsize=10, fontweight='bold', color="#276749")
    ax.text(32, 17, "Artisan completes\nphysical repair", ha='center', va='center', fontsize=7.5, color="#4A5568")

    # CLOSED
    b_cls = patches.FancyBboxPatch((68, 13), 20, 14, boxstyle="round,pad=1", ec="#4A5568", fc="#EDF2F7", lw=2)
    ax.add_patch(b_cls)
    ax.text(78, 22, "CLOSED", ha='center', va='center', fontsize=10, fontweight='bold', color="#2D3748")
    ax.text(78, 17, "Dispute window expires\n(Terminal State)", ha='center', va='center', fontsize=7.5, color="#4A5568")

    # REJECTED
    b_rej = patches.FancyBboxPatch((68, 73), 20, 14, boxstyle="round,pad=1", ec="#E53E3E", fc="#FFF5F5", lw=2)
    ax.add_patch(b_rej)
    ax.text(78, 82, "REJECTED", ha='center', va='center', fontsize=10, fontweight='bold', color="#9B2C2C")
    ax.text(78, 77, "Invalid or duplicate\n(Terminal State)", ha='center', va='center', fontsize=7.5, color="#4A5568")

    # REOPENED
    b_rop = patches.FancyBboxPatch((45, 43), 20, 14, boxstyle="round,pad=1", ec="#805AD5", fc="#FAF5FF", lw=2)
    ax.add_patch(b_rop)
    ax.text(55, 52, "REOPENED", ha='center', va='center', fontsize=10, fontweight='bold', color="#553C9A")
    ax.text(55, 47, "Student disputes fix\nwithin 48 hours", ha='center', va='center', fontsize=7.5, color="#4A5568")

    # ARROWS
    # Submitted -> Acknowledged
    ax.annotate("", xy=(32, 57), xytext=(32, 73), arrowprops=dict(arrowstyle="->", lw=2, color="#4A5568"))
    ax.text(33, 65, "Acknowledge", ha='left', va='center', fontsize=8, color="#4A5568", fontweight='semibold')

    # Acknowledged -> Resolved
    ax.annotate("", xy=(32, 27), xytext=(32, 43), arrowprops=dict(arrowstyle="->", lw=2, color="#4A5568"))
    ax.text(33, 35, "Mark Resolved", ha='left', va='center', fontsize=8, color="#4A5568", fontweight='semibold')

    # Submitted -> Rejected
    ax.annotate("", xy=(68, 80), xytext=(42, 80), arrowprops=dict(arrowstyle="->", lw=2, color="#E53E3E"))
    ax.text(55, 83, "Reject Submission", ha='center', va='center', fontsize=8, color="#E53E3E", fontweight='semibold')

    # DIRECT RESOLUTION (Submitted -> Resolved curve)
    ax.annotate("", xy=(22, 20), xytext=(22, 80),
                arrowprops=dict(arrowstyle="->", lw=2, color="#2B6CB0", connectionstyle="arc3,rad=-0.45", ls="--"))
    ax.text(6.5, 50, "Direct Resolution\n(Emergency Offline Fix)", ha='center', va='center', fontsize=7.5, color="#2B6CB0", fontweight='bold')

    # Resolved -> Closed
    ax.annotate("", xy=(68, 20), xytext=(42, 20), arrowprops=dict(arrowstyle="->", lw=2, color="#276749"))
    ax.text(55, 16, "48h Dispute Expired\n(Auto-Close Job)", ha='center', va='center', fontsize=8, color="#276749", fontweight='semibold')

    # Resolved -> Reopened
    ax.annotate("", xy=(52, 43), xytext=(38, 27), arrowprops=dict(arrowstyle="->", lw=2, color="#805AD5"))
    ax.text(49, 33, "Dispute Fix", ha='left', va='center', fontsize=8, color="#805AD5", fontweight='semibold')

    # Reopened -> Resolved
    ax.annotate("", xy=(38, 24), xytext=(52, 43), arrowprops=dict(arrowstyle="->", lw=2, color="#38A169", ls=":"))
    ax.text(41, 38, "Re-resolve", ha='right', va='center', fontsize=8, color="#38A169", fontweight='semibold')

    path = os.path.join(out_dir, "fig_3_2_state_machine.png")
    plt.tight_layout()
    plt.savefig(path, dpi=300, facecolor='#FFFFFF')
    plt.close()
    print("Saved:", path)

def generate_erd():
    fig, ax = plt.subplots(figsize=(10, 7.5), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    fig.patch.set_facecolor('#FFFFFF')

    # Entities
    entities = [
        ("USER", 5, 60, 26, 32, [
            ("PK _id", "ObjectId"),
            ("studentId", "String (Unique)"),
            ("name", "String"),
            ("email", "String (Unique)"),
            ("role", "Enum (5 Roles)"),
            ("passwordHash", "String (Bcrypt)"),
            ("FK assignedHallIds", "ObjectId[]"),
            ("createdAt", "Date")
        ]),
        ("HALL", 38, 70, 24, 22, [
            ("PK _id", "ObjectId"),
            ("name", "String (Unique)"),
            ("code", "String (AKU, COM...)"),
            ("classification", "String (Traditional/UGEL)"),
            ("isActive", "Boolean")
        ]),
        ("LOCATION", 70, 68, 25, 24, [
            ("PK _id", "ObjectId"),
            ("FK hallId", "ObjectId"),
            ("block", "String"),
            ("floor", "Number"),
            ("room", "String"),
            ("isCommonArea", "Boolean")
        ]),
        ("ISSUE", 36, 15, 30, 42, [
            ("PK _id", "ObjectId"),
            ("referenceNumber", "String (Unique)"),
            ("title", "String"),
            ("description", "String"),
            ("category", "Enum (Plumbing, Elec..)"),
            ("priority", "Enum (Low, High..)"),
            ("status", "Enum (Submitted..)"),
            ("FK hallId", "ObjectId"),
            ("FK locationId", "ObjectId"),
            ("FK reporterId", "ObjectId"),
            ("FK assigneeId", "ObjectId (Optional)"),
            ("disputeExpiresAt", "Date")
        ]),
        ("ISSUE_EVENT", 72, 18, 25, 28, [
            ("PK _id", "ObjectId"),
            ("FK issueId", "ObjectId"),
            ("FK actorId", "ObjectId"),
            ("eventType", "String"),
            ("previousValue", "String"),
            ("newValue", "String"),
            ("createdAt", "Date")
        ]),
        ("AUDIT_LOG", 4, 18, 26, 26, [
            ("PK _id", "ObjectId"),
            ("FK actorId", "ObjectId"),
            ("action", "String (RoleChange..)"),
            ("targetResource", "String"),
            ("ipAddress", "String"),
            ("createdAt", "Date")
        ])
    ]

    for name, x, y, w, h, fields in entities:
        # Header box
        hdr = patches.FancyBboxPatch((x, y + h - 6), w, 6, boxstyle="square,pad=0", ec="#2B6CB0", fc="#2B6CB0", lw=1.5)
        ax.add_patch(hdr)
        ax.text(x + w/2, y + h - 3, name, ha='center', va='center', fontsize=9, fontweight='bold', color="#FFFFFF")

        # Body box
        body = patches.FancyBboxPatch((x, y), w, h - 6, boxstyle="square,pad=0", ec="#CBD5E0", fc="#F7FAFC", lw=1.5)
        ax.add_patch(body)

        # Field items
        cur_y = y + h - 9
        for f_name, f_type in fields:
            is_pk = "PK" in f_name
            is_fk = "FK" in f_name
            col = "#C53030" if is_pk else ("#2B6CB0" if is_fk else "#2D3748")
            ax.text(x + 1.5, cur_y, f_name, ha='left', va='center', fontsize=6.8, fontweight='bold' if (is_pk or is_fk) else 'normal', color=col)
            ax.text(x + w - 1.5, cur_y, f_type, ha='right', va='center', fontsize=6.2, color="#718096")
            cur_y -= 3.2

    # Relationship connectors
    # Hall -> Location (1:N)
    ax.annotate("", xy=(70, 80), xytext=(62, 80), arrowprops=dict(arrowstyle="->", lw=1.8, color="#4A5568"))
    ax.text(66, 82, "1:N", ha='center', va='center', fontsize=8, color="#4A5568", fontweight='bold')

    # Location -> Issue (1:N)
    ax.annotate("", xy=(58, 57), xytext=(78, 68), arrowprops=dict(arrowstyle="->", lw=1.8, color="#4A5568"))
    ax.text(70, 61, "1:N", ha='center', va='center', fontsize=8, color="#4A5568", fontweight='bold')

    # User -> Issue (1:N Reporter)
    ax.annotate("", xy=(36, 45), xytext=(31, 65), arrowprops=dict(arrowstyle="->", lw=1.8, color="#4A5568"))
    ax.text(32, 53, "Reports (1:N)", ha='right', va='center', fontsize=7.5, color="#4A5568", fontweight='bold')

    # Issue -> IssueEvent (1:N)
    ax.annotate("", xy=(72, 32), xytext=(66, 32), arrowprops=dict(arrowstyle="->", lw=1.8, color="#4A5568"))
    ax.text(69, 34, "1:N", ha='center', va='center', fontsize=8, color="#4A5568", fontweight='bold')

    # User -> AuditLog (1:N)
    ax.annotate("", xy=(16, 44), xytext=(16, 60), arrowprops=dict(arrowstyle="->", lw=1.8, color="#4A5568"))
    ax.text(17.5, 52, "Generates (1:N)", ha='left', va='center', fontsize=7.5, color="#4A5568", fontweight='bold')

    path = os.path.join(out_dir, "fig_3_3_erd.png")
    plt.tight_layout()
    plt.savefig(path, dpi=300, facecolor='#FFFFFF')
    plt.close()
    print("Saved:", path)

if __name__ == "__main__":
    generate_architecture()
    generate_state_machine()
    generate_erd()
