import { AuthShell } from '@/components/auth/auth-shell';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

export const metadata = {
  title: 'Forgot Password',
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <ForgotPasswordForm />
    </AuthShell>
  );
}
