const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Supabase Connection
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase Environment Variables!");
}

const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// Helper for Supabase check
const checkSupabase = (res) => {
    if (!supabase) {
        return res.status(500).json({
            error: "Backend Configuration Error",
            details: "SUPABASE_URL or SUPABASE_KEY is missing in Vercel Environment Variables."
        });
    }
    return false;
};

// --- Heroes API ---
app.get('/api/heroes', async (req, res) => {
    const { data, error } = await supabase.from('heroes').select('*').order('created_at', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/heroes', async (req, res) => {
    if (checkSupabase(res)) return;
    const raw = req.body;

    // Ensure correct fields for heroes
    const hero = {
        id: raw.id,
        name: raw.name,
        type: raw.type,
        stats: raw.stats
    };

    const { data, error } = await supabase.from('heroes').upsert(hero);
    if (error) {
        console.error("Supabase Error (Heroes):", error);
        return res.status(500).json({ error: error.message, details: "Check if 'heroes' table exists." });
    }
    res.json({ message: 'Hero saved', data });
});

app.delete('/api/heroes/:id', async (req, res) => {
    const { error } = await supabase.from('heroes').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Hero deleted' });
});

// --- Equipment API ---
app.get('/api/equipment', async (req, res) => {
    const { data, error } = await supabase.from('equipment').select('*').order('created_at', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/equipment', async (req, res) => {
    if (checkSupabase(res)) return;
    const raw = req.body;

    // Map CamelCase (frontend) to snake_case (DB)
    const equip = {
        id: raw.id,
        category: raw.category,
        sub_type: raw.subType || raw.sub_type,
        name: raw.name,
        set: raw.set || raw.set_name,
        grade: raw.grade,
        enhance: raw.enhance,
        main_option: raw.mainOption || raw.main_option,
        sub_options: raw.subOptions || raw.sub_options,
        is_equipped: raw.isEquipped !== undefined ? raw.isEquipped : (raw.is_equipped !== undefined ? raw.is_equipped : false)
    };

    const { data, error } = await supabase.from('equipment').upsert(equip);
    if (error) {
        console.error("Supabase Error (Equipment):", error);
        return res.status(500).json({ error: error.message, details: "Check if 'equipment' table and columns match the schema." });
    }
    res.json({ message: 'Equipment saved', data });
});

app.delete('/api/equipment/:id', async (req, res) => {
    const { error } = await supabase.from('equipment').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Equipment deleted' });
});

// --- Presets API ---
app.get('/api/presets', async (req, res) => {
    const { data, error } = await supabase.from('presets').select('*').order('created_at', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/presets', async (req, res) => {
    const preset = req.body;
    const { data, error } = await supabase.from('presets').upsert(preset);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Preset saved', data });
});

app.delete('/api/presets/:id', async (req, res) => {
    const { error } = await supabase.from('presets').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Preset deleted' });
});

module.exports = app;
