import { useQuery } from '@tanstack/react-query';

const fetchMessage = async () => {
  const response = await fetch('http://localhost:3333/api');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const TestApi = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['message'],
    queryFn: fetchMessage,
  });

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
