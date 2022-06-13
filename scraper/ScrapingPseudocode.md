# Scraping Pseudocode:
## Getting the videogame data
### Data required:
- List of all games for each platform (a)
- For each game:
   - Title (b)
   - Short description (c)
   - Genre (d)
   - Developer (e)
   - Price (f)
   - Images[4] (g)

### Source for each:
- a) List of all games: Wikipedia API for "List of <consoleName> games" (A)
- b) Title: Wikipedia API for "List of <consoleName> games" (A)
- c) Short description: Corresponding game wikipedia page (B)
- d) Genre: Wikipedia API for "List of <consoleName> games" (A)
- e) Price: Scrape from Amazon/Google (C)
- f) Images: Scrape from Google (D)