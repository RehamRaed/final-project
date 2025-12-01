type btnProps ={
    title:string,
    bgcolor:string,
    onClick?: () => void
}
export default function Button({title, bgcolor, onClick }: btnProps){
    return(<button 
        id="btn" 
        className="px-6 py-3 rounded-lg shadow-md transition"
        style={{ backgroundColor: `var(${bgcolor})`, color: "#fff"}}
        onClick={onClick}
        >
        {title}
        
    </button>)
}