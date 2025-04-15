export interface UserProfile {
    uid: string;
    email: string;
    name: string;
    phone?: string;
    photoURL?: string;
    createdAt: Date;
    updatedAt: Date;
  }