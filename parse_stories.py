#!/usr/bin/env python3
import os
import glob
import json


def extract_phrases(filepath):
    phrases = []
    in_phrases = False
    with open(filepath, "r") as f:
        for line in f:
            line = line.strip()
            if line.startswith("## Phrases"):
                in_phrases = True
                continue
            if in_phrases and line.startswith("- "):
                phrase = line[2:].strip()
                phrases.append(phrase)
            elif in_phrases and line == "":
                # optional stop at blank line
                pass
            elif in_phrases and not line.startswith("- "):
                # continuation lines? ignore
                pass
    return phrases


def split_into_levels(phrases, chunk_size=20):
    levels = []
    for i in range(0, len(phrases), chunk_size):
        chunk = phrases[i : i + chunk_size]
        levels.append(chunk)
    return levels


def main():
    stories_dir = "stories"
    story_files = glob.glob(os.path.join(stories_dir, "*.md"))
    story_data = {}
    for filepath in story_files:
        filename = os.path.basename(filepath)
        story_id = filename.replace("-phrases.md", "").replace("-", "_")
        # human readable title
        title = story_id.replace("_", " ").title()
        # special cases
        if story_id == "little_red_riding_hood":
            title = "Little Red Riding Hood"
        elif story_id == "the_ugly_duckling":
            title = "The Ugly Duckling"
        elif story_id == "three_little_pigs":
            title = "Three Little Pigs"
        elif story_id == "peter_rabbit":
            title = "Peter Rabbit"
        elif story_id == "cinderella":
            title = "Cinderella"
        elif story_id == "goldilocks":
            title = "Goldilocks and the Three Bears"

        phrases = extract_phrases(filepath)
        levels = split_into_levels(phrases, 20)
        story_data[story_id] = {"title": title, "levels": levels}

    # Output as JavaScript object
    print("const storyPhrases = {")
    for story_id, data in story_data.items():
        print(f"  '{story_id}': {{")
        print(f"    title: '{data['title']}',")
        print("    levels: [")
        for level in data["levels"]:
            # each level is array of phrase strings
            print("      [")
            for phrase in level:
                # escape single quotes in phrase
                escaped = phrase.replace("'", "\\'")
                print(f"        '{escaped}',")
            print("      ],")
        print("    ],")
        print("  },")
    print("};")

    # Also output story order for dropdown
    print("\nconst storyOrder = [")
    for story_id in story_data.keys():
        print(f"  '{story_id}',")
    print("];")


if __name__ == "__main__":
    main()
