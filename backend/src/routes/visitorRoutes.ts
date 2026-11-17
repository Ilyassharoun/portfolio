import express from 'express';
import axios from 'axios';
import Visitor from '../models/Visitor';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Helper to check if IP is local/private/bogon
const isLocalOrPrivateIP = (ip: string): boolean => {
  if (!ip || ip === '::1' || ip === '127.0.0.1' || ip === 'localhost' || ip.includes('127.0.0.1')) return true;
  if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.16.') || ip.startsWith('::ffff:127.')) return true;
  return false;
};

// Helper function to fetch visitor location using multi-provider lookup with fallback
const getLocationFromIP = async (ipAddress: string): Promise<string> => {
  const isLocal = isLocalOrPrivateIP(ipAddress);

  // 1. Try ip-api.com
  try {
    const url = isLocal ? 'http://ip-api.com/json/' : `http://ip-api.com/json/${ipAddress}`;
    const response = await axios.get(url, { timeout: 3000 });
    if (response.data && response.data.status === 'success') {
      const city = response.data.city;
      const country = response.data.country;
      if (city && country) return `${city}, ${country}`;
      if (country) return country;
    }
  } catch (err) {
    // Continue to next provider
  }

  // 2. Try ipapi.co
  try {
    const url = isLocal ? 'https://ipapi.co/json/' : `https://ipapi.co/${ipAddress}/json/`;
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'portfolio-visitor-tracker' },
      timeout: 3000
    });
    if (response.data && response.data.country_name) {
      const city = response.data.city;
      const country = response.data.country_name;
      return city && country ? `${city}, ${country}` : country;
    }
  } catch (err) {
    // Continue to next provider
  }

  // 3. Try ipwho.is
  try {
    const url = isLocal ? 'https://ipwho.is/' : `https://ipwho.is/${ipAddress}`;
    const response = await axios.get(url, { timeout: 3000 });
    if (response.data && response.data.success) {
      const city = response.data.city;
      const country = response.data.country;
      return city && country ? `${city}, ${country}` : (country || 'Local Host');
    }
  } catch (err) {
    // Fail silently
  }

  return isLocal ? 'Local Development' : 'Unknown';
};

// Track visitor
router.post('/track', async (req, res) => {
  try {
    // Get real IP address from X-Forwarded-For header, fall back to req.ip
    let ipAddress = req.headers['x-forwarded-for'] as string || '';
    if (ipAddress) {
      // X-Forwarded-For can contain multiple IPs, take the first one (original client IP)
      ipAddress = ipAddress.split(',')[0].trim();
    }
    // If no X-Forwarded-For, use req.ip (will be ::1 in local dev)
    if (!ipAddress) {
      ipAddress = req.ip || 'unknown';
    }
    const userAgent = req.headers['user-agent'] || 'unknown';
    const path = req.body.path || 'unknown';

    // Check if a visitor with this IP was recorded in the last hour
    const recentVisitor = await Visitor.findOne({
      ipAddress,
      timestamp: { $gt: new Date(Date.now() - 60 * 60 * 1000) }
    });

    if (recentVisitor) {
      return res.status(200).json({ message: 'Visitor already tracked recently' });
    }

    // Get visitor location
    const location = await getLocationFromIP(ipAddress);

    const visitor = new Visitor({
      ipAddress,
      userAgent,
      path,
      location
    });

    await visitor.save();

    res.status(201).json({ message: 'Visitor tracked successfully', location });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    res.status(500).json({ message: 'Error tracking visitor' });
  }
});

// Get all visitors (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ timestamp: -1 });

    // Include virtual fields (formattedIP) and fix any old 'Unknown' locations on the fly
    const visitorsWithFormattedIP = await Promise.all(
      visitors.map(async (visitor) => {
        const visitorObj = visitor.toObject();
        visitorObj.formattedIP = (visitor as any).formattedIP;

        // If location was previously stored as 'Unknown', try resolving it now
        if (!visitorObj.location || visitorObj.location === 'Unknown') {
          const updatedLocation = await getLocationFromIP(visitorObj.ipAddress);
          visitorObj.location = updatedLocation;
          // Optionally update in background
          Visitor.updateOne({ _id: visitor._id }, { location: updatedLocation }).exec().catch(() => {});
        }

        return visitorObj;
      })
    );

    res.json(visitorsWithFormattedIP);
  } catch (error) {
    console.error('Error getting visitors:', error);
    res.status(500).json({ message: 'Error getting visitors' });
  }
});

// Get visitor stats (admin only)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Count total unique visitors by IP address
    const totalVisitors = await Visitor.countDocuments();
    const uniqueVisitors = await Visitor.distinct('ipAddress').countDocuments();
    res.json({
      totalVisitors,
      uniqueVisitors
    });
  } catch (error) {
    console.error('Error getting visitor stats:', error);
    res.status(500).json({ message: 'Error getting visitor stats' });
  }
});

// Protected dashboard route
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    // Your dashboard logic here
    // For API requests, return JSON
    if (req.headers.accept?.includes('application/json')) {
      return res.json({ message: 'Welcome to the dashboard' });
    }
    // For frontend requests, render the dashboard page
    res.render('dashboard'); // Assuming you have a dashboard view
  } catch (error) {
    console.error('Error accessing dashboard:', error);
    // For API requests, return JSON error
    if (req.headers.accept?.includes('application/json')) {
      return res.status(500).json({ message: 'Error accessing dashboard' });
    }
    // For frontend requests, redirect to error page
    res.redirect('/error');
  }
});

export default router;