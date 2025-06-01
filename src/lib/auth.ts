import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface DecodedToken {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function generateToken(userId: string, role: string): string {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

export function isAuthenticated(token: string | undefined): boolean {
  if (!token) return false;
  const decoded = verifyToken(token);
  return decoded !== null;
}

export function getUserRole(token: string | undefined): string | null {
  if (!token) return null;
  const decoded = verifyToken(token);
  return decoded?.role || null;
}

export function getUserId(token: string | undefined): string | null {
  if (!token) return null;
  const decoded = verifyToken(token);
  return decoded?.userId || null;
} 