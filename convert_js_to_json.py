#!/usr/bin/env python3
import re
import json
import sys


def remove_js_comments(js_str):
    # Remove single-line comments (// ...)
    lines = js_str.split("\n")
    cleaned = []
    for line in lines:
        # Find comment delimiter not inside string
        in_string = False
        string_char = None
        escape = False
        for i, ch in enumerate(line):
            if escape:
                escape = False
                continue
            if ch == "\\":
                escape = True
                continue
            if not in_string and ch in '""':
                in_string = True
                string_char = ch
            elif in_string and ch == string_char:
                in_string = False
                string_char = None
            elif (
                not in_string and ch == "/" and i + 1 < len(line) and line[i + 1] == "/"
            ):
                # comment start, truncate line
                line = line[:i]
                break
        cleaned.append(line)
    return "\n".join(cleaned)


def js_object_to_json(js_str):
    # Convert JavaScript object literal to JSON string
    # Step 0: Remove comments
    js_str = remove_js_comments(js_str)
    # Step 1: Remove trailing commas before ] or }
    js_str = re.sub(r",\s*\]", "]", js_str)
    js_str = re.sub(r",\s*}", "}", js_str)

    # Step 2: Wrap unquoted property names in double quotes
    # Match pattern: { property: or , property:
    # Use regex to find property names that are valid identifiers
    def replace_property(match):
        # match groups: preceding char and whitespace, property name
        pre_whitespace = match.group(1)  # '{' or ',' plus optional whitespace
        prop = match.group(2)  # property name
        # Ensure prop is a valid identifier (no spaces)
        if re.fullmatch(r"[a-zA-Z_][a-zA-Z0-9_]*", prop):
            return f'{pre_whitespace}"{prop}":'
        else:
            return match.group(0)

    js_str = re.sub(r"([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:", replace_property, js_str)
    # Step 3: Replace single quotes with double quotes, but not escaped ones
    # Simple replace, assuming no escaped single quotes inside strings
    js_str = js_str.replace("'", '"')
    # Step 4: Fix escaped double quotes inside strings (if any)
    # Not needed.
    return js_str


def extract_js_variable(html, var_name):
    # Find const var_name = ...
    start = html.find(f"const {var_name} =")
    if start == -1:
        start = html.find(f"let {var_name} =")
    if start == -1:
        start = html.find(f"var {var_name} =")
    if start == -1:
        return None
    # Find the start of the value after '='
    i = start + len(f"const {var_name} =")
    # Skip whitespace
    while i < len(html) and html[i].isspace():
        i += 1
    # Now parse until balanced brackets
    brace = 0
    square = 0
    curly = 0
    in_string = False
    string_char = None
    escape = False
    start_idx = i
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
            elif ch in "'\"":
                in_string = True
                string_char = ch
            if square == 0 and curly == 0 and not in_string and ch == ";":
                # end of assignment
                break
        else:
            if ch == string_char:
                in_string = False
                string_char = None
        i += 1
    value = html[start_idx:i].rstrip(" ;")
    return value


def main():
    with open("toddler-reading-game.html", "r", encoding="utf-8") as f:
        html = f.read()

    # iconRules
    icon_js = extract_js_variable(html, "iconRules")
    if icon_js:
        icon_json_str = js_object_to_json(icon_js)
        icon_data = json.loads(icon_json_str)
        with open("data/icon-rules.json", "w", encoding="utf-8") as f:
            json.dump(icon_data, f, indent=2, ensure_ascii=False)
        print("Saved icon-rules.json")

    # phrasePairs
    phrase_js = extract_js_variable(html, "phrasePairs")
    if phrase_js:
        # phrasePairs is a 2D array of arrays of strings
        # Convert single quotes to double quotes, remove trailing commas
        phrase_json_str = js_object_to_json(phrase_js)
        phrase_data = json.loads(phrase_json_str)
        with open("data/basic-phrases-raw.json", "w", encoding="utf-8") as f:
            json.dump(phrase_data, f, indent=2, ensure_ascii=False)
        print("Saved basic-phrases-raw.json")

    # levelMilestones
    milestone_js = extract_js_variable(html, "levelMilestones")
    if milestone_js:
        milestone_json_str = js_object_to_json(milestone_js)
        milestone_data = json.loads(milestone_json_str)
        with open("data/level-milestones.json", "w", encoding="utf-8") as f:
            json.dump(milestone_data, f, indent=2, ensure_ascii=False)
        print("Saved level-milestones.json")

    # storyPhrases
    story_js = extract_js_variable(html, "storyPhrases")
    if story_js:
        # storyPhrases is a JavaScript object with keys as strings (already quoted?)
        # The keys are quoted with single quotes? In the source they are 'goldilocks': ...
        # Our js_object_to_json will handle.
        story_json_str = js_object_to_json(story_js)
        story_data = json.loads(story_json_str)
        with open("data/stories.json", "w", encoding="utf-8") as f:
            json.dump(story_data, f, indent=2, ensure_ascii=False)
        print("Saved stories.json")

    print("Done.")


if __name__ == "__main__":
    main()
