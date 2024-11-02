<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Search } from "lucide-vue-next";
import { debounce } from "@/utils/debounce.ts";
import { computed, ref, watch } from "vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import api from "@/lib/api/api.ts";
import { Student } from "@/types/student.ts";
import Loader from "@/components/ui/loader/Loader.vue";
import { Classroom } from "@/types/classroom";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "vue-router";

const queryClient = useQueryClient();
const router = useRouter();

const query = ref("");
const searchValue = ref("");
const classroomId = ref("");
const student = ref<Student | null>();
const data = ref({
  student_id: String(student.value?.id) || "",
  description: "",
});
const setSearchValue = debounce(
  (val: string) => (searchValue.value = val),
  1000
);
const setStudent = (s: any) => {
  student.value = s;
  data.value.student_id = String(student.value?.id || "");
  classroomId.value = String(student.value?.classroom.id);
};

const { data: students, isFetching: isLoading } = useQuery<Student[]>({
  queryKey: ["search-result", searchValue, classroomId],
  initialData: [],
  queryFn: async () => {
    try {
      const res = await api.get(
        `student/search?name=${searchValue.value || ""}${
          !isNaN(Number(classroomId.value))
            ? "&classroomId=" + classroomId.value
            : ""
        }`
      );
      return res.data.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  },
});
const { data: classrooms } = useQuery<Classroom[]>({
  queryKey: ["classrooms"],
  queryFn: async () => {
    try {
      return (await api.get("classroom")).data?.data;
    } catch (err: any) {
      throw new Error(err?.message);
    }
  },
});
const { mutate: submitReport, isPending } = useMutation({
  mutationFn: async (d: typeof data.value) => {
    try {
      const res = await api.post("report", d);
      return res.data;
    } catch (err: any) {
      throw new Error(err?.message);
    }
  },
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ["reports"] });
    router.push({ name: "dashboard.report" });
  },
});
watch(query, () => setSearchValue(query.value));
watch(data, () => console.log("dataL", data.value), { deep: true });
</script>
<template>
  <div>
    <h1 class="text-xl md:text-2xl font-semibold">Report</h1>
    <p class="text-slate-600 text-sm md:text-base">Create new report.</p>
    <div class="mt-6">
      <form
        method="post"
        @submit="
          (e) => {
            e.preventDefault();
            submitReport(data);
          }
        "
      >
        <div class="flex flex-col gap-y-5 lg:max-w-[45rem]">
          <div class="flex sm:items-end gap-2 max-sm:flex-col-reverse">
            <div class="flex flex-col flex-1">
              <div class="relative">
                <div
                  class="flex relative items-center shadow-sm rounded-md border border-slate-300"
                >
                  <span class="pl-2 pr-1.5">
                    <Search class="min-w-4 h-4" />
                  </span>
                  <Input
                    placeholder="Search student"
                    v-model="query"
                    class="!shadow-none !p-0 focus:!ring-0 !border-0"
                    id="search"
                  />
                  <span class="px-2">
                    <Loader
                      class="min-w-5 h-5"
                      v-show="isLoading && searchValue.length > 0"
                    />
                  </span>
                </div>
                <div
                  class="bg-white flex flex-col max-h-[20.5rem] overflow-y-scroll rounded-md shadow-sm border border-slate-200 z-[9] absolute w-full duration-300 ease-in-out origin-top"
                  v-if="!isLoading"
                  :class="[
                    searchValue.length > 0 && query.length > 0
                      ? 'pointer-events-auto'
                      : 'scale-90 opacity-0 pointer-events-none',
                  ]"
                >
                  <div v-if="students.length > 0" class="flex flex-col">
                    <div
                      v-for="student in students"
                      @click="
                        () => {
                          setStudent(student);
                          query = '';
                        }
                      "
                      class="cursor-pointer flex flex-col px-4 py-3 rounded-md hover:bg-slate-100"
                    >
                      <h1 class="text-sm font-medium">{{ student.name }}</h1>
                      <div class="flex items-center justify-between">
                        <p class="text-sm text-[0.80rem] text-slate-600">
                          {{ student.nis }}
                        </p>
                        <p class="text-sm text-[0.80rem] text-slate-600">
                          {{ student.classroom.name }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="flex justify-center items-center py-8" v-else>
                    <h1 class="text-slate-600 text-sm">No Students found.</h1>
                  </div>
                </div>
              </div>
            </div>
            <Select
              @update:model-value="
                () => {
                  student = null;
                }
              "
              class="max-w-[20rem]"
              v-model="classroomId"
            >
              <SelectTrigger class="sm:max-w-[12rem] max-sm:flex-1">
                <SelectValue placeholder="Select Classroom" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel class="font-medium">Classroom</SelectLabel>
                  <SelectItem value="-">All Classroom</SelectItem>
                  <SelectItem
                    v-for="classroom in classrooms"
                    :value="String(classroom.id)"
                    >{{ classroom.name }}</SelectItem
                  >
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label class="font-medium max-md:text-sm">Name</label>
            <Input
              :model-value="student?.name || ''"
              readonly
              class="!border-slate-300 mt-1 !text-black focus:!ring-0"
            />
          </div>
          <div class="flex flex-col">
            <label for="description" class="font-medium pb-1 max-md:text-sm"
              >Description</label
            >
            <Textarea
              v-model="data.description"
              placeholder="Add some report description"
              rows="7"
              class="!px-2.5 focus:!ring-0"
            />
          </div>
          <button
            type="submit"
            class="px-3 py-2 text-sm bg-zinc-900 text-white rounded-md mt-3"
          >
            Create New Report
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
