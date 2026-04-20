export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: "64px" }}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-pale border-t-green-dark rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm font-medium">טוען...</p>
      </div>
    </div>
  );
}
