const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Path to data files
const DATA_DIR = path.join(__dirname, '../data');
const CASES_FILE = path.join(DATA_DIR, 'cases.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const EVIDENCE_FILE = path.join(DATA_DIR, 'evidence.json');

// Helper function to read JSON files
async function readData(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    // Return empty array if file doesn't exist or is invalid
    return [];
  }
}

// 1. Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'AI Harm Watch API'
  });
});

// 2. Get all cases - FRONTEND NEEDS THIS!
router.get('/cases', async (req, res) => {
  try {
    console.log('API: Fetching cases from', CASES_FILE);
    
    // Read cases from file
    const cases = await readData(CASES_FILE);
    
    console.log(`Found ${cases.length} cases`);
    
    // If no cases, return empty array
    res.json({
      success: true,
      data: cases || [], // Ensure it's always an array
      pagination: {
        total: cases.length,
        page: 1,
        limit: 20,
        totalPages: 1
      }
    });
    
  } catch (error) {
    console.error('Error in /api/cases:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch cases',
      message: error.message 
    });
  }
});

// 3. Get statistics - FRONTEND NEEDS THIS!
router.get('/stats', async (req, res) => {
  try {
    const cases = await readData(CASES_FILE);
    const users = await readData(USERS_FILE);
    const evidence = await readData(EVIDENCE_FILE);
    
    res.json({
      success: true,
      data: {
        totalCases: cases.length,
        totalUsers: users.length,
        totalEvidence: evidence.length,
        verifiedCases: cases.filter(c => c.status === 'verified').length,
        pendingCases: cases.filter(c => c.status === 'pending').length,
        // For demo charts
        categoryDistribution: cases.reduce((acc, c) => {
          acc[c.category] = (acc[c.category] || 0) + 1;
          return acc;
        }, {})
      }
    });
    
  } catch (error) {
    console.error('Error in /api/stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch statistics' 
    });
  }
});

// 4. Create new case
router.post('/cases', async (req, res) => {
  try {
    const cases = await readData(CASES_FILE);
    const newCase = {
      id: 'case-' + Date.now(),
      ...req.body,
      status: 'pending',
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    cases.push(newCase);
    
    // Save back to file
    await fs.writeFile(CASES_FILE, JSON.stringify(cases, null, 2));
    
    res.status(201).json({
      success: true,
      data: newCase,
      message: 'Case submitted successfully!'
    });
    
  } catch (error) {
    console.error('Error creating case:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create case' 
    });
  }
});

module.exports = router;
