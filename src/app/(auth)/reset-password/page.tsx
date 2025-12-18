import { ResetPasswordForm } from '@/components/ui/auth/reset-password-form'


export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                 
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-primary">
                        Reset Password
                    </h1>
                    <p className="text-gray-600 mt-2">Choose a new, strong password</p>
                </div>


                <div className="bg-bg backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
                    <ResetPasswordForm />
                </div>

                <p className="text-center text-sm text-text-secondary mt-6">
                    You will be redirected to log in after resetting your password
                </p>
            </div>
        </div>
    )
}