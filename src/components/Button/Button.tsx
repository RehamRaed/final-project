type btnProps ={
    title:string,
    bgcolor?:string,
    onClick?: () => void
}
export default function Button({title, bgcolor, onClick }: btnProps){
    const bg = bgcolor || "var(--primary)";
    return(<button 
        id="btn" 
        className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        style={{ backgroundColor: bg, color: "#fff"}}
        onClick={onClick}
        >
        {title}
        
    </button>)
}