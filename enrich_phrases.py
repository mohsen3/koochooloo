#!/usr/bin/env python3
import json
import copy


def load_phrases():
    with open("data/basic-phrases-raw.json", "r", encoding="utf-8") as f:
        return json.load(f)


def save_phrases(data):
    with open("data/basic-phrases-raw.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def get_existing_phrases(data):
    """Get set of all existing English phrases (lowercase)"""
    existing = set()
    for level in data:
        for eng, farsi in level:
            existing.add(eng.lower())
    return existing


def enrich_phrases(data, existing_phrases):
    """Enrich levels 1-15 with 4-year-old vocabulary"""
    enriched = copy.deepcopy(data)

    # Level 1 (Basic nouns) - add more basic nouns for 4-year-olds
    level0_additions = [
        ["hi", "سلام"],
        ["bye", "خداحافظ"],
        ["yes", "بله"],
        ["no", "نه"],
        ["please", "لطفا"],
        ["thank you", "ممنون"],
        ["sorry", "ببخشید"],
        ["more", "بیشتر"],
        ["all done", "تموم شد"],
        ["help", "کمک"],
    ]

    # Level 2 (Family, clothing) - add more family and clothing
    level1_additions = [
        ["eyes", "چشم"],
        ["nose", "بین"],
        ["mouth", "دهن"],
        ["ears", "گوش"],
        ["hands", "دست"],
        ["feet", "پا"],
        ["hair", "مو"],
        ["head", "سر"],
        ["tummy", "شکم"],
        ["back", "کمر"],
    ]

    # Level 3 (Actions) - add more actions
    level2_additions = [
        ["clap", "دست بزن"],
        ["wave", "دست تکان بده"],
        ["stomp", "پاهاتو بکوب"],
        ["spin", "بچرخ"],
        ["skip", "لی لی کن"],
        ["crawl", "چهار دست و پا برو"],
        ["slide", "سر بخور"],
        ["swing", "تاب بخور"],
        ["catch", "بگیر"],
        ["throw", "بنداز"],
    ]

    # Level 4 (Possessive) - add more "my" phrases
    level3_additions = [
        ["my eyes", "چشمام"],
        ["my nose", "بینیم"],
        ["my mouth", "دهنم"],
        ["my ears", "گوشام"],
        ["my hands", "دستام"],
        ["my feet", "پاهام"],
        ["my hair", "موهام"],
        ["my head", "سرم"],
        ["my tummy", "شکمم"],
        ["my back", "کمرم"],
    ]

    # Level 5 (Colors) - add more colors and combinations
    level4_additions = [
        ["red car", "ماشین قرمز"],
        ["blue sky", "آسمون آبی"],
        ["green grass", "چمن سبز"],
        ["yellow sun", "آفتاب زرد"],
        ["brown bear", "خرس قهوه ای"],
        ["pink flower", "گل صورتی"],
        ["purple grapes", "انگور بنفش"],
        ["orange carrot", "هویج نارنجی"],
        ["black cat", "گربه سیاه"],
        ["white cloud", "ابر سفید"],
    ]

    # Level 6 (Two-word actions) - add more two-word commands
    level5_additions = [
        ["clap hands", "دست بزن"],
        ["stomp feet", "پاهاتو بکوب"],
        ["nod head", "سرت رو تکون بده"],
        ["shake hands", "دست بدی"],
        ["blow nose", "بینیتو فین کن"],
        ["brush hair", "موهات رو شونه کن"],
        ["wash face", "صورتتو بشور"],
        ["dry hands", "دستاتو خشک کن"],
        ["zip coat", "کاپشنتو زیپ کن"],
        ["button shirt", "پیراهنتو دکمه کن"],
    ]

    # Level 7 (I want) - add more "I want" phrases
    level6_additions = [
        ["I want to play", "میخوام بازی کنم"],
        ["I want to read", "میخوام کتاب بخونم"],
        ["I want to draw", "میخوام نقاشی کنم"],
        ["I want to sing", "میخوام آواز بخونم"],
        ["I want to dance", "میخوام برقصم"],
        ["I want to sleep", "میخوام بخوابم"],
        ["I want to eat", "میخوام بخورم"],
        ["I want to drink", "میخوام بنوشم"],
        ["I want to go", "میخوام برم"],
        ["I want to stay", "میخوام بمونم"],
    ]

    # Level 8 (I am feelings) - add more feelings
    level7_additions = [
        ["I am four", "چهار سالمه"],
        ["I am big", "بزرگ شدم"],
        ["I am strong", "قوی ام"],
        ["I am smart", "باهوشم"],
        ["I am kind", "مهربونم"],
        ["I am funny", "بامزه ام"],
        ["I am fast", "تندم"],
        ["I am tall", "بلند قدم"],
        ["I am clean", "تمیزم"],
        ["I am ready", "آماده ام"],
    ]

    # Level 9 (Time to) - add more time phrases
    level8_additions = [
        ["time for school", "وقت مدرسه است"],
        ["time for park", "وقت پارکه"],
        ["time for tv", "وقت تلویزیونه"],
        ["time for art", "وقت نقاشیه"],
        ["time for music", "وقت موسیقیه"],
        ["time for blocks", "وقت بلوکه"],
        ["time for puzzle", "وقت پازله"],
        ["time for story", "وقت داستانه"],
        ["time for coloring", "وقت رنگ آمیزی"],
        ["time for sharing", "وقت تقسیم کردنه"],
    ]

    # Level 10 (Please requests) - add more polite requests
    level9_additions = [
        ["please watch", "لطفا نگاه کن"],
        ["please look", "لطفا ببین"],
        ["please come", "لطفا بیا"],
        ["please go", "لطفا برو"],
        ["please stop", "لطفا وایسا"],
        ["please start", "لطفا شروع کن"],
        ["please try", "لطفا تلاش کن"],
        ["please think", "لطفا فکر کن"],
        ["please find", "لطفا پیدا کن"],
        ["please show", "لطفا نشون بده"],
    ]

    # Level 11 (Questions) - add more questions
    level10_additions = [
        ["how are you?", "حالت چطوره؟"],
        ["what is that?", "اون چیه؟"],
        ["who is she?", "اون دختر کیه؟"],
        ["who is he?", "اون پسر کیه؟"],
        ["where is home?", "خونه کجاست؟"],
        ["when is lunch?", "ناهار کی؟"],
        ["why is it red?", "چرا قرمزه؟"],
        ["how old are you?", "چند سالته؟"],
        ["what color is it?", "چه رنگیه؟"],
        ["can you help?", "میتونی کمک کنی؟"],
    ]

    # Level 12 (Positional) - add more positional phrases
    level11_additions = [
        ["on the table", "روی میز"],
        ["under the chair", "زیر صندلی"],
        ["in the box", "توی جعبه"],
        ["next to me", "کنارم"],
        ["behind you", "پشت تو"],
        ["in front of", "جلوی"],
        ["between us", "بین ما"],
        ["above my head", "بالای سرم"],
        ["below my feet", "زیر پام"],
        ["around the room", "دور اتاق"],
    ]

    # Level 13 (I can) - add more "I can" phrases
    level12_additions = [
        ["I can count", "می تونم بشمرم"],
        ["I can share", "می تونم تقسیم کنم"],
        ["I can wait", "می تونم صبر کنم"],
        ["I can listen", "می تونم گوش کنم"],
        ["I can talk", "می تونم حرف بزنم"],
        ["I can read", "می تونم بخونم"],
        ["I can write", "می تونم بنویسم"],
        ["I can draw", "می تونم نقاشی کنم"],
        ["I can build", "می تونم بسازم"],
        ["I can clean", "می تونم تمیز کنم"],
    ]

    # Level 14 (Social) - add more social phrases
    level13_additions = [
        ["hi mom", "سلام مامان"],
        ["hi dad", "سلام بابا"],
        ["hello teacher", "سلام مربی"],
        ["good morning", "صبح بخیر"],
        ["good night", "شب بخیر"],
        ["see you soon", "به زودی می بینمت"],
        ["nice to see you", "خوشحالم می بینمت"],
        ["how was your day?", "روزت چطور بود؟"],
        ["I had fun", "خوش گذشت"],
        ["let's play again", "بیا دوباره بازی کنیم"],
    ]

    # Level 15 (Safety/Health) - add more safety phrases
    level14_additions = [
        ["I'm careful", "مواظبم"],
        ["hold my hand", "دستم رو بگیر"],
        ["watch your step", "مواظب پاهات باش"],
        ["be gentle", "آروم باش"],
        ["use soft voice", "با صدای آروم حرف بزن"],
        ["walk slowly", "آروم راه برو"],
        ["sit properly", "درست بشین"],
        ["cover your cough", "سرفه ات رو بپوشون"],
        ["use your words", "با کلماتت بگو"],
        ["ask for help", "کمک بخواه"],
    ]

    # Add all additions, checking for duplicates
    additions_by_level = [
        (0, level0_additions),
        (1, level1_additions),
        (2, level2_additions),
        (3, level3_additions),
        (4, level4_additions),
        (5, level5_additions),
        (6, level6_additions),
        (7, level7_additions),
        (8, level8_additions),
        (9, level9_additions),
        (10, level10_additions),
        (11, level11_additions),
        (12, level12_additions),
        (13, level13_additions),
        (14, level14_additions),
    ]

    for level_idx, additions in additions_by_level:
        if level_idx < len(enriched):
            for eng, farsi in additions:
                if eng.lower() not in existing_phrases:
                    enriched[level_idx].append([eng, farsi])
                    existing_phrases.add(eng.lower())
                    print(f"Added to level {level_idx + 1}: {eng} -> {farsi}")
                else:
                    print(f"Duplicate skipped in level {level_idx + 1}: {eng}")

    return enriched


def main():
    print("Loading existing phrases...")
    data = load_phrases()
    existing_phrases = get_existing_phrases(data)

    print(f"Total levels: {len(data)}")
    print(f"Existing unique phrases: {len(existing_phrases)}")

    print("\nEnriching levels 1-15...")
    enriched_data = enrich_phrases(data, existing_phrases)

    # Count new totals
    new_existing = get_existing_phrases(enriched_data)
    print(f"\nNew unique phrases: {len(new_existing)}")
    print(f"Added {len(new_existing) - len(existing_phrases)} new phrases")

    # Save enriched data
    save_phrases(enriched_data)
    print("\nSaved enriched phrases to data/basic-phrases-raw.json")

    # Also update the JS file
    print("Updating phrase-pairs.js...")
    with open("data/phrase-pairs.js", "w", encoding="utf-8") as f:
        f.write("const phrasePairs = ")
        json.dump(enriched_data, f, ensure_ascii=False, indent=2)
        f.write(";")

    print("Done!")


if __name__ == "__main__":
    main()
