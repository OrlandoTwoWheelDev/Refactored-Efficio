# Refactoring a Nightmare

This project is based on the final capstone project my team and I worked on at the end of our coding bootcamp. During the initial stages, the group dynamic was all over the place, but I did my best to stay calm and focused on the tasks ahead.

What started as simple dependency issues with the database eventually led to me rewriting the schema to get it working properly. Things went smoothly until I had to learn how to use socket.io on the fly. Understanding the fundamentals of what socket.io does and how to implement it was easy, but the challenge came when every time I ran the code in the browser, I encountered a slew of errors. After much debugging, I realized that the issue wasn’t with my implementation, but with the way the server and its files had been set up.

## Adjusting the Project

Through some research and AI assistance, I realized that security is a huge concern, especially with live chat. The project could benefit from stronger security measures, so my first task was to remove a problematic catch-all route that caused issues for me and two of my teammates while trying to adjust or add new code.

Quickly, I understood why so much hardcoding had been done—it was necessary just to make the website look functional with the way things had been set up. It became clear why one of my teammates didn’t want me touching their code, but I ultimately found out for myself during this refactor.

I improved the server setup, swapped the database for Pool to enhance DB handling and security, and worked on getting data dynamically populated instead of relying on hardcoded values. Along the way, I encountered a sea of errors. In hindsight, I probably should have scrapped most of the files and started fresh, but I kept in mind that this wouldn’t be feasible in a real-world scenario. So, I pushed forward, tackling issue after issue. I believe I touched about 70% of the files in one way or another.

After getting a new user to populate correctly, data flowing into the DB, and having the frontend display the newly added data, I felt that the refactor was in a good place—at least for now.

## Realization in a Sea of Uncertainty

As my first-ever refactor, I knew this would be a learning experience full of challenges, especially since the project was largely hardcoded to "work." I came to understand the importance of security through JWT, and how middleware can be used to secure entire routes and files. I also realized how even small changes—like replacing ‘user’ with ‘user_id’—can cause a cascade of errors.

While I had some experience setting up the DB and backend routes to handle different combinations, working on an already existing project with so many unknowns proved to be a steep learning curve. I learned how to identify errors, trace them back to their source, and understand how modifying one area affects other parts of the system. It was a valuable process that will stick with me.

## The Project Continues

This project will continue to evolve. Although I’m taking a short break to focus on learning Docker and Python (and revisiting some random code practice), I’m invested in seeing this project reach its full potential. Working on it solo has been a big undertaking, especially without a team to segment tasks and tackle issues together.

The reason for the pause is that I recently graduated from coding bootcamp and want to stick to a schedule of learning new technologies, so I can build on what I’ve learned and start applying for jobs. As a new developer, I know there’s a huge universe of coding knowledge to explore, but I also understand that it’s unrealistic to expect to know everything right out of bootcamp.

## My Backstory in Short

Before diving into development, I was a high-level HVAC technician at the end of 2024. In January 2025, I began my journey in coding with Fullstack Academy. In just a few months, I went from barely knowing how to use a computer to building full-stack websites with JavaScript, debugging code, enhancing security, and improving efficiency. I’ve learned numerous frameworks and tools along the way, but I always return to JavaScript as the foundation of my work. Additionally, I'm starting to pick up technologies like Node.js, Express, and React, and I’m excited to continue expanding my knowledge in these areas.

# Update 🤩

It’s been two weeks since I last touched this project — but that’s because I was building another one in the meantime!

The big realization? I could spend weeks picking apart the way this project was originally set up, reworking section by section, and still end up with a pile of bugs. So I went all in: dismantled the entire thing, tagged the first version, created a new v2 branch, and started fresh. 🔥

For the setup, I ran `create vite@latest` with the React & TypeScript template. I then set up:

- **Docker** for hot reloading and containerization
- **Jest** with mock tests to ensure functionality is testable
- **Prettier** to keep formatting clean and consistent

That setup — the learning curve, the config chaos, and the _million_ questions — took up most of the day... but every bit was worth it.

---

### 🚀 What’s Different in v2

- Dedicated **Chat** page (instead of scattered message boxes)
- Auth-protected routes (not just checking if a user is signed in)
- Enhanced **database functionality**
- Segmented code structure for easier debugging
- **Dockerized** for smoother deployment
- **Jest** for continuous testing
- Dynamic **DB seed** file usage

## 😎 So far so good!

I've come back to this project with a calmer mind about what all went down during bootcamp, while leveraging how much I have learned
in the past couple weeks.

**Side Note:** during this phase of fixing the catchall issue and building out the front end.... I am also going through the lovely
journey of quitting smoking cigarrets and/or vaping. Been quite the rollercoaster while doing this beast of a project. 👀💀

**The adjustments** made during this project refactor came from many questions and hours of understanding what I can or cannot do for the app. Along with what should and shouldn't be in the app. It has been this _constant_ game of stopping to zoom out, question everything,
and zoom back in to utilize the new angle I am seeing it at!

### Things I've Kept in Mind🧠

- question everything
- zooming out to see the flow of the webpage
- ensuring I have everything I will need in each section,
  so that the customer isn't lost or stuck
- security of the project as a whole
  - currently I dont have security mesaures 'in place', but I do have them in mind.
  - I am building it out first, so that after I can have feature branches to tackle the finer points
- building out the basic structure was the goal for this feature branch
  - up and comming branches will be:
    - authorization via tokens
    - styling
    - beefing up the chat page to a whole dynamic chat room
    - adjusting of routes as needed

## Another Milestone Reached 🤩🥳

Originally, I thought getting the styling done would be a breeze, but the more questions I asked, the more I realize it indeed was not a breeze.

**For** whatever reason, when I start styling, errors come about. This time it was more so a case of tiny tweaks I must have made in haste! After some time of taking one bug at a time, I got to a point that I deemed worthy of switching gears back to styling.

### The Issues
Small instances of when switching from camelCase and snake_case to flatcase was the biggest hurdle. Yet, with patience and determination, it all turned out smooth, even, and operating well. 
From there, it seems to be misunderstandings of why some fetch calls were built a little differently than intended. 

### Styling
To me, styling is more about how to ask the right questions of what you want on the page. With these questions, you can more rapidly get the answers YOU need, and get things rolling. 