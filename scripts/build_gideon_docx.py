import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn
import os

def create_document():
    doc = docx.Document()
    
    # Configure base style
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(12)
    normal_style.font.color.rgb = RGBColor(0, 0, 0)
    normal_style.paragraph_format.line_spacing_rule = WD_LINE_SPACING.ONE_POINT_FIVE
    normal_style.paragraph_format.space_after = Pt(6)
    normal_style.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

    # XML Helper functions
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

    def add_num_pages(run):
        fldSimple = parse_xml(r'<w:fldSimple %s w:instr="NUMPAGES"/>' % nsdecls('w'))
        run._r.append(fldSimple)

    # -------------------------------------------------------------
    # SECTION 1: COVER & PRELIMINARY PAGES
    # -------------------------------------------------------------
    sec1 = doc.sections[0]
    sec1.top_margin = Inches(1.0)
    sec1.bottom_margin = Inches(1.0)
    sec1.left_margin = Inches(1.5)
    sec1.right_margin = Inches(1.0)
    sec1.different_first_page_header_footer = True
    
    # Roman numeral numbering for section 1
    pgNumType1 = parse_xml(r'<w:pgNumType %s w:fmt="lowerRoman" w:start="1"/>' % nsdecls('w'))
    sec1._sectPr.append(pgNumType1)

    # Helper functions for text elements
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

    def p_heading1(text, space_before=18, space_after=12):
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

    def p_heading2(text, space_before=14, space_after=6):
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

    def p_heading3(text, space_before=10, space_after=4):
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

    def add_figure(img_path, caption):
        if os.path.exists(img_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(12)
            p_img.paragraph_format.space_after = Pt(6)
            run = p_img.add_run()
            run.add_picture(img_path, width=Inches(5.6))
            
            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_after = Pt(14)
            p_cap.paragraph_format.keep_with_next = False
            run_cap = p_cap.add_run(caption)
            run_cap.font.name = 'Times New Roman'
            run_cap.font.size = Pt(11)
            run_cap.font.bold = True
            run_cap.font.italic = True
        else:
            p_body(f"[Image file not found: {img_path}]")

    def create_styled_table(headers, rows_data):
        table = doc.add_table(rows=len(rows_data) + 1, cols=len(headers))
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = False

        # Header Row
        hdr_cells = table.rows[0].cells
        for i, header_text in enumerate(headers):
            cell = hdr_cells[i]
            cell.text = header_text
            set_cell_background(cell, "EAEAEA")
            set_cell_margins(cell, top=120, bottom=120, left=150, right=150)
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
            bg_color = "F9F9F9" if r_idx % 2 == 1 else "FFFFFF"
            for c_idx, val in enumerate(row_values):
                cell = row_cells[c_idx]
                cell.text = str(val)
                set_cell_background(cell, bg_color)
                set_cell_margins(cell, top=100, bottom=100, left=150, right=150)
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
    # 1. COVER PAGE (PAGE 1)
    # -------------------------------------------------------------
    p_title_center("UNIVERSITY OF GHANA", size=16, bold=True, space_before=24, space_after=6)
    p_title_center("COLLEGE OF BASIC AND APPLIED SCIENCES", size=14, bold=True, space_before=0, space_after=24)

    # University of Ghana Crest extracted from template PDF
    ug_crest_path = "/Users/kaeytee/Desktop/Joenick/HostelFix/docs/diagrams/ug_crest.png"
    if os.path.exists(ug_crest_path):
        p_crest = doc.add_paragraph()
        p_crest.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_crest.paragraph_format.space_before = Pt(6)
        p_crest.paragraph_format.space_after = Pt(24)
        r_crest = p_crest.add_run()
        r_crest.add_picture(ug_crest_path, width=Inches(2.2))

    p_title_center("DESIGN AND IMPLEMENTATION OF A ROLE-BASED MAINTENANCE REPORTING AND TRACKING SYSTEM FOR UNIVERSITY OF GHANA HALLS", size=15, bold=True, space_before=12, space_after=48)

    p_title_center("BY", size=12, bold=True, space_before=0, space_after=12)
    p_title_center("ASANTE GIDEON KWADWO", size=14, bold=True, space_before=0, space_after=6)
    p_title_center("(11287773)", size=12, bold=True, space_before=0, space_after=0)

    doc.add_page_break()

    # -------------------------------------------------------------
    # 2. SUBMITTAL PAGE (PAGE 2)
    # -------------------------------------------------------------
    p_title_center("DESIGN AND IMPLEMENTATION OF A ROLE-BASED MAINTENANCE REPORTING AND TRACKING SYSTEM FOR UNIVERSITY OF GHANA HALLS", size=15, bold=True, space_before=24, space_after=60)

    p_title_center("BY", size=12, bold=True, space_before=0, space_after=18)
    p_title_center("ASANTE GIDEON KWADWO", size=14, bold=True, space_before=0, space_after=6)
    p_title_center("(11287773)", size=12, bold=True, space_before=0, space_after=72)

    p_title_center("A PROJECT REPORT SUBMITTED TO THE DEPARTMENT OF COMPUTER SCIENCE, SCHOOL OF PHYSICAL AND MATHEMATICAL SCIENCES, COLLEGE OF BASIC AND APPLIED SCIENCES, UNIVERSITY OF GHANA", size=12, bold=True, space_before=0, space_after=18)
    p_title_center("IN PARTIAL FULFILLMENT OF THE AWARD OF DEGREE OF", size=12, bold=True, space_before=0, space_after=18)
    p_title_center("BACHELOR OF SCIENCE IN COMPUTER SCIENCE", size=13, bold=True, space_before=0, space_after=72)

    p_title_center("DEPARTMENT OF COMPUTER SCIENCE", size=13, bold=True, space_before=0, space_after=6)
    p_title_center("MARCH, 2026", size=12, bold=True, space_before=0, space_after=0)

    doc.add_page_break()

    # Configure Header / Footer for preliminary pages (Page i onwards)
    footer_sec1 = sec1.footer
    p_ft1 = footer_sec1.paragraphs[0]
    p_ft1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_ft1 = p_ft1.add_run()
    r_ft1.font.name = 'Times New Roman'
    r_ft1.font.size = Pt(11)
    add_page_number(r_ft1)

    # -------------------------------------------------------------
    # 3. DECLARATION (PAGE i)
    # -------------------------------------------------------------
    p_title_center("DECLARATION", size=16, bold=True, space_before=18, space_after=24)
    p_body("I hereby declare that this project report entitled \"Design and Implementation of a Role-Based Maintenance Reporting and Tracking System for University of Ghana Halls\" is my own original work, except where due acknowledgment has been made in the text. This work has not been submitted in whole or in part for a degree at this or any other university.")

    p_body("", space_after=18)
    p_body("STUDENT", bold_prefix="CANDIDATE: ")
    p_body("Asante Gideon Kwadwo", bold_prefix="Name: ")
    p_body("________________________________________          Date: ____________________", bold_prefix="Signature: ")

    p_body("", space_after=24)
    p_body("SUPERVISOR", bold_prefix="SUPERVISOR: ")
    p_body("Prof. Winfred Yaokumah", bold_prefix="Name: ")
    p_body("________________________________________          Date: ____________________", bold_prefix="Signature: ")

    doc.add_page_break()

    # -------------------------------------------------------------
    # 4. ABSTRACT (PAGE ii)
    # -------------------------------------------------------------
    p_title_center("ABSTRACT", size=16, bold=True, space_before=18, space_after=24)

    p_body("HostelFix is a web-based maintenance reporting and tracking system engineered specifically for student residential halls across the University of Ghana, Legon campus. It resolves long-standing inefficiencies associated with traditional, fragmented maintenance handling methods such as verbal reporting, manual paper logbooks, informal messaging applications, and uncoordinated telephone calls.", bold_prefix="Context: ")

    p_body("The primary aim of this study is to design and implement a role-based digital operational record that bridges the communication divide between student residents, hall managers, maintenance technicians, university administrators, and system administrators, establishing strict accountability without disrupting rapid on-the-ground repair processes.", bold_prefix="Aim: ")

    p_body("An iterative Agile software development methodology was employed. The architecture was implemented as a modular monolith featuring a Next.js 16 frontend with Tailwind CSS and React Hook Form, an Express 5 and TypeScript backend API, and a MongoDB database managed via Mongoose. Object-level authorization, role-based access control, cryptographic JWT session management with HTTP-only refresh tokens, and BullMQ background job queues were integrated.", bold_prefix="Method: ")

    p_body("The system was thoroughly validated through 48 automated tests across unit, integration, and security layers with a 100% pass rate. Automated Playwright browser tests verified seamless multi-role authentication and navigation. The simplified workflow (Submitted -> Acknowledged -> Resolved -> Closed) eliminated administrative bottlenecks, while the 48-hour dispute window ensured student confirmation before automated closure.", bold_prefix="Result: ")

    p_body("HostelFix successfully demonstrates that aligning software lifecycles with the physical realities of university facility management delivers superior traceability, enhanced student satisfaction, and actionable institutional analytics without administrative friction.", bold_prefix="Conclusion: ")

    p_body("maintenance reporting, role-based access control, university halls, MongoDB, Next.js, Express, facility management, audit trail.", bold_prefix="Keywords: ")

    doc.add_page_break()

    # -------------------------------------------------------------
    # 5. DEDICATION (PAGE iii)
    # -------------------------------------------------------------
    p_title_center("DEDICATION", size=16, bold=True, space_before=18, space_after=24)
    p_body("This work is dedicated to my family, whose continuous support, encouragement, and prayers sustained me throughout my academic pursuits.")
    p_body("It is also dedicated to the hardworking hall management staff, porters, and maintenance personnel of the University of Ghana, who labor daily to ensure the welfare and comfort of student residents.")

    doc.add_page_break()

    # -------------------------------------------------------------
    # 6. ACKNOWLEDGEMENT (PAGE iv)
    # -------------------------------------------------------------
    p_title_center("ACKNOWLEDGEMENT", size=16, bold=True, space_before=18, space_after=24)
    p_body("I would like to express my profound gratitude to my supervisor, Prof. Winfred Yaokumah, for his invaluable guidance, scholarly advice, constructive critique, and continuous encouragement throughout the conception, design, and implementation of this project.")
    p_body("I extend my sincere appreciation to the faculty and staff of the Department of Computer Science, University of Ghana, for providing an intellectually rigorous environment and technical foundation during my undergraduate studies.")
    p_body("Special thanks go to the Hall Management teams, porters, and maintenance personnel across both traditional and UGEL halls who generously shared their operational workflows, logistical challenges, and domain expertise.")
    p_body("Finally, I am indebted to my colleagues and friends for their camaraderie, constructive feedback, and support during the design, testing, and refinement of the HostelFix system.")

    doc.add_page_break()

    # -------------------------------------------------------------
    # 7. TABLE OF CONTENTS (PAGE v)
    # -------------------------------------------------------------
    p_title_center("TABLE OF CONTENTS", size=16, bold=True, space_before=18, space_after=24)

    toc_items = [
        ("DECLARATION", "i"),
        ("ABSTRACT", "ii"),
        ("DEDICATION", "iii"),
        ("ACKNOWLEDGEMENT", "iv"),
        ("TABLE OF CONTENTS", "v"),
        ("LIST OF FIGURES", "vii"),
        ("LIST OF TABLES", "viii"),
        ("LIST OF ABBREVIATIONS", "ix"),
        ("CHAPTER ONE: INTRODUCTION", "1"),
        ("  1.1 Background and Motivation", "1"),
        ("  1.2 Statement of the Problem", "3"),
        ("  1.3 Scope and Delimitations of the Study", "4"),
        ("  1.4 Research Objectives", "5"),
        ("    1.4.1 Global Objective", "5"),
        ("    1.4.2 Specific Objectives", "5"),
        ("  1.5 Significance and Research Contribution", "6"),
        ("  1.6 Organization of the Project Report", "7"),
        ("CHAPTER TWO: LITERATURE REVIEW", "8"),
        ("  2.1 Overview of Facility Maintenance in Higher Education", "8"),
        ("  2.2 Limitations of Paper-Based and Ad-Hoc Maintenance Systems", "10"),
        ("  2.3 Review of Similar Commercial and Open-Source Systems", "12"),
        ("  2.4 Comparative Evaluation of Existing Systems", "15"),
        ("  2.5 Theoretical and Technological Foundations", "17"),
        ("  2.6 Identified Research Gaps and the HostelFix Approach", "20"),
        ("CHAPTER THREE: RESEARCH METHODOLOGY AND SYSTEM DESIGN", "22"),
        ("  3.1 Research and Software Development Methodology", "22"),
        ("  3.2 Requirements Engineering and Analysis", "24"),
        ("  3.3 High-Level System Architecture", "28"),
        ("  3.4 Operational Workflow Design (ADR 001)", "31"),
        ("  3.5 Database Modeling and Data Architecture", "35"),
        ("  3.6 Security Architecture and Authorization Model", "39"),
        ("CHAPTER FOUR: EXPERIMENTAL RESULTS AND EVALUATION", "43"),
        ("  4.1 Implementation Environment and Technology Stack", "43"),
        ("  4.2 Presentation of the Implemented Application", "45"),
        ("  4.3 Automated Verification and Testing Strategy", "55"),
        ("  4.4 Security and Permission-Denial Test Matrix", "58"),
        ("  4.5 Playwright End-to-End Browser Automation Results", "60"),
        ("  4.6 Discussion on System Efficacy and Operational Alignment", "62"),
        ("CHAPTER FIVE: CONCLUDING REMARKS AND FUTURE WORK", "65"),
        ("  5.1 Summary of Findings", "65"),
        ("  5.2 Practical and Intellectual Contributions", "66"),
        ("  5.3 Limitations of the Current Implementation", "67"),
        ("  5.4 Recommendations for Future Research and Development", "68"),
        ("REFERENCES", "70"),
        ("APPENDICES", "73"),
        ("  Appendix A: System Deployment and Local Execution Guide", "73"),
        ("  Appendix B: Seeded Test Accounts and Credentials Matrix", "75"),
        ("  Appendix C: REST API Contract Specifications", "76"),
        ("  Appendix D: Playwright End-to-End Test Suite Script", "79")
    ]

    for title, page_no in toc_items:
        p_toc = doc.add_paragraph()
        p_toc.paragraph_format.space_after = Pt(2)
        p_toc.paragraph_format.line_spacing_rule = WD_LINE_SPACING.ONE_POINT_FIVE
        r_title = p_toc.add_run(title)
        r_title.font.name = 'Times New Roman'
        r_title.font.size = Pt(11)
        if "CHAPTER" in title or title in ["DECLARATION", "ABSTRACT", "DEDICATION", "ACKNOWLEDGEMENT", "TABLE OF CONTENTS", "LIST OF FIGURES", "LIST OF TABLES", "LIST OF ABBREVIATIONS", "REFERENCES", "APPENDICES"]:
            r_title.font.bold = True
        
        # Dot leader calculation
        dots_count = max(5, 75 - len(title))
        r_dots = p_toc.add_run(" " + "." * dots_count + " ")
        r_dots.font.name = 'Times New Roman'
        r_dots.font.size = Pt(11)
        r_dots.font.color.rgb = RGBColor(120, 120, 120)

        r_page = p_toc.add_run(page_no)
        r_page.font.name = 'Times New Roman'
        r_page.font.size = Pt(11)
        r_page.font.bold = True

    doc.add_page_break()

    # -------------------------------------------------------------
    # 8. LIST OF FIGURES (PAGE vii)
    # -------------------------------------------------------------
    p_title_center("LIST OF FIGURES", size=16, bold=True, space_before=18, space_after=24)

    figures_list = [
        ("Figure 3.1: Multi-Tier Modular Monolith Architecture Diagram", "30"),
        ("Figure 3.2: Simplified Operational State Machine (ADR 001)", "33"),
        ("Figure 3.3: Complete Entity-Relationship Diagram (ERD)", "38"),
        ("Figure 4.1: Secure Authentication Portal (ID and PIN)", "46"),
        ("Figure 4.2: Student Resident Dashboard with Status Metrics", "47"),
        ("Figure 4.3: Structured Issue Reporting Form with Directory Selection", "48"),
        ("Figure 4.4: Student Maintenance Issues History and Tracking View", "49"),
        ("Figure 4.5: Issue Detail View and Lifecycle Audit Timeline", "50"),
        ("Figure 4.6: Hall Manager Operations Dashboard Scoped to Hall", "51"),
        ("Figure 4.7: Hall Manager Issue Triage and Allocation Panel", "52"),
        ("Figure 4.8: Maintenance Personnel Work Order Queue", "53"),
        ("Figure 4.9: University Administrator Executive Overview", "54"),
        ("Figure 4.10: Cross-Campus Maintenance Analytics and Metrics", "55"),
        ("Figure 4.11: System Administration Dashboard and Governance Portal", "56")
    ]

    for f_title, f_page in figures_list:
        p_fig = doc.add_paragraph()
        p_fig.paragraph_format.space_after = Pt(4)
        p_fig.paragraph_format.line_spacing_rule = WD_LINE_SPACING.ONE_POINT_FIVE
        r_t = p_fig.add_run(f_title)
        r_t.font.name = 'Times New Roman'
        r_t.font.size = Pt(11)

        dots = max(5, 75 - len(f_title))
        r_d = p_fig.add_run(" " + "." * dots + " ")
        r_d.font.name = 'Times New Roman'
        r_d.font.size = Pt(11)
        r_d.font.color.rgb = RGBColor(120, 120, 120)

        r_p = p_fig.add_run(f_page)
        r_p.font.name = 'Times New Roman'
        r_p.font.size = Pt(11)
        r_p.font.bold = True

    doc.add_page_break()

    # -------------------------------------------------------------
    # 9. LIST OF TABLES (PAGE viii)
    # -------------------------------------------------------------
    p_title_center("LIST OF TABLES", size=16, bold=True, space_before=18, space_after=24)

    tables_list = [
        ("Table 2.1: Comparative Matrix of Maintenance Solutions", "16"),
        ("Table 3.1: Approved University of Ghana Halls and Prefixes", "26"),
        ("Table 3.2: Issue Schema Field Definitions and Types", "36"),
        ("Table 3.3: Database Indexing Strategy and Rationale", "37"),
        ("Table 3.4: Role-Based Access Control and Capability Matrix", "41"),
        ("Table 4.1: Implementation Technology Stack Summary", "44"),
        ("Table 4.2: Automated Verification and Testing Summary (48/48 Passed)", "57"),
        ("Table 4.3: Security and Permission-Denial Test Evaluation Matrix", "59"),
        ("Table 4.4: Playwright End-to-End Browser Test Scenarios (7/7 Passed)", "61"),
        ("Table B.1: Provisioned Test Account Credentials Matrix", "75")
    ]

    for t_title, t_page in tables_list:
        p_tab = doc.add_paragraph()
        p_tab.paragraph_format.space_after = Pt(4)
        p_tab.paragraph_format.line_spacing_rule = WD_LINE_SPACING.ONE_POINT_FIVE
        r_t = p_tab.add_run(t_title)
        r_t.font.name = 'Times New Roman'
        r_t.font.size = Pt(11)

        dots = max(5, 75 - len(t_title))
        r_d = p_tab.add_run(" " + "." * dots + " ")
        r_d.font.name = 'Times New Roman'
        r_d.font.size = Pt(11)
        r_d.font.color.rgb = RGBColor(120, 120, 120)

        r_p = p_tab.add_run(t_page)
        r_p.font.name = 'Times New Roman'
        r_p.font.size = Pt(11)
        r_p.font.bold = True

    doc.add_page_break()

    # -------------------------------------------------------------
    # 10. LIST OF ABBREVIATIONS (PAGE ix)
    # -------------------------------------------------------------
    p_title_center("LIST OF ABBREVIATIONS", size=16, bold=True, space_before=18, space_after=24)

    abbreviations = [
        ("ADR", "Architectural Decision Record"),
        ("API", "Application Programming Interface"),
        ("ARIA", "Accessible Rich Internet Applications"),
        ("Bcrypt", "Blowfish Password Hashing Algorithm"),
        ("BSc", "Bachelor of Science"),
        ("CDN", "Content Delivery Network"),
        ("CMMS", "Computerized Maintenance Management System"),
        ("CRUD", "Create, Read, Update, Delete"),
        ("CSS", "Cascading Style Sheets"),
        ("DOM", "Document Object Model"),
        ("E2E", "End-to-End"),
        ("ERD", "Entity-Relationship Diagram"),
        ("HTML", "Hypertext Markup Language"),
        ("HTTP", "Hypertext Transfer Protocol"),
        ("JSON", "JavaScript Object Notation"),
        ("JWT", "JSON Web Token"),
        ("NoSQL", "Not Only Structured Query Language"),
        ("RBAC", "Role-Based Access Control"),
        ("REST", "Representational State Transfer"),
        ("RTL", "React Testing Library"),
        ("UI", "User Interface"),
        ("UG", "University of Ghana"),
        ("UGEL", "University of Ghana Enterprises Limited"),
        ("URL", "Uniform Resource Locator"),
        ("UX", "User Experience"),
        ("Zod", "TypeScript-First Schema Validation Library")
    ]

    for abbr, full_text in abbreviations:
        p_abbr = doc.add_paragraph()
        p_abbr.paragraph_format.space_after = Pt(3)
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
    p_heading1("CHAPTER ONE: INTRODUCTION")

    p_heading2("1.1 Background and Motivation")
    p_body("Residential accommodation in tertiary institutions plays an indispensable role in shaping student academic performance, mental well-being, and social development. At the University of Ghana, Legon campus, the residential system encompasses five traditional halls (Akuafo Hall, Legon Hall, Volta Hall, Commonwealth Hall, and Mensah Sarbah Hall) and four modern University of Ghana Enterprises Limited (UGEL) halls (Hilla Limann Hall, Alexander Adum Kwapong Hall, Elizabeth Frances Sey Hall, and Jean Nelson Aka Hall). Together, these nine university-managed halls provide residential quarters for tens of thousands of undergraduate and postgraduate students annually.")

    p_body("Maintaining infrastructural integrity across these diverse facilities is a massive logistical challenge. High-density communal living accelerates wear and tear on essential amenities including sanitary plumbing, electrical wiring, overhead lighting, door locks, room furniture, water storage systems, and wireless internet access points. When fixtures deteriorate or fail, the speed and transparency with which repairs are executed directly impact student quality of life and health.")

    p_body("Historically, the University of Ghana has managed residential maintenance through traditional, non-digital mechanisms. Students discover broken fixtures in their study bedrooms, shared washrooms, or communal corridors and attempt to lodge reports through whatever immediate channel is available. Typically, this involves walking to the hall porter lodge to write in a paper logbook, verbally alerting a cleaner or groundskeeper, phoning a hall caretaker directly, or posting on unofficial hall WhatsApp groups.")

    p_body("While informal communication is rapid and convenient, it suffers from severe systemic defects. Paper logbooks placed at security desks are frequently misplaced, damaged, or filled with unreadable handwriting. Verbal complaints to security personnel are often forgotten across shift handovers. Direct telephone calls to maintenance artisans fail to establish an institutional record, leaving hall managers entirely in the dark regarding total repair volumes, contractor responsiveness, or outstanding issues. Students receive no feedback regarding whether their complaints have been seen, prioritized, or scheduled for repair, leading to widespread cynicism, repeated complaints, and prolonged infrastructural decay.")

    p_body("HostelFix was conceived to address this exact operational void. Rather than forcing facility staff into complex enterprise software, HostelFix provides a clean, role-based digital ledger tailored exclusively to the administrative and social realities of the University of Ghana residential system.")

    p_heading2("1.2 Statement of the Problem")
    p_body("The residential maintenance management framework across University of Ghana halls is compromised by five critical operational failure points:")

    p_bullet("Lack of Traceability: When a student reports a broken fixture, no persistent record exists that can be tracked across the repair lifecycle. Neither the student nor central administration can determine who is currently handling the complaint.", bold_prefix="1. ")
    p_bullet("Communication Fragmentation: Maintenance requests are scattered across disparate channels including paper books, phone calls, text messages, and informal conversations. This decentralization prevents systematic aggregation and prioritization.", bold_prefix="2. ")
    p_bullet("Absence of Verification and Dispute Mechanisms: Traditional systems assume that when an artisan visits a room, the problem is permanently solved. If a repair is substandard or incomplete, the student has no formal digital avenue to dispute the resolution, forcing them to start the complaint cycle from scratch.", bold_prefix="3. ")
    p_bullet("Zero Operational Visibility for Central Administration: University executives and the Director of Physical Development and Municipal Services have no real-time data regarding maintenance performance across campus. They cannot identify halls experiencing abnormal failure rates or compare resolution times.", bold_prefix="4. ")
    p_bullet("Misalignment of Digital Systems with Field Reality: Previous attempts to introduce generic IT ticketing systems failed because they imposed rigid digital workflows requiring technicians to carry computers and update multiple intermediate statuses before fixing a leak.", bold_prefix="5. ")

    p_body("Consequently, there is an urgent academic and practical necessity to engineer a specialized system that provides complete traceability and strict role-based access while deliberately accommodating informal physical repair workflows.")

    p_heading2("1.3 Scope and Delimitations of the Study")
    p_body("To maintain academic rigor and project feasibility, the scope of HostelFix is precisely defined and delimited:")

    p_body("The system is strictly designed for and delimited to the nine University-managed student halls at the University of Ghana, Legon campus. This covers the five traditional halls (Akuafo, Legon, Volta, Commonwealth, Mensah Sarbah) and the four UGEL halls (Hilla Limann, Alexander Adum Kwapong, Elizabeth Frances Sey, Jean Nelson Aka).", bold_prefix="Target Environment: ")

    p_body("Private commercial hostels located outside direct University administrative control (such as Bani, Evandy, TF, and diaspora hostels) are explicitly out of scope because their procurement, artisan dispatch, and billing operations are privately governed.", bold_prefix="Excluded Accommodation: ")

    p_body("The system models the operational ledger of maintenance requests, covering reporting, acknowledgment, resolution, student dispute windows, and automated lifecycle closure. It does not attempt to handle inventory stock control, material procurement purchasing, or artisan payroll.", bold_prefix="Functional Boundary: ")

    p_body("HostelFix is explicitly NOT an emergency dispatch service. For life-threatening emergencies such as exposed electrical cables, active fires, gas leaks, structural collapse, or major sewage flooding, residents must contact emergency services and physical security desks immediately. The digital record can be documented after immediate danger is neutralized.", bold_prefix="Safety Boundary: ")

    p_heading2("1.4 Research Objectives")

    p_heading3("1.4.1 Global Objective")
    p_body("The global objective of this project is to design, implement, and empirically evaluate a role-based maintenance reporting and tracking system (HostelFix) that establishes an accountable, low-friction digital ledger for student residences across the University of Ghana.")

    p_heading3("1.4.2 Specific Objectives")
    p_body("To achieve the global objective, the following specific objectives were established:")

    p_bullet("To analyze the residential maintenance workflows and communication channels across University of Ghana traditional and UGEL halls.", bold_prefix="1. ")
    p_bullet("To design a streamlined operational lifecycle (Submitted, Acknowledged, Resolved, Closed) that accurately mirrors physical maintenance work without introducing administrative bottlenecks.", bold_prefix="2. ")
    p_bullet("To architect and implement a secure multi-tier web application using Next.js 16, Express 5, TypeScript, and MongoDB, enforcing object-level authorization and tenant isolation.", bold_prefix="3. ")
    p_bullet("To develop role-specific dashboards for Students, Hall Managers, Maintenance Staff, University Administrators, and System Administrators.", bold_prefix="4. ")
    p_bullet("To formulate an automated dispute and closure engine that provides students with a 48-hour verification window before closing resolved issues.", bold_prefix="5. ")
    p_bullet("To empirically evaluate the security, reliability, accessibility, and correctness of the system through comprehensive automated unit, integration, permission-denial, and browser end-to-end testing.", bold_prefix="6. ")

    p_heading2("1.5 Significance and Research Contribution")
    p_body("The academic and institutional contributions of this work are significant across multiple dimensions:")

    p_body("From a software engineering perspective, this project contributes an Architectural Decision Record (ADR 001) that re-evaluates the relationship between digital state machines and manual physical labor. By demonstrating that intermediate stages (such as verified, assigned, and in-progress) can be treated as optional metadata rather than mandatory blocking states, the research provides a design model for deploying information systems in resource-constrained institutional environments.", bold_prefix="Workflow Engineering Contribution: ")

    p_body("The project designs and validates a strict object-level authorization policy model in a multi-tenant university environment. It proves that combining role-based access control with dynamic hall-boundary predicates guarantees student data privacy and prevents horizontal privilege escalation across residential buildings.", bold_prefix="Security Architecture Contribution: ")

    p_body("Practically, the University of Ghana gains a turnkey, deployment-ready software asset that replaces loss-prone paper logbooks with an immutable audit trail, establishing transparency and providing leadership with actionable data on infrastructure reliability.", bold_prefix="Practical Institutional Impact: ")

    p_heading2("1.6 Organization of the Project Report")
    p_body("This project report is structured into five cohesive chapters in accordance with the university guidelines:")

    p_bullet("Chapter One presents the background, problem statement, scope, objectives, significance, and organizational roadmap of the study.", bold_prefix="Chapter 1: ")
    p_bullet("Chapter Two reviews authoritative literature on higher education facility management, analyzes the limitations of traditional paper and ad-hoc reporting channels, compares existing commercial and open-source systems, and establishes the theoretical frameworks underpinning HostelFix.", bold_prefix="Chapter 2: ")
    p_bullet("Chapter Three details the research methodology, requirements specifications, modular monolith system architecture, operational workflow design, database schemas, and security policy models.", bold_prefix="Chapter 3: ")
    p_bullet("Chapter Four describes the implementation environment, presents the live user interface screenshots, reports on the automated test suites (Vitest, React Testing Library, Playwright), details security evaluation results, and analyzes system performance.", bold_prefix="Chapter 4: ")
    p_bullet("Chapter Five concludes the report with a synthesis of findings, a summary of intellectual contributions, an honest critique of current limitations, and actionable recommendations for future research.", bold_prefix="Chapter 5: ")

    # =============================================================
    # CHAPTER TWO: LITERATURE REVIEW
    # =============================================================
    p_heading1("CHAPTER TWO: LITERATURE REVIEW")

    p_heading2("2.1 Overview of Facility Maintenance in Higher Education")
    p_body("Facility maintenance in higher education encompasses the coordinated processes required to ensure that physical infrastructure, utilities, and communal amenities remain operational, safe, and supportive of institutional learning objectives. As universities expand their student enrollment, residential infrastructure experiences heightened usage stress. Modern research in educational facility management demonstrates a direct correlation between the physical condition of campus housing and student retention, mental focus, and academic achievement (Wireman, 2004; Lateef, 2010).")

    p_body("Higher education facilities present unique logistical challenges that distinguish them from corporate offices or private residential apartments. First, tertiary institutions operate under strict academic calendar deadlines, where periods of peak occupancy alternate with brief vacation windows. Second, students residing in halls are temporary occupants who lack personal ownership of physical fixtures, which can lead to higher rates of fixture degradation. Third, maintenance administration in public universities is governed by statutory procurement procedures, centralized budgetary oversight, and complex labor divisions among civil service artisans.")

    p_heading2("2.2 Limitations of Paper-Based and Ad-Hoc Maintenance Systems")
    p_body("A thorough review of existing institutional practices at the University of Ghana and comparable West African institutions reveals an enduring reliance on manual and semi-formal communication channels. Each of these methods exhibits severe operational drawbacks:")

    p_heading3("2.2.1 Verbal Reporting and Porters' Desks")
    p_body("Verbal reporting remains the most common first-response mechanism. A student resident noticing a leaking pipe informs the porter on duty at the hall entrance. While verbal communication requires zero technical literacy, it provides zero auditability. Shifts change three times daily, and unwritten messages are routinely lost. If the porter forgets to relay the complaint to the maintenance foreman, the resident assumes work is underway while no technician has been informed.")

    p_heading3("2.2.2 Paper-Based Hall Logbooks")
    p_body("Paper maintenance logbooks represent the traditional attempt at recording complaints. Located at security counters, students manually record their room number, date, and description of the defect. However, empirical analysis demonstrates that physical logbooks suffer from:")

    p_bullet("Vulnerability to physical loss, water damage, and torn pages.", bold_prefix="* ")
    p_bullet("Illegible handwriting and ambiguous problem descriptions that require follow-up visits simply to identify the tools needed.", bold_prefix="* ")
    p_bullet("Zero remote accessibility for supervising engineers or hall administrators.", bold_prefix="* ")
    p_bullet("Total absence of automated notifications, search indexing, or historical reporting.", bold_prefix="* ")

    p_heading3("2.2.3 Ad-hoc Messaging Channels (WhatsApp and SMS)")
    p_body("In recent years, hall executives and student leadership have established informal WhatsApp groups or phone hotlines to bridge communication gaps. Although messaging apps provide rapid digital connectivity, they mix critical maintenance alerts with social chatter, memes, and administrative announcements. Important repair tickets quickly disappear in message feeds, and assignment status cannot be programmatically tracked.")

    p_heading3("2.2.4 Standalone Spreadsheets")
    p_body("Some hall managers attempt to compile weekly maintenance spreadsheets from paper entries. While spreadsheets allow simple sorting, they do not support multi-user concurrent access, lack granular role-based permissions, provide no real-time push notifications, and require labor-intensive manual data entry.")

    p_heading2("2.3 Review of Similar Commercial and Open-Source Systems")
    p_body("To establish the technological context of this project, three broad categories of existing digital maintenance solutions were analyzed:")

    p_heading3("2.3.1 Enterprise IT Service Management Platforms (Jira Service Management, Zendesk)")
    p_body("Generic ticketing platforms are designed primarily for enterprise information technology support. They offer mature ticket lifecycles, SLA tracking, and sophisticated escalation rules. However, their workflows assume a corporate IT environment where users submit tickets from desktop workstations, and dedicated helpdesk agents triage each request digitally before dispatching engineers. When deployed in university residential settings, these systems overwhelm users with irrelevant fields (such as 'affected software version' or 'severity SLA codes') and force artisans to maintain active digital connections while repairing plumbing fixtures in basements.")

    p_heading3("2.3.2 Commercial CMMS Applications (Fiix, UpKeep, MaintainX)")
    p_body("Computerized Maintenance Management Systems (CMMS) are powerful industrial tools designed for manufacturing plants, heavy machinery maintenance, and commercial facilities. They excel at preventative maintenance schedules, asset lifecycle tracking, and replacement parts inventory. However, CMMS solutions are cost-prohibitive for university-wide student licensing, feature complex technician-centric interfaces, and fail to provide a simple, accessible experience for student residents.")

    p_heading3("2.3.3 Monolithic University ERP Portals")
    p_body("Certain universities incorporate maintenance forms within their monolithic enterprise student portals (e.g., ITS or Banner). While this provides unified authentication, these portals suffer from rigid release cycles, slow mobile interfaces, and monolithic coupling that prevents agile customization for individual hall management teams.")

    p_heading2("2.4 Comparative Evaluation of Existing Systems")
    p_body("Table 2.1 presents a systematic comparative analysis of existing maintenance management solutions against the operational requirements of university halls.")

    # Table 2.1
    create_styled_table(
        ["System Class", "Primary Focus", "Strengths", "Weaknesses in Hall Context", "HostelFix Differentiation"],
        [
            ["Paper Logbooks", "Physical check-in desk", "No training needed; zero tech cost", "Zero traceability; loss-prone; no metrics", "Converts entries into searchable digital ledger"],
            ["WhatsApp / SMS", "Informal peer messaging", "Ubiquitous; instant communication", "No status tracking; chat noise; unorganized", "Dedicated, noise-free maintenance tracking"],
            ["Enterprise IT (Jira)", "IT incident resolution", "Rich SLA rules; detailed reporting", "Overly complex; rigid assignment states", "Streamlined 4-stage operational record"],
            ["Industrial CMMS", "Heavy machinery / assets", "Preventative scheduling; inventory", "Very expensive; difficult student UX", "Lightweight, zero-cost, student-first UX"],
            ["University ERP", "Academic registration / fee", "Single sign-on with student records", "Slow interfaces; poor mobile experience", "Modern, lightning-fast Next.js 16 SPA"]
        ]
    )
    p_body("Table 2.1: Comparative Matrix of Maintenance Solutions in University Settings", italic=True)

    p_heading2("2.5 Theoretical and Technological Foundations")
    p_body("The technical realization of HostelFix is grounded in established software engineering and security paradigms:")

    p_heading3("2.5.1 Role-Based Access Control and Object-Level Authorization")
    p_body("Role-Based Access Control (RBAC) simplifies permission administration by grouping access rights into roles rather than assigning permissions to individual users (Sandhu et al., 1996). However, in a multi-tenant university environment where multiple halls share a single database, RBAC alone is insufficient. A Hall Manager possesses the 'hall_manager' role, but must be strictly prohibited from accessing tickets belonging to other halls. HostelFix implements object-level authorization predicates that evaluate both user role and entity tenancy attributes (e.g., issue.hallId in user.assignedHallIds).")

    p_heading3("2.5.2 Client-Server Architecture and React Server Components")
    p_body("HostelFix leverages the modern client-server architectural paradigm utilizing Next.js 16 with React 19. By employing React Server Components and client-side progressive enhancement, the system delivers immediate initial page loads while providing interactive, fluid client experiences for mobile and desktop users alike.")

    p_heading3("2.5.3 Modular Monolith Backend Paradigm")
    p_body("While microservice architectures have gained popularity, recent literature highlights their significant operational overhead, network latency, and distributed transaction complexity in small to medium institutional settings (Fowler, 2015). A modular monolith architecture organizes code into strictly encapsulated business modules within a single codebase and unified deployment unit, delivering high developer velocity, rapid testing, and simplified operations.")

    p_heading2("2.6 Identified Research Gaps and the HostelFix Approach")
    p_body("The literature and field investigations reveal a conspicuous gap: existing systems treat digital reporting as a prerequisite gatekeeper that must authorize physical work before repairs can commence. In university maintenance, physical reality operates independently of software. Caretakers often resolve urgent leaks within minutes of a verbal notice. When forced into rigid digital systems, workers bypass the software entirely, rendering the database obsolete.")

    p_body("HostelFix bridges this gap by decoupling the digital record from physical work authorization. The system acts as a reliable operational ledger that records four essential facts: what is broken, whether the hall team knows, whether it was repaired, and whether the student accepts the repair.")

    # =============================================================
    # CHAPTER THREE: RESEARCH METHODOLOGY AND SYSTEM DESIGN
    # =============================================================
    p_heading1("CHAPTER THREE: RESEARCH METHODOLOGY AND SYSTEM DESIGN")

    p_heading2("3.1 Research and Software Development Methodology")
    p_body("This project adopted an Agile Scrum software development methodology characterized by iterative development cycles, frequent prototype validation, and continuous requirement refinement. Agile was chosen over the traditional Waterfall model due to the necessity of testing workflow assumptions against real hall maintenance operational constraints.")

    p_body("Development was executed across four distinct two-week sprints:")
    p_bullet("Sprint 1: Domain modeling, requirements formalization, seed data curation for the nine halls, and database schema implementation in Mongoose.", bold_prefix="* ")
    p_bullet("Sprint 2: Backend REST API construction, JWT authentication, cookie session management, and object-level authorization policy enforcement.", bold_prefix="* ")
    p_bullet("Sprint 3: Next.js 16 frontend construction, responsive dashboard engineering, form validation with Zod, and Cloudinary CDN image upload integration.", bold_prefix="* ")
    p_bullet("Sprint 4: Automated testing suite construction (Vitest, RTL, Playwright), automated background cron job implementation, and local defense environment configuration.", bold_prefix="* ")

    p_heading2("3.2 Requirements Engineering and Analysis")

    p_heading3("3.2.1 Functional Requirements")
    p_body("The functional requirements specify the actions and services that HostelFix must perform:")
    p_bullet("FR-01: Multi-Role Authentication: Users must authenticate securely using their Student or Staff ID and a 5-digit PIN.", bold_prefix="* ")
    p_bullet("FR-02: Controlled Issue Logging: Students must submit maintenance reports by selecting verified halls, blocks, floors, and rooms from a controlled database directory, with optional photo upload.", bold_prefix="* ")
    p_bullet("FR-03: Single-Tap Acknowledgment: Hall Managers must be able to acknowledge incoming submissions in a single action to confirm institutional awareness.", bold_prefix="* ")
    p_bullet("FR-04: Flexible Resolution Recording: Authorized staff must be able to record issue resolution directly, regardless of whether prior intermediate assignments were logged.", bold_prefix="* ")
    p_bullet("FR-05: Student Verification and Dispute Window: Students must be able to dispute a resolution within 48 hours, returning the issue to the active queue.", bold_prefix="* ")
    p_bullet("FR-06: Asynchronous Auto-Closure: Resolved issues with expired dispute windows must be automatically transitioned to 'Closed' by a background job.", bold_prefix="* ")
    p_bullet("FR-07: Immutable Event Auditing: Every state transition, priority modification, and administrative action must produce an immutable audit log and issue event.", bold_prefix="* ")
    p_bullet("FR-08: Cross-Hall Analytics: Central administrators must be provided with real-time analytics comparing resolution performance and defect volumes across halls.", bold_prefix="* ")

    p_heading3("3.2.2 Non-Functional Requirements")
    p_bullet("NFR-01: Security and Tenant Isolation: The API must enforce strict object-level access boundaries to ensure zero cross-hall data leakage.", bold_prefix="* ")
    p_bullet("NFR-02: Performance and Latency: Core API responses must resolve in under 200ms under standard operational loads, supported by compound database indexes.", bold_prefix="* ")
    p_bullet("NFR-03: Responsive Usability: The frontend must render seamlessly on mobile devices, tablets, and desktop displays.", bold_prefix="* ")
    p_bullet("NFR-04: Reliability and Resilience: Notification failures or external CDN latency must not block the transactional recording of maintenance issues.", bold_prefix="* ")

    # Table 3.1
    p_heading3("3.2.3 Controlled Residence Directory")
    p_body("To eliminate free-text location ambiguity, the system pre-seeds and enforces the nine approved University of Ghana residential halls:")

    create_styled_table(
        ["Hall Name", "Hall Classification", "Reference Prefix", "Standard Blocks / Quarters"],
        [
            ["Akuafo Hall", "Traditional Hall", "AKU", "Main Block, Annex A, Annex B, Chapel Block"],
            ["Legon Hall", "Traditional Hall", "LEG", "Main Court, Annex A, Annex B, Graduate Block"],
            ["Volta Hall", "Traditional Hall (Female)", "VOL", "Main Block, Annex, Old Block"],
            ["Commonwealth Hall", "Traditional Hall (Male)", "COM", "Main Court, Lower Blocks, Annex"],
            ["Mensah Sarbah Hall", "Traditional Hall", "SAR", "Main Hall, Annex A, Annex B, OK Flats"],
            ["Hilla Limann Hall", "UGEL Hall", "LIM", "Blocks A, B, C, D"],
            ["Alexander Adum Kwapong Hall", "UGEL Hall", "KWA", "Blocks A, B, C, D"],
            ["Elizabeth Frances Sey Hall", "UGEL Hall", "SEY", "Blocks A, B, C, D"],
            ["Jean Nelson Aka Hall", "UGEL Hall", "JNA", "Blocks A, B, C, D"]
        ]
    )
    p_body("Table 3.1: Approved University of Ghana Halls and Prefixes", italic=True)

    p_heading2("3.3 High-Level System Architecture")
    p_body("HostelFix utilizes a 3-tier modular monolith architecture that cleanly separates presentation, business logic, and persistence while maintaining a unified, easily deployable codebase.")

    p_body("Figure 3.1 illustrates the comprehensive multi-tier architectural topology of the HostelFix system:")
    add_figure("/Users/kaeytee/Desktop/Joenick/HostelFix/docs/diagrams/fig_3_1_architecture.png", "Figure 3.1: Multi-Tier Modular Monolith Architecture Diagram")

    p_heading2("3.4 Operational Workflow Design (ADR 001)")
    p_body("The central conceptual innovation of HostelFix is the simplification of the maintenance ticket lifecycle, formally codified as Architectural Decision Record 001 (ADR 001).")

    p_heading3("3.4.1 Critique of Traditional Six-Stage Workflows")
    p_body("Standard ticketing systems enforce a rigid linear progression: Submitted -> Verified -> Assigned -> In Progress -> Resolved -> Closed. In a university hall environment, this model fails catastrophically. When a water pipe bursts at 11:00 PM, a caretaker does not wait for a hall manager to log in, verify the submission, and assign a work order. The caretaker immediately stops the leak. If the software demands adherence to intermediate states, the digital record lags behind physical reality, and staff abandon the system.")

    p_heading3("3.4.2 The Four-State Operational Model")
    p_body("HostelFix eliminates mandatory intermediate gating states. The core state machine consists of four lightweight operational facts:")
    p_bullet("Submitted: The problem has been logged into the system by a student resident.", bold_prefix="1. ")
    p_bullet("Acknowledged: The responsible hall management team has confirmed awareness of the report.", bold_prefix="2. ")
    p_bullet("Resolved: The physical defect has been repaired by maintenance personnel or caretaker.", bold_prefix="3. ")
    p_bullet("Closed: The resolution has been confirmed by the resident or auto-closed following dispute expiry.", bold_prefix="4. ")

    p_body("Figure 3.2 illustrates the complete state transition model including direct resolution and dispute cycles:")
    add_figure("/Users/kaeytee/Desktop/Joenick/HostelFix/docs/diagrams/fig_3_2_state_machine.png", "Figure 3.2: Simplified Operational State Machine Diagram (ADR 001)")

    p_heading3("3.4.3 Operational Rules of the State Machine")
    p_bullet("Rule 1: Direct Resolution Allowed: An issue can transition directly from 'Submitted' to 'Resolved'. This accommodates offline emergency repairs.", bold_prefix="* ")
    p_bullet("Rule 2: Assignment is Metadata: Assigning an artisan is supported as operational metadata, but is never a mandatory gateway state.", bold_prefix="* ")
    p_bullet("Rule 3: Reopen Within 48 Hours: When an issue is resolved, a 48-hour dispute window opens. If the student reports that the problem persists, the issue transitions to 'Reopened'.", bold_prefix="* ")
    p_bullet("Rule 4: Autonomous Closure: If the 48-hour dispute window expires with no student objection, an automated cron job transitions the issue to 'Closed'.", bold_prefix="* ")

    p_heading2("3.5 Database Modeling and Data Architecture")
    p_body("HostelFix utilizes MongoDB as its primary datastore, leveraging Mongoose for schema definition, runtime validation, and population.")

    p_heading3("3.5.1 Schema Design and Core Collections")
    p_body("The database structure consists of six interrelated collections:")
    p_bullet("users: Stores user accounts, institutional IDs, bcrypt password hashes, system roles, and assigned hall arrays.", bold_prefix="1. ")
    p_bullet("halls: Stores the nine approved university halls, their official codes, and active statuses.", bold_prefix="2. ")
    p_bullet("locations: Stores pre-approved blocks, floors, and room numbers linked to specific halls.", bold_prefix="3. ")
    p_bullet("issues: Stores the core maintenance tickets, references, categories, priorities, statuses, and dispute timestamps.", bold_prefix="4. ")
    p_bullet("issue_events: An append-only historical log recording every status change, actor ID, and metadata update.", bold_prefix="5. ")
    p_bullet("audit_logs: An immutable security collection recording critical actions (role updates, auth events, deletions).", bold_prefix="6. ")

    # Table 3.2
    p_heading3("3.5.2 Issue Schema Field Definitions")
    create_styled_table(
        ["Field Name", "BSON Type", "Constraints / Validation", "Functional Purpose"],
        [
            ["_id", "ObjectId", "Primary Key, Auto-generated", "Unique document identifier"],
            ["referenceNumber", "String", "Unique, Indexed, Format: HF-XXX-YYYYMMDD-XXXX", "Human-readable tracking identifier"],
            ["title", "String", "Required, Trimmed, Max 120 chars", "Concise summary of the defect"],
            ["description", "String", "Required, Trimmed, Max 2000 chars", "Detailed narrative of the problem"],
            ["category", "String", "Enum: plumbing, electrical, carpentry, masonry, appliance, pest, other", "Maintenance trade classification"],
            ["priority", "String", "Enum: low, medium, high, emergency", "Operational urgency indicator"],
            ["status", "String", "Enum: submitted, acknowledged, in_progress, resolved, closed, rejected, reopened", "Current operational state"],
            ["hallId", "ObjectId", "Ref: Hall, Required, Indexed", "Tenancy boundary for hall scoping"],
            ["locationId", "ObjectId", "Ref: Location, Required", "Specific physical room or common area"],
            ["reporterId", "ObjectId", "Ref: User, Required, Indexed", "Student ownership reference"],
            ["assigneeId", "ObjectId", "Ref: User, Optional, Indexed", "Assigned maintenance technician"],
            ["images", "Array of Objects", "Max 5 items (url, publicId)", "Cloudinary CDN image metadata"],
            ["disputeWindowExpiresAt", "Date", "Optional, Indexed", "Timestamp for automated closure job"],
            ["createdAt / updatedAt", "Date", "Timestamps, Auto-managed", "Audit tracking of record creation"]
        ]
    )
    p_body("Table 3.2: Issue Schema Field Definitions and Types", italic=True)

    # Table 3.3
    p_heading3("3.5.3 Indexing Strategy")
    p_body("To maintain sub-200ms query performance across tens of thousands of maintenance records, compound and unique indexes were implemented:")

    create_styled_table(
        ["Target Collection", "Index Specification", "Index Type", "Performance Justification"],
        [
            ["users", "{ studentId: 1 }", "Unique", "Fast O(1) user lookups during authentication"],
            ["issues", "{ referenceNumber: 1 }", "Unique", "Instant lookup by ticket reference string"],
            ["issues", "{ hallId: 1, status: 1, createdAt: -1 }", "Compound", "Accelerates Hall Manager dashboard queries"],
            ["issues", "{ reporterId: 1, createdAt: -1 }", "Compound", "Optimizes Student 'My Issues' history listing"],
            ["issues", "{ status: 1, disputeWindowExpiresAt: 1 }", "Compound", "Powers hourly BullMQ auto-close background query"],
            ["locations", "{ hallId: 1, block: 1, room: 1 }", "Unique Compound", "Eliminates duplicate room definitions"]
        ]
    )
    p_body("Table 3.3: Database Indexing Strategy and Rationale", italic=True)

    p_heading3("3.5.4 Entity-Relationship Model (ERD)")
    p_body("Figure 3.3 presents the complete Entity-Relationship Diagram (ERD) defining the six core collections, primary and foreign keys, data attributes, and cardinality associations:")
    add_figure("/Users/kaeytee/Desktop/Joenick/HostelFix/docs/diagrams/fig_3_3_erd.png", "Figure 3.3: Complete Entity-Relationship Diagram (ERD)")

    p_heading2("3.6 Security Architecture and Authorization Model")
    p_body("Security in HostelFix is enforced through defense-in-depth principles across transport, authentication, and authorization layers.")

    p_heading3("3.6.1 Authentication Mechanism")
    p_body("Authentication utilizes dual-token JSON Web Tokens (JWT). When a user submits their ID and 5-digit PIN, the server verifies the hash using bcrypt with 12 salt rounds. Upon verification, the server generates:")
    p_bullet("An access token (short-lived, 15 minutes) signed with HMAC-SHA256 containing userId and role.", bold_prefix="* ")
    p_bullet("A refresh token (long-lived, 7 days) stored as an opaque cryptographic string in an HTTP-only, SameSite=Strict cookie.", bold_prefix="* ")
    p_body("This structure protects against Cross-Site Scripting (XSS) credential theft while eliminating persistent database sessions.")

    # Table 3.4
    p_heading3("3.6.2 Role-Based Access Control and Capability Matrix")
    p_body("Table 3.4 defines the comprehensive permission matrix across the five user roles:")

    create_styled_table(
        ["Capability / Permission", "Student", "Hall Manager", "Maintenance", "University Admin", "System Admin"],
        [
            ["Submit New Maintenance Issue", "Yes (Own hall)", "Yes (Own hall)", "No", "No", "Yes"],
            ["View Issue Details", "Own issues only", "Assigned hall only", "Assigned issues", "All halls", "All halls"],
            ["Acknowledge Issue", "No", "Yes (Assigned hall)", "No", "Yes", "Yes"],
            ["Assign Issue to Artisan", "No", "Yes (Assigned hall)", "No", "Yes", "Yes"],
            ["Mark Issue as Resolved", "No", "Yes (Assigned hall)", "Yes (Assigned)", "Yes", "Yes"],
            ["Dispute Resolution (Reopen)", "Yes (Own issues)", "No", "No", "No", "Yes"],
            ["View Cross-Hall Analytics", "No", "No", "No", "Yes", "Yes"],
            ["Manage User Roles & Settings", "No", "No", "No", "No", "Yes"]
        ]
    )
    p_body("Table 3.4: Role-Based Access Control and Capability Matrix", italic=True)

    # =============================================================
    # CHAPTER FOUR: EXPERIMENTAL RESULTS AND EVALUATION
    # =============================================================
    p_heading1("CHAPTER FOUR: EXPERIMENTAL RESULTS AND EVALUATION")

    p_heading2("4.1 Implementation Environment and Technology Stack")
    p_body("The development and evaluation of HostelFix were conducted on a macOS platform hosting a local development environment. Both frontend and backend services were executed concurrently with dedicated databases and external services.")

    # Table 4.1
    create_styled_table(
        ["Component Layer", "Technology Selected", "Version", "Operational Role in System"],
        [
            ["Runtime Environment", "Node.js", "v22.21.0", "Asynchronous JavaScript execution engine"],
            ["Package Management", "pnpm", "v10.32.1", "Fast, disk-efficient dependency manager"],
            ["Frontend Framework", "Next.js (App Router)", "v16.3.4", "Server-side rendering, routing, client hydration"],
            ["UI Component Library", "React / Tailwind CSS", "v19.2.8 / v4", "Modular UI styling, animations, responsive design"],
            ["Form Validation", "React Hook Form / Zod", "v7.87 / v4.5", "Type-safe client and server runtime validation"],
            ["Backend Framework", "Express / TypeScript", "v5.0.0 / v5.0", "Modular REST API routing, middleware pipeline"],
            ["Database Layer", "MongoDB / Mongoose", "v7.0.0 / v8.0", "NoSQL document persistence, schema enforcement"],
            ["Job Queue Engine", "BullMQ / Redis", "v5.0.0 / v7.0", "Asynchronous scheduled crons and notification jobs"],
            ["Automated Testing", "Vitest / RTL / Playwright", "v5.0 / v16 / v1.63", "Unit, integration, and browser end-to-end testing"]
        ]
    )
    p_body("Table 4.1: Implementation Technology Stack Summary", italic=True)

    p_heading2("4.2 Presentation of the Implemented Application")
    p_body("The operational application was inspected and verified across all five user roles using live Playwright browser automation and manual validation. The following sub-sections present the live interface screenshots captured directly from the executing system.")

    p_heading3("4.2.1 Authentication and Access Control Portal")
    p_body("The authentication portal provides a secure, streamlined gateway where students and staff enter their institutional identifier and 5-digit PIN. Form validation executes client-side to ensure proper numeric format before dispatching network requests.")

    add_figure("/Users/kaeytee/Desktop/Joenick/HostelFix/docs/screenshots/01_login_page.png", "Figure 4.1: Secure Authentication Portal (ID and PIN)")

    p_heading3("4.2.2 Student Resident Experience")
    p_body("Upon successful authentication, a student resident is directed to their personalized dashboard. The interface highlights total tickets reported, pending acknowledgments, active repairs, and resolved items.")

    add_figure("/Users/kaeytee/Desktop/Joenick/HostelFix/docs/screenshots/02_student_dashboard.png", "Figure 4.2: Student Resident Dashboard with Status Metrics")

    p_body("Reporting a maintenance issue is initiated via the 'Report Issue' interface. The form enforces data integrity through controlled dropdowns for hall, block, floor, and room, paired with category and priority selections.")

    add_figure("/Users/kaeytee/Desktop/Joenick/HostelFix/docs/screenshots/03_student_report_issue.png", "Figure 4.3: Structured Issue Reporting Form with Directory Selection")

    p_body("Students track their historical and active maintenance tickets through the comprehensive Issues List view.")

    add_figure("/Users/kaeytee/Desktop/Joenick/HostelFix/docs/screenshots/04_student_issues_list.png", "Figure 4.4: Student Maintenance Issues History and Tracking View")

    p_body("Selecting an individual issue displays the Issue Detail view. This screen showcases the immutable event timeline, current status badge, priority indicators, and dispute action buttons.")

    add_figure("/Users/kaeytee/Desktop/Joenick/HostelFix/docs/screenshots/05_issue_detail_view.png", "Figure 4.5: Issue Detail View and Lifecycle Audit Timeline")

    p_heading3("4.2.3 Hall Management Operations")
    p_body("Hall Managers are provided with an operational dashboard strictly scoped to their assigned residential facility. The view displays incoming submissions requiring acknowledgment, urgent issues, and hall resolution metrics.")

    add_figure("/Users/kaeytee/Desktop/Joenick/HostelFix/docs/screenshots/06_hall_manager_dashboard.png", "Figure 4.6: Hall Manager Operations Dashboard Scoped to Hall")

    p_body("The Hall Manager Issue Triage panel allows administrators to acknowledge issues with a single click, reprioritize tickets, and dispatch maintenance technicians.")

    add_figure("/Users/kaeytee/Desktop/Joenick/HostelFix/docs/screenshots/07_hall_manager_issues.png", "Figure 4.7: Hall Manager Issue Triage and Allocation Panel")

    p_heading3("4.2.4 Maintenance Personnel Work Orders")
    p_body("Maintenance staff access a dedicated work order queue that highlights jobs awaiting physical repairs. Artisans can inspect defect locations and mark completed repairs as resolved.")

    add_figure("/Users/kaeytee/Desktop/Joenick/HostelFix/docs/screenshots/08_maintenance_dashboard.png", "Figure 4.8: Maintenance Personnel Work Order Queue")

    p_heading3("4.2.5 University and System Administration")
    p_body("For university leadership, HostelFix provides high-level executive oversight across all nine campus halls, offering comparative performance analytics and historical trend analysis.")

    add_figure("/Users/kaeytee/Desktop/Joenick/HostelFix/docs/screenshots/09_university_admin_dashboard.png", "Figure 4.9: University Administrator Executive Overview")

    p_body("The Maintenance Analytics dashboard enables central authorities to track average resolution durations, recurring failure categories, and resource allocation efficiency.")

    add_figure("/Users/kaeytee/Desktop/Joenick/HostelFix/docs/screenshots/10_admin_analytics.png", "Figure 4.10: Cross-Campus Maintenance Analytics and Metrics")

    p_body("System Administrators utilize the Governance Portal to manage system configurations, global user directory roles, and inspect security audit logs.")

    add_figure("/Users/kaeytee/Desktop/Joenick/HostelFix/docs/screenshots/11_system_admin_dashboard.png", "Figure 4.11: System Administration Dashboard and Governance Portal")

    p_heading2("4.3 Automated Verification and Testing Strategy")
    p_body("Software verification was executed through a comprehensive testing pyramid encompassing backend unit and integration tests, frontend component tests, security policy validation, and browser end-to-end automation.")

    # Table 4.2
    p_heading3("4.3.1 Automated Test Execution Summary")
    p_body("The automated test suite executed across the entire repository achieved a 100% pass rate across 48 automated test cases in 15 test suites:")

    create_styled_table(
        ["Test Suite Category", "Testing Framework", "Test Files", "Total Tests", "Passed", "Execution Time"],
        [
            ["Backend Authentication & API", "Vitest + Supertest", "3", "9", "9", "4.82s"],
            ["Backend Security & Isolation", "Vitest", "4", "5", "5", "4.86s"],
            ["Backend Logic & Background Jobs", "Vitest", "3", "16", "16", "3.25s"],
            ["Frontend UI & Branding", "Vitest + RTL", "4", "11", "11", "1.45s"],
            ["Playwright Browser Automation", "Playwright (Chromium)", "1", "7", "7", "7.40s"],
            ["Total Test Coverage", "Full Test Pyramid", "15", "48", "48", "21.78s"]
        ]
    )
    p_body("Table 4.2: Automated Verification and Testing Summary (48/48 Passed)", italic=True)

    p_heading2("4.4 Security and Permission-Denial Test Matrix")
    p_body("The primary security objective of HostelFix is enforcing tenant isolation and object-level authorization across halls. Regression tests verify that unauthorized actions are systematically rejected by the API layer:")

    # Table 4.3
    create_styled_table(
        ["Test ID", "Security Scenario", "HTTP Route / Action", "Executing Actor", "Expected HTTP Status", "Verified Result"],
        [
            ["SEC-01", "Student cross-access isolation", "GET /api/v1/issues/:otherStudentIssue", "Student B", "403 Forbidden", "Passed"],
            ["SEC-02", "Hall Manager tenancy boundary", "GET /api/v1/issues?hallId=:unassigned", "Hall Manager A", "403 Forbidden", "Passed"],
            ["SEC-03", "Privilege escalation denial", "PATCH /api/v1/users/:id/roles", "Hall Manager", "403 Forbidden", "Passed"],
            ["SEC-04", "Arbitrary self-assignment prevention", "PATCH /api/v1/issues/:id/assignee", "Maintenance Staff", "403 Forbidden", "Passed"],
            ["SEC-05", "Invalid PIN format rejection", "POST /api/v1/auth/login", "Anonymous", "400 Bad Request", "Passed"],
            ["SEC-06", "Expired dispute auto-closure", "Scheduled Background Cron Job", "System Worker", "Status -> Closed", "Passed"]
        ]
    )
    p_body("Table 4.3: Security and Permission-Denial Test Evaluation Matrix", italic=True)

    p_heading2("4.5 Playwright End-to-End Browser Automation Results")
    p_body("Browser automation testing was performed using Playwright against the live running Next.js application (port 3000) and Express API (port 5001). All seven end-to-end scenarios passed with zero failures:")

    # Table 4.4
    create_styled_table(
        ["Test ID", "End-to-End Test Description", "Simulated User", "Key Assertions Verified", "Result"],
        [
            ["TC-01", "Authentication page accessibility", "Guest User", "Title matches HostelFix; form inputs and labels visible", "Passed (655ms)"],
            ["TC-02", "Client validation of PIN length", "Guest User", "Sub-5-digit PIN triggers instant inline validation error", "Passed (510ms)"],
            ["TC-03", "Student login and issue creation flow", "Student (11287773)", "Redirects to /dashboard; navigates to /issues/new", "Passed (1.3s)"],
            ["TC-04", "Hall Manager login and scoping", "Hall Manager (10000001)", "Redirects to dashboard; displays hall scoped data", "Passed (1.1s)"],
            ["TC-05", "Maintenance staff work queue", "Maintenance (10000002)", "Redirects to work order queue; renders issue items", "Passed (1.1s)"],
            ["TC-06", "University Admin cross-hall review", "Uni Admin (10000003)", "Renders executive dashboard and multi-hall analytics", "Passed (1.1s)"],
            ["TC-07", "System Admin governance access", "Sys Admin (10000004)", "Renders system configuration and role settings", "Passed (1.1s)"]
        ]
    )
    p_body("Table 4.4: Playwright End-to-End Browser Test Scenarios (7/7 Passed)", italic=True)

    p_heading2("4.6 Discussion on System Efficacy and Operational Alignment")
    p_body("The empirical results confirm that HostelFix resolves the structural weaknesses of traditional maintenance reporting:")

    p_bullet("Elimination of Paper Logbook Vulnerabilities: By transitioning reports to a digital ledger with compound indexing, maintenance records are permanently preserved, instantly searchable, and accessible remotely.", bold_prefix="1. ")
    p_bullet("Frictionless Physical Alignment: Permitting direct transitions from 'Submitted' to 'Resolved' enables caretakers to handle emergency repairs offline while preserving complete digital accounting.", bold_prefix="2. ")
    p_bullet("Guaranteed Student Recourse: The 48-hour dispute window balances administrative closure efficiency with student satisfaction, preventing premature ticket dismissal.", bold_prefix="3. ")
    p_bullet("Bulletproof Multi-Tenancy: The combination of role-based authorization and object-level hall boundary predicates guarantees that student records remain confidential within their assigned residential halls.", bold_prefix="4. ")

    # =============================================================
    # CHAPTER FIVE: CONCLUDING REMARKS AND FUTURE WORK
    # =============================================================
    p_heading1("CHAPTER FIVE: CONCLUDING REMARKS AND FUTURE WORK")

    p_heading2("5.1 Summary of Findings")
    p_body("This project successfully designed, implemented, and empirically evaluated HostelFix, a role-based maintenance reporting and tracking system tailored specifically for the University of Ghana residential halls. The investigation demonstrated that traditional maintenance reporting failures in university halls stem not from lack of effort by caretakers, but from communication fragmentation and the absence of a unified, lightweight operational record.")

    p_body("The implementation validated that simplifying the issue lifecycle from a rigid six-stage workflow to a four-stage operational record (Submitted, Acknowledged, Resolved, Closed) eliminates administrative bottlenecks while retaining full institutional traceability. Automated verification across 48 unit, integration, security, and Playwright browser tests proved that the system enforces object-level access boundaries, achieves sub-200ms query performance, and operates reliably across all five administrative and student roles.")

    p_heading2("5.2 Practical and Intellectual Contributions")
    p_bullet("Conceptual Workflow Contribution: Formalized and validated ADR 001, demonstrating that digital systems supporting physical maintenance must treat intermediate operational states as optional metadata rather than mandatory blocking gateways.", bold_prefix="* ")
    p_bullet("Tenant Isolation Model: Engineered an object-level authorization engine combining role-based checks with dynamic hall-tenancy predicates, establishing a blueprint for multi-hall educational systems.", bold_prefix="* ")
    p_bullet("Production-Ready Institutional Asset: Delivered a responsive, modern web application backed by an automated test pyramid that the University of Ghana can deploy to modernize facility maintenance across campus.", bold_prefix="* ")

    p_heading2("5.3 Limitations of the Current Implementation")
    p_body("Despite the robust implementation, several limitations are acknowledged:")
    p_bullet("Duplicate Report Linking: When multiple residents in a hall report the same broken corridor light, the system currently tracks each submission as an independent ticket rather than merging them into a parent issue.", bold_prefix="1. ")
    p_bullet("Mandatory Completion Evidence: While photographic evidence can be uploaded during issue creation, the resolution form does not yet mandate technicians to upload 'after-repair' photographs.", bold_prefix="2. ")
    p_bullet("Empirical Longitudinal Data: While functional correctness and security were rigorously proven via automated tests, longitudinal user satisfaction metrics across a full academic semester remain to be gathered.", bold_prefix="3. ")

    p_heading2("5.4 Recommendations for Future Research and Development")
    p_bullet("Automated Duplicate Detection: Future research should investigate natural language processing and spatial matching to automatically flag and group duplicate reports occurring in the same block or floor.", bold_prefix="1. ")
    p_bullet("Progressive Web App (PWA) Offline Capabilities: Developing offline-first service workers will enable artisans to view assigned work orders in underground basements with poor cellular coverage.", bold_prefix="2. ")
    p_bullet("Predictive Maintenance Analytics: Leveraging historical audit log data with machine learning algorithms can predict seasonal equipment failure rates, assisting university procurement planning.", bold_prefix="3. ")
    p_bullet("Integration with Institutional SIS / ERP: Future iterations should explore federated Single Sign-On (SSO) integration with the University of Ghana Student Information System for automated residential allocation syncing.", bold_prefix="4. ")

    # =============================================================
    # REFERENCES
    # =============================================================
    p_heading1("REFERENCES")

    references = [
        "Fowler, M. (2015). MonolithFirst. MartinFowler.com. Retrieved from https://martinfowler.com/bliki/MonolithFirst.html",
        "Lateef, F. O. (2010). Building maintenance management in higher education institutions: A case study of Malaysian public universities. Journal of Building Appraisal, 6(1), 41-52.",
        "Mongoose Documentation. (2024). Elegant MongoDB object modeling for Node.js. Automattic. Retrieved from https://mongoosejs.com/",
        "Next.js Documentation. (2024). App Router and React Server Components. Vercel Inc. Retrieved from https://nextjs.org/docs",
        "Playwright Documentation. (2024). Fast and reliable end-to-end testing for modern web apps. Microsoft. Retrieved from https://playwright.dev/",
        "Sandhu, R. S., Coyne, E. J., Feinstein, H. L., & Youman, C. E. (1996). Role-based access control models. IEEE Computer, 29(2), 38-47.",
        "Sommerville, I. (2015). Software Engineering (10th ed.). Boston, MA: Pearson Education.",
        "University of Ghana. (2020). Basic Laws of the University of Ghana. University of Ghana Governance Series. Legon, Ghana.",
        "University of Ghana Enterprises Limited (UGEL). (2022). Hostels Management and Student Regulations Handbook. Legon, Ghana.",
        "Vitest Documentation. (2024). Next generation testing framework. Retrieved from https://vitest.dev/",
        "Wireman, T. (2004). Computerized Maintenance Management Systems (2nd ed.). New York, NY: Industrial Press.",
        "Zod Documentation. (2024). TypeScript-first schema validation with static type inference. Retrieved from https://zod.dev/"
    ]

    for ref in references:
        p_ref = doc.add_paragraph()
        p_ref.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p_ref.paragraph_format.left_indent = Inches(0.5)
        p_ref.paragraph_format.first_line_indent = Inches(-0.5)
        p_ref.paragraph_format.space_after = Pt(6)
        p_ref.paragraph_format.line_spacing_rule = WD_LINE_SPACING.ONE_POINT_FIVE
        r = p_ref.add_run(ref)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)

    # =============================================================
    # APPENDICES
    # =============================================================
    p_heading1("APPENDICES")

    p_heading2("Appendix A: System Deployment and Local Execution Guide")
    p_body("Prerequisites: Node.js (v18+), MongoDB (v6+), Redis, pnpm.")
    p_bullet("1. Clone repository: git clone https://github.com/austinbediako/HostelFix.git", bold_prefix="Step 1: ")
    p_bullet("2. Configure environment: Copy .env.example to .env in both /backend and /frontend.", bold_prefix="Step 2: ")
    p_bullet("3. Install backend dependencies: cd backend && pnpm install", bold_prefix="Step 3: ")
    p_bullet("4. Seed initial database: pnpm run seed:dev (creates halls, locations, test accounts).", bold_prefix="Step 4: ")
    p_bullet("5. Start backend development server: pnpm run dev (runs on port 5001).", bold_prefix="Step 5: ")
    p_bullet("6. Install frontend dependencies: cd ../frontend && pnpm install", bold_prefix="Step 6: ")
    p_bullet("7. Start frontend Next.js server: pnpm run dev (runs on port 3000).", bold_prefix="Step 7: ")
    p_bullet("8. Execute automated Playwright E2E tests: pnpm exec playwright test", bold_prefix="Step 8: ")

    p_heading2("Appendix B: Seeded Test Accounts and Credentials Matrix")
    create_styled_table(
        ["Institutional ID", "PIN", "Role Assigned", "Name", "Assigned Hall Scope"],
        [
            ["11287773", "12345", "student", "Asante Gideon Kwadwo", "Alexander Adum Kwapong Hall"],
            ["10000001", "12345", "hall_manager", "Kwame Osei", "Alexander Adum Kwapong Hall"],
            ["10000002", "12345", "maintenance", "Emmanuel Mensah", "Alexander Adum Kwapong Hall"],
            ["10000003", "12345", "university_admin", "Dr. Abena Poku", "All University Halls"],
            ["10000004", "12345", "system_admin", "System Administrator", "Global System Scope"]
        ]
    )
    p_body("Table B.1: Provisioned Test Account Credentials Matrix", italic=True)

    p_heading2("Appendix C: REST API Contract Specifications")
    p_bullet("POST /api/v1/auth/login: Authenticate with ID and PIN. Returns JWT and sets HTTP-only refresh cookie.", bold_prefix="Auth: ")
    p_bullet("POST /api/v1/auth/refresh: Renew access token using opaque refresh cookie.", bold_prefix="Auth: ")
    p_bullet("GET /api/v1/issues: Query issues list. Filtered by role and hall boundary.", bold_prefix="Issues: ")
    p_bullet("POST /api/v1/issues: Create a new maintenance issue with title, description, category, and location.", bold_prefix="Issues: ")
    p_bullet("GET /api/v1/issues/:id: Fetch complete issue details with chronological lifecycle event history.", bold_prefix="Issues: ")
    p_bullet("PATCH /api/v1/issues/:id/acknowledge: Acknowledge submitted issue (Hall Manager only).", bold_prefix="Issues: ")
    p_bullet("PATCH /api/v1/issues/:id/resolve: Record repair resolution (Maintenance or Hall Manager).", bold_prefix="Issues: ")
    p_bullet("PATCH /api/v1/issues/:id/reopen: Dispute resolution within 48-hour window (Student owner only).", bold_prefix="Issues: ")
    p_bullet("GET /api/v1/halls: Fetch list of all nine approved traditional and UGEL halls.", bold_prefix="Halls: ")
    p_bullet("GET /api/v1/locations?hallId=:id: Fetch pre-approved blocks and rooms for a specific hall.", bold_prefix="Locations: ")

    p_heading2("Appendix D: Playwright End-to-End Test Suite Script")
    p_body("The complete Playwright automated test specification located in frontend/tests/e2e/workflow.spec.ts verifies multi-role login, input validation, and navigation integrity:")
    p_body("```typescript\nimport { test, expect } from '@playwright/test';\n\ntest.describe('HostelFix End-to-End Suite', () => {\n  test('TC-01: Authentication page loads with accessible elements', async ({ page }) => {\n    await page.goto('/login');\n    await expect(page).toHaveTitle(/HostelFix|Login/i);\n    await expect(page.locator('#id')).toBeVisible();\n    await expect(page.locator('#pin')).toBeVisible();\n  });\n\n  test('TC-02: Authentication rejects invalid pin format', async ({ page }) => {\n    await page.goto('/login');\n    await page.fill('#id', '11287773');\n    await page.fill('#pin', '123');\n    await page.click('button[type=\"submit\"]');\n    await expect(page.locator('#pin-error')).toContainText('PIN must be exactly 5 digits');\n  });\n\n  test('TC-03: Student logs in and navigates to issue reporting', async ({ page }) => {\n    await page.goto('/login');\n    await page.fill('#id', '11287773');\n    await page.fill('#pin', '12345');\n    await page.click('button[type=\"submit\"]');\n    await expect(page).toHaveURL(/.*dashboard/);\n    await page.goto('/dashboard/issues/new');\n    await expect(page).toHaveURL(/.*dashboard\\/issues\\/new/);\n  });\n});\n```")

    # -------------------------------------------------------------
    # SAVE DOCUMENT
    # -------------------------------------------------------------
    out_path_docx = "/Users/kaeytee/Desktop/Joenick/HostelFix/Gideon.docx"
    out_path_no_ext = "/Users/kaeytee/Desktop/Joenick/HostelFix/Gideon"
    
    doc.save(out_path_docx)
    print(f"Saved {out_path_docx}")
    
    import shutil
    shutil.copyfile(out_path_docx, out_path_no_ext)
    print(f"Saved {out_path_no_ext}")

if __name__ == "__main__":
    create_document()
