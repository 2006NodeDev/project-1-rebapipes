// User data from DB

export class UserDTO {
  user_id: number
    username: string
    password: string
    first_name: string
    last_name: string
  email: string
  image?:string // path to the file in cloud storage, question mark makes it optional
  role_id: number
  role: string
}
