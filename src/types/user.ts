export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone: string;
  dateJoined?: string;
}

export interface UserProfile extends User {
  address?: string;
  dateOfBirth?: string;
  nationality?: string;
}
