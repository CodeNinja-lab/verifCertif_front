export default function AdminLoading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 py-20">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
      <p className="text-muted-foreground animate-pulse">Chargement de l'administration...</p>
    </div>
  )
}
