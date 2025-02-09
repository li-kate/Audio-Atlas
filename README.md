# Audio Atlas

Kate Li, Janhavi Dhote, Agni Athreya

## Inspiration
The inspiration for our app came from Nuci’s Space, a local organization in Athens that uses music as a tool to support mental health. Their work highlights how music can create connections and foster emotional well-being. We wanted to build on this idea, creating an app that not only promotes mental health but also strengthens community ties by connecting people through their shared love of music. By drawing from Athens’ vibrant music scene, we aimed to bridge the gap between individuals and create a space for people to bond over their musical passions.

## What it does
Our app displays music events in your area and helps you connect with others who share similar music tastes and are attending the same events. This provides local music events with greater visibility and helps strengthen connections within the music community. Additionally, it offers a song recommendation system that introduces you to songs from different cultures, expanding your musical horizons beyond English-language tracks. By exploring these diverse songs, you can immerse yourself in new cultures and become more connected to the vibrant, multicultural community, such as in Athens.

## How we built it
We used Figma for designing the user interface and experience, which was then implemented into React for a responsive and dynamic frontend. To manage user authentication, we utilized Express.js for backend routing and Auth0 for secure login. MongoDB Atlas provided a robust solution for database storage, handling user preferences, song data, and event information. The backend, powered by Python Flask, helped manage complex operations such as fetching event data and user settings. The Spotify API was integrated to allow searching and saving songs. Lastly, we used Streamlit to recommend songs from different languages. 

## Challenges we ran into
Some challenges we faced included issues with React, particularly when trying to create and display our song recommendation system. No matter what we tried, it just frustratingly wouldn’t work! To overcome this, we turned to Streamlit, whose simplicity allowed us to quickly integrate and display song recommendations without dealing with complex frontend code. This streamlined our development process and made the recommendation system much easier to implement.

## Accomplishments that we're proud of
As first-time hackers, it was the first time we used almost all the technology we incorporated into the project. From React and Express.js to Streamlit and the Spotify API, we were learning as we went. Despite the many hurdles, we’re incredibly proud of how we came together and applied our newfound skills to create something in such a short amount of time!

## What we learned
Not only did we learn new technology, but we also honed our problem-solving skills and improved our ability to collaborate as a team. We also discovered how invaluable the event staff were, offering support and guidance that helped us overcome many challenges and troubleshoot issues.

## What's next for Audio Atlas
We plan to integrate more APIs, such as Eventbrite, to improve our event recommendations and connect users with a wider variety of local activities and gatherings. This will provide a richer, more immersive experience by encouraging participation in social and cultural events. Additionally, we aim to refine our recommendation engine to offer personalized event suggestions, helping users step out and engage more with their local music scene.
