# CKEditor 5 A11yFirst Plugin - User Guide

## Welcome to Accessible Content Creation

This guide helps content authors and editors use the CKEditor 5 A11yFirst plugin to create accessible content that works for all users, including those using assistive technologies like screen readers.

---

## What Is A11yFirst?

**A11yFirst** (accessibility first) helps you write accessible content while you're creating it, rather than trying to fix accessibility problems after publication.

The plugin provides **real-time guidance and validation** as you type, helping you:
- ✅ Write meaningful link text
- ✅ Add descriptive image alt text
- ✅ Organize content with proper heading structure
- ✅ Create accessible tables with captions and headers
- ✅ Use proper lists instead of bullet-like text

---

## Getting Started

### The Help System

The Help Button (❓) in your editor opens in-editor guidance on 10 accessibility topics.

**To Use Help:**
1. Click the Help button (❓) in the toolbar
2. Select a topic from the dropdown
3. Click "Load Topic" to see guidance
4. Close the dialog when done

**Available Help Topics:**
- Getting Started - Overview of A11yFirst
- Heading & Paragraph - Proper heading structure
- List - Creating accessible lists
- Image - Alt text and captions
- Character Style - Semantic text attributes
- Link - Meaningful link text
- Paragraph Format - Semantic block elements
- Table - Table structure and captions
- A11y Checker Summary - Understanding findings
- About A11yFirst - Project philosophy

---

## Feature Guide by Content Type

### Headings & Document Structure

**Why It Matters:**
Screen reader users can jump between headings to quickly navigate long documents. Proper heading hierarchy is essential for understanding structure.

**Best Practices:**
- Start with Heading 2 (H2) for major sections
- Go in sequence: H2 → H3 → H4 (never skip levels like H2 → H4)
- Never use multiple H1s – the page title is already H1
- Every section should have a heading

**A11yFirst Validation:**
A11yFirst will warn you if:
- ❌ Heading levels are out of sequence (H2 → H4 without H3)
- ❌ A new heading breaks the structure for following headings
- ❌ You use H1 when only H2-H6 are allowed (Strict Mode)

**Example of Good Heading Structure:**
```
H2: Main Topic
   H3: First Subtopic
      H4: Detail
   H3: Second Subtopic
H2: Next Topic
```

**Example of Bad Heading Structure:**
```
H2: Main Topic
   H4: Detail (jumped from H2 to H4!)  ❌
H2: Next Topic
```

---

### Images & Visual Content

**Why It Matters:**
Screen reader users can't see images. Alt text describes what the image shows so everyone can understand your content.

**Best Practices:**
- Write alt text that describes what's happening or what the image is about
- Keep alt text concise (usually under 150 characters)
- Don't start with "image of" or "picture of" – that's already understood
- For decorative images with no meaning, alt text can be empty
- Complex images may need a longer description below the image

**A11yFirst Validation:**
A11yFirst will warn you if:
- ❌ Images are missing alt text completely
- ⚠️ Complex images might need a caption (advisory)

**Good Alt Text Examples:**
- ❌ "Picture of a solar panel"
- ✅ "Solar panel array on roof of community center"

- ❌ "Graph"
- ✅ "Bar graph showing 45% renewable energy adoption in 2025"

- ❌ "Decorative line"
- ✅ (leave alt empty – it's purely decorative)

---

### Links & Navigation

**Why It Matters:**
Screen reader users often scan links to understand a page. Meaningful link text helps them determine where each link leads without reading surrounding text.

**Best Practices:**
- Describe where the link goes or what it does
- Avoid generic phrases like "click here," "link," "read more"
- Don't use raw URLs as visible text when possible
- If you must link to an external site, say so ("Open solar guide in new window")

**A11yFirst Validation:**
A11yFirst will warn you if:
- ❌ Link text is generic: "click here," "read more," "link,"  "here"
- ❌ Link text is empty or has no content
- ⚠️ Link text is ambiguous: "this," "information," "page"

**Good Link Examples:**
- ❌ "Click here for solar installation guide"
- ✅ "Read the solar installation guide"

- ❌ "www.example.org/solar"
- ✅ "Solar installation guide (opens new window)"

- ❌ "More"
- ✅ "Learn more about our solar program"

---

### Lists & Organization

**Why It Matters:**
Proper lists help screen readers announce the number of items and navigate through lists. Fake lists (created with bullet-like text) prevent assistive technology from understanding the structure.

**Best Practices:**
- Use proper bullet lists (`•`) for unordered items
- Use numbered lists for sequences or ranked items
- Don't create fake lists using dashes, asterisks, or numbers in regular paragraphs
- Keep list nesting reasonable (avoid 4+ levels; it's confusing)
- Each item should be logically similar to others in the list

**A11yFirst Validation:**
A11yFirst will warn you if:
- ❌ You write bullet-like text (`•`, `–`, numbered) without proper list markup
- ⚠️ Lists are deeply nested (4+ levels) – consider flattening structure
- ❌ Improper nesting within lists

**Good List Examples:**

✅ Proper Unordered List:
```
• Electric accessible bus network
• Rooftop solar + battery co-ops
• Cooling green corridors
```

✅ Proper Ordered List:
```
1. Assess current infrastructure
2. Identify accessibility gaps
3. Create renewable energy plan
4. Execute improvement projects
```

❌ Fake List (Bad):
```
Priorities include:
• Solar installation
• Transit improvements
• Green corridors
```
Should use proper list markup instead.

---

### Tables & Data

**Why It Matters:**
Tables organize data, but screen reader users need clear headers to understand relationships between cells. Without proper headers and captions, tables become confusing.

**Best Practices:**
- Use tables only for actual data/relationships, never for layout
- Always include a caption describing what the table shows
- Use header cells (`<th>`) for column and row headers
- Add `scope` attributes to headers (scope="col" for columns, scope="row" for rows)
- For complex tables with multiple levels, add a summary
- Keep tables simple; avoid complex merging

**Table Caption & Summary Editor:**
A11yFirst provides an "Edit Caption" button to help you manage table metadata:

1. Click "Edit Caption" button
2. Enter **Caption Text** (required): Describes what the table shows
   - Example: "Community investment priorities comparing accessibility and environmental benefits"
3. Optionally enter **Summary**: Explains table structure (for complex tables only)
   - Example: "First column lists initiatives, with columns for accessibility benefit, environmental benefit, and priority level"
4. Click "Save Caption"

**A11yFirst Validation:**
A11yFirst will warn you if:
- ❌ Table has no caption
- ❌ Table uses data cells (`<td>`) instead of header cells (`<th>`)
- ⚠️ Header cells don't have scope attributes
- ⚠️ Complex table missing summary attribute

**Good Table Examples:**

✅ Proper Table Structure:
```
<table>
  <caption>Community Investment Priorities</caption>
  <thead>
    <tr>
      <th scope="col">Initiative</th>
      <th scope="col">Accessibility</th>
      <th scope="col">Environment</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Solar Co-ops</th>
      <td>Energy resilience</td>
      <td>Reduces emissions</td>
    </tr>
  </tbody>
</table>
```

---

### Paragraph Formatting

**Why It Matters:**
Semantic formatting (blockquotes, addresses, code) adds meaning that screen readers can announce, helping users understand the context and importance of content.

**Semantic Formats Available:**
- **Blockquote**: For quoted passages or highlighted text
  - Visually indented and emphasized
  - Announced as "quote" by screen readers
- **Address**: For contact information or author bio
  - Styled distinctly
  - Emphasizes that content is address-like
- **Code Block** (Pre): For programming code or technical examples
  - Monospace font
  - Preserves formatting

**Best Practices:**
- Use blockquotes for citations or important quotes from sources
- Use address format for contact info or signatures
- Use code blocks only for actual code, not for styling regular text
- Don't use formatting for visual effect only

**Good Examples:**

✅ Blockquote:
```
"A11yFirst changes the paradigm by guiding authors during 
content creation rather than after publication." 
— A11yFirst Project
```

✅ Address:
```
Solar Energy Coalition
123 Green Street
Energy City, EC 12345
info@solarcoalition.org
```

❌ Wrong Use:
Using blockquote just to indent text that isn't a quote.

---

### Character Styles & Semantic Markup

**Why It Matters:**
Sometimes you need to mark or emphasize specific text. Semantic character styles add context that screen readers can convey.

**Available Semantic Styles:**
- **Marker/Highlight**: Mark important text
- **Inline Quote**: Distinguishes quoted phrases within paragraphs
- **Cited Work**: References to books, articles, or works
- **Deleted Text**: Tracks deletions (shows as struck-through)
- **Inserted Text**: Tracks additions (shows as underlined)

**Best Practices:**
- Use character styles for semantic meaning, not visual styling
- Combine with bold/italic for emphasis
- Use deleted/inserted text for collaborative editing or revision tracking
- Don't overuse styles; reserved for truly important text

**Examples:**

✅ Proper Use:
"The term 'accessibility' refers to designing for people of all abilities."

✅ Tracking Changes:
Original: "Solar panels produce energy"
Edited: "Solar ~~panels~~ arrays ~~produce~~ generate renewable energy"

---

## Understanding Validation Results

### How A11yFirst Reports Issues

A11yFirst categorizes issues as:

**🔴 Blocking Issues** (Must fix before publishing)
- These are critical accessibility problems
- Examples: missing link text, missing alt, broken heading sequence
- The editor will show them immediately as you type

**🟡 Advisory Issues** (Best practices)
- These are recommendations that improve accessibility
- Examples: missing table summary, deeply nested lists
- Good to fix, but not blocking

### The A11y Checker Summary

In Demo 9, you can run a comprehensive accessibility check:

1. Edit your content
2. Click "Run Checker Summary"
3. View results showing:
   - Blocking issues (critical)
   - Advisory issues (recommendations)
   - Passing checks (green)

This helps you do a final review before publishing.

---

## Tips for Creating Accessible Content

### 1. Start with Structure
- Plan your heading hierarchy first
- Write major section headings (H2)
- Add sub-section headings (H3) under them
- Let A11yFirst validate your structure

### 2. Write for Screen Readers
- Imagine reading your content aloud to someone who can't see it
- Would they understand the images and links? If not, add text
- Would the heading structure make sense? If not, reorganize

### 3. Use Semantic Formatting
- Choose paragraph formats based on meaning, not appearance
- Use lists for related items, not for paragraphing
- Use blockquotes for actual quotes, not spacing

### 4. Test Before Publishing
- Use the A11y Checker Summary before going live
- Fix blocking issues (red) before publishing
- Consider fixing advisory issues (yellow) for better experience
- Ask colleagues to review with screen readers if possible

### 5. Keep Content Simple
- Write clearly and concisely
- Use short paragraphs
- Break up long pages with headings
- Use lists to organize information
- Avoid jargon when possible

---

## Common Accessibility Mistakes & How to Fix Them

### Mistake 1: Skipped Heading Levels
❌ H2 → H4 (skipped H3)
✅ H2 → H3 ✓

**Fix**: Use A11yFirst's suggested heading level, or manually adjust to include all levels.

---

### Mistake 2: Making Information Visual Only
❌ "See the red box for important notice"
✅ "Important: This notice requires your attention"

**Fix**: Don't rely on color or position alone; state the information in text.

---

### Mistake 3: Using "Click Here" Links
❌ "For more info, [click here](link)"
✅ "[Learn more about solar installation](link)"

**Fix**: Make link text describe the destination or action.

---

### Mistake 4: Fake Lists
❌ 
```
Our priorities include:
- Solar installation
- Transit improvements
- Green corridors
```

✅ Use proper bulleted list instead of dashes in regular text

**Fix**: Use the list button in the toolbar.

---

### Mistake 5: Images Without Alt Text
❌ Image with no alt attribute
✅ Image with descriptive alt text

**Fix**: Click image → add alt text describing what it shows

---

### Mistake 6: Tables for Layout
❌ Using a table to position text in columns
✅ Using tables only for data or relationships

**Fix**: Use CSS columns or grids for layout; save tables for data.

---

### Mistake 7: Missing Table Headers
❌ Table with all `<td>` cells
✅ Table with `<th>` header row and scope attributes

**Fix**: Use "Edit Caption" button; mark first row/column as headers with proper scope.

---

## Accessibility Standards (WCAG 2.1)

A11yFirst helps you meet **WCAG 2.1** accessibility standards:

- **Level A** (Basic): Covers fundamental accessibility
- **Level AA** (Enhanced) ⭐ Recommended for public content
  - Includes all Level A + additional requirements
  - Required by many laws and standards
- **Level AAA** (Advanced): Specialized requirements for specialized content

**A11yFirst validates primarily Level AA requirements**, which is recommended for most public and organizational content.

### Key WCAG Principles (Covered by A11yFirst):

1. **Perceivable** - Information is conveivable to users
   - Images have alt text
   - Color isn't the only way to convey information

2. **Operable** - Users can navigate and use content
   - Heading structure aids navigation
   - Links are clear

3. **Understandable** - Content is clear and easy to follow
   - Proper structure with headings
   - Clear, simple language
   - Clear link text

4. **Robust** - Works with assistive technologies
   - Proper HTML semantics
   - Proper table structure
   - Heading hierarchy

---

## Browser & Device Support

A11yFirst works with:

| Technology | Support |
|------------|---------|
| Screen Readers | NVDA, JAWS, VoiceOver |
| Keyboard Users | Full keyboard navigation |
| Mobile | Touch-friendly, Alt text works |
| High Contrast | Works with all contrast modes |
| Text Resizing | No loss of functionality |

---

## Glossary

| Term | Definition |
|------|-----------|
| **Alt Text** | Text describing an image for users who can't see it |
| **Assistive Technology** | Software/hardware helping people with disabilities (screen readers, magnifiers) |
| **ARIA** | Accessible Rich Internet Applications - markup for describing interactive content |
| **Caption** | Title or description of a table |
| **Semantic** | Meaningful; HTML that conveys meaning beyond appearance |
| **Screen Reader** | Technology that reads web content aloud |
| **Scope (attribute)** | Indicates whether a table header applies to row or column |
| **Semantic Formatting** | Using HTML elements based on meaning (blockquote, address) rather than appearance |

---

## Need More Help?

### In-Editor Help
- Click the Help button (❓) in the toolbar
- Find answers to specific questions

### External Resources
- [W3C Web Accessibility Tutorials](https://www.w3.org/WAI/tutorials/) – Official web accessibility guidance
- [WebAIM](https://webaim.org/) – Web Accessibility In Mind – practical tips
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/) – Official standards
- [SCULPT Accessibility Framework](https://www.worcestershire.gov.uk/council-services/business/digital-worcestershire/sculpt-accessibility) – A practical six-point checklist for content authors (Structure, Colour and contrast, Use of images, Links, Plain English, Tables)

---

## The SCULPT Framework

[SCULPT](https://www.worcestershire.gov.uk/council-services/business/digital-worcestershire/sculpt-accessibility) is an accessibility framework developed by Worcestershire County Council that gives content authors a memorable checklist for creating accessible digital content. It maps closely to the guidance built into A11yFirst:

| SCULPT Area | What it means | A11yFirst Support |
|-------------|---------------|-------------------|
| **S**tructure | Use headings and logical document structure | ✅ Heading validator enforces correct heading hierarchy |
| **C**olour and contrast | Ensure sufficient contrast; don't rely on colour alone | ⚠️ Not enforced in-editor; use a contrast checker alongside A11yFirst |
| **U**se of images | Provide meaningful alternative text for images | ✅ Image validator warns when alt text is missing |
| **L**inks | Write descriptive link text (avoid "click here", "more") | ✅ Link validator detects generic and empty link text |
| **P**lain English | Write clearly and concisely | 💡 Use clear, simple language; A11yFirst encourages semantic structure |
| **T**ables | Use proper table markup with headers and captions | ✅ Table validator checks for captions, header cells, and scope attributes |

### Quick SCULPT checklist for authors

Before publishing your content, ask yourself:

1. **Structure** — Does my page have a clear heading hierarchy (H2 → H3 → H4)?
2. **Colour and contrast** — Does my text have sufficient contrast against its background? Is colour used as the *only* way to convey information?
3. **Use of images** — Do all meaningful images have descriptive alt text?
4. **Links** — Does every link describe where it goes or what it does?
5. **Plain English** — Is the content clear, concise, and free of unnecessary jargon?
6. **Tables** — Does every table have a caption, header row, and appropriate scope attributes?

A11yFirst will flag issues in categories S, U, L, and T automatically. Categories C and P rely on author judgment.

### Feedback
For issues or suggestions, contact your content management team or visit the [A11yFirst GitHub](https://github.com/a11yfirst/plugins-dev).

---

## Accessibility is for Everyone

Creating accessible content benefits everyone:
- ♿ People with disabilities
- 👴 Older adults with age-related changes
- 🌐 Non-native speakers (clear language helps)
- 📱 Mobile users (simpler pages load faster)
- 🔊 Anyone using voice commands
- 🌟 Your SEO (search engines like structured content)

**A11yFirst makes creating accessible content easy. Thank you for creating content that works for everyone!**
