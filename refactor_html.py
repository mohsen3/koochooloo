#!/usr/bin/env python3
import sys

with open("toddler-reading-game.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

# line numbers are 1-indexed
# convert to 0-indexed
keep_ranges = [
    (0, 491),  # up to line 491 (the line before iconRules)
    (550, 561),  # from line 550 (blank line) to line 561 (the line before phrasePairs)
    (1352, 1352),  # comment line "// Combined stories object including basic phrases"
    (1376, len(lines) - 1),  # from line 1376 (allStories) to end
]
# need to also keep the lines between storyPhrases and levelMilestones? Actually we skip storyPhrases and levelMilestones.
# The ranges above skip lines 562-1351 and 1353-1375.

# Build new lines
new_lines = []
for start, end in keep_ranges:
    new_lines.extend(lines[start : end + 1])

# Now insert script tags after Phrase class (line 491 is the line before iconRules)
# Actually we need to insert after line 491 (which is the line after Phrase class? Let's check.
# lines[491] is line 492? Wait index 491 corresponds to line 492? Since lines[0] is line 1.
# Let's compute: we kept lines[0:491] which includes lines 1-491? Actually slice end exclusive.
# We'll just insert after the Phrase class line within the new_lines.
# Let's find the line index where Phrase class ends.
for i, line in enumerate(new_lines):
    if line.strip() == "class Phrase {":
        # insert after the closing brace (next few lines). We'll insert after the entire class definition.
        # The class ends at line with '}'? Actually there are multiple lines; we'll insert after the line with '}'.
        # Let's search for '}' at same indentation.
        for j in range(i, min(i + 10, len(new_lines))):
            if new_lines[j].strip() == "}":
                insert_pos = j + 1
                # Insert script tags
                script_tags = [
                    '        <script src="data/icon-rules.js"></script>\n',
                    '        <script src="data/phrase-pairs.js"></script>\n',
                    '        <script src="data/level-milestones.js"></script>\n',
                    '        <script src="data/story-phrases.js"></script>\n',
                ]
                new_lines = (
                    new_lines[:insert_pos] + script_tags + new_lines[insert_pos:]
                )
                break
        break

# Write back
with open("toddler-reading-game.html", "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("HTML refactored.")
