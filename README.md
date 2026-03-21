# Estate Map (Реєстр маєтностей)

An interactive web application for mapping and managing historical estates and their inventories (snapshots) over time.

## 🚀 Features

- **Interactive Map:** Visualize historical estates using Leaflet.
- **Historical Snapshots:** View detailed inventories for different time periods, including owners, source documents, and lists of settlements.
- **Admin Dashboard:** Full CRUD operations for estates and snapshots.
- **Approval System:** Workflow for reviewing and approving new data submissions (Pending/Approved status).
- **Responsive Design:** Modern UI with dark mode support, built with Shadcn/UI.

## 🛠 Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **Mapping:** Leaflet
- **Styling:** Tailwind CSS & Shadcn/UI
- **Validation:** Zod
- **Database:** Local JSON storage (`data/data.json`) with Server Actions

## 📦 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000).

## 🗂 Project Structure

- `app/estate-map/`: Main application logic and map view.
- `app/admin/`: Admin dashboard for data management.
- `lib/data-utils.ts`: Server-side logic for data persistence.
- `data/`: Contains `data.json` acting as the primary data store.
- `components/ui/`: Reusable UI components.
