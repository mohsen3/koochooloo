#!/usr/bin/env python3
import re


def find_matching(html, start_idx):
    """Given start index of a value (after '='), return end index of the value (before ';')"""
    i = start_idx
    brace = 0
    square = 0
    curly = 0
    in_string = False
    string_char = None
    escape = False
    while i < len(html):
        ch = html[i]
        if escape:
            escape = False
            i += 1
            continue
        if ch == "\\":
            escape = True
            i += 1
            continue
        if not in_string:
            if ch == "[":
                square += 1
            elif ch == "]":
                square -= 1
            elif ch == "{":
                curly += 1
            elif ch == "}":
                curly -= 1
            elif ch in '""':
                in_string = True
                string_char = ch
            if square == 0 and curly == 0 and not in_string and ch == ";":
                return i  # index of semicolon
        else:
            if ch == string_char:
                in_string = False
                string_char = None
        i += 1
    return -1


def replace_variable(html, var_name):
    """Remove const var_name = ... ;"""
    pattern = f"const {var_name} ="
    start = html.find(pattern)
    if start == -1:
        pattern = f"let {var_name} ="
        start = html.find(pattern)
    if start == -1:
        pattern = f"var {var_name} ="
        start = html.find(pattern)
    if start == -1:
        return html, 0
    # Move to after '='
    value_start = start + len(pattern)
    # skip whitespace
    while value_start < len(html) and html[value_start].isspace():
        value_start += 1
    semicolon = find_matching(html, value_start)
    if semicolon == -1:
        return html, 0
    # Replace from start to semicolon inclusive with empty string
    new_html = html[:start] + html[semicolon + 1 :]
    # Return new html and length removed (for offset adjustment)
    removed_len = semicolon + 1 - start
    return new_html, removed_len


def insert_script_tags(html):
    # Find the closing head tag
    head_close = html.find("</head>")
    if head_close == -1:
        return html
    # Insert script tags before </head> with 4-space indentation
    script_tags = '\n    <script src="data/icon-rules.js"></script>\n    <script src="data/phrase-pairs.js"></script>\n    <script src="data/level-milestones.js"></script>\n    <script src="data/story-phrases.js"></script>'
    new_html = html[:head_close] + script_tags + html[head_close:]
    return new_html


def main():
    with open("toddler-reading-game.html", "r", encoding="utf-8") as f:
        html = f.read()

    # Remove variables
    html, _ = replace_variable(html, "iconRules")
    html, _ = replace_variable(html, "phrasePairs")
    html, _ = replace_variable(html, "storyPhrases")
    html, _ = replace_variable(html, "levelMilestones")

    # Insert script tags
    html = insert_script_tags(html)

    # Write back
    with open("toddler-reading-game.html", "w", encoding="utf-8") as f:
        f.write(html)

    print("Refactoring complete.")


if __name__ == "__main__":
    main()
