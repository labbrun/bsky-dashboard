# AI Guidance Directory

This directory contains all the strategic guidance, brand assets, and content strategies that the AI content repurposing system should consult when analyzing blog content and generating Bluesky post suggestions.

## Directory Structure

```
ai-guidance/
├── brand-assets/           # Brand voice, customer avatars, target audience
├── content-strategies/     # Copywriting, repurposing, content calendar strategies  
├── marketing-psychology/   # Hooks, psychology, persuasion techniques
└── examples/              # Successful content examples and templates
```

## How the AI Uses These Files

The content repurposing service (`contentRepurposingService.js`) will:

1. **Load brand context** from `brand-assets/` to ensure content aligns with your voice and audience
2. **Apply content strategies** from `content-strategies/` for platform-specific optimization
3. **Use psychological principles** from `marketing-psychology/` to craft compelling hooks and engagement
4. **Reference examples** to maintain consistency with proven successful patterns

## Adding New Guidance

When adding new markdown files:
1. Place them in the appropriate subdirectory
2. Use clear, descriptive filenames
3. Include actionable guidelines the AI can follow
4. Update the service to load new guidance files

## Integration Points

These guidance files are consulted by:
- `services/contentRepurposingService.js` - Main content analysis and suggestion generation
- `services/aiInsightsService.js` - AI-powered insights and recommendations
- `pages/BlogAnalytics.js` - Blog content analysis and repurposing interface