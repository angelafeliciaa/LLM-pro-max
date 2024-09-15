
<img width="1512" alt="Screenshot 2024-09-15 at 05 43 48" src="https://github.com/user-attachments/assets/ab693cc1-3ed8-4716-b2da-5ac19914512b">

## Inspiration
Large Language Models (LLMs) are limited by a token cap, making it difficult for them to process large contexts, such as entire codebases. We wanted to overcome this limitation and provide a solution that enables LLMs to handle extensive projects more efficiently.

## What it does
LLM Pro Max intelligently breaks a codebase into manageable chunks and feeds only the relevant information to the LLM, ensuring token efficiency and improved response accuracy. It also provides an interactive dependency graph that visualizes the relationships between different parts of the codebase, making it easier to understand complex dependencies.

## How we built it
Our landing page and chatbot interface were developed using React. We used Python and Pyvis to create an interactive visualization graph, while FastAPI powered the backend for dependency graph content. We've added third-party authentication using the GitHub Social Identity Provider on Auth0. We set up our project's backend using Convex and also added a Convex database to store the chats. We implemented Chroma for vector embeddings of GitHub codebases, leveraging advanced Retrieval-Augmented Generation (RAG) techniques, including query expansion and re-ranking. This enhanced the Cohere-powered chatbot’s ability to respond with high accuracy by focusing on relevant sections of the codebase.

## Challenges we ran into
We faced a learning curve with vector embedding codebases and applying new RAG techniques. Integrating all the components—especially since different team members worked on separate parts—posed a challenge when connecting everything at the end.

## Accomplishments that we're proud of
We successfully created a fully functional repo agent capable of retrieving and presenting highly relevant and accurate information from GitHub repositories. This feat was made possible through RAG techniques, surpassing the limits of current chatbots restricted by character context.

## What we learned
We deepened our understanding of vector embedding, enhanced our skills with RAG techniques, and gained valuable experience in team collaboration and merging diverse components into a cohesive product.

## What's next for LLM Pro Max
We aim to improve the user interface and refine the chatbot’s interactions, making the experience even smoother and more visually appealing. (Please Fund Us)
