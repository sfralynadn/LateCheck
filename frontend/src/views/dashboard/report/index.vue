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
import {Button} from "@/components/ui/button";

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
import {useAuthStore} from "@/stores/auth";
import {useQuery} from "@tanstack/vue-query";
import {Response} from "@/types/response";
import {Report} from "@/types/report";
import {computed, ref} from "vue";
import moment from "moment";
import {Skeleton} from "@/components/ui/skeleton";

const auth = useAuthStore();
const currentPage = ref(1);
const {data, isLoading} = useQuery<Response<Report[]>>({
  queryKey: ["reports", currentPage],
  queryFn: async () => {
    try {
      const res = await api.get(`report?page=${currentPage.value}`);
      return res.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  },
});
const reports = computed(() => data.value?.data);
const pagination = computed(() => data.value?.pagination);
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
    <div class="mt-5">
      <RouterLink
          to="/dashboard/report/new"
          class="bg-zinc-800 text-white px-3 py-2 rounded-md text-sm max-sm:fixed max-sm:bottom-6 max-sm:right-5 z-[8]"
      >
        Create Report
      </RouterLink>
    </div>
    <div class="mt-6 border border-slate-200 rounded-md">
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
                <PaginationFirst class="w-8 h-8 p-0"/>
                <PaginationPrev class="w-8 h-8 p-0"/>
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
                  <PaginationEllipsis v-else :key="item.type" :index="index"/>
                </template>

                <PaginationNext class="w-8 h-8 p-0"/>
                <PaginationLast class="w-8 h-8 p-0"/>
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
              <Skeleton class="h-5 rounded-full"/>
            </TableCell>
            <TableCell>
              <Skeleton class="h-5 rounded-full"/>
            </TableCell>
            <TableCell>
              <Skeleton class="h-5 rounded-full"/>
            </TableCell>
            <TableCell class="text-right"
            >
              <Skeleton class="h-5 rounded-full"/>
            </TableCell>
          </TableRow>
          <TableRow v-else v-for="report in reports">
            <TableCell class="font-medium max-sm:hidden">
              {{ report.student.nis }}
            </TableCell>
            <TableCell>{{ report.student.name }}</TableCell>
            <TableCell>{{ report.description }}</TableCell>
            <TableCell class="text-right">{{
                moment(report.date).format("LL")
              }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>
