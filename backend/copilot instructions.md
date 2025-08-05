# Copilot Instructions

## API Routes Overview

Below is a summary of all backend API routes, what each does, what you send, and what you get back.

---

### Authentication

- **POST `/api/auth/register`**  
  Sign up with your name, email, password, and preferred platforms.  
  Returns your user info and a login token.

- **POST `/api/auth/login`**  
  Log in with your email and password.  
  Returns your user info and a login token.

---

### User Profile & Onboarding

- **PUT `/api/users/onboarding`**  
  Set up your profile: tone, platforms, goals, audience, past posts, summary, and schedule.  
  Returns a success message.

- **GET `/api/users/onboarding`**  
  Fetch your onboarding info (preferences, past posts, etc.).  
  Returns all your saved onboarding details.

- **GET `/api/users/me`**  
  Get your profile summary.  
  Returns your name, email, and preferences.

- **PUT `/api/users/preferences`**  
  Update your profile settings (tone, platforms, goals, audience, schedule).  
  Returns a success message.

---

### Campaigns

- **POST `/api/campaigns`**  
  Create a campaign with name, platform, tone, and audience.  
  Returns campaign details.

- **GET `/api/campaigns`**  
  Get all your campaigns.  
  Returns a list of campaigns.

---

### Drafts

- **POST `/api/drafts`**  
  Create a draft for a campaign: provide campaign, topic, AI output, tone, platform, and content.  
  Returns draft details.

- **PUT `/api/drafts/:id`**  
  Update a draft: final version and reviewed status.  
  Returns updated draft.

- **GET `/api/drafts/:campaignId`**  
  Get all drafts for a campaign.  
  Returns a list of drafts.

---

### Scheduling

- **POST `/api/schedule`**  
  Schedule a draft for posting: provide draft, campaign, and date/time.  
  Returns scheduled post details.

- **GET `/api/schedule`**  
  Get all your scheduled posts.  
  Returns a list of scheduled posts.

- **PUT `/api/schedule/:id`**  
  Update a scheduled post: change date or mark as published.  
  Returns updated schedule.

---

### Templates

- **GET `/api/templates`**  
  Get all content templates.  
  Returns a list of templates.

- **GET `/api/templates/:id`**  
  Get a specific template.  
  Returns template details.

---

### AI Content

- **POST `/api/ai/generate`**  
  Ask AI to write a post: provide topic, tone, and platform.  
  Returns generated content and saves a draft.

- **POST `/api/ai/retone`**  
  Ask AI to rewrite your content in a different tone.  
  Returns rewritten content.

---

## Layman Explanations

- **Register/Login:** Create an account or sign in.
- **Onboarding:** Set up your writing style, platforms, goals, audience, and give examples of your past posts.
- **Profile:** View or update your preferences and settings.
- **Campaigns:** Organize your posts by campaign.
- **Drafts:** Create, edit, and review your social media drafts.
- **Schedule:** Plan when your posts go live.
- **Templates:** Use ready-made content structures.
- **AI:** Generate or retone content using AI.

**Note:**  
Most routes require you to be logged in (send your token).  
For routes with `:id` or `:campaignId`, use the actual ID from your data.

---
