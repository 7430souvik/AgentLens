import express from "express";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import apiKeyRoutes from "./routes/apikey.routes";
import eventRoutes from "./routes/event.route";
import healthRoutes from "./routes/health.router";

const app = express();
import cors from "cors";

app.use(
    cors({
        origin: "https://agentlens-3.onrender.com",
        credentials: true,
    })
);

app.use(express.json());

app.use((req, res, next) => {
    console.log(
        "REQUEST:",
        req.method,
        req.originalUrl
    );

    next();
});



app.get("/", (req,res)=>{
    res.json({
        status: "ok"
    })
});

app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api", apiKeyRoutes);

app.use("/api",eventRoutes);

app.use("/api/health",healthRoutes);

export default app;