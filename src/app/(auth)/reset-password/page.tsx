import { ResetPasswordForm } from '@/components/ui/auth/reset-password-form'
import { Shield } from 'lucide-react'

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        Reset Password
                    </h1>
                    <p className="text-gray-600 mt-2">Choose a new, strong password</p>
                </div>


                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
                    <ResetPasswordForm />
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    You will be redirected to log in after resetting your password
                </p>
            </div>
        </div>
    )
}