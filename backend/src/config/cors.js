const normalizeOrigin = (origin) => origin?.trim().replace(/\/+$/, '');

const parseOrigins = (value) =>
  value
    ?.split(',')
    .map(normalizeOrigin)
    .filter(Boolean) || [];

export const getAllowedOrigins = () => {
  const configuredOrigins = parseOrigins(process.env.CLIENT_URL);
  return Array.from(new Set([
    ...configuredOrigins,
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ]));
};

export const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = normalizeOrigin(origin);
  return getAllowedOrigins().includes(normalizedOrigin);
};

export const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked request from origin: ${origin}`));
  },
  credentials: true
};
