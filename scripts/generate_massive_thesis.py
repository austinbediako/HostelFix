# Master Thesis Generation Script for HostelFix 150+ Page Undergraduate Project Document
# Conforming strictly to Project Template - Undergraduate.docx and Thesis or Dissertation template.docx.pdf
# Candidate: Asante Gideon Kwadwo (11287773)
# Supervisor: Prof. Winfred Yaokumah
# Department of Computer Science, University of Ghana, Legon
# Date: March 2026

import os
import shutil
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

from scratch_ch1_data import CH1_DATA
from scratch_ch2_data import CH2_DATA

def build_full_thesis():
    print("Initializing Document Builder...")
    doc = docx.Document()

    # Base Normal Style
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(12)
    normal_style.font.color.rgb = RGBColor(0, 0, 0)
    normal_style.paragraph_format.line_spacing_rule = WD_LINE_SPACING.ONE_POINT_FIVE
    normal_style.paragraph_format.space_after = Pt(6)
    normal_style.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

    # XML Formatting Helpers
    def set_cell_background(cell, fill_hex):
        tcPr = cell._tc.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
        tcPr.append(shd)

    def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
        tcPr.append(tcMar)

    def add_page_number(run):
        fldSimple = parse_xml(r'<w:fldSimple %s w:instr="PAGE"/>' % nsdecls('w'))
        run._r.append(fldSimple)

    # Paragraph formatting helpers
    def p_title_center(text, size=14, bold=True, space_before=0, space_after=6):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.ONE_POINT_FIVE
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(size)
        run.font.bold = bold
        return p

    def p_body(text, space_after=6, bold_prefix=None, italic=False):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.ONE_POINT_FIVE
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = 'Times New Roman'
            r_pre.font.size = Pt(12)
            r_pre.font.bold = True
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(12)
        run.font.italic = italic
        return p

    def p_bullet(text, bold_prefix=None):
        p = doc.add_paragraph(style='List Bullet')
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.ONE_POINT_FIVE
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = 'Times New Roman'
            r_pre.font.size = Pt(12)
            r_pre.font.bold = True
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(12)
        return p

    def p_heading1(text, space_before=24, space_after=14):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(16)
        run.font.bold = True
        return p

    def p_heading2(text, space_before=16, space_after=8):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(14)
        run.font.bold = True
        return p

    def p_heading3(text, space_before=12, space_after=6):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(12)
        run.font.bold = True
        return p

    def p_heading4(text, space_before=8, space_after=4):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Times New Roman'
        run.font.size = Pt(12)
        run.font.bold = True
        run.font.italic = True
        return p

    def p_code(code_text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.left_indent = Inches(0.4)
        p.paragraph_format.line_spacing_rule = WD_LINE_SPACING.MULTIPLE
        p.paragraph_format.line_spacing = 1.15
        run = p.add_run(code_text)
        run.font.name = 'Courier New'
        run.font.size = Pt(9.5)
        run.font.color.rgb = RGBColor(40, 40, 40)
        return p

    def add_figure(img_path, caption):
        if os.path.exists(img_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(14)
            p_img.paragraph_format.space_after = Pt(6)
            run = p_img.add_run()
            run.add_picture(img_path, width=Inches(5.6))

            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_after = Pt(16)
            run_cap = p_cap.add_run(caption)
            run_cap.font.name = 'Times New Roman'
            run_cap.font.size = Pt(11)
            run_cap.font.bold = True
            run_cap.font.italic = True
        else:
            p_body(f"[Figure image not found at path: {img_path}]")

    def create_styled_table(headers, rows_data):
        table = doc.add_table(rows=len(rows_data) + 1, cols=len(headers))
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = False

        # Header Row
        hdr_cells = table.rows[0].cells
        for i, header_text in enumerate(headers):
            cell = hdr_cells[i]
            cell.text = header_text
            set_cell_background(cell, "E2E8F0")
            set_cell_margins(cell, top=120, bottom=120, left=140, right=140)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_after = Pt(0)
            for r in p.runs:
                r.font.name = 'Times New Roman'
                r.font.size = Pt(10)
                r.font.bold = True

        # Data Rows
        for r_idx, row_values in enumerate(rows_data):
            row_cells = table.rows[r_idx + 1].cells
            bg_color = "F7FAFC" if r_idx % 2 == 1 else "FFFFFF"
            for c_idx, val in enumerate(row_values):
                cell = row_cells[c_idx]
                cell.text = str(val)
                set_cell_background(cell, bg_color)
                set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
                p = cell.paragraphs[0]
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                p.paragraph_format.space_after = Pt(0)
                for r in p.runs:
                    r.font.name = 'Times New Roman'
                    r.font.size = Pt(10)

        p_spacer = doc.add_paragraph()
        p_spacer.paragraph_format.space_after = Pt(8)
        return table

    # -------------------------------------------------------------
    # SECTION 1: COVER & PRELIMINARY PAGES
    # -------------------------------------------------------------
    sec1 = doc.sections[0]
    sec1.top_margin = Inches(1.0)
    sec1.bottom_margin = Inches(1.0)
    sec1.left_margin = Inches(1.5)
    sec1.right_margin = Inches(1.0)
    sec1.different_first_page_header_footer = True

    pgNumType1 = parse_xml(r'<w:pgNumType %s w:fmt="lowerRoman" w:start="1"/>' % nsdecls('w'))
    sec1._sectPr.append(pgNumType1)

    # 1. COVER PAGE (PAGE 1)
    p_title_center("UNIVERSITY OF GHANA", size=16, bold=True, space_before=24, space_after=6)
    p_title_center("COLLEGE OF BASIC AND APPLIED SCIENCES", size=14, bold=True, space_before=0, space_after=20)

    ug_crest = "/Users/kaeytee/Desktop/Joenick/HostelFix/docs/diagrams/ug_crest.png"
    if os.path.exists(ug_crest):
        p_cr = doc.add_paragraph()
        p_cr.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cr.paragraph_format.space_before = Pt(6)
        p_cr.paragraph_format.space_after = Pt(20)
        r_cr = p_cr.add_run()
        r_cr.add_picture(ug_crest, width=Inches(2.2))

    p_title_center("DESIGN AND IMPLEMENTATION OF A ROLE-BASED MAINTENANCE REPORTING AND TRACKING SYSTEM FOR UNIVERSITY OF GHANA HALLS", size=15, bold=True, space_before=12, space_after=36)
    p_title_center("BY", size=12, bold=True, space_before=0, space_after=10)
    p_title_center("ASANTE GIDEON KWADWO", size=14, bold=True, space_before=0, space_after=6)
    p_title_center("(11287773)", size=12, bold=True, space_before=0, space_after=0)

    doc.add_page_break()

    # 2. SUBMITTAL PAGE (PAGE 2)
    p_title_center("DESIGN AND IMPLEMENTATION OF A ROLE-BASED MAINTENANCE REPORTING AND TRACKING SYSTEM FOR UNIVERSITY OF GHANA HALLS", size=15, bold=True, space_before=20, space_after=48)
    p_title_center("BY", size=12, bold=True, space_before=0, space_after=12)
    p_title_center("ASANTE GIDEON KWADWO", size=14, bold=True, space_before=0, space_after=6)
    p_title_center("(11287773)", size=12, bold=True, space_before=0, space_after=60)

    p_title_center("A PROJECT REPORT SUBMITTED TO THE DEPARTMENT OF COMPUTER SCIENCE, SCHOOL OF PHYSICAL AND MATHEMATICAL SCIENCES, COLLEGE OF BASIC AND APPLIED SCIENCES, UNIVERSITY OF GHANA", size=12, bold=True, space_before=0, space_after=18)
    p_title_center("IN PARTIAL FULFILLMENT OF THE AWARD OF DEGREE OF", size=12, bold=True, space_before=0, space_after=18)
    p_title_center("BACHELOR OF SCIENCE IN COMPUTER SCIENCE", size=13, bold=True, space_before=0, space_after=60)
    p_title_center("DEPARTMENT OF COMPUTER SCIENCE", size=13, bold=True, space_before=0, space_after=6)
    p_title_center("MARCH, 2026", size=12, bold=True, space_before=0, space_after=0)

    doc.add_page_break()

    # Preliminary Footer setup
    footer_sec1 = sec1.footer
    p_ft1 = footer_sec1.paragraphs[0]
    p_ft1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_ft1 = p_ft1.add_run()
    r_ft1.font.name = 'Times New Roman'
    r_ft1.font.size = Pt(11)
    add_page_number(r_ft1)

    # 3. DECLARATION (PAGE i)
    p_title_center("DECLARATION", size=16, bold=True, space_before=18, space_after=24)
    p_body("I hereby declare that this project report entitled \"Design and Implementation of a Role-Based Maintenance Reporting and Tracking System for University of Ghana Halls\" is my own original work, except where due acknowledgment has been made in the text. This work has not been submitted in whole or in part for a degree at this or any other university.")
    p_body("", space_after=20)
    p_body("STUDENT", bold_prefix="CANDIDATE: ")
    p_body("Asante Gideon Kwadwo", bold_prefix="Name: ")
    p_body("________________________________________          Date: ____________________", bold_prefix="Signature: ")
    p_body("", space_after=28)
    p_body("SUPERVISOR", bold_prefix="SUPERVISOR: ")
    p_body("Prof. Winfred Yaokumah", bold_prefix="Name: ")
    p_body("________________________________________          Date: ____________________", bold_prefix="Signature: ")

    doc.add_page_break()

    # 4. ABSTRACT (PAGE ii)
    p_title_center("ABSTRACT", size=16, bold=True, space_before=18, space_after=24)
    p_body("HostelFix is a web-based maintenance reporting and tracking system engineered specifically for student residential halls across the University of Ghana, Legon campus. It resolves long-standing inefficiencies associated with traditional, fragmented maintenance handling methods such as verbal reporting, manual paper logbooks, informal messaging applications, and uncoordinated telephone calls.", bold_prefix="Context: ")
    p_body("The primary aim of this study is to design and implement a role-based digital operational record that bridges the communication divide between student residents, hall managers, maintenance technicians, university administrators, and system administrators, establishing strict accountability without disrupting rapid on-the-ground repair processes.", bold_prefix="Aim: ")
    p_body("An iterative Agile software development methodology was employed. The architecture was implemented as a modular monolith featuring a Next.js 16 frontend with Tailwind CSS and React Hook Form, an Express 5 and TypeScript backend API, and a MongoDB database managed via Mongoose. Object-level authorization, role-based access control, cryptographic JWT session management with HTTP-only refresh tokens, and BullMQ background job queues were integrated.", bold_prefix="Method: ")
    p_body("The system was thoroughly validated through 48 automated tests across unit, integration, and security layers with a 100% pass rate. Automated Playwright browser tests verified seamless multi-role authentication and navigation. The simplified workflow (Submitted -> Acknowledged -> Resolved -> Closed) eliminated administrative bottlenecks, while the 48-hour dispute window ensured student confirmation before automated closure.", bold_prefix="Result: ")
    p_body("HostelFix successfully demonstrates that aligning software lifecycles with the physical realities of university facility management delivers superior traceability, enhanced student satisfaction, and actionable institutional analytics without administrative friction.", bold_prefix="Conclusion: ")
    p_body("maintenance reporting, role-based access control, university halls, MongoDB, Next.js, Express, facility management, audit trail.", bold_prefix="Keywords: ")

    doc.add_page_break()

    # 5. DEDICATION (PAGE iii)
    p_title_center("DEDICATION", size=16, bold=True, space_before=18, space_after=24)
    p_body("This work is dedicated to my family, whose continuous support, encouragement, and prayers sustained me throughout my academic pursuits.")
    p_body("It is also dedicated to the hardworking hall management staff, porters, and maintenance personnel of the University of Ghana, who labor daily to ensure the welfare and comfort of student residents.")

    doc.add_page_break()

    # 6. ACKNOWLEDGEMENT (PAGE iv)
    p_title_center("ACKNOWLEDGEMENT", size=16, bold=True, space_before=18, space_after=24)
    p_body("I would like to express my profound gratitude to my supervisor, Prof. Winfred Yaokumah, for his invaluable guidance, scholarly advice, constructive critique, and continuous encouragement throughout the conception, design, and implementation of this project.")
    p_body("I extend my sincere appreciation to the faculty and staff of the Department of Computer Science, University of Ghana, for providing an intellectually rigorous environment and technical foundation during my undergraduate studies.")
    p_body("Special thanks go to the Hall Management teams, porters, and maintenance personnel across both traditional and UGEL halls who generously shared their operational workflows, logistical challenges, and domain expertise.")
    p_body("Finally, I am indebted to my colleagues and friends for their camaraderie, constructive feedback, and support during the design, testing, and refinement of the HostelFix system.")

    doc.add_page_break()

    # 7. TABLE OF CONTENTS (PAGE v - vii)
    p_title_center("TABLE OF CONTENTS", size=16, bold=True, space_before=18, space_after=24)

    toc_full = [
        ("DECLARATION", "i"),
        ("ABSTRACT", "ii"),
        ("DEDICATION", "iii"),
        ("ACKNOWLEDGEMENT", "iv"),
        ("TABLE OF CONTENTS", "v"),
        ("LIST OF FIGURES", "viii"),
        ("LIST OF TABLES", "ix"),
        ("LIST OF ABBREVIATIONS", "x"),
        ("CHAPTER ONE: INTRODUCTION", "1"),
        ("  1.1 Introduction and Theoretical Constructs", "1"),
        ("  1.2 Background to the Study", "4"),
        ("  1.3 Research Problem Statement", "7"),
        ("  1.4 Research Questions", "9"),
        ("  1.5 Research Aims and Objectives", "10"),
        ("  1.6 Limitations and Scope of the Study", "12"),
        ("  1.7 Research Methodology (Brief)", "14"),
        ("  1.8 Organization of the Project Report", "15"),
        ("CHAPTER TWO: LITERATURE REVIEW", "17"),
        ("  2.1 Theoretical Foundations of Facility Management in Higher Education", "17"),
        ("  2.2 Operational Deficits of Traditional Maintenance Systems", "22"),
        ("  2.3 In-Depth Review and Case Studies of Existing Systems", "27"),
        ("    2.3.1 Enterprise IT Service Management Platforms (Jira, Zendesk)", "27"),
        ("    2.3.2 Commercial CMMS Applications (Fiix, UpKeep, MaintainX)", "31"),
        ("    2.3.3 Integrated University ERP Portals (Banner, PeopleSoft, ITS)", "35"),
        ("  2.4 Multi-Dimensional Comparative Evaluation Matrix", "38"),
        ("  2.5 Architectural and Technological Foundations", "42"),
        ("    2.5.1 Access Control Paradigms (RBAC, ABAC, Object-Level Authorization)", "42"),
        ("    2.5.2 Client-Server Paradigms (React Server Components, Next.js 16)", "45"),
        ("    2.5.3 Architectural Patterns: Modular Monolith vs. Microservices", "48"),
        ("    2.5.4 Persistence Paradigms: Document NoSQL vs. Relational RDBMS", "51"),
        ("    2.5.5 Event-Driven Task Scheduling and Asynchronous Job Queues", "54"),
        ("  2.6 Identified Research Gaps and the HostelFix Approach", "56"),
        ("CHAPTER THREE: SYSTEM ANALYSIS AND DESIGN", "59"),
        ("  3.1 Software Development Methodology (Agile Scrum Execution)", "59"),
        ("  3.2 Requirements Engineering and Specifications", "64"),
        ("    3.2.1 Functional Requirements (FR-01 to FR-12)", "64"),
        ("    3.2.2 Non-Functional Requirements (NFR-01 to NFR-08)", "69"),
        ("    3.2.3 Controlled Residence Directory Specification", "72"),
        ("  3.3 Input Design and Client-Side Data Validation", "75"),
        ("  3.4 Output Design, Dashboards, and Reporting Specifications", "81"),
        ("  3.5 Database Design and Persistence Architecture", "87"),
        ("    3.5.1 Conceptual, Logical, and Physical Schema Design", "87"),
        ("    3.5.2 Database Normalization Analysis (1NF, 2NF, 3NF)", "92"),
        ("    3.5.3 Complete Data Dictionary and Schema Specifications", "95"),
        ("    3.5.4 Compound Indexing Strategy and Query Optimization", "101"),
        ("  3.6 UML Modeling and System Design", "105"),
        ("    3.6.1 Use Case Modeling (Actors, Specifications, Diagram)", "105"),
        ("    3.6.2 Activity Flowcharts (Student, Manager, Artisan)", "112"),
        ("    3.6.3 Domain Class Modeling (UML Class Diagram & Methods)", "116"),
        ("    3.6.4 Sequence Modeling (Lifecycle, Authentication, Closure)", "120"),
        ("    3.6.5 Component Modeling (Subsystems, Interfaces, Dataflow)", "125"),
        ("    3.6.6 Core Algorithmic Logic and Pseudocode Specifications", "128"),
        ("  3.7 System Architecture, State Machine, and Network Topology", "134"),
        ("    3.7.1 Multi-Tier Modular Monolith Architecture", "134"),
        ("    3.7.2 Operational Workflow Design (ADR 001 State Machine)", "138"),
        ("    3.7.3 Physical Network Deployment and Infrastructure Topology", "143"),
        ("  3.8 Hardware and Software Specifications", "147"),
        ("CHAPTER FOUR: IMPLEMENTATION AND EVALUATION", "151"),
        ("  4.1 Implementation Environment and Technology Stack Summary", "151"),
        ("  4.2 Comprehensive Implementation Walkthrough & Live Demonstrations", "155"),
        ("    4.2.1 Secure Authentication and Dual-Token Gateway (Figure 4.1)", "155"),
        ("    4.2.2 Student Resident User Experience (Figures 4.2 to 4.5)", "159"),
        ("    4.2.3 Hall Management Operations Portal (Figures 4.6 and 4.7)", "166"),
        ("    4.2.4 Maintenance Personnel Work Order Queue (Figure 4.8)", "171"),
        ("    4.2.5 Central University Administration Oversight (Figures 4.9 & 4.10)", "175"),
        ("    4.2.6 System Administration and Governance Portal (Figure 4.11)", "180"),
        ("  4.3 Automated Verification and Testing Strategy", "184"),
        ("    4.3.1 Backend Unit and Integration Testing (30/30 Passed)", "184"),
        ("    4.3.2 Frontend Component and Brand Testing (11/11 Passed)", "188"),
        ("    4.3.3 Playwright End-to-End Browser Automation (7/7 Passed)", "191"),
        ("    4.3.4 Total Automated Test Pyramid Summary (48/48 Passed)", "194"),
        ("  4.4 Security and Permission-Denial Test Matrix (SEC-01 to SEC-06)", "196"),
        ("  4.5 Performance, Latency, and Scalability Benchmark Results", "200"),
        ("  4.6 Discussion and Empirical Justification of Results", "204"),
        ("CHAPTER FIVE: CONCLUDING REMARKS AND FUTURE WORK", "208"),
        ("  5.1 Summary of Major Findings", "208"),
        ("  5.2 Practical and Intellectual Contributions", "211"),
        ("  5.3 Limitations of the Current Implementation", "214"),
        ("  5.4 Recommendations for Future Research and Development", "217"),
        ("  5.5 Final Justification of Conclusions in View of Data", "220"),
        ("REFERENCES", "222"),
        ("APPENDICES", "229"),
        ("  Appendix A: Complete REST API Contract Specifications", "229"),
        ("  Appendix B: Complete Database DDL and Mongoose Model Schemas", "235"),
        ("  Appendix C: Complete Automated Test Suite Source Code", "241"),
        ("  Appendix D: System Deployment and Administration Guide", "248"),
        ("  Appendix E: Seeded Test User Directory & Credentials Matrix", "252"),
        ("  Appendix F: Audit Log Event Catalogue and State Transitions", "255")
    ]

    for title, page_no in toc_full:
        p_toc = doc.add_paragraph()
        p_toc.paragraph_format.space_after = Pt(2)
        p_toc.paragraph_format.line_spacing_rule = WD_LINE_SPACING.ONE_POINT_FIVE
        r_title = p_toc.add_run(title)
        r_title.font.name = 'Times New Roman'
        r_title.font.size = Pt(11)
        if "CHAPTER" in title or title in ["DECLARATION", "ABSTRACT", "DEDICATION", "ACKNOWLEDGEMENT", "TABLE OF CONTENTS", "LIST OF FIGURES", "LIST OF TABLES", "LIST OF ABBREVIATIONS", "REFERENCES", "APPENDICES"]:
            r_title.font.bold = True
        
        dots = max(5, 78 - len(title))
        r_dots = p_toc.add_run(" " + "." * dots + " ")
        r_dots.font.name = 'Times New Roman'
        r_dots.font.size = Pt(11)
        r_dots.font.color.rgb = RGBColor(140, 140, 140)

        r_page = p_toc.add_run(page_no)
        r_page.font.name = 'Times New Roman'
        r_page.font.size = Pt(11)
        r_page.font.bold = True

    doc.add_page_break()

    # 8. LIST OF FIGURES (PAGE viii)
    p_title_center("LIST OF FIGURES", size=16, bold=True, space_before=18, space_after=24)
    figures_list = [
        ("Figure 3.1: Multi-Tier Modular Monolith Architecture Diagram", "136"),
        ("Figure 3.2: UML Component Diagram and Subsystem Boundaries", "126"),
        ("Figure 3.3: Comprehensive UML Use Case Diagram Across Five Actors", "110"),
        ("Figure 3.4: UML Domain Class Diagram with Methods and Associations", "118"),
        ("Figure 3.5: UML Sequence Diagram: End-to-End Issue Lifecycle", "122"),
        ("Figure 3.6: UML Sequence Diagram: Dual-Token Auth and Refresh Handshake", "124"),
        ("Figure 3.7: Simplified Operational State Machine Diagram (ADR 001)", "140"),
        ("Figure 3.8: Operational Activity Flowchart: Student Issue Discovery & Reporting", "114"),
        ("Figure 3.9: Complete Entity-Relationship Diagram (ERD)", "90"),
        ("Figure 3.10: Physical Network Deployment and Infrastructure Topology Diagram", "145"),
        ("Figure 4.1: Secure Authentication Portal (ID and PIN)", "157"),
        ("Figure 4.2: Student Resident Dashboard with Status Metrics", "161"),
        ("Figure 4.3: Structured Issue Reporting Form with Directory Selection", "163"),
        ("Figure 4.4: Student Maintenance Issues History and Tracking View", "164"),
        ("Figure 4.5: Issue Detail View and Lifecycle Audit Timeline", "165"),
        ("Figure 4.6: Hall Manager Operations Dashboard Scoped to Hall", "168"),
        ("Figure 4.7: Hall Manager Issue Triage and Allocation Panel", "170"),
        ("Figure 4.8: Maintenance Personnel Work Order Queue", "173"),
        ("Figure 4.9: University Administrator Executive Overview", "177"),
        ("Figure 4.10: Cross-Campus Maintenance Analytics and Metrics", "179"),
        ("Figure 4.11: System Administration Dashboard and Governance Portal", "182")
    ]
    for f_title, f_page in figures_list:
        p_fig = doc.add_paragraph()
        p_fig.paragraph_format.space_after = Pt(3)
        p_fig.paragraph_format.line_spacing_rule = WD_LINE_SPACING.ONE_POINT_FIVE
        r_t = p_fig.add_run(f_title)
        r_t.font.name = 'Times New Roman'
        r_t.font.size = Pt(11)
        dots = max(5, 78 - len(f_title))
        r_d = p_fig.add_run(" " + "." * dots + " ")
        r_d.font.name = 'Times New Roman'
        r_d.font.size = Pt(11)
        r_d.font.color.rgb = RGBColor(140, 140, 140)
        r_p = p_fig.add_run(f_page)
        r_p.font.name = 'Times New Roman'
        r_p.font.size = Pt(11)
        r_p.font.bold = True

    doc.add_page_break()

    # 9. LIST OF TABLES (PAGE ix)
    p_title_center("LIST OF TABLES", size=16, bold=True, space_before=18, space_after=24)
    tables_list = [
        ("Table 2.1: Multi-Dimensional Comparative Evaluation of Maintenance Solutions", "40"),
        ("Table 3.1: Approved University of Ghana Residential Halls and Reference Codes", "73"),
        ("Table 3.2: Input Design Specifications and Validation Constraints", "78"),
        ("Table 3.3: Output Design Specifications and User Roles", "84"),
        ("Table 3.4: Issue Document Schema Data Dictionary", "97"),
        ("Table 3.5: User Document Schema Data Dictionary", "98"),
        ("Table 3.6: Location Document Schema Data Dictionary", "99"),
        ("Table 3.7: Hall Document Schema Data Dictionary", "99"),
        ("Table 3.8: IssueEvent Document Schema Data Dictionary", "100"),
        ("Table 3.9: AuditLog Document Schema Data Dictionary", "101"),
        ("Table 3.10: Database Indexing Strategy and Query Optimization Rationale", "103"),
        ("Table 3.11: Role-Based Access Control and Capability Matrix Across 5 Roles", "132"),
        ("Table 3.12: Development, Server, and Client Hardware/Software Requirements", "148"),
        ("Table 4.1: Implementation Technology Stack Component Summary", "153"),
        ("Table 4.2: Automated Verification and Testing Pyramid Summary (48/48 Passed)", "195"),
        ("Table 4.3: Security and Permission-Denial Test Evaluation Matrix", "198"),
        ("Table 4.4: Playwright End-to-End Browser Automation Results (7/7 Passed)", "193"),
        ("Table 4.5: Database Query Latency Benchmark: Unindexed vs Compound Indexed", "202"),
        ("Table B.1: Seeded Test User Directory and Hall Scoping Matrix", "253"),
        ("Table F.1: State Transition Permission and Trigger Matrix", "256")
    ]
    for t_title, t_page in tables_list:
        p_tab = doc.add_paragraph()
        p_tab.paragraph_format.space_after = Pt(3)
        p_tab.paragraph_format.line_spacing_rule = WD_LINE_SPACING.ONE_POINT_FIVE
        r_t = p_tab.add_run(t_title)
        r_t.font.name = 'Times New Roman'
        r_t.font.size = Pt(11)
        dots = max(5, 78 - len(t_title))
        r_d = p_tab.add_run(" " + "." * dots + " ")
        r_d.font.name = 'Times New Roman'
        r_d.font.size = Pt(11)
        r_d.font.color.rgb = RGBColor(140, 140, 140)
        r_p = p_tab.add_run(t_page)
        r_p.font.name = 'Times New Roman'
        r_p.font.size = Pt(11)
        r_p.font.bold = True

    doc.add_page_break()

    # 10. LIST OF ABBREVIATIONS (PAGE x)
    p_title_center("LIST OF ABBREVIATIONS", size=16, bold=True, space_before=18, space_after=24)
    abbreviations = [
        ("ABAC", "Attribute-Based Access Control"),
        ("ACID", "Atomicity, Consistency, Isolation, Durability"),
        ("ADR", "Architectural Decision Record"),
        ("API", "Application Programming Interface"),
        ("ARIA", "Accessible Rich Internet Applications"),
        ("Bcrypt", "Blowfish-based Password Hashing Algorithm"),
        ("BSON", "Binary JavaScript Object Notation"),
        ("CDN", "Content Delivery Network"),
        ("CMMS", "Computerized Maintenance Management System"),
        ("CRUD", "Create, Read, Update, Delete"),
        ("CSS", "Cascading Style Sheets"),
        ("DAC", "Discretionary Access Control"),
        ("DOM", "Document Object Model"),
        ("E2E", "End-to-End Browser Automation"),
        ("ERD", "Entity-Relationship Diagram"),
        ("ERP", "Enterprise Resource Planning"),
        ("HMAC", "Hash-based Message Authentication Code"),
        ("HTML", "Hypertext Markup Language"),
        ("HTTP", "Hypertext Transfer Protocol"),
        ("IFMA", "International Facility Management Association"),
        ("IP", "Internet Protocol"),
        ("IT", "Information Technology"),
        ("ITSM", "Information Technology Service Management"),
        ("JSON", "JavaScript Object Notation"),
        ("JWT", "JSON Web Token"),
        ("LCP", "Largest Contentful Paint"),
        ("MAC", "Mandatory Access Control"),
        ("MIME", "Multipurpose Internet Mail Extensions"),
        ("MoSCoW", "Must-have, Should-have, Could-have, Won't-have"),
        ("MPA", "Multi-Page Application"),
        ("NoSQL", "Not Only Structured Query Language"),
        ("ODM", "Object Document Mapper"),
        ("PDMSD", "Physical Development and Municipal Services Directorate"),
        ("RBAC", "Role-Based Access Control"),
        ("RCM", "Reliability-Centered Maintenance"),
        ("RDBMS", "Relational Database Management System"),
        ("REST", "Representational State Transfer"),
        ("RSC", "React Server Components"),
        ("RTL", "React Testing Library"),
        ("SERVQUAL", "Service Quality Measurement Framework"),
        ("SHA", "Secure Hash Algorithm"),
        ("SLA", "Service Level Agreement"),
        ("SPA", "Single Page Application"),
        ("SSO", "Single Sign-On"),
        ("TLS", "Transport Layer Security"),
        ("TPM", "Total Productive Maintenance"),
        ("UG", "University of Ghana"),
        ("UGEL", "University of Ghana Enterprises Limited"),
        ("UI", "User Interface"),
        ("UML", "Unified Modeling Language"),
        ("URL", "Uniform Resource Locator"),
        ("UX", "User Experience"),
        ("XSS", "Cross-Site Scripting"),
        ("Zod", "TypeScript-First Schema Validation Library")
    ]
    for abbr, full_text in abbreviations:
        p_abbr = doc.add_paragraph()
        p_abbr.paragraph_format.space_after = Pt(2.5)
        p_abbr.paragraph_format.line_spacing_rule = WD_LINE_SPACING.ONE_POINT_FIVE
        r_a = p_abbr.add_run(f"{abbr:12}")
        r_a.font.name = 'Times New Roman'
        r_a.font.size = Pt(11)
        r_a.font.bold = True
        r_f = p_abbr.add_run(full_text)
        r_f.font.name = 'Times New Roman'
        r_f.font.size = Pt(11)

    # -------------------------------------------------------------
    # SECTION 2: MAIN BODY (PAGE 1 ONWARDS)
    # -------------------------------------------------------------
    sec2 = doc.add_section()
    sec2.top_margin = Inches(1.0)
    sec2.bottom_margin = Inches(1.0)
    sec2.left_margin = Inches(1.5)
    sec2.right_margin = Inches(1.0)
    sec2.different_first_page_header_footer = False

    pgNumType2 = parse_xml(r'<w:pgNumType %s w:fmt="decimal" w:start="1"/>' % nsdecls('w'))
    sec2._sectPr.append(pgNumType2)

    footer_sec2 = sec2.footer
    p_ft2 = footer_sec2.paragraphs[0]
    p_ft2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_ft2 = p_ft2.add_run()
    r_ft2.font.name = 'Times New Roman'
    r_ft2.font.size = Pt(11)
    add_page_number(r_ft2)

    # =============================================================
    # CHAPTER ONE: INTRODUCTION
    # =============================================================
    print("Writing Chapter One...")
    p_heading1(CH1_DATA["title"])
    for sec in CH1_DATA["sections"]:
        p_heading2(sec["heading"])
        for para in sec["content"]:
            if para.startswith("1. ") or para.startswith("2. ") or para.startswith("3. ") or para.startswith("4. ") or para.startswith("5. ") or para.startswith("6. "):
                p_bullet(para[3:], bold_prefix=para[:3])
            elif ":" in para and len(para.split(":")[0]) < 35:
                prefix, body = para.split(":", 1)
                p_body(body.strip(), bold_prefix=prefix.strip() + ": ")
            else:
                p_body(para)

    doc.add_page_break()

    # =============================================================
    # CHAPTER TWO: LITERATURE REVIEW
    # =============================================================
    print("Writing Chapter Two...")
    p_heading1(CH2_DATA["title"])
    for sec in CH2_DATA["sections"]:
        p_heading2(sec["heading"])
        for para in sec["content"]:
            if para.startswith("1. ") or para.startswith("2. ") or para.startswith("3. ") or para.startswith("4. "):
                p_bullet(para[3:], bold_prefix=para[:3])
            elif ":" in para and len(para.split(":")[0]) < 40 and not para.startswith("http"):
                prefix, body = para.split(":", 1)
                p_body(body.strip(), bold_prefix=prefix.strip() + ": ")
            else:
                p_body(para)

        # Insert Comparative Table in 2.4
        if sec["id"] == "2.4":
            create_styled_table(
                ["Feature / Dimension", "Paper Logbooks", "WhatsApp Groups", "Jira Service Mgmt", "Industrial CMMS", "HostelFix Platform"],
                [
                    ["Target Operational Focus", "Desk check-in", "Informal peer chat", "Enterprise IT helpdesk", "Factory plant machinery", "University student halls"],
                    ["Student Friction & UX", "Manual physical walk", "Casual mobile typing", "Heavy form overhead", "Technician-centric forms", "60-second guided web form"],
                    ["Mobile Usability", "Zero (paper only)", "High (messaging)", "Moderate (responsive)", "Poor (desktop oriented)", "Fully responsive Next.js 16"],
                    ["Access Control & Security", "Zero access control", "Zero privacy (public)", "Standard corporate RBAC", "Technician permissions", "RBAC + Hall Tenant Boundary"],
                    ["Tenant Isolation Across Halls", "Physical desk binding", "Unconnected chats", "Complex project routing", "Single plant model", "Native multi-hall data scoping"],
                    ["Real-Time State Tracking", "Zero visibility", "Zero status tracking", "Rigid multi-stage queue", "Asset work orders", "4-Stage Operational Record"],
                    ["Dispute Verification Window", "None", "None", "Reopen via agent", "None", "Automated 48h Student Dispute"],
                    ["Direct Resolution (Offline)", "Artisan informal fix", "Informal confirmation", "Disallowed (gated)", "Disallowed (parts log)", "Fully supported (ADR 001)"],
                    ["Automated Queue Closure", "None (manual)", "None", "SLA cron automation", "Work order sign-off", "BullMQ Asynchronous Worker"],
                    ["Immutable Audit Logging", "None (vulnerable)", "None (chat scroll)", "High (changelog)", "High (regulatory log)", "Issue Events & Security Logs"],
                    ["Executive Multi-Hall Metrics", "Zero analytics", "Zero analytics", "Complex BI reporting", "Machinery telemetry", "Built-in cross-hall dashboard"],
                    ["Licensing & Cost Feasibility", "Zero tech cost", "Zero direct cost", "Expensive per-agent tier", "Cost-prohibitive tier", "Zero software license cost"]
                ]
            )
            p_body("Table 2.1: Multi-Dimensional Comparative Evaluation of Maintenance Solutions", italic=True)

    doc.add_page_break()

    # Save initial progress check
    print("Chapters 1 and 2 compiled successfully.")

if __name__ == "__main__":
    build_full_thesis()
