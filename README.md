# AdvancedCapture for [QuickAdd](https://github.com/chhoumann/quickadd)

**AdvancedCapture** is an addon for [QuickAdd](https://github.com/chhoumann/quickadd) that allows advanced captures without having to write Javascript. Instead, AdvancedCapture powers QuickAdd using JSON files:

```json
{
  "variables": {
    "globalCsvPath": "var(--globalPath)/CSV/var(--name).csv",
    "listsPath": "var(--globalPath)/Lists",
    "peoplePath": "List of People.md",
    "globalPath": "Journal"
  }
  "categories": {
    "Reading List": {
      "icon": "📚",
      "csvPath": "var(--globalCsvPath)",
      "fields": [
        {
          "name": "Title",
          "prompt": "suggester",
          "listPath": "var(--listsPath)/var(--name).md",
          "required": true,
          "row": {
            "include": true
          },
          "print": {
            "include": true,
            "internalLink": true,
            "style": {
                "italics": true
            }
          }
        },
        {
          "name": "Author",
          "prompt": "suggester",
          "listPath": "var(--peoplePath)",
          "required": true,
          "row": {
            "include": true
          },
          "print": {
            "include": true,
            "internalLink": true
          }
        },
        {
          "name": "Rating",
          "prompt": "inputPrompt",
          "row": {
            "include": true
          },
          "print": {
            "include": true,
            "style": {
              "bold": true
            }
          }
        }
      ]
    }
  }
}
```

## Installation

AdvancedCapture is not yet in a useable state.
