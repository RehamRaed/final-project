import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className={`flex items-center gap-2 text-sm ${className}`}
        >
            <Link
                href="/"
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Home"
            >
                <Home className="w-4 h-4" />
            </Link>

            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <div key={index} className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-gray-400" />

                        {item.href && !isLast ? (
                            <Link
                                href={item.href}
                                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span
                                className={`${isLast ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}
                                aria-current={isLast ? 'page' : undefined}
                            >
                                {item.label}
                            </span>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
