import { useGetMessageQuery } from '../../store/services/api';

export const TestApi = () => {
  const { data, isLoading, error } = useGetMessageQuery();

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error instanceof Error ? error.message : 'An error occurred'}
      </div>
    );
  }

  return <div className="p-4 text-sm">{data?.message}</div>;
};
