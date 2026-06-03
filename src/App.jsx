import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Editor";
import Config from "./Config";
import Profile from "./Profile";

import "./App.css";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/config" element={<Config />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </BrowserRouter>
    );
}