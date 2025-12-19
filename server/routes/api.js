const express = require('express');
const router = express.Router();

// 1. Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'AI Harm Watch API'
  });
});

// 2. Get cases (Frontend needs this!)
router.get('/cases', (req, res) => {
  const demoCases = [
    {
      id: 'case-1',
      title: 'Algorithmic Bias in Hiring',
      description: 'AI hiring tools discriminating against women',
      category: 'bias',
      severity: 'high',
      status: 'verified',
      views: 1243,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'case-2',
      title: 'Deepfake Political Manipulation',
      description: 'AI-generated videos influencing elections',
      category: 'deepfakes',
      severity: 'critical',
      status: 'verified',
      views: 2156,
      createdAt: '2024-02-01T09:15:00Z'
    }
  ];
  
  res.json({
    success: true,
    data: demoCases,
    pagination: {
      total: demoCases.length,
      page: 1,
      limit: 20,
      totalPages: 1
    }
  });
});

// 3. Get statistics (Frontend needs this!)
router.get('/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalCases: 2,
      totalUsers: 0,
      totalEvidence: 0,
      verifiedCases: 2,
      pendingCases: 0,
      categoryDistribution: {
        bias: 1,
        deepfakes: 1,
        surveillance: 0,
        'job-loss': 0,
        misinformation: 0
      }
    }
  });
});

// 4. Create new case
router.post('/cases', (req, res) => {
  const newCase = {
    id: 'case-' + Date.now(),
    ...req.body,
    status: 'pending',
    views: 0,
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json({
    success: true,
    data: newCase,
    message: 'Case submitted successfully!'
  });
});

module.exports = router;
