# IMAGI-NATION Wiki Frontend Guide

This guide explains the frontend implementation for your IMAGI-NATION Research Wiki, including the YouTube and Mailchimp integrations.

## What's Been Built

### 1. Modern Next.js Frontend
- Complete application structure with pages, components, and API routes
- Responsive design using Tailwind CSS
- Clean, modern UI that showcases your content effectively

### 2. YouTube Integration
- API route for fetching videos from your YouTube channel or playlists
- FeaturedVideos component to display videos on your homepage
- Video archive page with filtering capabilities
- Individual video pages with related content

### 3. Mailchimp Newsletter Archive
- API route for fetching campaigns from your Mailchimp account
- MailchimpArchive component to display newsletters
- Newsletter subscription page
- Ready to connect with your Mailchimp credentials

### 4. Core Components
- Header with navigation
- Footer with links and social media
- RecommendationCard for showcasing key insights
- Page layouts and content containers

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Your `.env.local` file has been created with placeholders. Update it with your actual API keys:

```
YOUTUBE_API_KEY=your_actual_youtube_api_key
MAILCHIMP_API_KEY=your_actual_mailchimp_api_key
MAILCHIMP_SERVER_PREFIX=your_actual_mailchimp_server_prefix
```

### 3. Add Your Images
You've already added some images to the `assets/images` directory. Make sure to:
- Create a `logo.png` file for your header
- Add any additional images you want to use throughout the site

### 4. Run the Development Server
```bash
npm run dev
```

## Connecting to Your YouTube Channel

1. **Get Your YouTube API Key**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable the YouTube Data API v3
   - Create API credentials and copy your API key

2. **Update Your Channel or Playlist ID**
   - In `src/app/api/youtube/route.ts`, update the API endpoint to use your channel or playlist ID
   - For testing, you can use the mock data in `src/components/FeaturedVideos.tsx`

3. **Customize Video Display**
   - Adjust the video card layout in `src/components/FeaturedVideos.tsx`
   - Update the video detail page in `src/app/content/videos/[id]/page.tsx`

## Connecting to Your Mailchimp Account

1. **Get Your Mailchimp API Key**
   - Log in to your Mailchimp account
   - Go to Account > Extras > API keys
   - Create a new API key or use an existing one

2. **Find Your Server Prefix**
   - Your server prefix is the part after the dash in your Mailchimp API endpoint
   - For example, if your API endpoint is `https://us6.api.mailchimp.com`, your server prefix is `us6`

3. **Update Your Campaign Data**
   - For testing, you can use the mock data in `src/components/MailchimpArchive.tsx`
   - Once connected to the API, this will display your actual campaigns

## Customizing the Frontend

### Styling
- Update the color scheme in `tailwind.config.js`
- Modify global styles in `src/app/globals.css`
- Adjust component styles as needed

### Content
- Update the homepage content in `src/app/page.tsx`
- Customize the header navigation in `src/components/Header.tsx`
- Modify the footer links in `src/components/Footer.tsx`

### Adding New Pages
1. Create a new directory in `src/app/` for your page
2. Add a `page.tsx` file with your page content
3. Update navigation in `Header.tsx` if needed

## Integrating with Your Wiki Content

The frontend is designed to work seamlessly with the wiki structure we created earlier:

1. **Markdown Integration**
   - Use the `react-markdown` package to render your markdown content
   - Create API routes to fetch content from your wiki files

2. **Content Organization**
   - Link to your wiki sections from the navigation
   - Create dedicated pages for each major section

3. **Search Implementation**
   - Implement full-text search across your wiki content
   - Use the search component on the video archive page as a starting point

## Next Steps

1. **Complete API Integration**
   - Replace mock data with actual API calls
   - Test with your YouTube and Mailchimp accounts

2. **Add Content Pages**
   - Create pages for each section of your wiki
   - Implement markdown rendering for your content files

3. **Enhance User Experience**
   - Add search functionality
   - Implement filtering for videos and newsletters
   - Create interactive visualizations for research data

4. **Deploy Your Wiki**
   - Choose a hosting platform (Vercel, Netlify, etc.)
   - Set up continuous deployment
   - Configure environment variables on your hosting platform

This frontend provides a solid foundation that you can build upon to create a truly exceptional wiki experience that showcases your IMAGI-NATION Research Synthesis.