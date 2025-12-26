#!/usr/bin/env python3
import json
import os


def json_to_js(var_name, json_file, js_file):
    with open(json_file, "r", encoding="utf-8") as f:
        data = json.load(f)
    js_content = f"const {var_name} = {json.dumps(data, indent=2, ensure_ascii=False)};"
    with open(js_file, "w", encoding="utf-8") as f:
        f.write(js_content)
    print(f"Generated {js_file}")


def main():
    data_dir = "data"
    # iconRules
    json_to_js(
        "iconRules",
        os.path.join(data_dir, "icon-rules.json"),
        os.path.join(data_dir, "icon-rules.js"),
    )
    # phrasePairs
    json_to_js(
        "phrasePairs",
        os.path.join(data_dir, "basic-phrases-raw.json"),
        os.path.join(data_dir, "phrase-pairs.js"),
    )
    # levelMilestones
    json_to_js(
        "levelMilestones",
        os.path.join(data_dir, "level-milestones.json"),
        os.path.join(data_dir, "level-milestones.js"),
    )
    # storyPhrases
    json_to_js(
        "storyPhrases",
        os.path.join(data_dir, "stories.json"),
        os.path.join(data_dir, "story-phrases.js"),
    )
    # Also create a combined loader that defines allStories? We'll let the original code construct allStories.


if __name__ == "__main__":
    main()
