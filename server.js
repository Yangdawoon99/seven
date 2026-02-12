const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'sena_manager.db');

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(__dirname));

// DB Initialization
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) console.error('DB Connection Error:', err.message);
    else console.log('Connected to SQLite database.');
});

db.serialize(() => {
    // Heroes Table
    db.run(`CREATE TABLE IF NOT EXISTS heroes (
        id TEXT PRIMARY KEY,
        name TEXT,
        type TEXT,
        level INTEGER,
        stats TEXT,
        icon TEXT,
        priority TEXT
    )`);

    // Equipment Table
    db.run(`CREATE TABLE IF NOT EXISTS equipment (
        id TEXT PRIMARY KEY,
        category TEXT,
        subType TEXT,
        name TEXT,
        set_name TEXT,
        grade INTEGER,
        enhance INTEGER,
        mainOption TEXT,
        subOptions TEXT,
        isEquipped BOOLEAN,
        equippedTo TEXT
    )`);

    // Presets Table
    db.run(`CREATE TABLE IF NOT EXISTS presets (
        id TEXT PRIMARY KEY,
        heroId TEXT,
        name TEXT,
        tag TEXT,
        weapons TEXT,
        armors TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// API Routes - Heroes
app.get('/api/heroes', (req, res) => {
    db.all("SELECT * FROM heroes", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        rows.forEach(row => {
            row.stats = JSON.parse(row.stats);
            row.priority = JSON.parse(row.priority || '[]');
        });
        res.json(rows);
    });
});

app.post('/api/heroes', (req, res) => {
    const { id, name, type, level, stats, icon, priority } = req.body;
    const stmt = db.prepare("INSERT OR REPLACE INTO heroes (id, name, type, level, stats, icon, priority) VALUES (?, ?, ?, ?, ?, ?, ?)");
    stmt.run(id, name, type, level, JSON.stringify(stats), icon, JSON.stringify(priority), function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id, message: 'Hero saved' });
    });
    stmt.finalize();
});

app.delete('/api/heroes/:id', (req, res) => {
    db.run("DELETE FROM heroes WHERE id = ?", req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Hero deleted' });
    });
});

// API Routes - Equipment
app.get('/api/equipment', (req, res) => {
    db.all("SELECT * FROM equipment", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        rows.forEach(row => {
            try {
                row.mainOption = row.mainOption ? JSON.parse(row.mainOption) : { name: "", value: 0 };
                row.subOptions = row.subOptions ? JSON.parse(row.subOptions) : [];
            } catch (e) {
                console.error("JSON Parse Error for equip:", row.id, e);
                row.mainOption = { name: "", value: 0 };
                row.subOptions = [];
            }
            row.isEquipped = !!row.isEquipped;
            // Ensure BOTH set and set_name exist and match
            row.set = row.set_name || row.set || "";
            row.set_name = row.set;
        });
        res.json(rows);
    });
});

app.post('/api/equipment', (req, res) => {
    const data = req.body;
    // Prefer 'set', fallback to 'set_name', but never allow null/undefined string
    let setId = data.set || data.set_name;
    if (setId === 'undefined' || !setId) setId = "";

    const { id, category, subType, name, grade, enhance, mainOption, subOptions, isEquipped, equippedTo } = data;

    const stmt = db.prepare("INSERT OR REPLACE INTO equipment (id, category, subType, name, set_name, grade, enhance, mainOption, subOptions, isEquipped, equippedTo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    stmt.run(id, category, subType, name, setId, grade, enhance, JSON.stringify(mainOption), JSON.stringify(subOptions), isEquipped ? 1 : 0, equippedTo, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id, message: 'Equipment saved' });
    });
    stmt.finalize();
});

app.delete('/api/equipment/:id', (req, res) => {
    db.run("DELETE FROM equipment WHERE id = ?", req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Equipment deleted' });
    });
});

// API Routes - Presets
app.get('/api/presets', (req, res) => {
    db.all("SELECT * FROM presets", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        rows.forEach(row => {
            // Handle potential old schema where weapons/armors might be null or undefined
            row.weapons = JSON.parse(row.weapons || '[]');
            row.armors = JSON.parse(row.armors || '[]');
            // If old 'equipIds' existed, it would be ignored here.
        });
        res.json(rows);
    });
});

app.post('/api/presets', (req, res) => {
    const { id, heroId, name, tag, weapons, armors } = req.body;
    const stmt = db.prepare("INSERT OR REPLACE INTO presets (id, heroId, name, tag, weapons, armors) VALUES (?, ?, ?, ?, ?, ?)");
    stmt.run(id, heroId, name, tag, JSON.stringify(weapons), JSON.stringify(armors), function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id, message: 'Preset saved' });
    });
    stmt.finalize();
});

app.delete('/api/presets/:id', (req, res) => {
    db.run("DELETE FROM presets WHERE id = ?", req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Preset deleted' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
