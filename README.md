
# Our Birding Log — GitHub Pages Starter

A simple, no-code(ish) website for you and your spouse to track the birds you've seen and where you saw them.
- Counts **unique species**
- Links each sighting to **Google Maps**
- Records **Audubon page** references
- Shows a scrolling gallery of all birds
- Hosted free on **GitHub Pages**

## ✅ What you'll do
1. **Create a GitHub account** (if needed) at github.com.
2. Create a new repository named **`USERNAME.github.io`** (replace USERNAME with your GitHub username).
3. **Upload** all files from this folder to that repository.
4. Visit `https://USERNAME.github.io` to see your live site.

> You do not need to install anything. It’s just files.

## ✍️ How to add or edit birds
Open `data/birds.csv` in any spreadsheet tool (Google Sheets, Excel) and keep the same headers:
```
date,common_name,scientific_name,location_name,latitude,longitude,city,region,country,photo,notes,audubon_page,book_edition,maps_url
```
- **Minimum fields**: `date`, `common_name`
- **Google Maps**:
  - Either paste a full map link into `maps_url` (easiest, e.g. share link from Google Maps), **or**
  - Fill `latitude` and `longitude` (the site will build the link for you).
- **Audubon page**: add the page number and optional edition.
- **Photo**: upload a picture file into the `images/` folder and put its path in the `photo` column (e.g. `images/robin.jpg`). Photos are optional.
- Save/export as **CSV** and upload to `data/birds.csv` (replace the old one). Your website updates immediately.

Tip: If you keep the log in Google Sheets, use **File → Download → Comma-separated values (.csv)** and replace `data/birds.csv` in GitHub.

## 🧭 Pages
- **Home (index.html)**: overview stats + most recent sightings
- **All Birds (birds.html)**: infinite scrolling gallery with search and filters (region, year)

## 🧮 How unique species are counted
We count distinct values from the `common_name` column (case-insensitive).

## 🗺️ Get coordinates (optional)
- In Google Maps, right-click the spot → copy the numbers like `42.3389, -83.0603` and paste into `latitude` and `longitude`.
- Or just click **Share → Copy link** and paste into `maps_url`.

## 🖼️ Photos
- Put image files into the `images/` folder.
- Use small images when possible (under ~1 MB) so pages load fast.

## 🎨 Change the title
Open `index.html` and `birds.html` and replace the brand text `Our Birding Log` with your names.

## 🛠️ Troubleshooting
- If the site shows but there are **no birds**, make sure your `birds.csv` still has the **header row**.
- If **photos** don’t appear, double-check the path (e.g. `images/whatever.jpg`) and file extension.
- If the page looks cached, hit **Shift + Reload**.

## 📝 License
MIT — you can modify and use freely.
