'use client';

import { useState } from 'react';

// Components
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

// Types
import { Label, EditLabelsModalProps } from '@/types/task-list'


export function ManageLabelsModal({
	labels,
	setLabels,
	selectedLabelId,
	setSelectedLabelId,
}: EditLabelsModalProps) {
	const [newLabel, setNewLabel] = useState('');
	const [open, setOpen] = useState(false);

	const handleAddLabel = () => {
		if (!newLabel.trim()) return;
		const newId = crypto.randomUUID();
		const newLabelObj: Label = { id: newId, title: newLabel.trim() };
		setLabels((prev) => [...prev, newLabelObj]);
		setNewLabel('');
	};

	const handleDeleteLabel = (id: string) => {
		setLabels((prev) => prev.filter((label) => label.id !== id));
		if (selectedLabelId === id) setSelectedLabelId(null);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<button className="py-2 px-4 flex items-center gap-2 rounded-md bg-gray-700 hover:bg-black text-white">
					<Pencil size={20} />
				</button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Manage Labels</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div className="flex gap-2">
						<Input
							value={newLabel}
							onChange={(e) => setNewLabel(e.target.value)}
							placeholder="New label"
						/>
						<Button onClick={handleAddLabel}>
							<Plus size={16} className="mr-1" />
							Add
						</Button>
					</div>
					<div className="space-y-2">
						{labels.map((label) => (
							<div
								key={label.id}
								className="flex justify-between items-center border p-2 rounded"
							>
								<div className="flex items-center gap-2">
									<span>{label.title}</span>
								</div>
								<button
									onClick={() => handleDeleteLabel(label.id)}
									className="text-red-500 hover:text-red-700"
								>
									<X size={24} />
								</button>
							</div>
						))}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
