import { Button, Card, Checkbox } from "@nextui-org/react";
import DeleteIcon from "../assets/DeleteIcon";
import EditIcon from "../assets/EditIcon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "../types";
import { useState } from "react";

interface TaskCardProps {
  task: Task;
  activeTab: boolean;
  updateTaskStatus: (isChecked: boolean, taskId: number) => void;
  onOpen: () => void;
  setIsEdit: (value: React.SetStateAction<boolean>) => void;
  setToBeEditedTask: (value: any) => void;
  deleteTask: (taskId: number, taskStatus: boolean) => void;
}

export default function TaskCard({
  task,
  activeTab,
  updateTaskStatus,
  onOpen,
  setIsEdit,
  setToBeEditedTask,
  deleteTask,
}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });
  const dndStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;
  const onTouchStart = (e: any) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: any) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe || isRightSwipe)
      console.log("swipe", isLeftSwipe ? "left" : "right");
  };

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        ...dndStyle,
        display:
          (task.status && activeTab) || (!task.status && !activeTab)
            ? "block"
            : "none",
        touchAction: "none",
      }}
      className="cursor-pointer flex items-center min-h-max my-4 border-1 border-slate-300 shadow-none transition-shadow hover:shadow-[0rem_0rem_3rem_-0.4rem_rgb(0,0,0,0.2)]"
      shadow="none">
      <div className="w-full flex flex-row items-center py-4 pl-4 pr-3">
        <div className="w-full overflow-hidden mr-3">
          <Checkbox
            checked={task.status}
            onChange={(e) => updateTaskStatus(e.target.checked, task.id)}
            color="success">
            <span
              className={`font-regular ${
                task.status ? "line-through text-slate-500" : "text-slate-700"
              }`}>
              {task.title}
            </span>
          </Checkbox>
        </div>
        <div className="flex flex-row flex-grow gap-2">
          <Button
            isIconOnly
            variant="flat"
            color="secondary"
            aria-label="Edit task"
            size="sm"
            onPress={() => {
              onOpen();
              setIsEdit(true);
              setToBeEditedTask(task);
            }}>
            <EditIcon />
          </Button>
          <Button
            isIconOnly
            variant="flat"
            color="danger"
            aria-label="Delete task"
            size="sm"
            onPress={() => deleteTask(task.id, task.status)}>
            <DeleteIcon />
          </Button>
        </div>
      </div>
      {task.description ? (
        <div className="w-full m-0 p-4 pt-0 pl-4">
          <p className="w-full break-words leading-5 text-sm text-slate-500">
            {task.description}
          </p>
        </div>
      ) : null}
    </Card>
  );
}
