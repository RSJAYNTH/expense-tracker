# Expense Tracker

A simple and efficient expense tracker application built with Node.js and Express.

## Features

-   **Add Expenses**: Easily record your daily expenses.
-   **View History**: Keep track of your spending habits.
-   **Docker Support**: specialized Docker configuration for easy deployment.
-   **Responsive Design**: Works on desktop and mobile.

## Project Structure

-   `public/`: Contains frontend assets (HTML, CSS, JS).
-   `server/`: Backend logic and data storage (`data.json`).
-   `Dockerfile` & `compose.yaml`: Docker configuration files.

## Getting Started

### Prerequisites

-   Node.js installed
-   Docker (optional, for containerized run)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/RSJAYNTH/expense-tracker.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the server:
    ```bash
    npm start
    ```
    Or for development:
    ```bash
    npm run dev
    ```

### Running with Docker

1.  Build and run the container:
    ```bash
    docker compose up --build
    ```

## License

This project is licensed under the ISC License.
