# IMAGI-NATION Wiki Frontend

This directory contains the frontend application for the IMAGI-NATION Research Wiki, built with Next.js and React.

## Directory Structure

- `app/` - Next.js App Router pages and layouts
  - `api/` - API routes for YouTube and Mailchimp integration
  - `newsletters/` - Newsletter archive page
  - `page.tsx` - Homepage
  - `layout.tsx` - Root layout with header and footer
  - `globals.css` - Global styles

- `components/` - Reusable React components
  - `Header.tsx` - Site navigation
  - `Footer.tsx` - Site footer
  - `FeaturedVideos.tsx` - YouTube video integration
  - `MailchimpArchive.tsx` - Mailchimp newsletter integration
  - `RecommendationCard.tsx` - Card for displaying recommendations

- `lib/` - Utility functions and API clients
- `types/` - TypeScript type definitions
- `data/` - Static data and content

## API Integrations

### YouTube API

The YouTube integration allows you to display videos from your IMAGI-NATION YouTube channel or specific playlists. To set this up:

1. Create a Google Developer account and obtain a YouTube Data API key
2. Set the `YOUTUBE_API_KEY` environment variable
3. Update the `FeaturedVideos.tsx` component to use your channel or playlist ID

API endpoints:
- `GET /api/youtube?playlistId=YOUR_PLAYLIST_ID` - Fetch videos from a specific playlist
- `GET /api/youtube?channelId=YOUR_CHANNEL_ID` - Fetch videos from a specific channel

### Mailchimp API

The Mailchimp integration displays your newsletter archive. To set this up:

1. Obtain a Mailchimp API key from your account
2. Set the `MAILCHIMP_API_KEY` and `MAILCHIMP_SERVER_PREFIX` environment variables
3. Update the `MailchimpArchive.tsx` component to display your campaigns

API endpoints:
- `GET /api/mailchimp?count=10&offset=0` - Fetch campaigns with pagination

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   Create a `.env.local` file with:
   ```
   YOUTUBE_API_KEY=your_youtube_api_key
   MAILCHIMP_API_KEY=your_mailchimp_api_key
   MAILCHIMP_SERVER_PREFIX=your_mailchimp_server_prefix
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Extending the Frontend

### Adding New Pages

1. Create a new directory in `src/app/` for your page
2. Add a `page.tsx` file with your page content
3. Update navigation in `Header.tsx` if needed

### Adding New Components

1. Create a new file in `src/components/`
2. Import and use the component where needed

### Styling

This project uses Tailwind CSS for styling. You can:
- Modify `tailwind.config.js` to customize the theme
- Add custom styles in `globals.css`
- Use Tailwind utility classes directly in components

### Content Integration

To integrate with your markdown wiki content:
1. Use the `gray-matter` package to parse frontmatter
2. Use `react-markdown` to render markdown content
3. Create API routes to fetch content from your wiki structure

## Deployment

This Next.js application can be deployed to various platforms:

1. Vercel (recommended):
   ```
   npm install -g vercel
   vercel
   ```

2. Netlify:
   Create a `netlify.toml` file with build settings

3. Self-hosted:
   ```
   npm run build
   npm run start
   ```

Remember to set environment variables in your deployment environment.