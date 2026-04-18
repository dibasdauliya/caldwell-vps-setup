/**
 * Reusable skeleton row components for table loading states
 */

export function TableRowSkeleton({ columns = 2 }: { columns?: number }) {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="skeleton h-5 w-32" />
        </td>
      ))}
    </tr>
  )
}

export function ProjectRowSkeleton() {
  return (
    <div className="p-4 rounded-lg border border-border bg-card">
      <div className="skeleton h-6 w-40"></div>
    </div>
  )
}

export function ResourceRowSkeleton() {
  return (
    <tr className="border-b border-border">
      <td className="px-6 py-4">
        <div className="skeleton h-5 w-40" />
      </td>
      <td className="px-6 py-4">
        <div className="skeleton h-5 w-24" />
      </td>
      <td className="px-6 py-4">
        <div className="skeleton h-6 w-20" />
      </td>
    </tr>
  )
}
