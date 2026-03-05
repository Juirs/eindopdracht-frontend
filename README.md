# IndieVerse Frontend

IndieVerse is a community-driven platform that connects indie game developers with gamers. It provides a space for developers to showcase their projects, receive feedback through reviews, participate in game jams, and build a dedicated community.

## 🚀 Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 7](https://vitejs.dev/)
- **Routing:** [React Router 7](https://reactrouter.com/)
- **State Management:** React Context API
- **API Communication:** Axios
- **Real-time Communication:** SockJS & StompJS (WebSockets)
- **Styling:** CSS Modules / Standard CSS
- **Testing:** [Vitest](https://vitest.dev/)
- **Linting:** [ESLint 9](https://eslint.org/) (Flat Config)

## 📋 Requirements

- **Node.js:** v18.0.0 or higher (LTS recommended)
- **npm:** v9.0.0 or higher

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd eindopdracht-frontend
   ```

2. **Install dependencies:**
   Using `npm ci` is recommended for deterministic installs if a `package-lock.json` is present.
   ```bash
   npm ci
   # or
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the root directory and specify the backend API base URL:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```
   *Note: Ensure the backend server is running at this URL.*

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173` (default Vite port).

## 📜 Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Compiles the application for production. |
| `npm run preview` | Locally previews the production build. |
| `npm run lint` | Runs ESLint to check for code quality issues. |
| `npm run test` | Runs Vitest in interactive watch mode. |
| `npm run test:run` | Runs Vitest once (CI-friendly). |
| `npm run test:watch` | Explicitly runs Vitest in watch mode. |

## 📁 Project Structure

```text
src/
├── assets/             # Static assets (images, icons)
├── components/         # Reusable UI components
│   ├── chat/           # Chat module components
│   ├── chatBar/        # Sidebar chat integration
│   ├── gameCard/       # Game display cards
│   ├── navigation/     # Top navigation bar
│   └── sidebar/        # Main sidebar
├── context/            # React Context providers (Auth, Chat)
├── helpers/            # API clients, socket utilities, and pure helpers
├── pages/              # Main page components/views
│   ├── browsePage/      # Game discovery
│   ├── chatPage/        # Dedicated chat view
│   ├── gameDetailsPage/ # Game information and demo
│   └── ...              # Other feature-specific pages
├── App.jsx             # Root component & Routing
└── main.jsx            # Application entry point
```

## 🧪 Testing

This project uses **Vitest** for unit testing.
- To run tests once: `npm run test:run`
- To run tests in watch mode: `npm run test`

For component testing, `@testing-library/react` and `@testing-library/jest-dom` are used. Ensure you set the environment to `jsdom` for React component tests.

## 🔑 Authentication

IndieVerse uses JWT-based authentication.
- Tokens are stored in `localStorage`.
- `AuthContext` handles the login/logout flow and rehydrates user state from the token.
- API requests automatically include the `Authorization: Bearer <token>` header where required (via `src/helpers/api.js`).

## 🤝 Contributing

1. Ensure the linter passes: `npm run lint`
2. Run existing tests: `npm run test:run`
3. Follow the established coding style (ESM, file extensions in imports).

## 📄 License

TODO: Add license information.

---
*Created as part of the IndieVerse project.*
