import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import api from "@/utils/api/api";
import { Report } from "@/types/report";
import { Pagination } from "@/types/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import useModal from "@/hooks/use_modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Pagination as PaginationWrapper,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select } from "@/components/custom/select/select";

const formatPaginationUrl = (url: string) => Number(url.split("page=")[1]);

export default function AnalyticPage() {
  const { isShow, toggle } = useModal();
  const [date, setDate] = React.useState<Date>();
  const [page, setPage] = useState(1);
  const [classroom, setClassroom] = useState(null);
  const [pagination, setPagination] = useState<Pagination>({
    next_page_url: null,
    prev_page_url: null,
    last_page: 0,
    current_page: 1,
    from: 0,
    to: 0,
    total: 0,
    per_page: 0,
  });

  const { data: classrooms } = useQuery({
    queryKey: ["classrooms"],
    queryFn: async () => {
      const res = await api.get("classroom");
      return res.data.data;
    },
  });

  const {
    data: result,
    isLoading,
    refetch,
  } = useQuery<Report[]>({
    queryKey: ["result", page],
    queryFn: async () => {
      try {
        const res = await api.get(
          `report?page=${page}${date ? "&date=" + moment(date).format("YYYY-MM-DD") : ""}`,
        );
        if (res.status == 200) {
          setPagination(res.data?.pagination);
          return res.data.data;
        }
      } catch (err: any) {
        throw new Error(err.message);
      }
    },
  });

  return (
    <>
      <div className="flex justify-center flex-col">
        <h1 className="text-lg font-semibold md:text-2xl">Reports</h1>
        <p className="text-sm text-slate-700">
          All listing of students reports
        </p>
      </div>
      <div className="flex gap-2 flex-wrap *:flex-grow">
        <Popover open={isShow}>
          <PopoverTrigger onClick={toggle} asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
            <div className="p-4">
              <Button
                onClick={() => {
                  toggle();
                  refetch();
                }}
                className="w-full"
              >
                Select
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        {!!classrooms && (
          <Select
            placeholder="Classroom"
            items={classrooms.map((classroom: any) => ({
              name: classroom.name,
              value: classroom.id,
            }))}
          />
        )}
      </div>
      <div
        className=" rounded-lg md:border border-dashed border-slate-300 shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <Table>
          <TableCaption>
            {/* Pagination */}
            <div className="py-4">
              <PaginationWrapper>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  {!!pagination.prev_page_url && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={() =>
                          setPage(
                            formatPaginationUrl(
                              pagination?.prev_page_url as string,
                            ),
                          )
                        }
                      >
                        {formatPaginationUrl(pagination.prev_page_url)}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink className="text-black" href="#">
                      {pagination.current_page}
                    </PaginationLink>
                  </PaginationItem>
                  {!!pagination.next_page_url && (
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={() =>
                          setPage(
                            formatPaginationUrl(
                              pagination.next_page_url as string,
                            ),
                          )
                        }
                      >
                        {formatPaginationUrl(pagination.next_page_url)}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </PaginationWrapper>
            </div>
            {/* end Pagination */}
          </TableCaption>
          <TableHeader>
            <TableRow className="*:py-3">
              <TableHead className="w-[100px] max-md:hidden">NIS</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="max-md:hidden">Description</TableHead>
              <TableHead>Class</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading && result && result?.length > 0
              ? result.map((report, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium max-md:hidden">
                      {report.student.nis}
                    </TableCell>
                    <TableCell>{report.student.name}</TableCell>
                    <TableCell className="max-md:hidden">
                      {report.description}
                    </TableCell>
                    <TableCell>{report.student.classroom.name}</TableCell>
                    <TableCell className="text-right">
                      {moment(report.date).format("LL")}
                    </TableCell>
                  </TableRow>
                ))
              : Array(15)
                  .fill(" ")
                  .map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium max-md:hidden">
                        <Skeleton className="h-3.5" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-3.5" />
                      </TableCell>
                      <TableCell className="max-md:hidden">
                        <Skeleton className="h-3.5" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-3.5" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-3.5" />
                      </TableCell>
                    </TableRow>
                  ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
