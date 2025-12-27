#!/usr/bin/env python3
import re

# Clean and split sentences
sentences = """I ask for help.
I brush my hair.
I brush my teeth.
I buckle up.
I build a tower.
I calm my body.
I carry my bag.
I catch a ball.
I chew my food.
I clap my hands.
I clean the table.
I clean up toys.
I close my eyes.
I color with crayons.
I comb my hair.
I dance around.
I dig in the sand.
I draw a picture.
I drink juice.
I drink milk.
I drink water.
I dry my hands.
I dry with a towel.
I eat breakfast.
I eat dinner.
I eat fruits and vegetables.
I eat my lunch.
I feel happy.
I feel mad.
I feel sad.
I feel tired.
I flush the toilet.
I get in the car.
I get out of bed.
I give a hug.
I go potty.
I go to bed.
I go to school.
I go to sleep.
I hold hands when crossing street.
I hop on one foot.
I hug daddy.
I hug mommy.
I hug my teddy.
I jump high.
I listen to lullababis.
I listen to lullabibies.
I listen to the teacher.
I listen when someone talks.
I make the bed.
I paint with a brush.
I pick my clothes.
I play with blocks.
I play with toys.
I pull up my pants.
I put books back on the shelf.
I put dirty clothes in the laundry.
I put on my clothes.
I put on my shoes.
I put on pajamas.
I read a bedtime story.
I read a book.
I ride my bike.
I rinse with water.
I run fast.
I say good night.
I say hello.
I say my prayers.
I say please.
I say sorry when I hurt someone.
I say thank you.
I scrub with soap.
I set the table.
I shampoo my hair.
I share my toy.
I sing a song.
I sit at the table.
I sit during circle time.
I slide down.
I smile big.
I stretch my arms.
I sweep the floor.
I swing high.
I take a bath.
I take a bite.
I take a breath.
I throw a ball.
I try new food.
I turn off the light.
I use my spoon.
I use soap.
I wait for my turn.
I wait for the light to cross.
I wake up.
I wash my face.
I wash my hands.
I water the plants.
I wave goodbye.
I wear my socks.
I wipe my nose.
I zip my jacket.""".split("\n")

# Clean up
cleaned = []
for s in sentences:
    s = s.strip()
    if not s:
        continue
    if not s.endswith("."):
        s = s + "."
    cleaned.append(s)

print(f"Cleaned sentences: {len(cleaned)}")

# Split into 5 levels
levels = []
chunk_size = len(cleaned) // 5
remainder = len(cleaned) % 5
start = 0
for i in range(5):
    end = start + chunk_size + (1 if i < remainder else 0)
    levels.append(cleaned[start:end])
    start = end

# Print distribution
for i, level in enumerate(levels):
    print(f"Level {i + 1}: {len(level)} sentences")

# Build the story object as a string
story_id = "i_can_do_it"
story_title = "I Can Do It!"

story_lines = []
story_lines.append(f'  "{story_id}": {{')
story_lines.append(f'    "title": "{story_title}",')
story_lines.append(f'    "levels": [')
for level in levels:
    story_lines.append("      [")
    for sentence in level:
        story_lines.append(f'        "{sentence}",')
    story_lines.append("      ],")
story_lines.append("    ]")
story_lines.append("  },")

story_text = "\n".join(story_lines)
print("\nGenerated story object:")
print(story_text[:200] + "...")

# Read existing story-phrases.js
with open("data/story-phrases.js", "r", encoding="utf-8") as f:
    content = f.read()

# Insert the new story before "goldilocks"
# Find the line with "goldilocks": {
lines = content.split("\n")
new_lines = []
inserted = False
for line in lines:
    if line.strip().startswith('"goldilocks": {') and not inserted:
        # Insert our story before this line
        new_lines.append(story_text)
        inserted = True
    new_lines.append(line)

if not inserted:
    # Fallback: insert after opening brace
    print("Could not find goldilocks line, attempting fallback")
    new_lines = []
    for i, line in enumerate(lines):
        new_lines.append(line)
        if line.strip() == "{" and i + 1 < len(lines):
            # Next line is first story, insert before
            new_lines.append(story_text)
            inserted = True

new_content = "\n".join(new_lines)

# Write back
with open("data/story-phrases.js", "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"\nAdded story '{story_title}' to story-phrases.js")

# Update HTML dropdown
with open("toddler-reading-game.html", "r", encoding="utf-8") as f:
    html = f.read()

# Insert new option before "Basic Phrases"
# Find the line with <option value="basic_phrases">Basic Phrases</option>
pattern = r'(\s*)<option value="basic_phrases">Basic Phrases</option>'
replacement = r'\1<option value="i_can_do_it">I Can Do It!</option>\n\1<option value="basic_phrases">Basic Phrases</option>'
new_html = re.sub(pattern, replacement, html)

with open("toddler-reading-game.html", "w", encoding="utf-8") as f:
    f.write(new_html)

print("Added dropdown option for 'I Can Do It!' before Basic Phrases")

print("\nDone!")
