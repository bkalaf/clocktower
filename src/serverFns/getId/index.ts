// src/serverFns/getId/index.ts
import { getUserFromCookie } from './getUserFromCookie';

const getId = {
    user: getUserFromCookie
};

export default getId;
