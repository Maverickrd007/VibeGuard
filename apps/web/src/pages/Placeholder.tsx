export function Placeholder({ title }: { title: string }) {
  return (
    <div className="bg-white shadow rounded-lg border border-gray-100 p-12 text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">This feature is not yet implemented.</p>
    </div>
  );
}
