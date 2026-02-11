import { getUsers } from '@/action/userinfo'
import UserManagement from '@/components/user-manage'


export default async function UserManagementPage() {
  const initialUsers = await getUsers()

  return <UserManagement initialUsers={initialUsers} />
}
