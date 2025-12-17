"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { updateCurrentRoadmapAction } from "@/actions/learning.actions";
import RoadmapCard from "@/components/StudentRoadmap/RoadmapCard";
import RoadmapChangeConfirmationModal from "@/components/Roadmap/RoadmapChangeConfirmationModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Tables } from "@/types/database.types";

interface RoadmapWithStatus extends Tables<'roadmaps'> {
    course_count: number;
    is_current: boolean;
}

interface RoadmapSelectionClientProps {
    initialRoadmaps: RoadmapWithStatus[];
}

export default function RoadmapSelectionClient({ initialRoadmaps }: RoadmapSelectionClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const fromProfile = searchParams.get("from") === "profile";

    const [roadmaps, setRoadmaps] = useState<RoadmapWithStatus[]>(initialRoadmaps);
    const [isPending, setIsPending] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const currentActiveRoadmap = roadmaps.find(r => r.is_current);
    const [selectedRoadmap, setSelectedRoadmap] = useState<RoadmapWithStatus | undefined>(currentActiveRoadmap);

    const handleSelect = (roadmap: RoadmapWithStatus) => {
        setSelectedRoadmap(roadmap);
    };

    const handleChangeRoadmap = async () => {
        if (!selectedRoadmap || isPending) return;

        setIsModalOpen(false);
        setIsPending(true);

        const result = await updateCurrentRoadmapAction(selectedRoadmap.id);

        if (result.success) {
            setRoadmaps(prev => prev.map(r => ({
                ...r,
                is_current: r.id === selectedRoadmap.id
            })));

            router.refresh();

            if (fromProfile) {
                router.push("/profile");
            } else {
                router.push(`/roadmaps/${selectedRoadmap.id}`); 
            }
        } else {
            alert(`Failed to change roadmap: ${result.error}`);
            setIsPending(false);
        }
    };

    const handleButtonClick = () => {
        if (!selectedRoadmap) return;

        const isCurrent = currentActiveRoadmap?.id === selectedRoadmap.id;

        if (isCurrent) {
            router.push(`/roadmaps/${selectedRoadmap.id}`);
        } else {
            setIsModalOpen(true);
        }
    };

    const renderButton = () => {
        if (!selectedRoadmap) return null;

        const isCurrent = currentActiveRoadmap?.id === selectedRoadmap.id;
        const baseClass = "px-3 py-2 md:px-10 md:py-4 rounded-xl text-[14px] md:text-lg md:font-semibold shadow-md transition-all transform hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto";

        if (isCurrent) {
            return (
                <button
                    onClick={handleButtonClick}
                    className={`${baseClass} bg-primary hover:bg-primary-hover text-white shadow-lg`}
                    role="button"
                    aria-label={`Go to current roadmap: ${selectedRoadmap.title}`}
                >
                    Go to {selectedRoadmap.title} Roadmap
                </button>
            );
        } else {
            return (
                <button
                    onClick={handleButtonClick}
                    className={`${baseClass} bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
                    disabled={isPending}
                    aria-live="assertive"
                    aria-busy={isPending}
                    aria-label={`Change to ${selectedRoadmap.title}`}
                >
                    Change to {selectedRoadmap.title}
                </button>
            );
        }
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {roadmaps.map((roadmap) => (
                    <RoadmapCard
                        key={roadmap.id}
                        roadmap={roadmap}
                        isSelected={selectedRoadmap?.id === roadmap.id}
                        isCurrentActive={currentActiveRoadmap?.id === roadmap.id}
                        onSelect={() => handleSelect(roadmap)}
                    />
                ))}
            </div>

            <div className="mt-12 text-center" role="group" aria-label="Roadmap Actions">
                {renderButton()}
            </div>

            {selectedRoadmap && currentActiveRoadmap?.id !== selectedRoadmap.id && (
                <RoadmapChangeConfirmationModal
                    roadmap={selectedRoadmap}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleChangeRoadmap}
                    isPending={isPending}
                />
            )}

            {isPending && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" aria-modal="true" role="dialog">
                    <LoadingSpinner />
                </div>
            )}
        </>
    );
}
