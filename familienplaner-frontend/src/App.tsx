/* ============================================================================
 * Definiert Layout der gesamten Anwendung
 * ============================================================================
 */
import React from "react";
import { AppRouter } from "./router";
import { NavBar } from "./components/NavBar";

const App: React.FC = () => {
    return (
        <div className="app-root">
            <NavBar />
            <main className="app-main-padded">
                <AppRouter />
            </main>
        </div>
    );
};

export default App;
