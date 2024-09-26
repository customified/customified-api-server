export default function Loading() {
    return (
        <div className="w-full h-[60vh] flex items-center justify-center">
            <ul className="list-disc mt-4 space-y-2">
            <div className="w-12 h-12 rounded-full animate-spin
                    border-4 border-solid border-slate-950 border-t-transparent"></div>
            </ul>
        </div>
    )
}
