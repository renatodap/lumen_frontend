import { Card } from '@/components/ui/Card';

export function EmptyFutureBlock() {
  return (
    <Card className="border-error/50 bg-error/5">
      <div className="text-center py-8">
        <div className="mb-3 flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-error"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h3 className="text-lg font-semibold text-text-primary mb-2">Future Bucket Blocked</h3>

        <p className="text-sm text-text-secondary max-w-xs mx-auto">
          Complete or reschedule tasks in the 2-day bucket before adding future tasks. This keeps
          you focused on immediate priorities.
        </p>
      </div>
    </Card>
  );
}
