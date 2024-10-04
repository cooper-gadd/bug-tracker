import { StopwatchIcon } from "@radix-ui/react-icons";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  CircleIcon,
  ZapIcon,
} from "lucide-react";

export const statuses = [
  {
    value: "Unassigned",
    label: "Unassigned",
    icon: CircleIcon,
  },
  {
    value: "Assigned",
    label: "Assigned",
    icon: StopwatchIcon,
  },
  {
    value: "Closed",
    label: "Closed",
    icon: CheckCircleIcon,
  },
];

export const priorities = [
  {
    label: "Low",
    value: "Low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "Medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "High",
    icon: ArrowUpIcon,
  },
  {
    label: "Urgent",
    value: "Urgent",
    icon: ZapIcon,
  },
];
