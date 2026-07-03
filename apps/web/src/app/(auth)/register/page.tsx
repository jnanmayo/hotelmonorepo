import { AuthShell } from '@/components/auth/auth-shell';
import { RegisterForm } from '@/features/auth/components/register-form';

export const metadata = {
  title: 'Register Hotel',
};

export default function RegisterPage() {
  return (
    <AuthShell>
      <RegisterForm />
    </AuthShell>
  );
}
