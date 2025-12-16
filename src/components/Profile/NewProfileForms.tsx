'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Save, Shield, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Tables } from '@/types/database.types';
import { updateProfile, type ActionState } from '@/actions/profile.actions';

type Profile = Tables<'profiles'>;

// UI Components
const Label = ({ children, htmlFor, className }: any) => (
    <label htmlFor={htmlFor} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}>
        {children}
    </label>
);

const Input = ({ className, error, ...props }: any) => (
    <input className={cn(
        "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
        error ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500" : "border-input hover:border-primary/50",
        className
    )} {...props} />
);

const Textarea = ({ className, error, ...props }: any) => (
    <textarea className={cn(
        "flex min-h-[100px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none",
        error ? "border-red-500 bg-red-50/10 focus-visible:ring-red-500" : "border-input hover:border-primary/50",
        className
    )} {...props} />
);

const Button = ({ className, children, disabled, type = "button", ...props }: any) => (
    <button
        type={type}
        disabled={disabled}
        className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-sm",
            "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 h-10 px-6 py-2 shadow-blue-500/20",
            "hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
            className
        )}
        {...props}
    >
        {children}
    </button>
);


// Animations
const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
};

// --- General Form ---

export function GeneralForm({ profile }: { profile: Profile }) {
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState<ActionState>({ success: false, message: '' });

    const [formData, setFormData] = useState({
        full_name: profile.full_name || '',
        avatar_url: profile.avatar_url || '',
        bio: profile.bio || '',
    });

    const wordCount = formData.bio.trim().split(/\s+/).filter(Boolean).length;
    const isBioValid = wordCount >= 3; // Keep simple requirements

    const isDirty =
        formData.full_name !== (profile.full_name || '') ||
        formData.avatar_url !== (profile.avatar_url || '') ||
        formData.bio !== (profile.bio || '');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setState({ success: false, message: '' });

        const result = await updateProfile({
            full_name: formData.full_name,
            avatar_url: formData.avatar_url,
            bio: formData.bio,
        });

        setLoading(false);
        setState(result);

        // Hide success message after 3s
        if (result.success) {
            setTimeout(() => setState(prev => ({ ...prev, message: '' })), 4000);
        }
    };

    return (
        <form onSubmit={handleSave}>
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">

                {/* Full Name & Avatar */}
                <div className="grid gap-6 md:grid-cols-2">
                    <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="full_name">Full Name <span className="text-red-500">*</span></Label>
                        <Input
                            id="full_name"
                            value={formData.full_name}
                            onChange={(e: any) => setFormData({ ...formData, full_name: e.target.value })}
                            error={state?.fieldErrors?.full_name}
                            placeholder="e.g. Ahmad Ali"
                        />
                        {state?.fieldErrors?.full_name && <p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">{state.fieldErrors.full_name[0]}</p>}
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="avatar_url">Avatar URL</Label>
                        <Input
                            id="avatar_url"
                            value={formData.avatar_url}
                            onChange={(e: any) => setFormData({ ...formData, avatar_url: e.target.value })}
                            placeholder="https://example.com/me.jpg"
                            error={state?.fieldErrors?.avatar_url}
                        />
                        {state?.fieldErrors?.avatar_url && <p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">{state.fieldErrors.avatar_url[0]}</p>}
                    </motion.div>
                </div>

                {/* Bio */}
                <motion.div variants={itemVariants} className="space-y-2">
                    <div className="flex justify-between">
                        <Label htmlFor="bio">Bio</Label>
                        <span className={cn("text-xs font-medium", isBioValid ? "text-green-500" : "text-amber-500")}>
                            {wordCount} / 3 words ideal
                        </span>
                    </div>
                    <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e: any) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Briefly describe your academic interests..."
                        error={state?.fieldErrors?.bio}
                    />
                    <p className="text-xs text-muted-foreground">This will be displayed on your ID card.</p>
                    {state?.fieldErrors?.bio && <p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">{state.fieldErrors.bio[0]}</p>}
                </motion.div>

                {/* Status Messages */}
                <AnimatePresence mode="wait">
                    {state.message && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={cn(
                                "p-3 rounded-lg text-sm flex items-center gap-2 border",
                                state.success
                                    ? "bg-green-500/10 text-green-700 border-green-500/20"
                                    : "bg-red-500/10 text-red-700 border-red-500/20"
                            )}>
                            {state.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Shield className="w-4 h-4 shrink-0" />}
                            <span className="font-medium">{state.message}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Actions */}
                <motion.div variants={itemVariants} className="flex justify-end pt-4 border-t border-dashed border-gray-200">
                    <Button type="submit" disabled={loading || !isDirty} className={isDirty ? "animate-pulse-slow" : ""}>
                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                    </Button>
                </motion.div>
            </motion.div>
        </form>
    );
}

// --- Academic Form ---

const DEPARTMENTS = [
    "Computer Engineering", "Computer Science", "Information Technology", "Software Engineering",
    "Civil Engineering", "Architectural Engineering", "Mechanical Engineering", "Electrical Engineering",
    "Medicine", "Business Administration", "Accounting", "Law", "Other"
];

export function AcademicForm({ profile }: { profile: Profile }) {
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState<ActionState>({ success: false, message: '' });

    const [formData, setFormData] = useState({
        university_id: profile.university_id || '',
        department: profile.department || '',
    });

    const isDirty =
        formData.university_id !== (profile.university_id || '') ||
        formData.department !== (profile.department || '');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setState({ success: false, message: '' });

        const result = await updateProfile({
            university_id: formData.university_id,
            department: formData.department,
        });

        setLoading(false);
        setState(result);

        if (result.success) {
            setTimeout(() => setState(prev => ({ ...prev, message: '' })), 4000);
        }
    };

    return (
        <form onSubmit={handleSave}>
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">

                    {/* University ID */}
                    <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="university_id">University ID <span className="text-red-500">*</span></Label>
                        <Input
                            id="university_id"
                            value={formData.university_id}
                            onChange={(e: any) => setFormData({ ...formData, university_id: e.target.value })}
                            placeholder="12345678"
                            error={state?.fieldErrors?.university_id}
                        />
                        {state?.fieldErrors?.university_id && <p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">{state.fieldErrors.university_id[0]}</p>}
                    </motion.div>

                    {/* Department */}
                    <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
                        <select
                            id="department"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            className={cn(
                                "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
                                state?.fieldErrors?.department ? "border-red-500 bg-red-50/10" : "border-input hover:border-primary/50"
                            )}
                        >
                            <option value="" disabled>Select Department</option>
                            {DEPARTMENTS.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                        {state?.fieldErrors?.department && <p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">{state.fieldErrors.department[0]}</p>}
                    </motion.div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm text-muted-foreground">
                    <p className="flex items-center gap-2"><Shield className="w-4 h-4" /> Academic details are verified against university records.</p>
                </div>

                {/* Status Messages */}
                <AnimatePresence mode="wait">
                    {state.message && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={cn(
                                "p-3 rounded-lg text-sm flex items-center gap-2 border",
                                state.success
                                    ? "bg-green-500/10 text-green-700 border-green-500/20"
                                    : "bg-red-500/10 text-red-700 border-red-500/20"
                            )}>
                            {state.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Shield className="w-4 h-4 shrink-0" />}
                            <span className="font-medium">{state.message}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div variants={itemVariants} className="flex justify-end pt-4">
                    <Button type="submit" disabled={loading || !isDirty} className="bg-primary text-white">
                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                    </Button>
                </motion.div>
            </motion.div>
        </form>
    );
}
