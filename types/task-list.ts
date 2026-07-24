import { Task } from '@/lib/db';

export interface TaskListProps {
	initialTasks: Task[];
}

export interface Label {
	id: string;
	title: string;
}

export interface TaskWithLabels extends Task {
	labelIds?: string[];
	labels?: Label[];
}

export interface TaskCardProps {
	task: TaskWithLabels;
	children?: React.ReactNode;
}

export interface EditLabelsModalProps {
	labels: Label[];
	setLabels: React.Dispatch<React.SetStateAction<Label[]>>;
	selectedLabelId: string | null;
	setSelectedLabelId: (id: string | null) => void;
	onLabelAssign?: (labelId: string) => void;
	onLabelUnassign?: (labelId: string) => void;
	taskId?: string;
	taskLabels?: string[];
}