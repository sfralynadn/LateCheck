<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  CalendarDate,
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
} from "@internationalized/date";
import { CalendarIcon } from "@radix-icons/vue";

const df = new DateFormatter("en-US", {
  dateStyle: "long",
});
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from "@/components/ui/pagination";
import api from "@/lib/api/api";
import "moment/locale/id";
import { useAuthStore } from "@/stores/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { Response } from "@/types/response";
import { Report } from "@/types/report";
import { computed, ref, watch, watchEffect } from "vue";
import moment from "moment";
import { Skeleton } from "@/components/ui/skeleton";
import queryString from "query-string";
import { useUrlSearchParams } from "@vueuse/core";
import router from "@/route";
import { useRoute } from "vue-router";
import { parseStringToDateValue } from "radix-vue/date";
import {
  ArrowUpFromLine,
  ArrowUpToLine,
  Download,
  EllipsisVertical,
  FileText,
  Import,
  LoaderCircle,
  Sheet,
  SlidersHorizontal,
} from "lucide-vue-next";
import AlertDialogTitle from "@/components/ui/alert-dialog/AlertDialogTitle.vue";
import Input from "@/components/ui/input/Input.vue";
import { toast } from "vue-sonner";

const queryClient = useQueryClient();
const auth = useAuthStore();
const route = useRoute();
const query = computed(() => queryString.parseUrl(route.fullPath).query);
const currentPage = ref(1);
const { data, isLoading } = useQuery<Response<Report[]>>({
  queryKey: ["reports", currentPage],
  queryFn: async () => {
    try {
      query.value.page = String(currentPage.value);
      const res = await api.get(`report`, {
        params: query.value,
      });
      return res.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  },
});
const { data: classrooms } = useQuery<{ name: string; id: string }[]>({
  queryKey: ["classrooms"],
  queryFn: async () => {
    try {
      const res = await api.get("classroom");
      return res.data.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  },
});

const { mutate: importFromFile, isPending: pendingImport } = useMutation({
  mutationFn: async (file: File) => {
    try {
      const res = await api.post(
        "/report/import",
        { file },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return res.data;
    } catch (err: any) {
      throw new Error("error in importing file:", err?.message);
    }
  },
  onSuccess: async (data) => {
    await queryClient.invalidateQueries({ queryKey: ["reports"] }),
      toast.success(
        data?.message.charAt(0).toLocaleUpperCase() +
          data?.message.substring(1),
      );
  },
});

const { mutate: exportToXlsx, isPending: pendingExportToXlsx } = useMutation({
  mutationFn: async () => {
    try {
      const res = await api.get("/report/export", {
        responseType: "blob",
        params: query.value,
      });
      return res;
    } catch (err) {
      throw new Error("Err downloading FIle", err.message);
    }
  },
  onSuccess: (response) => {
    if (
      response.data.size === 0 ||
      response.headers["content-type"] !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      throw new Error("file is not valid/empty !");
    }
    const blob = new Blob([response.data]);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "reports.xlsx";
    link.click();
  },
});

function createDateValue(val: string) {
  const date = new Date(val);
  if (!isNaN(date.getTime())) {
    return parseStringToDateValue(
      val,
      new CalendarDate(date.getFullYear(), date.getMonth(), date.getDate()),
    );
  } else return null;
}

const file = ref<File>();
const from = ref<DateValue | null>(
  createDateValue(query.value?.from as string),
);
const to = ref<DateValue | null>(createDateValue(query.value?.to as string));
const reports = computed(() => data.value?.data);
const pagination = computed(() => data.value?.pagination);
const classroomsQuery = ref<string[]>(
  (query.value?.["classroom[]"] as string[]) || [],
);
watch(
  () => route.fullPath,
  () => queryClient.invalidateQueries({ queryKey: ["reports"] }),
);
</script>
<template>
  <div>
    <h1 class="text-xl md:text-2xl font-semibold">Report</h1>
    <p class="text-slate-600 text-sm md:text-base">
      {{
        auth.user?.role == "STUDENT"
          ? "Get your reports data"
          : auth.user?.role == "TEACHER"
            ? "Get your class reports data : " +
              auth.user.profile.classroom.name
            : "Get all reports data"
      }}
    </p>
    <div class="mt-5 flex items-center">
      <RouterLink
        to="/dashboard/report/new"
        class="bg-zinc-800 text-white px-3 py-2 rounded-md text-sm max-sm:fixed max-sm:bottom-6 max-sm:right-5 z-[8]"
      >
        Create Report
      </RouterLink>
      <Popover>
        <PopoverTrigger class="ms-auto">
          <EllipsisVertical class="w-4 h-4" />
        </PopoverTrigger>
        <PopoverContent align="end">
          <div class="flex flex-col text-sm gap-3">
            <div class="flex flex-col" v-if="auth.user?.role !== 'STUDENT'">
              <h1 class="font-medium pb-2.5">Import from File</h1>
              <input
                type="file"
                id="file"
                accept="xlsx"
                hidden
                @change="(e) => (file = e.target?.files[0])"
              />
              <div
                class="flex items-center gap-2 rounded border border-slate-200"
              >
                <label
                  for="file"
                  class="px-2 py-1 text-neutral-900 rounded-l-md bg-slate-200 border border-slate-200"
                  >Browse</label
                >
                <span class="text-slate-700">
                  {{ file?.name ?? "No file selected" }}
                </span>
              </div>
              <Button
                type="button"
                @click="() => importFromFile(file as File)"
                :disabled="!!!file"
                class="!h-[1.9rem] mt-2 text-[0.85rem]"
              >
                <LoaderCircle
                  v-if="pendingImport"
                  class="w-4 h-4 animate-spin"
                />
                <span v-else>Submit</span>
              </Button>
            </div>
            <div class="flex flex-col">
              <h1 class="font-medium pb-1.5">Export Data</h1>
              <div
                class="flex items-center *:cursor-default hover:*:bg-slate-100 *:w-1/2 *:text-[0.8rem] text-center *:p-1.5 rounded border border-slate-300"
              >
                <span
                  @click="() => exportToXlsx()"
                  class="flex items-center justify-center gap-1.5 border-slate-300 border-r"
                >
                  <LoaderCircle
                    v-if="pendingExportToXlsx"
                    class="w-4 h-4 animate-spin"
                  />
                  <Sheet v-else class="w-4 h-4" />
                  <span>XLSX</span>
                </span>
                <span
                  class="flex items-center justify-center gap-1.5 border-slate-300 border-l"
                >
                  <FileText class="w-4 h-4" />
                  PDF
                </span>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger class="!rounded-t-md">
                <div
                  class="flex bg-black text-white overflow-hidden !text-sm items-center gap-2 rounded-md border border-slate-300 p-1.5 justify-center"
                >
                  <SlidersHorizontal class="w-3 h-3 -ml-2" />
                  <span> Filter Data</span>
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent class="!p-5">
                <AlertDialogHeader>
                  <AlertDialogTitle class="!text-left !font-semibold"
                    >Filter Data</AlertDialogTitle
                  >
                  <AlertDialogDescription>
                    <div class="flex flex-col *:!text-left">
                      <h1 class="mb-3">Date</h1>
                      <div
                        class="flex flex-wrap w-full items-center gap-x-3 gap-y-1.5"
                      >
                        <div
                          class="!w-full sm:w-[49%] flex-col !flex !flex-1 !min-w-[12rem]"
                        >
                          <h1 class="mb-0.5">From</h1>
                          <Popover>
                            <PopoverTrigger
                              class="!px-3 mt-0.5 !flex !w-full !text-black"
                              as-child
                            >
                              <Button
                                variant="outline"
                                :class="
                                  cn(
                                    'w-[280px] justify-start text-left font-normal',
                                    !from && 'text-muted-foreground',
                                  )
                                "
                              >
                                <CalendarIcon class="mr-2 h-4 w-4" />
                                {{
                                  from
                                    ? df.format(from.toDate(getLocalTimeZone()))
                                    : "Start Date"
                                }}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent class="w-auto p-0">
                              <Calendar
                                v-model="from as DateValue"
                                initial-focus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div
                          class="!w-full sm:w-[49%] flex-col !flex !flex-1 !min-w-[12rem]"
                        >
                          <h1 class="mb-0.5">To</h1>
                          <Popover>
                            <PopoverTrigger
                              class="!px-3 mt-0.5 !flex !w-full !text-black"
                              as-child
                            >
                              <Button
                                variant="outline"
                                :class="
                                  cn(
                                    'w-[280px] justify-start text-left font-normal',
                                    !to && 'text-muted-foreground',
                                  )
                                "
                              >
                                <CalendarIcon class="mr-2 h-4 w-4" />
                                {{
                                  to
                                    ? df.format(to.toDate(getLocalTimeZone()))
                                    : "End Date"
                                }}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent class="w-auto p-0">
                              <Calendar
                                v-model="to as DateValue"
                                initial-focus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      <div
                        v-if="auth.user?.role != 'STUDENT'"
                        class="pt-4 mt-3"
                      >
                        <div class="flex items-center justify-between">
                          <h1>Class</h1>
                          <div class="flex items-center gap-2 justify-center">
                            <label for="all">Select All</label>
                            <input
                              id="all"
                              :checked="
                                classroomsQuery.length === classrooms?.length
                              "
                              @change="
                                () => {
                                  if (
                                    classroomsQuery.length !==
                                    classrooms?.length
                                  )
                                    classroomsQuery = classrooms?.map(
                                      (classroom) => String(classroom.id),
                                    ) as string[];
                                  else {
                                    classroomsQuery = [];
                                  }
                                }
                              "
                              type="checkbox"
                            />
                          </div>
                        </div>
                        <div class="flex flex-wrap pt-4 gap-3">
                          <div
                            v-for="classroom in classrooms"
                            class="flex gap-1.5"
                          >
                            <input
                              :checked="
                                classroomsQuery.includes(String(classroom.id))
                              "
                              @change="
                                () => {
                                  if (
                                    classroomsQuery.includes(
                                      String(classroom.id),
                                    )
                                  ) {
                                    classroomsQuery = classroomsQuery.filter(
                                      (c) => c !== String(classroom.id),
                                    );
                                  } else {
                                    classroomsQuery = [
                                      ...classroomsQuery,
                                      String(classroom.id),
                                    ];
                                  }
                                }
                              "
                              :id="classroom.name"
                              type="checkbox"
                              :value="classroom.id"
                            />
                            <label :for="classroom.name">{{
                              classroom.name
                            }}</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter class="pt-3">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    @click="
                      () => {
                        let params: {
                          to?: string;
                          from?: string;
                          classroom?: string[];
                        } = {};
                        if (classroomsQuery.length > 0)
                          params.classroom = classroomsQuery;
                        if (from) params.from = from.toString();
                        if (to) params.to = to.toString();

                        const query = queryString.stringify(params, {
                          arrayFormat: 'bracket',
                        });
                        router.push(`/dashboard/report?${query}`).then(() => {
                          queryClient.invalidateQueries({
                            queryKey: ['reports'],
                          });
                        });
                      }
                    "
                    >Apply</AlertDialogAction
                  >
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </PopoverContent>
      </Popover>
    </div>
    <div class="mt-4 border border-slate-200 rounded-md">
      <Table>
        <TableCaption>
          <div class="flex justify-center py-4">
            <Pagination
              v-slot="{ page }"
              :total="pagination?.total"
              :sibling-count="1"
              show-edges
              :default-page="1"
              :items-per-page="pagination?.per_page"
            >
              <PaginationList
                v-slot="{ items }"
                class="flex items-center gap-1"
              >
                <PaginationFirst class="w-8 h-8 p-0" />
                <PaginationPrev class="w-8 h-8 p-0" />
                <template v-for="(item, index) in items">
                  <PaginationListItem
                    v-if="item.type === 'page'"
                    :key="index"
                    :value="item.value"
                    as-child
                    @click="currentPage = item.value"
                  >
                    <Button
                      class="w-8 h-8 p-0"
                      :variant="item.value === page ? 'default' : 'outline'"
                    >
                      {{ item.value }}
                    </Button>
                  </PaginationListItem>
                  <PaginationEllipsis v-else :key="item.type" :index="index" />
                </template>

                <PaginationNext class="w-8 h-8 p-0" />
                <PaginationLast class="w-8 h-8 p-0" />
              </PaginationList>
            </Pagination>
          </div>
        </TableCaption>
        <TableHeader>
          <TableRow class="bg-slate-100">
            <TableHead class="w-[100px] max-sm:hidden">NIS</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead class="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="isLoading" v-for="n in 10">
            <TableCell class="font-medium max-sm:hidden">
              <Skeleton class="h-5 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton class="h-5 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton class="h-5 rounded-full" />
            </TableCell>
            <TableCell class="text-right">
              <Skeleton class="h-5 rounded-full" />
            </TableCell>
          </TableRow>
          <TableRow v-else v-for="report in reports">
            <TableCell class="font-medium max-sm:hidden">
              {{ report.student.nis }}
            </TableCell>
            <TableCell>{{ report.student.name }}</TableCell>
            <TableCell>{{ report.description }}</TableCell>
            <TableCell class="text-right"
              >{{ moment(report.date).format("LL") }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
