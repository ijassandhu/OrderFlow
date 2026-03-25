const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const OPENCLAW_CLI_PATH = 'C:\\Users\\91623\\Desktop\\OpenClaw\\openclaw\\openclaw.mjs';

/**
 * 
 * @param {Array} orders - Array of messy order data
 */
async function processOrdersWithOpenClaw(orders) {
    const systemPrompt = `
You are an intelligent order processing and inventory management assistant.
You have been provided with raw, messy order and inventory data.
Please perform the following tasks:
1. Parse the data and clean it up (extract customer info, items, quantities, and prices).
2. Detect any issues like duplicate orders (same customer ordering the exact same items in a short time frame).
3. Detect low stock alerts (determine if order quantities exceed typical low stock thresholds).
4. Organize the final data into three categories: "processed_results", "alerts", and "issues".

The messy data is as follows:
${JSON.stringify(orders, null, 2)}

Return ONLY valid JSON in the exact format below, with nothing else:
{
  "results": [
    {
      "id": "ORD-XXXX",
      "customer": "Customer Name",
      "items": 2 or [{"name": "item", "qty": 2}],
      "status": "completed|processing|attention",
      "urgency": "normal|high|critical",
      "total": "$X,XXX.XX"
    }
  ],
  "alerts": ["alert 1", "alert 2"],
  "issues": ["duplicate order found for XYZ", "low stock on ABC"]
}
`;

  try {
    const response = await fetch('http://127.0.0.1:18789/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENCLAW_GATEWAY_TOKEN || 'testtoken123'}`
      },
      body: JSON.stringify({
        model: 'openclaw:main',
        messages: [{ role: 'user', content: systemPrompt }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`OpenClaw API Error ${response.status}:`, errText);
      throw new Error(`OpenClaw API returned status ${response.status}`);
    }

    const data = await response.json();
    
    // Extract JSON from response text using standard OpenAI response format
    const replyText = data.choices?.[0]?.message?.content || "";
    
    // Extract JSON from response text
    const jsonMatch = replyText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('Could not find JSON in OpenClaw response. Raw response:', replyText);
      throw new Error('OpenClaw response did not contain valid JSON structure. Raw response: ' + replyText);
    }

    try {
      const parsedData = JSON.parse(jsonMatch[0]);
      return {
        results: parsedData.results || [],
        alerts: parsedData.alerts || [],
        issues: parsedData.issues || []
      };
    } catch (parseError) {
      console.error('Failed to parse inner JSON from OpenClaw:', parseError);
      throw new Error('Failed to parse OpenClaw JSON response');
    }

  } catch (error) {
    console.error('Error calling OpenClaw HTTP API:', error);
    
    // Fallback Mock Data for UI Testing if local agent is down
    return {
      results: [
        { id: "ORD-9999", customer: "Fallback Customer", items: 3, status: "attention", urgency: "critical", total: "$500.00" }
      ],
      alerts: ["Could not reach OpenClaw, showing fallback data."],
      issues: ["API Connection Failed: " + error.message]
    };
  }
}

module.exports = {
  processOrdersWithOpenClaw
};
