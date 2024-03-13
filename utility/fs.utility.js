import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const initializeStorage = () => {
  const avatarsDir = join('..', 'public', 'avatars');
  if (!existsSync(avatarsDir)) {
    mkdirSync(avatarsDir, { recursive: true });
  }
  const signDir = join('..', 'private', 'sign');
  if (!existsSync(signDir)) {
    mkdirSync(signDir, { recursive: true });
  }
};

export default initializeStorage;
