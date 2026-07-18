# GW Consulting — Website

A landing page for **GW Consulting**, helping international school students in Korea
gain admission to top US universities.

## 📂 What's in this project

- **`index.html`** — Your entire website. It's a single file containing the design,
  layout, and text. You can open it in any web browser.

## ▶️ How to preview the site on your computer

1. Find the file `index.html` in this folder.
2. **Double-click it.** It will open in your web browser (Chrome, Safari, etc.).
3. That's it — you're looking at your live website.

## ✏️ How to change the text

1. Open `index.html` in a text editor (even Notepad or TextEdit works; a free editor
   like **VS Code** is nicer).
2. Use "Find" (Ctrl+F / Cmd+F) to search for the words you want to change.
3. Type your new words, then **Save**.
4. Refresh the browser to see the change.

### Things you'll want to update
- **Business name / logo** — search for `GW Consulting`.
- **Contact info** — search for `hello@gwconsulting.com` and `+82 10-0000-0000`.
- **Statistics** — search for `150+`, `92%`, etc. Use your real numbers.
- **Testimonials** — search for `Mrs. Park` to find the review section.
- **University names** — search for `Cornell` to find the logo strip.
- **Colors** — near the top of the file, look for `--navy` and `--gold`. Change the
  color codes (like `#0f2c4c`) to re-brand the whole site at once.

## 📮 Making the contact form actually send you emails

Right now the form shows a friendly "thank you" message but does **not** email you yet.
To receive submissions, connect it to a free form service (no coding required):

1. Go to **[Formspree.com](https://formspree.io)** and create a free account.
2. Create a new form — it gives you a web address (an "endpoint").
3. In `index.html`, find `<form class="form" id="contactForm"` and:
   - add `action="YOUR_FORMSPREE_URL"` and `method="POST"` to that line, and
   - remove (or keep) the demo JavaScript at the bottom.
4. Submissions will now arrive in your email inbox.

(Alternatives: Google Forms, Tally, or Netlify Forms all work too.)

## 🌐 How to put the website online (publish it)

Pick one — all have free options:

- **Netlify Drop** (easiest): go to app.netlify.com/drop and drag this folder in.
- **GitHub Pages**: enable Pages in this repository's settings.
- **Vercel**: connect this repository and deploy.

You can later buy a custom domain (e.g. `gwconsulting.com`) and connect it.

---

*Built as a starting point — every word, color, and number is yours to customize.*
