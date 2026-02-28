# Simple Analytics

A lightweight, script-based website analytics platform.

Users can register their website, embed a tracking script, and view real-time analytics through a dashboard. The system tracks sessions and events efficiently, caches heavy queries, and pre-aggregates historical data for fast performance.

---

## Overview

This project provides:

- Website registration
- Tracking script generation
- Event ingestion
- Session management
- Real-time + historical analytics dashboard
- Intelligent caching + background aggregation

The goal is simple:  
Drop a script → collect events → see clean analytics.

---

## How It Works

### 1. Add Website

Users add their website URL inside the dashboard.

### 2. Embed Tracking Script

A unique script tag is generated:

```html
<script src="https://your-domain.com/pixel.js" defer></script>
````

This loads a **minified JavaScript file (`pixel.js`)** that automatically tracks:

* Page View
* Page Exit
* Path Change (SPA navigation support)

### 3. Event Tracking

The script sends event payloads to an ingestion endpoint.

Each event is stored in the database and linked to:

* A session
* A website
* Metadata

---

## Tracked Data

### Events

* `PAGE_VIEW`
* `PAGE_EXIT`
* `PATH_CHANGE`

### Session Data

Each session stores:

* Session duration
* Entry and exit paths
* Browser
* Operating system
* Device type
* UTM parameters:

  * `utm_source`
  * `utm_campaign`

---

## Dashboard Features

Users can view:

* Total page views
* Unique visitors
* Average session duration
* Most viewed pages
* Traffic sources (UTM breakdown)
* Device distribution
* Browser distribution
* OS distribution

All analytics are scoped per website.

---

## Performance Architecture

### 1. Cached Queries

All heavy analytics queries are cached in Redis.

When new events are ingested:

* A background job is triggered
* Cache for affected time ranges is updated
* Stale cache entries are replaced

This ensures:

* Fast dashboard loading
* No heavy live aggregation on every request

---

### 2. Background Jobs (Ingest)

When an event is created:

* A background job is scheduled
* Analytics cache is recalculated
* Aggregated snapshots are updated

This decouples ingestion from heavy analytics processing.

---

### 3. Time-Based Aggregation

A cron job runs periodically to:

* Aggregate analytics hourly (last 7 days)
* Aggregate analytics daily (up to 2 years)
* Store summarized snapshots
* Delete stale historical data automatically

This prevents:

* Unbounded table growth
* Expensive historical queries
* Performance degradation over time

---

## Data Model (High Level)

Core entities:

* `Website`
* `Session`
* `Event`
* `Analytics Snapshot`

Relationships:

* A Website has many Sessions
* A Session has many Events
* Snapshots store precomputed analytics per time range

---

## Tech Stack

* **Next.js** — Full-stack framework (API routes + frontend)
* **PostgreSQL** — Primary database
* **Prisma ORM** — Database access layer
* **NeonDB** — Cloud-hosted PostgreSQL
* **Clerk** — Authentication & user management
* **Redis** — Caching layer
* **Ingest** — Background job processing

---

## Key Design Decisions

* Script-based tracking for easy integration
* SPA-aware path change detection
* Event-driven cache updates
* Pre-aggregated historical snapshots
* Automatic stale data cleanup
* Redis-first analytics serving

---

## Result

A minimal, performant, script-based analytics platform that:

* Is easy to integrate
* Handles real-time ingestion
* Scales through caching + aggregation
* Maintains long-term historical data efficiently
