# Script to export full thesis to Markdown artifact

from data_prelims import PRELIMS_DATA
from data_ch1 import CH1_DATA
from data_ch2 import CH2_DATA
from data_ch3 import CH3_DATA
from data_ch4 import CH4_DATA
from data_ch5 import CH5_DATA
from data_references import REFERENCES_DATA
from data_appendices import APPENDICES_DATA

def sanitize(text):
    if not isinstance(text, str):
        return text
    return text.replace('\u2014', ' - ').replace('\u2013', '-').replace('--', ' - ')

lines = []
lines.append('# ' + sanitize(PRELIMS_DATA['title']))
lines.append('## ' + sanitize(PRELIMS_DATA['subtitle']))
lines.append('')
lines.append('**Candidate:** ' + PRELIMS_DATA['candidate']['name'] + '  ')
lines.append('**Student ID:** ' + PRELIMS_DATA['candidate']['id'] + '  ')
lines.append('**Degree:** ' + PRELIMS_DATA['candidate']['degree'] + '  ')
lines.append('**Department:** ' + PRELIMS_DATA['candidate']['department'] + '  ')
lines.append('**College:** ' + PRELIMS_DATA['candidate']['college'] + '  ')
lines.append('**Supervisor:** ' + PRELIMS_DATA['supervisor']['name'] + '  ')
lines.append('**Institution:** ' + PRELIMS_DATA['candidate']['institution'] + '  ')
lines.append('**Date:** ' + PRELIMS_DATA['candidate']['submission_date'] + '  ')
lines.append('')
lines.append('---')
lines.append('')
lines.append('## ABSTRACT')
lines.append(sanitize(PRELIMS_DATA['abstract']))
lines.append('')
lines.append('---')
lines.append('')
lines.append('## DEDICATION')
lines.append(sanitize(PRELIMS_DATA['dedication']))
lines.append('')
lines.append('---')
lines.append('')
lines.append('## ACKNOWLEDGEMENTS')
lines.append(sanitize(PRELIMS_DATA['acknowledgements']))
lines.append('')
lines.append('---')
lines.append('')

# Chapter 1
lines.append(f"# CHAPTER {CH1_DATA['chapter_number']}: {CH1_DATA['chapter_title']}")
for sec in CH1_DATA['sections']:
    lines.append(f"## {sec['num']} {sec['title']}")
    for p in sec['paragraphs']:
        lines.append(sanitize(p) + '\n')

# Chapter 2
lines.append(f"# CHAPTER {CH2_DATA['chapter_number']}: {CH2_DATA['chapter_title']}")
for sec in CH2_DATA['sections']:
    lines.append(f"## {sec['num']} {sec['title']}")
    for p in sec['paragraphs']:
        lines.append(sanitize(p) + '\n')
    if 'comparison_table' in sec:
        t = sec['comparison_table']
        lines.append(f"### {t['caption']}")
        lines.append('| ' + ' | '.join(t['headers']) + ' |')
        lines.append('| ' + ' | '.join(['---'] * len(t['headers'])) + ' |')
        for r in t['rows']:
            lines.append('| ' + ' | '.join(sanitize(c) for c in r) + ' |')
        lines.append('')

# Chapter 3
lines.append(f"# CHAPTER {CH3_DATA['chapter_number']}: {CH3_DATA['chapter_title']}")
for sec in CH3_DATA['sections']:
    lines.append(f"## {sec['num']} {sec['title']}")
    for p in sec['paragraphs']:
        lines.append(sanitize(p) + '\n')
    if 'functional_requirements_table' in sec:
        t = sec['functional_requirements_table']
        lines.append(f"### {t['caption']}")
        lines.append('| ' + ' | '.join(t['headers']) + ' |')
        lines.append('| ' + ' | '.join(['---'] * len(t['headers'])) + ' |')
        for r in t['rows']:
            lines.append('| ' + ' | '.join(sanitize(c) for c in r) + ' |')
        lines.append('')
    if 'non_functional_requirements_table' in sec:
        t = sec['non_functional_requirements_table']
        lines.append(f"### {t['caption']}")
        lines.append('| ' + ' | '.join(t['headers']) + ' |')
        lines.append('| ' + ' | '.join(['---'] * len(t['headers'])) + ' |')
        for r in t['rows']:
            lines.append('| ' + ' | '.join(sanitize(c) for c in r) + ' |')
        lines.append('')
    if 'input_specifications_table' in sec:
        t = sec['input_specifications_table']
        lines.append(f"### {t['caption']}")
        lines.append('| ' + ' | '.join(t['headers']) + ' |')
        lines.append('| ' + ' | '.join(['---'] * len(t['headers'])) + ' |')
        for r in t['rows']:
            lines.append('| ' + ' | '.join(sanitize(c) for c in r) + ' |')
        lines.append('')
    if 'data_dictionaries' in sec:
        for dd in sec['data_dictionaries']:
            lines.append(f"### {dd['caption']}")
            lines.append('| ' + ' | '.join(dd['headers']) + ' |')
            lines.append('| ' + ' | '.join(['---'] * len(dd['headers'])) + ' |')
            for r in dd['rows']:
                lines.append('| ' + ' | '.join(sanitize(c) for c in r) + ' |')
            lines.append('')
    if 'use_case_specifications' in sec:
        for uc in sec['use_case_specifications']:
            lines.append(f"### {uc['caption']}")
            lines.append('| Specification Element | Detailed Content |')
            lines.append('| --- | --- |')
            for r in uc['rows']:
                lines.append(f"| {sanitize(r[0])} | {sanitize(r[1]).replace(chr(10), '<br>')} |")
            lines.append('')
    if 'algorithms' in sec:
        for al in sec['algorithms']:
            lines.append(f"### {al['title']}")
            lines.append('```text')
            lines.append(sanitize(al['code']))
            lines.append('```\n')

# Chapter 4
lines.append(f"# CHAPTER {CH4_DATA['chapter_number']}: {CH4_DATA['chapter_title']}")
for sec in CH4_DATA['sections']:
    lines.append(f"## {sec['num']} {sec['title']}")
    for p in sec['paragraphs']:
        lines.append(sanitize(p) + '\n')
    if 'test_suite_tables' in sec:
        for ts in sec['test_suite_tables']:
            lines.append(f"### {ts['caption']}")
            lines.append('| ' + ' | '.join(ts['headers']) + ' |')
            lines.append('| ' + ' | '.join(['---'] * len(ts['headers'])) + ' |')
            for r in ts['rows']:
                lines.append('| ' + ' | '.join(sanitize(c) for c in r) + ' |')
            lines.append('')
    if 'performance_table' in sec:
        t = sec['performance_table']
        lines.append(f"### {t['caption']}")
        lines.append('| ' + ' | '.join(t['headers']) + ' |')
        lines.append('| ' + ' | '.join(['---'] * len(t['headers'])) + ' |')
        for r in t['rows']:
            lines.append('| ' + ' | '.join(sanitize(c) for c in r) + ' |')
        lines.append('')
    if 'sus_table' in sec:
        t = sec['sus_table']
        lines.append(f"### {t['caption']}")
        lines.append('| ' + ' | '.join(t['headers']) + ' |')
        lines.append('| ' + ' | '.join(['---'] * len(t['headers'])) + ' |')
        for r in t['rows']:
            lines.append('| ' + ' | '.join(sanitize(c) for c in r) + ' |')
        lines.append('')

# Chapter 5
lines.append(f"# CHAPTER {CH5_DATA['chapter_number']}: {CH5_DATA['chapter_title']}")
for sec in CH5_DATA['sections']:
    lines.append(f"## {sec['num']} {sec['title']}")
    for p in sec['paragraphs']:
        lines.append(sanitize(p) + '\n')

# References
lines.append('# REFERENCES')
for ref in REFERENCES_DATA:
    lines.append(f"- {sanitize(ref)}")
lines.append('')

# Appendices
lines.append('# APPENDICES')
for app_key in ['appendix_a', 'appendix_b', 'appendix_c', 'appendix_d', 'appendix_e', 'appendix_f']:
    app = APPENDICES_DATA[app_key]
    lines.append(f"## {app['title']}")
    lines.append(sanitize(app['description']) + '\n')

md_content = '\n'.join(lines)
out_path = '/Users/kaeytee/.gemini/antigravity-ide/brain/9ee88218-2244-4ce6-970e-4f139892a498/HostelFix_Final_Report_Undergraduate.md'
with open(out_path, 'w') as f:
    f.write(md_content)

print(f"Updated markdown artifact at {out_path}.")
print(f"Total Lines: {len(lines)}")
print(f"Total Words: {len(md_content.split())}")
