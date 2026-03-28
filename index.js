const { spawn } = require("child_process");
const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let botProcess;
let logs = [];

// 🌐 BOT URL (Railway env support)
const BOT_URL = process.env.BOT_URL || "http://localhost:" + PORT;

// -------- START BOT --------
function startBot() {
    try {
        botProcess = spawn("node", ["Goat.js"], {
            cwd: __dirname,
            shell: true
        });

        botProcess.stdout.on("data", (data) => {
            let log = data.toString();
            console.log(log);
            logs.push(log);
        });

        botProcess.stderr.on("data", (data) => {
            let log = data.toString();
            console.log(log);
            logs.push(log);
        });

        botProcess.on("error", (err) => {
            console.error("Bot start error:", err);
        });

    } catch (e) {
        console.error("Spawn failed:", e);
    }
}

startBot();

// -------- ROOT --------
app.get("/", (req, res) => {
    res.send("Server Running ✅");
});

// -------- HEALTHCHECK --------
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

// -------- BOT LIVE CHECK --------
app.get("/ping", async (req, res) => {
    try {
        const r = await axios.get(BOT_URL + "/health", { timeout: 5000 });
        res.json({
            status: "Online 🟢",
            bot: r.status === 200
        });
    } catch (e) {
        res.json({
            status: "Offline 🔴"
        });
    }
});

// -------- LOGS --------
app.get("/api/logs", (req, res) => {
    res.json({ logs: logs.slice(-50) });
});

// -------- BOT STATUS --------
app.get("/api/status", (req, res) => {
    res.json({ status: botProcess ? "Online 🟢" : "Offline 🔴" });
});

// -------- RESTART BOT --------
app.get("/api/restart", (req, res) => {
    if (botProcess) botProcess.kill();
    startBot();
    res.json({ message: "Bot Restarted 🔄" });
});

// -------- SAVE APPSTATE --------
app.post("/api/appstate", (req, res) => {
    const { appstate } = req.body;

    if (!appstate)
        return res.status(400).json({ error: "Appstate required" });

    fs.writeFile("account.txt", appstate, (err) => {
        if (err)
            return res.status(500).json({ error: "Save failed" });

        res.json({ success: true });

        console.log("Restarting after appstate...");
        setTimeout(() => process.exit(2), 1000);
    });
});

// -------- START SERVER --------
app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port " + PORT);
    console.log("BOT URL:", BOT_URL);
});
