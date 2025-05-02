// config/default.js
module.exports = {
    app: {
      port: process.env.PORT || 4000,
      environment: process.env.NODE_ENV || 'development',
    },
    db: {
      uri: process.env.MONGO_URI || 'mongodb://localhost:27017/study-ai-mvp',
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'your-secret-key',
      expiresIn: '30d',
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-4o-mini',
    },
    uploads: {
      maxFileSize: 50 * 1024 * 1024, // 50MB
      directory: './uploads',
    },
  };