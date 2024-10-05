import { Chart } from "@/components/custom/chart/chart";

export default function Dashboard() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div
        className="flex flex-1 rounded-lg sm:border border-slate-300 border-dashed shadow-sm sm:p-4 lg:p-6"
        // x-chunk="dashboard-02-chunk-1"
      >
        <Chart className="h-fit sm:w-full sm:max-w-[25rem] md:max-w-[25rem] lg:max-w-[30rem]" />
      </div>
    </>
  );
}
