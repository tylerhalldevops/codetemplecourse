# 📰 Blog Archive - RSS Feed Sources Update

## ✅ Updated to Ski/Snowboard & Colorado Focus

### **New RSS Feeds:**

#### **🎿 Ski/Snowboard News Sources:**
1. **OnTheSnow** - `https://www.onthesnow.com/news/rss`
   - Snow reports and ski resort news
   - Icon: ❄️ | Color: Blue (#0099FF)

2. **Powder Magazine** - `https://www.powder.com/feed/`
   - Premium ski/snowboard content
   - Icon: 🏔️ | Color: Red (#FF4444)

3. **Skiing Magazine** - `https://www.skiingmagazine.com/feed/`
   - Ski industry news and reviews
   - Icon: ⛷️ | Color: Dark Blue (#0066CC)

4. **Newschoolers** - `https://www.newschoolers.com/rss/news`
   - Freestyle skiing community news
   - Icon: 🎿 | Color: Green (#00AA00)

#### **🌲 Colorado News Sources:**
5. **Colorado Sun** - `https://coloradosun.com/feed/`
   - Colorado news and local stories
   - Icon: ☀️ | Color: Orange (#FFA500)

6. **Denver Post** - `https://www.denverpost.com/feed/`
   - Denver and Colorado news
   - Icon: 📰 | Color: Navy (#003366)

#### **🌨️ Weather & Snow Reports:**
7. **Weather.com** - `https://weather.com/rss/news`
   - General weather news
   - Icon: 🌤️ | Color: Blue (#1E88E5)

8. **OpenSnow** - `https://opensnow.com/dailysnow/rss`
   - Daily snow forecasts and reports
   - Icon: 🌨️ | Color: Sky Blue (#4A90E2)

---

## 🎛️ Updated Filter Buttons:

### **Before:**
- 🏆 All Articles
- 📺 ESPN
- 🇬🇧 BBC Sport
- 📰 SI

### **After:**
- ⛷️ All Articles
- ❄️ Snow Reports (OnTheSnow)
- 🏔️ Powder Mag (Powder Magazine)
- 🌲 Colorado (Colorado Sun + Denver Post combined)

---

## 🎨 Source Color Coding:

Each article is color-coded by source:

| Source | Color | Emoji |
|--------|-------|-------|
| OnTheSnow | Blue | ❄️ |
| Powder Magazine | Red | 🏔️ |
| Skiing Magazine | Dark Blue | ⛷️ |
| Newschoolers | Green | 🎿 |
| Colorado Sun | Orange | ☀️ |
| Denver Post | Navy | 📰 |
| Weather.com | Blue | 🌤️ |
| OpenSnow | Sky Blue | 🌨️ |

---

## 📊 Expected Content:

### **You'll Now See:**
✅ Ski resort news and conditions  
✅ Snowboard gear reviews  
✅ Colorado mountain weather  
✅ Snow forecasts  
✅ Local Colorado news (related to outdoors/winter)  
✅ Freestyle skiing content  
✅ Industry news  

### **No More:**
❌ NFL/NBA/MLB/NHL general sports  
❌ International sports news  
❌ General sports betting content  

---

## 🔧 Technical Changes:

1. **Updated RSS Feed List** (`blog.html` line ~189)
   - Replaced 7 general sports feeds
   - Added 8 ski/Colorado/weather feeds

2. **Updated Filter Buttons** (`blog.html` line ~70)
   - Changed button labels and data attributes
   - Added special "Colorado" filter for both CO news sources

3. **Updated Source Recognition** (`rss-importer.js` line ~36)
   - Added detection for all 8 new sources
   - Assigned appropriate colors and emojis
   - Kept legacy sports sources for backward compatibility

4. **Updated Filter Logic** (`blog.html` line ~262)
   - Added special handling for "Colorado" filter
   - Combines Colorado Sun + Denver Post

---

## 🚀 How It Works:

1. **Page loads** → Fetches from all 8 RSS feeds in parallel
2. **Articles appear** → Sorted by newest first
3. **Click filter** → Shows only that source's articles
4. **Colorado filter** → Shows both Colorado Sun + Denver Post
5. **Pagination** → 12 articles per page

---

## ⚠️ Note About RSS Feeds:

Some feeds may:
- Be slower to load (RSS proxies required)
- Return fewer articles than expected
- Occasionally fail (handled gracefully)
- Mix in non-ski content (especially CO news sources)

This is normal for RSS aggregation. The page will show whatever successfully loads from each feed.

---

## 🎯 Result:

Your blog archive now focuses entirely on:
- **Ski/Snowboard News** 🎿
- **Colorado Local News** 🌲
- **Snow & Weather Reports** ❄️

Perfect for SnowBytes! 🏂

