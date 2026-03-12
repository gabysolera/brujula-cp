# Brújula CP · Degree Planner

**University of Costa Rica · Political Science**

---

## Why this exists

I'm 36 years old and I went back to university.

At 17, I enrolled in Political Science at UCR — but I wasn't ready. Not for the degree, but for myself. I dropped out in my second year. I went through other programs, graduated in Business Administration, and built 15 years of professional career. But Political Science was always there, unfinished.

In 2026, I made the decision to go back. This time while keeping my full-time job, which makes every semester a precision exercise: I can't take a full course load, I can't waste time enrolling in a class I don't have the prerequisites for, and I can't reach my third year without having planned how I got there.

From the second year onward, Political Science courses have complex prerequisite chains. Knowing what you can take, when, and how to organize it to graduate as efficiently as possible is not obvious, it requires manually mapping dependencies across more than 40 courses spread over 8 cycles.

I didn't find a tool that solved that...so I built one.

---

## What Brújula CP does

Brújula CP is a web application for planning the Political Science degree at UCR in a visual and interactive way.

**Degree Map** — visualizes all 8 cycles of the program from left to right. Each course shows its current status and prerequisites. Hovering highlights related courses. A single click cycles a course through Approved, In Progress, Pending, or Locked.

**Semester Plan** — automatically generates the shortest path to graduation based on approved courses and a configurable limit of 1 to 4 courses per semester, or a full block. Every time a course status is updated, the plan recalculates in real time showing remaining semesters and estimated graduation date.

Progress is saved locally in each user's browser, which means anyone in the program can use the same URL with their own independent state.

---

## Live Demo

🔗 [brujula-cp.vercel.app](https://brujula-cp.vercel.app)

---

## Tech Stack

- **React** — interactive UI and state management
- **localStorage** — per-user progress persistence in the browser
- **Vercel** — deployment and hosting
- **GitHub** — version control

---

## Local Setup

```bash
git clone https://github.com/gabysolera/brujula-cp.git
cd brujula-cp
npm install
npm start
```

App runs at `http://localhost:3000`.

---

## About the development

This project was built by me with Claude (Anthropic) as a development tool. The planner logic, course data, design, and product decisions are my own. 

---

## License

MIT — free to use, adapt, and share.

---

*Built with the conviction that it's never too late — but that efficiency helps.*