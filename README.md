# ASAP AI

**Your AI Partner in Academic & Professional Excellence.**

ASAP AI is a sophisticated web application designed to provide rigorous, AI-driven analysis for academic papers, professional reports, and various other projects. It leverages the power of Google's Gemini Pro model to deliver comprehensive, objective, and actionable feedback, helping users elevate their work to the highest standard.

---

## Core Features

-   **📝 Customizable Evaluation:** Tailor the analysis by defining the project title, discipline, academic level, evaluation context, and specific criteria.
-   **☁️ Multi-File Upload:** Upload project documents in various formats. The system intelligently processes the content for a holistic review.
-   **🧠 In-Depth AI Analysis:** Receive a detailed report featuring:
    -   An **overall score** and a synthesized summary of strengths and weaknesses.
    -   A **criterion-by-criterion breakdown** with specific scores and constructive feedback points.
    -   A conceptual **originality check** to identify potential overlaps with existing work.
    -   A list of concrete, **actionable suggestions** for improvement.
-   **🛡️ Defense Preparation (Viva Mode):** Generate a comprehensive set of probing questions based on your project, complete with answer outlines, to prepare for a thesis defense or project presentation.
-   **📜 Report History:** Automatically save and access all your past analysis reports to track progress over time.
-   **🎨 Modern, Responsive UI:** A clean, intuitive interface with both light and dark themes for a comfortable user experience on any device.

## How It Works

1.  **Configure Your Analysis:** Open the side panel to input your project's details. Select a discipline, academic level, and define the context. The evaluation criteria are pre-populated based on the discipline but are fully customizable.
2.  **Upload Your Files:** Drag and drop your project files or click to upload. The application supports a wide range of file types.
3.  **Initiate Analysis:** Click the "Analyze Project" button. ASAP AI sends your configuration and project files to the Gemini API for a thorough evaluation.
4.  **Review Your Report:** Once the analysis is complete, a detailed report is displayed. You can view the overall score, dive into each criterion, check the originality report, and see suggested actions.
5.  **Prepare for Defense:** Switch to the "Defense Prep" tab to access a set of flashcards with challenging questions and answer outlines, helping you anticipate and prepare for a successful project defense.

## Tech Stack

-   **Frontend:**
    -   [**React**](https://reactjs.org/) (with TypeScript)
    -   [**Tailwind CSS**](https://tailwindcss.com/) for styling
-   **AI & Backend Logic:**
    -   [**Google Gemini API**](https://ai.google.dev/) (specifically `gemini-2.5-pro`) for all analytical tasks. The application utilizes the JSON mode with a strict response schema to ensure data consistency.
-   **Deployment:**
    -   This application is designed to be deployed on static hosting platforms like Vercel or Netlify.

## Getting Started Locally

To run this project on your local machine:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd asap-ai-project
    ```

2.  **Install dependencies:**
    ```bash
    # Make sure you have Node.js and npm installed
    npm install
    ```

3.  **Set up Environment Variables:**
    You will need a Google Gemini API key. Create a `.env` file in the root of the project and add your key:
    ```
    API_KEY=YOUR_GEMINI_API_KEY
    ```

4.  **Run the development server:**
    ```bash
    npm start
    ```
    The application should now be running on `http://localhost:3000`.

---

This project was created to demonstrate the power of modern AI in an academic and professional context, providing a tool that is not just a proofreader but a true analytical partner.
