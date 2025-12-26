#!/usr/bin/env python3
import json


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


def add_conversational_phrases(data, existing_phrases):
    """Add conversational phrases to level 14 (social phrases)"""
    # Level 14 is index 13 (0-based)
    if len(data) <= 13:
        print("Error: Level 14 doesn't exist")
        return data, existing_phrases, 0

    conversational_phrases = [
        # Greetings and responses
        ["Hello", "سلام"],
        ["Goodbye", "خداحافظی"],
        ["Good morning", "صبح بخیر"],
        ["Good afternoon", "عصر بخیر"],
        ["Good evening", "شب بخیر"],
        ["Good night", "شب بخیر"],
        # Self-introduction
        ["My name is", "اسم من ... است"],
        ["I am four years old", "چهار سالمه"],
        ["I am a boy", "من پسر هستم"],
        ["I am a girl", "من دختر هستم"],
        ["I go to preschool", "مهد کودک میرم"],
        ["I like to play", "دوست دارم بازی کنم"],
        # Feelings and responses
        ["I am happy", "خوشحالم"],
        ["I am sad", "ناراحتم"],
        ["I am tired", "خسته ام"],
        ["I am hungry", "گرسنه ام"],
        ["I am thirsty", "تشنه ام"],
        # Conversational responses
        ["I'm fine, thank you", "خوبم، ممنون"],
        ["I'm okay", "حالم خوبه"],
        ["I'm good", "خوبم"],
        ["Nice to meet you", "خوشبختم"],
        ["You're welcome", "خواهش می کنم"],
        ["Excuse me", "ببخشید"],
        # Questions and answers
        ["What is your name?", "اسمت چیه؟"],
        ["How old are you?", "چند سالته؟"],
        ["How are you?", "حالت چطوره؟"],
        ["Where do you live?", "کجا زندگی می کنی؟"],
        ["What do you like?", "چی دوست داری؟"],
        # Family
        ["This is my mom", "این مامانمه"],
        ["This is my dad", "این بابامه"],
        ["This is my brother", "این برادرمه"],
        ["This is my sister", "این خواهرمه"],
        ["I love my family", "خانواده ام رو دوست دارم"],
        # Colors
        ["Red", "قرمز"],
        ["Blue", "آبی"],
        ["Green", "سبز"],
        ["Yellow", "زرد"],
        ["Orange", "نارنجی"],
        ["Purple", "بنفش"],
        ["Pink", "صورتی"],
        ["Brown", "قهوه ای"],
        ["Black", "سیاه"],
        ["White", "سفید"],
        # Numbers 1-10
        ["One", "یک"],
        ["Two", "دو"],
        ["Three", "سه"],
        ["Four", "چهار"],
        ["Five", "پنج"],
        ["Six", "شش"],
        ["Seven", "هفت"],
        ["Eight", "هشت"],
        ["Nine", "نه"],
        ["Ten", "ده"],
        # Shapes
        ["Circle", "دایره"],
        ["Square", "مربع"],
        ["Triangle", "مثلث"],
        ["Rectangle", "مستطیل"],
        ["Star", "ستاره"],
        ["Heart", "قلب"],
        # Body parts
        ["Head", "سر"],
        ["Eyes", "چشم"],
        ["Ears", "گوش"],
        ["Nose", "بین"],
        ["Mouth", "دهن"],
        ["Hands", "دست"],
        ["Feet", "پا"],
        ["Fingers", "انگشت"],
        ["Toes", "انگشت پا"],
        # Weather
        ["Sunny", "آفتابی"],
        ["Rainy", "بارانی"],
        ["Cloudy", "ابری"],
        ["Windy", "باد"],
        ["Snowy", "برفی"],
        # Daily activities
        ["I eat breakfast", "صبحونه می خورم"],
        ["I go to school", "مدرسه میرم"],
        ["I play with friends", "با دوستام بازی می کنم"],
        ["I take a nap", "چرت می زنم"],
        ["I eat dinner", "شام می خورم"],
        ["I go to bed", "می روم بخوابم"],
    ]

    added_count = 0
    for eng, farsi in conversational_phrases:
        if eng.lower() not in existing_phrases:
            data[13].append([eng, farsi])
            existing_phrases.add(eng.lower())
            added_count += 1
            print(f"Added to level 14: {eng} -> {farsi}")
        else:
            print(f"Duplicate skipped: {eng}")

    return data, existing_phrases, added_count


def update_js_file(data):
    """Update the phrase-pairs.js file"""
    with open("data/phrase-pairs.js", "w", encoding="utf-8") as f:
        f.write("const phrasePairs = ")
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write(";")
    print("Updated phrase-pairs.js")


def main():
    print("Loading phrases...")
    data = load_phrases()
    existing_phrases = get_existing_phrases(data)

    print(f"Existing unique phrases: {len(existing_phrases)}")
    print(f"Level 14 currently has {len(data[13])} phrases")

    print("\nAdding conversational phrases to level 14...")
    data, existing_phrases, added_count = add_conversational_phrases(
        data, existing_phrases
    )

    print(f"\nAdded {added_count} new phrases")
    print(f"Level 14 now has {len(data[13])} phrases")
    print(f"Total unique phrases: {len(existing_phrases)}")

    # Save updated data
    save_phrases(data)
    update_js_file(data)

    print("\nDone!")


if __name__ == "__main__":
    main()
