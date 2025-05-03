import { User, UserAPI } from '../models/user.model';

export class UserAdapter {
  static fromUserAPI(response: UserAPI): User {
    return {
      id: response._id,
      email: response.email,
      role: response.role
    };
  }

  static toUserAPI(user: User): string {
    return user.id;
  }
}
