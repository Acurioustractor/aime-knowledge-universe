# Content Integration Guide
## Connecting Airtable and YouTube to Your Wiki

This guide will help you seamlessly integrate your existing content from Airtable and YouTube into this wiki structure.

### Airtable Integration

#### Setting Up Your Airtable Connection
1. **Export Content Structure**
   - Create a view in your Airtable base that includes all relevant metadata fields
   - Export this structure as CSV or use the Airtable API for dynamic integration

2. **Mapping Fields to Wiki Structure**
   - Episode/Content Title → Page title
   - Participants → Link to [Voices](../voices/README.md) section
   - Themes → Link to relevant theme pages
   - Geographic Location → Link to regional pages
   - Key Quotes → Add to [Quote Database](../voices/quotes/README.md)
   - Recommendations → Link to relevant [Recommendation](../recommendations/README.md) pages

3. **Automation Options**
   - Use Airtable Automations to update wiki when content is added/modified
   - Create webhook connections for real-time updates
   - Set up scheduled exports for batch updates

#### Sample Airtable Structure
```
Table: Episodes
- Title (text)
- Date (date)
- Participants (multi-select)
- Themes (multi-select)
- Region (select)
- Country (text)
- Key Quotes (long text)
- Recommendations (multi-select)
- YouTube URL (URL)
- Transcript Status (select)
- Analysis Status (select)
```

### YouTube Integration

#### Organizing Your Video Content
1. **Create Playlists by Theme**
   - Organize your 250+ episodes into themed playlists
   - Use consistent naming conventions that match wiki structure

2. **Embedding Videos in Wiki**
   - Basic embed: `<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
   - Enhanced embed with timestamp links to key moments

3. **Transcript Integration**
   - Download YouTube auto-transcripts as starting point
   - Edit for accuracy and add speaker identification
   - Link transcripts to relevant wiki pages

#### Video Processing Workflow
1. Upload to YouTube
2. Add to appropriate playlist
3. Update Airtable record
4. Generate and edit transcript
5. Extract key quotes and insights
6. Update wiki with embedded video and insights

### Automated Content Population

To efficiently populate this wiki with your existing content, consider these approaches:

1. **Script-Based Population**
   - Use Python scripts to pull from Airtable API and generate markdown files
   - Automate creation of pages based on your content structure

2. **Manual-Hybrid Approach**
   - Set up the core structure manually (as we've done)
   - Use automation for specific content types (quotes, video embeds, etc.)

3. **Continuous Integration**
   - Set up GitHub Actions or similar to update wiki when source content changes
   - Create preview environments for content review before publishing

### Next Steps

1. **Audit Your Current Content**
   - Review your Airtable structure and YouTube organization
   - Identify gaps or inconsistencies to address

2. **Choose Integration Approach**
   - Decide between manual, automated, or hybrid approach
   - Select appropriate tools based on technical resources

3. **Start With a Pilot Section**
   - Begin with one theme or region as a proof of concept
   - Refine process before scaling to all content

---
[← Back to Content Archive](./README.md) | [Home](../README.md)