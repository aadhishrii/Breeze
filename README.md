<div align="center">

# Breeze

**Smart event planning with real-time safety insights — built when venue decisions carried real public health stakes.**

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=c8f060)](https://nextjs.org)
[![Flask](https://img.shields.io/badge/Flask-000000?style=flat&logo=flask&logoColor=c8f060)](https://flask.palletsprojects.com)

</div>

---

## What it does

Breeze lets you create an event, share an invitation link, and let guests join and respond — with one important difference from every other event planning tool. It monitors real-time COVID risk levels for your venue's location and alerts everyone the moment conditions change.

Create the event. Share the link. Everyone stays informed, automatically.

---

## The user problem

During COVID, planning any gathering meant making a decision under uncertainty. You'd pick a venue, send invites, and then spend the days before constantly checking government health updates, manually texting guests if something changed, and second-guessing whether the location was still a good idea.

No existing event planning tool factored public health risk into the venue decision. Breeze was built to fill that gap — combining event coordination with live safety data so organisers and guests could make informed decisions in real time.

---

## How it works

**For the organiser:**
1. Create an event with date, location, and details
2. Share the generated invitation link with guests
3. If the venue is undecided, answer a short questionnaire — Breeze scores your responses and suggests low-risk locations via an external API
4. Get notified automatically if the AU Government health API flags elevated risk for your venue's location

**For the guest:**
1. Open the invitation link
2. Respond to the event
3. Receive real-time safety alerts if conditions change before the event

---

## Product decisions

**Real-time alerts over manual checking**
The core insight was that event organisers shouldn't have to monitor health dashboards manually. Breeze uses Kafka to stream live updates from the Australian Government health API and triggers push notifications the moment risk levels rise for a venue's location. The organiser doesn't check — Breeze tells them.

**Venue recommendation as a fallback, not the main flow**
The venue suggestion feature — where Breeze scores a questionnaire and recommends low-risk locations — was deliberately scoped as a fallback for undecided organisers, not a required step. Most people already have a venue in mind. Forcing them through a recommendation flow would create friction in the happy path. The feature earns its place by being there when you need it and invisible when you don't.

**Shareable invitation links over account-required RSVPs**
Guests shouldn't need to create an account to respond to an event. Breeze generates a unique link per event so anyone can join and respond with zero friction. This was a deliberate prioritisation — reducing barriers to guest participation was more important than building user account infrastructure in v1.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js · dynamic routing · state management |
| Backend | Flask · RESTful API |
| Database | PostgreSQL · indexing · connection pooling |
| Streaming | Apache Kafka · AU Gov health API |
| External | Location-based risk scoring API |

---

## Architecture overview

```
Organiser creates event → Flask backend → PostgreSQL
        ↓
Unique invitation link generated → shared with guests
        ↓
Guests open link → respond → stored in PostgreSQL
        ↓
Kafka consumer → streams AU Gov COVID API
        ↓
Risk level elevated for venue location?
  YES → push notification to organiser + guests
  NO  → no action
        ↓
Venue undecided? → questionnaire scoring → low-risk suggestions
```

---

## Running locally

```bash
# Clone the repo
git clone https://github.com/aadhishrii/breeze

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Add your database URL and API keys

# Start the database
createdb breeze_db

# Start backend
cd backend && flask run

# Start frontend
cd ../frontend && npm run dev
```

---

## What's next (V2)

- **Calendar integration** — sync events directly to Google Calendar for organiser and guests
- **Guest messaging** — allow organisers to message all guests directly from the platform
- **Multi-venue comparison** — compare risk levels across multiple venue options before deciding
- **Post-COVID safety signals** — extend beyond COVID to support other location-based risk signals like weather, air quality, or local event conflicts

---
