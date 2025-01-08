/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Control, FieldValues, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MultipleSelector from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function Name(form: { control: Control<FieldValues> | undefined }) {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>姓名</FormLabel>
          <FormControl>
            <Input {...field} required />
          </FormControl>
          <FormDescription>请输入您的真实姓名</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function Age(form: { control: Control<FieldValues> | undefined }) {
  return (
    <FormField
      control={form.control}
      name="age"
      render={({ field }) => (
        <FormItem>
          <FormLabel>年龄</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择年龄范围" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-18">18岁以下</SelectItem>
                <SelectItem value="18-24">18-24</SelectItem>
                <SelectItem value="25-34">25-34</SelectItem>
                <SelectItem value="35-44">35-44</SelectItem>
                <SelectItem value="45-54">45-54</SelectItem>
                <SelectItem value="55-plus">55及以上</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>选择您的年龄范围</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function Stage(form: { control: Control<FieldValues> | undefined }) {
  return (
    <FormField
      control={form.control}
      name="stage"
      render={({ field }) => (
        <FormItem>
          <FormLabel>所在阶段</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择所在阶段" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pre-pregnancy">备孕</SelectItem>
                <SelectItem value="pregnancy">孕期</SelectItem>
                <SelectItem value="postpartum">产后</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>备孕、孕期、产后</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function EmploymentStatus(form: { control: Control<FieldValues> | undefined }) {
  return (
    <FormField
      control={form.control}
      name="employmentStatus"
      render={({ field }) => (
        <FormItem>
          <FormLabel>就业情况</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择就业情况" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">全职</SelectItem>
                <SelectItem value="part-time">兼职</SelectItem>
                <SelectItem value="student">学生</SelectItem>
                <SelectItem value="homemaker">家庭主妇</SelectItem>
                <SelectItem value="unemployed">待业</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>全职、兼职、学生、家庭主妇、待业</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function Country(form: { control: Control<FieldValues> | undefined }) {
  return (
    <FormField
      control={form.control}
      name="country"
      render={({ field }) => (
        <FormItem>
          <FormLabel>所在国家</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择所在国家" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="china">中国</SelectItem>
                <SelectItem value="usa">美国</SelectItem>
                <SelectItem value="other">其他</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>中国、美国或其他国家</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function EducationLevel(form: { control: Control<FieldValues> | undefined }) {
  return (
    <FormField
      control={form.control}
      name="educationLevel"
      render={({ field }) => (
        <FormItem>
          <FormLabel>最高学历</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择最高学历" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="below-highschool">高中以下</SelectItem>
                <SelectItem value="highschool">高中毕业</SelectItem>
                <SelectItem value="associate">大专</SelectItem>
                <SelectItem value="bachelor">本科</SelectItem>
                <SelectItem value="master-above">硕士及以上</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>高中以下至硕士及以上</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function MaritalStatus(form: { control: Control<FieldValues> | undefined }) {
  return (
    <FormField
      control={form.control}
      name="maritalStatus"
      render={({ field }) => (
        <FormItem>
          <FormLabel>婚姻状况</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择婚姻状况" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">单身/未婚</SelectItem>
                <SelectItem value="married">已婚/处于伴侣关系中</SelectItem>
                <SelectItem value="divorced">离异/分居</SelectItem>
                <SelectItem value="widowed">丧偶</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>单身、已婚、离异或丧偶</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function ChildrenCount(form: { control: Control<FieldValues> | undefined }) {
  return (
    <FormField
      control={form.control}
      name="childrenCount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>家中住有几个18岁以下孩子</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择孩子数量" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pregnancy">孕期</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3或3个以上</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>选择孩子数量（孕期至3个或更多）</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function DiagnosedConditions(form: {
  control: Control<FieldValues> | undefined;
}) {
  return (
    <FormField
      control={form.control}
      name="diagnosedConditions"
      render={({ field }) => (
        <FormItem>
          <FormLabel>确诊病史</FormLabel>
          <FormControl>
            <MultipleSelector
              // @ts-expect-error values is work for me
              values={field.value || []}
              onChange={(values) => field.onChange(values)}
              options={[
                { value: "depression", label: "抑郁症" },
                { value: "autism", label: "自闭症" },
                { value: "hearing-speech", label: "听力障碍/言语障碍" },
                { value: "developmental-disorder", label: "发育障碍" },
                {
                  value: "pregnancy-complications",
                  label: "产前并发症/产后并发症/分娩创伤",
                },
                { value: "prefer-not-to-say", label: "有 但不愿回答" },
              ]}
              placeholder="请选择确诊病史"
              className="border rounded-md"
              badgeClassName="bg-[#E9A79B] hover:bg-[#E9A79B]"
            />
          </FormControl>
          <FormDescription>请选择确诊的病史（可多选）</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function MedicationUsage(form: { control: Control<FieldValues> | undefined }) {
  return (
    <FormField
      control={form.control}
      name="medicationUsage"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            目前是否在使用任何精神类药物
            <span className="text-sm text-gray-500">
              （包括但不限于抗抑郁类药物，抗焦虑类药物，抗精神病类药物，抗癫痫类药物，情绪稳定剂等）
            </span>
          </FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">是</SelectItem>
                <SelectItem value="no">否</SelectItem>
                <SelectItem value="prefer-not-to-say">不想透露</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>选择是否正在使用精神类药物</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function CurrentIssues(form: { control: Control<FieldValues> | undefined }) {
  return (
    <FormField
      control={form.control}
      name="currentIssues"
      render={({ field }) => (
        <FormItem>
          <FormLabel>目前遇到以下哪些问题</FormLabel>
          <FormControl>
            <MultipleSelector
              // @ts-expect-error values is work for me
              values={field.value || []}
              onChange={(values) => field.onChange(values)}
              options={[
                { value: "anxiety", label: "焦虑" },
                { value: "worry", label: "忧虑" },
                { value: "low-mood", label: "情绪低落" },
                { value: "depression", label: "抑郁" },
                { value: "insomnia", label: "失眠" },
                { value: "irritability", label: "烦躁" },
                { value: "anger", label: "易怒" },
                { value: "stress", label: "压力大" },
                { value: "lack-of-support", label: "缺乏支持" },
                { value: "lack-of-exercise", label: "运动不足" },
                { value: "headache", label: "头疼" },
                { value: "digestive-issues", label: "肠胃不适" },
                { value: "low-energy", label: "没有精力" },
                { value: "poor-focus", label: "注意力不集中" },
                { value: "no-appetite", label: "没有胃口" },
                { value: "weight-change", label: "体重剧烈变化" },
                { value: "fatigue", label: "疲惫" },
                { value: "disinterest", label: "对生活丧失兴趣" },
                { value: "low-self-worth", label: "自我价值低" },
                { value: "guilt", label: "过度愧疚" },
              ]}
              placeholder="请选择问题"
              className="border rounded-md"
              badgeClassName="bg-[#E9A79B] hover:bg-[#E9A79B]"
            />
          </FormControl>
          <FormDescription>可多选，选择当前遇到的问题</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function WellbeingSatisfaction(form: {
  control: Control<FieldValues> | undefined;
}) {
  return (
    <FormField
      control={form.control}
      name="wellbeingSatisfaction"
      render={({ field }) => (
        <FormItem>
          <FormLabel>目前的身心状态满意度</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择满意度" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="satisfied">满意</SelectItem>
                <SelectItem value="needs-improvement">有待提高</SelectItem>
                <SelectItem value="dissatisfied">不满意</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>请根据自身感受选择满意度</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function DesiredChanges(form: { control: Control<FieldValues> | undefined }) {
  return (
    <FormField
      control={form.control}
      name="desiredChanges"
      render={({ field }) => (
        <FormItem>
          <FormLabel>你最想改变的是什么</FormLabel>
          <FormControl>
            <MultipleSelector
              // @ts-expect-error values is work for me
              values={field.value || []}
              onChange={(values) => field.onChange(values)}
              options={[
                { value: "improve-mood", label: "改善情绪状态" },
                { value: "improve-habits", label: "改善生活习惯" },
                { value: "gain-support", label: "获得支持" },
                { value: "learn-knowledge", label: "学习孕产期知识" },
              ]}
              placeholder="请选择要改变的内容"
              className="border rounded-md"
              badgeClassName="bg-[#E9A79B] hover:bg-[#E9A79B]"
            />
          </FormControl>
          <FormDescription>可多选，选择你最想改变的内容</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default function SelectForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      age: "",
      stage: "",
      employmentStatus: "",
      country: "",
      educationLevel: "",
      maritalStatus: "",
      childrenCount: "",
      diagnosedConditions: [],
      medicationUsage: "",
      wellbeingSatisfaction: "",
      currentIssues: [],
      desiredChanges: [],
    },
  });
  const router = useRouter();

  // @ts-expect-error values is array of questions
  function onSubmit(values) {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        extra: values,
      }),
    }).then(async (res) => {
      if (res.ok) {
        toast.success("Profile updated successfully");
        const data = await res.json();
        if (!data.edps) {
          router.push("/edps");
        } else {
          router.push("/chat");
        }
      } else {
        toast.error("Failed to update profile");
      }
    });
  }

  return (
    <div className="mx-20 mt-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-8"
        >
          <Name control={form.control} />
          <Age control={form.control} />
          <Stage control={form.control} />
          <EmploymentStatus control={form.control} />
          <Country control={form.control} />
          <EducationLevel control={form.control} />
          <MaritalStatus control={form.control} />
          <ChildrenCount control={form.control} />
          <DiagnosedConditions control={form.control} />
          <MedicationUsage control={form.control} />
          <WellbeingSatisfaction control={form.control} />
          <CurrentIssues control={form.control} />
          <DesiredChanges control={form.control} />

          <Button
            className="px-6 py-2 text-center sm:text-lg tracking-wider rounded-full bg-[#E9A79B] hover:bg-[#E9A79B] text-white transition-all duration-300 ease-in-out hover:shadow-xl"
            type="submit"
          >
            提交
          </Button>
        </form>
      </Form>
    </div>
  );
}
