import { useQuery } from "@tanstack/react-query";
import { getRituals } from "../services/rituals";

interface Ritual {
  id: string;
  title: string;
  isActive: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const Dashboard = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["rituals"],
    queryFn: getRituals,
  });

  const rituals: Ritual[] = data?.rituals ?? [];

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="p-4 border-b">
        heatmap and charts
      </div>

      <div className="flex flex-1">
        <div className="flex-2 border p-4">
          ritual table
        </div>

        <div className="flex-1 border p-4">

          {isPending && (
            <div>Loading rituals...</div>
          )}

          {isError && (
            <div>Error fetching rituals</div>
          )}

          {!isPending && !isError && rituals.length === 0 && (
            <div>No rituals found</div>
          )}

          {!isPending &&
            !isError &&
            rituals.map((ritual) => (
              <div
                key={ritual.id}
                className="border rounded p-2 mb-2"
              >
                <div>{ritual.title}</div>
                <div>
                  {ritual.isActive
                    ? "🟢 Active"
                    : "⚫ Inactive"}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;