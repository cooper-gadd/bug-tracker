import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  CircleIcon,
  Timer,
  ZapIcon,
  ShieldIcon,
  UserCogIcon,
  UserIcon,
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
    icon: Timer,
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

export const roles = [
  {
    label: "Admin",
    value: "Admin",
    icon: ShieldIcon,
  },
  {
    label: "Manager",
    value: "Manager",
    icon: UserCogIcon,
  },
  {
    label: "User",
    value: "User",
    icon: UserIcon,
  },
];
