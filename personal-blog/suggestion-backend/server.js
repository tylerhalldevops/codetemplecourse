const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SUGGESTIONS_FILE = path.join(__dirname, 'suggestions.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize suggestions file if it doesn't exist
async function initSuggestionsFile() {
    try {
        await fs.access(SUGGESTIONS_FILE);
    } catch (error) {
        await fs.writeFile(SUGGESTIONS_FILE, JSON.stringify([], null, 2));
        console.log('📮 Created new suggestions.json file');
    }
}

// Read suggestions from file
async function readSuggestions() {
    try {
        const data = await fs.readFile(SUGGESTIONS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading suggestions:', error);
        return [];
    }
}

// Write suggestions to file
async function writeSuggestions(suggestions) {
    try {
        await fs.writeFile(SUGGESTIONS_FILE, JSON.stringify(suggestions, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing suggestions:', error);
        return false;
    }
}

// API Routes

// Submit a new suggestion
app.post('/api/suggestions', async (req, res) => {
    try {
        const { name, email, category, suggestion, stoke, timestamp } = req.body;
        
        // Validate required fields
        if (!name || !category || !suggestion) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                success: false 
            });
        }
        
        // Read existing suggestions
        const suggestions = await readSuggestions();
        
        // Create new suggestion with ID
        const newSuggestion = {
            id: Date.now().toString(),
            name,
            email: email || '',
            category,
            suggestion,
            stoke: stoke || '3',
            timestamp: timestamp || new Date().toISOString(),
            read: false
        };
        
        // Add to suggestions array
        suggestions.unshift(newSuggestion); // Add to beginning
        
        // Write to file
        const success = await writeSuggestions(suggestions);
        
        if (success) {
            console.log(`📮 New suggestion from ${name} (${category})`);
            res.json({ 
                success: true, 
                message: 'Suggestion submitted successfully!',
                id: newSuggestion.id
            });
        } else {
            res.status(500).json({ 
                error: 'Failed to save suggestion',
                success: false 
            });
        }
        
    } catch (error) {
        console.error('Error submitting suggestion:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            success: false 
        });
    }
});

// Get all suggestions (for admin)
app.get('/api/suggestions', async (req, res) => {
    try {
        const suggestions = await readSuggestions();
        res.json({ 
            success: true, 
            suggestions,
            count: suggestions.length 
        });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).json({ 
            error: 'Failed to fetch suggestions',
            success: false 
        });
    }
});

// Mark suggestion as read
app.patch('/api/suggestions/:id/read', async (req, res) => {
    try {
        const { id } = req.params;
        const suggestions = await readSuggestions();
        
        const suggestion = suggestions.find(s => s.id === id);
        if (!suggestion) {
            return res.status(404).json({ 
                error: 'Suggestion not found',
                success: false 
            });
        }
        
        suggestion.read = true;
        await writeSuggestions(suggestions);
        
        res.json({ 
            success: true, 
            message: 'Suggestion marked as read' 
        });
    } catch (error) {
        console.error('Error marking suggestion as read:', error);
        res.status(500).json({ 
            error: 'Failed to update suggestion',
            success: false 
        });
    }
});

// Delete a suggestion
app.delete('/api/suggestions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const suggestions = await readSuggestions();
        
        const filteredSuggestions = suggestions.filter(s => s.id !== id);
        
        if (filteredSuggestions.length === suggestions.length) {
            return res.status(404).json({ 
                error: 'Suggestion not found',
                success: false 
            });
        }
        
        await writeSuggestions(filteredSuggestions);
        
        res.json({ 
            success: true, 
            message: 'Suggestion deleted' 
        });
    } catch (error) {
        console.error('Error deleting suggestion:', error);
        res.status(500).json({ 
            error: 'Failed to delete suggestion',
            success: false 
        });
    }
});

// Get stats
app.get('/api/stats', async (req, res) => {
    try {
        const suggestions = await readSuggestions();
        
        const stats = {
            total: suggestions.length,
            unread: suggestions.filter(s => !s.read).length,
            byCategory: {},
            avgStoke: 0
        };
        
        // Count by category
        suggestions.forEach(s => {
            stats.byCategory[s.category] = (stats.byCategory[s.category] || 0) + 1;
        });
        
        // Calculate average stoke
        if (suggestions.length > 0) {
            const totalStoke = suggestions.reduce((sum, s) => sum + parseInt(s.stoke || 3), 0);
            stats.avgStoke = (totalStoke / suggestions.length).toFixed(1);
        }
        
        res.json({ success: true, stats });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ 
            error: 'Failed to fetch stats',
            success: false 
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: '📮 SnowBytes Suggestion Backend is running!',
        timestamp: new Date().toISOString()
    });
});

// Start server
async function startServer() {
    await initSuggestionsFile();
    
    app.listen(PORT, () => {
        console.log(`
╔══════════════════════════════════════════════╗
║  📮 SnowBytes Suggestion Backend             ║
║                                              ║
║  🚀 Server running on port ${PORT}            ║
║  📊 Admin panel: http://localhost:${PORT}/admin ║
║  🔥 API ready: http://localhost:${PORT}/api     ║
╚══════════════════════════════════════════════╝
        `);
    });
}

startServer().catch(console.error);

