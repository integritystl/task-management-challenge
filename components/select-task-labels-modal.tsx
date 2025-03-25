'use client';

import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil, Plus, X } from 'lucide-react';

interface Label {
	id: string;
	title: string;
}

interface EditLabelsModalProps {
	labels: Label[];
	setLabels: React.Dispatch<React.SetStateAction<Label[]>>;
	selectedLabelId: string | null;
	setSelectedLabelId: (id: string | null) => void;
	onLabelAssign?: (labelId: string) => void;
	onLabelUnassign?: (labelId: string) => void;
	taskId?: string;
	taskLabels?: string[];
}

export function SelectTaskLabelsModal({
	labels,
	onLabelAssign,
	onLabelUnassign,
	taskId,
	taskLabels,
}: EditLabelsModalProps) {
	const [newLabel, setNewLabel] = useState('');
	const [open, setOpen] = useState(false);

	const handleToggleLabel = (labelId: string) => {
		if (taskLabels?.includes(labelId)) {
			onLabelUnassign?.(labelId);
		} else {
			onLabelAssign?.(labelId);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<button className="flex items-center rounded-md border-2 border-transparent hover:border-slate-600 text-slate-600" title='Click to select Labels'>
					<Pencil size={20} />
				</button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Select Labels for this Task</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div className="space-y-2">
						{labels.map((label) => (
							<div
								key={label.id}
								className="flex justify-between items-center border p-2 rounded hover:border-2 hover:border-slate-700"
							>
								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										checked={taskLabels?.includes(label.id)}
										onChange={() => handleToggleLabel(label.id)}
									/>
									<span>{label.title}</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
