export interface UserListItemDTO {
  id: string;
  name: string | null;
  email: string;
  profileImage: string | null;
  status: boolean;
  joinedAt: Date;
}
