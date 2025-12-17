'use client'

import { resetPassword } from '@/actions/auth'
import { useFormStatus } from 'react-dom'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
            {pending ? 'جاري التعيين...' : 'إعادة تعيين كلمة المرور'}
        </button>
    )
}

export function ResetPasswordForm() {
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [password, setPassword] = useState('')
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setMessage(null)
        const result = await resetPassword(formData)

        if (result.success) {
            setMessage({ type: 'success', text: result.message || 'تم التعيين بنجاح' })
            setTimeout(() => {
                router.push('/login')
            }, 2000)
        } else {
            setMessage({ type: 'error', text: result.error || 'حدث خطأ' })
        }
    }

    function getPasswordStrength(pass: string): { text: string, color: string, width: string } {
        if (pass.length === 0) return { text: '', color: '', width: '0%' }
        if (pass.length < 8) return { text: 'ضعيفة', color: 'bg-red-500', width: '33%' }
        if (pass.length < 12) return { text: 'متوسطة', color: 'bg-yellow-500', width: '66%' }
        return { text: 'قوية', color: 'bg-green-500', width: '100%' }
    }

    const strength = getPasswordStrength(password)

    return (
        <form action={handleSubmit} className="space-y-4">
            {message && (
                <div
                    className={`px-4 py-3 rounded-xl text-sm ${message.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-red-50 border border-red-200 text-red-700'
                        }`}
                >
                    {message.text}
                </div>
            )}

            <div>
                <label htmlFor="password" className="block font-semibold mb-2 text-gray-700">
                    كلمة المرور الجديدة
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                    minLength={8}
                />

                {password && (
                    <div className="mt-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">قوة كلمة المرور:</span>
                            <span className={`font-semibold ${strength.color.replace('bg-', 'text-')}`}>
                                {strength.text}
                            </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${strength.color} transition-all duration-300`}
                                style={{ width: strength.width }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block font-semibold mb-2 text-gray-700">
                    تأكيد كلمة المرور
                </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                    minLength={8}
                />
            </div>

            <SubmitButton />
        </form>
    )
}
