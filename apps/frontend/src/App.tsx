    import {
        Routes,
        Route,
        Navigate,
    } from "react-router-dom";
    import './index.css'; 

    import Login from "./pages/Login";
    import Signup from "./pages/Signup";
    import Dashboard from "./pages/Dashboard";
    import Project from "./pages/Project";
    import Events from "./pages/Event";
    import EventDetails from "./pages/EventDetails";
    import ApiKey from "./pages/apiKeys";
    import Landing from "./pages/Landing";
    import CreateProject from "./pages/CreateProject";
    import Docs from "./pages/Docs";

export default function App() {
    return (
        
        <Routes>
            <Route path="/" element={<Landing />} />
            

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/signup"
                element={<Signup />}
            />

            <Route
                path="/dashboard"
                element={<Dashboard />}
            />
            <Route
                path="/projects/new"
                element={<CreateProject />}
            />

            <Route
                path="/projects/:id/keys"
                element={<ApiKey />}
            />

            <Route
                path="/projects/:id"
                element={<Project />}
            />

            <Route
                path="/projects/:id/events"
                element={<Events />}
            />

            <Route
                path="/projects/:id/events/:eventId"
                element={<EventDetails />}
            />

            

            <Route path="/docs" element={<Docs/>} />

        </Routes>
    );
}