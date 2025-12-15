export default function ProgressBar ({donePercentage,}: {donePercentage: number}){ 
    {console.log("donePercentage in ProgressBar:", donePercentage);}
    return(
        <div className="flex flex-col gap-1">
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
            <div
                className="h-3 bg-accent"
                style={{ width: `${donePercentage}%` }}
            />
            </div>
            <p className="text-right text-gray-600 text-xs">
            {donePercentage}% done
            </p>
        </div>
    )
}