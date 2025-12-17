import type { Tables } from '@/types/database.types';

type Profile = Tables<'profiles'>;

interface CompletionResult {
    percentage: number;
    missingFields: string[];
}

export function calculateProfileCompletion(profile: Profile): CompletionResult {
    if (!profile) {
        return { percentage: 0, missingFields: ['Profile not found'] };
    }

    const fields = [
        { key: 'full_name', label: 'Full Name', weight: 15 },
        { key: 'avatar_url', label: 'Profile Picture', weight: 15 },
        { key: 'bio', label: 'Bio', weight: 10 },
        { key: 'university_id', label: 'University ID', weight: 15 },
        { key: 'department', label: 'Department', weight: 15 },
        // تم تعليق الحقول غير الموجودة أو غير المستخدمة حالياً لتبسيط النسبة
        // { key: 'current_semester', label: 'Current Semester', weight: 10 }, 
        // { key: 'level', label: 'Academic Level', weight: 10 },
        // { key: 'social_links', label: 'Social Links', weight: 10 },
        // { key: 'tawjihi_average', label: 'Tawjihi Average', weight: 15 },
    ];

    let score = 0;
    const missingFields: string[] = [];

    // إعادة حساب الأوزان لتكون 100% بناءً على الحقول المتاحة (المجموع الحالي 70)
    // دعنا نضبط الأوزان: 
    // full_name: 20
    // avatar_url: 20
    // bio: 20
    // university_id: 20
    // department: 20
    // المجموع: 100

    const adjustedFields = [
        { key: 'full_name', label: 'Full Name', weight: 20 },
        { key: 'avatar_url', label: 'Profile Picture', weight: 20 },
        { key: 'bio', label: 'Bio', weight: 20 },
        { key: 'university_id', label: 'University ID', weight: 20 },
        { key: 'department', label: 'Department', weight: 20 },
    ];

    for (const field of adjustedFields) {
        const value = profile[field.key as keyof Profile];

        if (value !== null && value !== undefined && value !== '') {
            score += field.weight;
        } else {
            missingFields.push(field.label);
        }
    }

    return {
        percentage: Math.min(score, 100),
        missingFields,
    };
}
