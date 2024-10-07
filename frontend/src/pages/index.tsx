import { Chart } from "@/components/custom/chart/chart";
import api from "@/utils/api/api";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      try {
        const res = await api.get("report/analytics");
        if (res.status == 200) return res.data.data;
      } catch (err: any) {
        throw new Error(err.message);
      }
    },
  });
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div
        className="flex flex-1 rounded-lg sm:border border-slate-300 border-dashed shadow-sm sm:p-4 lg:p-6"
        // x-chunk="dashboard-02-chunk-1"
      >
        {!isLoading && (
          <Chart
            items={data.map((d) => ({ desktop: d.student, month: d.month }))}
            className="h-fit sm:w-full sm:max-w-[20rem] md:max-w-[25rem]"
          />
        )}
      </div>
    </>
  );
}
