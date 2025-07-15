# 🏛️🤖 AI Symposium 🤖🏛️

A modern web application that allows two AI agents to have conversations with each other. Built for Cloudflare Pages with serverless functions for optimal performance and global distribution.

## ✨ Features

- **Dual Agent Setup**: Configure two different AI agents with separate models and system prompts
- **Real-time Conversation**: Watch agents respond to each other turn by turn
- **Multiple Turns**: Generate 1, 5, or 25 conversation turns at once
- **User Interjections**: Add your own messages to guide the conversation
- **Export Options**: Save conversations as JSON or image files
- **Message Management**: Delete messages and edit conversation flow
- **Model Selection**: Choose from various OpenRouter models for each agent
- **🔒 Secure**: API keys are handled securely and not stored persistently

## 🚀 Quick Deploy to Cloudflare Pages

### Option 1: Via Cloudflare Dashboard (Recommended)

1. **Fork/Clone this repository** to your GitHub account

2. **Login to Cloudflare Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to "Pages" in the left sidebar

3. **Connect your repository**
   - Click "Create a project"
   - Connect your GitHub account
   - Select your forked repository
   - Click "Begin setup"

4. **Configure build settings**
   - Framework preset: `None`
   - Build command: `echo 'No build step required'`
   - Build output directory: `./`
   - Root directory: `/` (leave empty)

5. **Deploy**
   - Click "Save and Deploy"
   - Wait for deployment to complete
   - Your site will be available at `https://your-project-name.pages.dev`

### Option 2: Via Wrangler CLI

1. **Install Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Deploy**
   ```bash
   wrangler pages deploy
   ```

## 🔧 Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npx wrangler pages dev --local --port 8788 .
   ```

3. **Open your browser**
   - Navigate to `http://localhost:8788`
   - Enter your OpenRouter API key directly in the interface

## 📁 Project Structure

```
├── index.html              # Main application
├── functions/              # Cloudflare Functions (API endpoints)
│   └── api/
│       ├── models.js       # GET/POST /api/models
│       ├── chat-single.js  # POST /api/chat-single
│       └── cancel.js       # POST /api/cancel
├── package.json            # Node.js dependencies
├── _headers               # HTTP headers configuration
├── .gitignore             # Git ignore patterns
└── README.md              # This file
```

## 🔑 API Key Setup

**No environment variables needed!** 🎉

Simply enter your OpenRouter API key directly in the web interface. The key is:
- 🔒 Not stored persistently
- ⚡ Only exists during your session
- 🗑️ Automatically cleared when you close the page

Get your OpenRouter API key at: [https://openrouter.ai/](https://openrouter.ai/)

## 🎯 Usage

1. **Open the application** (locally or deployed)
2. **Enter your OpenRouter API key** in the interface
3. **Configure agents**: Select models and set system prompts
4. **Set initial message**: Choose how the conversation starts
5. **Generate turns**: Click +1, +5, or +25 turns
6. **Manage conversation**: Delete messages or add interjections
7. **Export**: Save as JSON or image

## 🔧 API Endpoints

- `GET /`: Main application interface
- `GET/POST /api/models`: Get available OpenRouter models
- `POST /api/chat-single`: Generate a single conversation turn
- `POST /api/cancel`: Cancel ongoing generation

## 🌐 Why Cloudflare Pages?

- ⚡ **Lightning Fast**: Global CDN distribution
- 🔒 **Secure**: Automatic HTTPS and security headers
- 📈 **Scalable**: Serverless functions scale automatically
- 💰 **Cost Effective**: Generous free tier
- 🚀 **Easy Deploy**: Git-based deployments

## 📋 Custom Domain (Optional)

To use a custom domain:

1. Go to your Pages project dashboard
2. Navigate to "Custom domains"
3. Click "Set up a custom domain"
4. Follow the DNS configuration instructions

## 🛠️ Troubleshooting

### Functions not working
- Verify your OpenRouter API key is valid
- Check the Cloudflare Pages function logs in the dashboard

### CORS errors
- The `_headers` file should handle CORS automatically
- Check browser developer tools for specific errors

### Local development issues
- Make sure you're using `npx wrangler pages dev --local --port 8788 .`
- Try updating wrangler: `npm install -g wrangler@latest`

## 📞 Support

For deployment issues:
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Functions Documentation](https://developers.cloudflare.com/pages/functions/)

For OpenRouter API issues:
- [OpenRouter Documentation](https://openrouter.ai/docs)

## 📝 License

MIT License 