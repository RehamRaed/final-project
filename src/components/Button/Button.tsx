type btnProps = {
    title: string,
    bgcolor?: string,
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    className?: string
}
export default function Button({ title, bgcolor, onClick, className }: btnProps) {
    const bg = bgcolor || "var(--primary)";
    return (<button
        id="btn"
        className={`text-white px-4 py-2 rounded-lg hover:opacity-90 transition ${className || ''}`}
        style={{ backgroundColor: bg, color: "#fff" }}
        onClick={onClick}
    >
        {title}

    </button>)
}