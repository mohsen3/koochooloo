#!/usr/bin/env python3
import re
import json
import os


def extract_variable(html_content, var_name):
    # Find variable assignment like "const var_name = ... ;"
    # Use regex to capture everything after '=' until the semicolon (but careful with nested structures)
    # We'll use a simple approach: find the line where var_name appears, then continue until we have balanced brackets
    lines = html_content.split("\n")
    start = None
    for i, line in enumerate(lines):
        if (
            line.strip().startswith("const " + var_name)
            or line.strip().startswith("let " + var_name)
            or line.strip().startswith("var " + var_name)
        ):
            start = i
            break
    if start is None:
        return None
    # Collect lines until we have balanced brackets
    bracket_count = 0
    in_string = False
    string_char = None
    escape = False
    collected = []
    for line in lines[start:]:
        for ch in line:
            if escape:
                escape = False
                continue
            if ch == "\\":
                escape = True
                continue
            if not in_string and ch in "\"'":
                in_string = True
                string_char = ch
            elif in_string and ch == string_char:
                in_string = False
                string_char = None
            elif not in_string:
                if ch == "[" or ch == "{":
                    bracket_count += 1
                elif ch == "]" or ch == "}":
                    bracket_count -= 1
        collected.append(line)
        if bracket_count == 0 and not in_string:
            break
    code = "\n".join(collected)
    # Extract the assignment value using regex
    match = re.search(r"=\s*(.*?)\s*;", code, re.DOTALL)
    if match:
        value_str = match.group(1)
        # Parse as JSON? JavaScript objects are similar but not identical.
        # We'll use eval with a safe environment? Since we trust the source, we can use ast.literal_eval but it doesn't support JS syntax.
        # Instead, we can manually parse the array of arrays for phrasePairs.
        # For simplicity, we'll just keep the string and later process with json.loads after converting.
        # Let's try to convert JavaScript array to Python list using json.loads after some replacements.
        # Replace single quotes with double quotes, but careful with escaped quotes.
        # This is hacky; better to use a proper JS parser, but for simplicity we'll do minimal.
        return value_str
    return None


def js_array_to_python(js_str):
    # Convert JavaScript array string to Python list using json.loads after converting to JSON.
    # Replace single quotes with double quotes, but not inside escaped quotes.
    # Very naive: replace all ' with " after ensuring no escaped singles.
    # This may break if there are apostrophes inside strings.
    # Since our data doesn't contain apostrophes, it's okay.
    # Also need to handle trailing commas.
    js_str = re.sub(r",\s*\]", "]", js_str)  # remove trailing comma before ]
    js_str = re.sub(r",\s*}", "}", js_str)  # remove trailing comma before }
    # Replace ' with " but not \'? We'll assume no escaped single quotes.
    js_str = js_str.replace("'", '"')
    # Now parse with json
    return json.loads(js_str)


def main():
    with open("toddler-reading-game.html", "r", encoding="utf-8") as f:
        html = f.read()

    # Extract iconRules
    icon_js = extract_variable(html, "iconRules")
    if icon_js:
        # Convert to Python list
        # icon_js is a JavaScript array of objects. We'll parse with json after replacing single quotes.
        icon_js_fixed = icon_js.replace("'", '"')
        # Also need to handle trailing commas
        icon_js_fixed = re.sub(r",\s*]", "]", icon_js_fixed)
        icon_js_fixed = re.sub(r",\s*}", "}", icon_js_fixed)
        icon_data = json.loads(icon_js_fixed)
        with open("data/icon-rules.json", "w", encoding="utf-8") as f:
            json.dump(icon_data, f, indent=2, ensure_ascii=False)
        print("Saved icon-rules.json")

    # Extract phrasePairs
    phrase_js = extract_variable(html, "phrasePairs")
    if phrase_js:
        # phrasePairs is a 2D array of [english, farsi] arrays.
        # We'll parse using eval? Use ast.literal_eval after converting to Python syntax.
        # Let's use json.loads after converting single quotes and fixing trailing commas.
        phrase_js_fixed = phrase_js.replace("'", '"')
        phrase_js_fixed = re.sub(r",\s*]", "]", phrase_js_fixed)
        phrase_js_fixed = re.sub(r",\s*}", "}", phrase_js_fixed)
        phrase_data = json.loads(phrase_js_fixed)
        with open("data/basic-phrases-raw.json", "w", encoding="utf-8") as f:
            json.dump(phrase_data, f, indent=2, ensure_ascii=False)
        print("Saved basic-phrases-raw.json")

    # Extract levelMilestones
    milestone_js = extract_variable(html, "levelMilestones")
    if milestone_js:
        milestone_js_fixed = milestone_js.replace("'", '"')
        milestone_js_fixed = re.sub(r",\s*]", "]", milestone_js_fixed)
        milestone_js_fixed = re.sub(r",\s*}", "}", milestone_js_fixed)
        milestone_data = json.loads(milestone_js_fixed)
        with open("data/level-milestones.json", "w", encoding="utf-8") as f:
            json.dump(milestone_data, f, indent=2, ensure_ascii=False)
        print("Saved level-milestones.json")

    # Extract storyPhrases (object with story ids)
    story_js = extract_variable(html, "storyPhrases")
    if story_js:
        # storyPhrases is a JavaScript object with keys and values.
        # We'll parse as JSON after converting keys to strings and fixing syntax.
        # We'll need to wrap keys in double quotes.
        # Let's use a more robust approach: evaluate as JavaScript? Not safe.
        # Instead, we can manually parse using regex for each story.
        # For now, we'll just save the raw JS and manually convert later.
        with open("data/stories-raw.js", "w", encoding="utf-8") as f:
            f.write("const storyPhrases = " + story_js + ";")
        print("Saved stories-raw.js")

    print("Extraction done.")


if __name__ == "__main__":
    main()
