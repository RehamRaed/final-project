export default function Title({title}:{title: string}){
    return(
        <h1 style={{color: "var(--color-primary)", fontSize:"var(--font-2xl)"}}>{title}</h1>
    )
}