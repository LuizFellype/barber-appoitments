import { isAdmin } from "@/lib/admin-auth"
import { AdminLogin } from "@/components/admin/admin-login"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return <AdminLogin />
  }

  return <AdminDashboard />
}
