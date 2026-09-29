STA CATALINA NATIONAL HIGH SCHOOL — GATE
========================================

This is the SAME website as the preview (revised, not a second copy).
It is a backup of the full source so you or a teacher can improve it.

What you are looking at
-----------------------
src/routes/index.tsx     Home (office / parent sign-in)
src/routes/gate.tsx      School gate (face or PIN)
src/routes/office.tsx    Class list, hours, Gmail / SMS alerts
src/routes/parent.tsx    Parent desk
src/lib/school/          Attendance rules, class CSV, email and SMS
public/models/           Face-scan files
public/og.jpg            Share image

You do not have to use this zip to keep working.
You can still tell Grok in the chat what to change, and the preview updates.

If a teacher runs it on a computer
----------------------------------
1. Install Node.js 22
2. Unzip this folder
3. In Terminal, open this folder, then:
     npm install
     npm run dev
4. A local page will start. Use that, not the old index.html demo.

Records (students, passwords, alerts) live in the browser on that computer.
Gmail app password and Semaphore SMS key are typed in Office → Alerts.

School: Sta Catalina National High School
App name: Sta Catalina Gate
