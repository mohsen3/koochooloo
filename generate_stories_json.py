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
        levels = split_into_levels(phrases, 20)  # match original chunk size
        story_data[story_id] = {"title": title, "levels": levels}

    # Save each story as separate JSON file
    for story_id, data in story_data.items():
        outfile = os.path.join("data", f"{story_id}.json")
        with open(outfile, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Saved {outfile}")

    # Also save combined stories.json (optional)
    with open("data/stories.json", "w", encoding="utf-8") as f:
        json.dump(story_data, f, indent=2, ensure_ascii=False)
    print("Saved data/stories.json")


if __name__ == "__main__":
    main()
