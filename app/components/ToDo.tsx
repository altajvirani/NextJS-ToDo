"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  Card,
  CardBody,
  Tabs,
  Tab,
  Chip,
  Button,
  ScrollShadow,
  useDisclosure,
} from "@nextui-org/react";
import { Task } from "@/app/types";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import AddIcon from "@/app/assets/AddIcon.jsx";
import TaskModal from "./TaskModal";
import TaskCard from "./TaskCard";

export default function ToDo() {
  interface Tab {
    name: string;
    count: number;
  }

  const [tabs, setTabs] = useState<Tab[]>([
    { name: "Remaining", count: 0 },
    { name: "Done", count: 0 },
  ]);

  const [activeTab, setActiveTab] = useState<boolean>(false);
  const toggleTaskChbx = (e: React.Key) => {
    setActiveTab(e == 0 ? false : true);
  };

  const initialTasks: Task[] = [];
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const taskTitleRef = useRef<HTMLInputElement>();
  const taskDescRef = useRef<HTMLInputElement>();

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [toBeEditedTask, setToBeEditedTask] = useState<Task>();

  const addTask = () => {
    let task: Task = {
      id: tasks.length + 1,
      title: taskTitleRef.current?.value ?? "",
      description: taskDescRef.current?.value ?? "",
      status: false,
    };
    setTasks((prevTasks) => [...prevTasks, task]);

    setTabs((tabs) => {
      return tabs.map((tab) => {
        return tab.name == "Remaining" ? { ...tab, count: tab.count + 1 } : tab;
      });
    });
  };

  const editTask = (beingEditedTask: Task) => {
    setTasks((prevTasks) => {
      return prevTasks.map((task) => {
        return task.id == beingEditedTask.id
          ? {
              ...task,
              title: taskTitleRef.current?.value ?? "",
              description: taskDescRef.current?.value ?? "",
            }
          : task;
      });
    });

    setIsEdit(false);
  };

  const deleteTask = (taskId: number, taskStatus: boolean) => {
    setTasks((tasks) => {
      return tasks.filter((task) => task.id !== taskId);
    });

    setTabs((tabs) => {
      return taskStatus
        ? tabs.map((tab) => {
            return tab.name == "Done"
              ? { ...tab, count: tab.count > 0 ? tab.count - 1 : 0 }
              : tab;
          })
        : tabs.map((tab) => {
            return tab.name == "Remaining"
              ? { ...tab, count: tab.count > 0 ? tab.count - 1 : 0 }
              : tab;
          });
    });
  };

  const updateTaskStatus = (isCheckedOrSwiped: boolean, taskId: number) => {
    setTasks((tasks) => {
      return tasks.map((task) => {
        return task.id == taskId
          ? { ...task, status: isCheckedOrSwiped }
          : task;
      });
    });

    setTabs((tabs) => {
      return tabs.map((tab) => {
        return isCheckedOrSwiped
          ? tab.name == "Remaining"
            ? { ...tab, count: tab.count > 0 ? tab.count - 1 : 0 }
            : { ...tab, count: tab.count + 1 }
          : tab.name == "Remaining"
          ? { ...tab, count: tab.count + 1 }
          : { ...tab, count: tab.count > 0 ? tab.count - 1 : 0 };
      });
    });
  };

  const dndId = useId();
  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (active.id !== over?.id) {
      setTasks((tasks) => {
        const fromIndex = tasks.findIndex((task) => task.id === active.id);
        const toIndex = tasks.findIndex((task) => task.id === over?.id);
        let arr = arrayMove(tasks, fromIndex, toIndex);
        return arr;
      });
    }
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const modalBtnRef = useRef<HTMLButtonElement>(null);
  const addTaskBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isOpen) modalBtnRef.current?.click();
    };

    document.addEventListener("keydown", handleEnter);
    return () => {
      document.removeEventListener("keydown", handleEnter);
    };
  }, [isOpen, modalBtnRef]);

  return (
    <Card
      className="w-full sm:w-full md:w-[32rem] h-full max-h-[100svh] bg-slate-50 border-1 border-slate-300 shadow-[0rem_0rem_3rem_-0.4rem_rgb(0,0,0,0.15)]"
      shadow="none">
      <Tabs
        onSelectionChange={(e) => toggleTaskChbx(e)}
        aria-label="Options"
        color="primary"
        variant="underlined"
        classNames={{
          tabList:
            "px-4 py-0 gap-4 w-full relative rounded-none border-b border-divider",
          cursor: "w-full bg-indigo-700 h-[0.1rem]",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-slate-900",
        }}>
        {tabs.map((tab, key) => {
          return (
            <Tab
              key={key}
              title={
                <div className="flex items-center space-x-2">
                  <span className="font-bold">{tab.name}</span>
                  <Chip
                    size="sm"
                    variant="flat"
                    radius="none"
                    className=" text-slate-500 pb-[0.2rem] rounded-md">
                    {tab.count}
                  </Chip>
                </div>
              }
            />
          );
        })}
      </Tabs>
      <CardBody className="p-0 pb-6">
        <ScrollShadow className="w-full h-full p-6 pt-2">
          <DndContext
            id={dndId}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}>
            <SortableContext
              items={tasks}
              strategy={verticalListSortingStrategy}>
              {tasks.map((task: Task) => {
                return (
                  <TaskCard
                    key={task.id}
                    task={task}
                    activeTab={activeTab}
                    updateTaskStatus={updateTaskStatus}
                    onOpen={onOpen}
                    setIsEdit={setIsEdit}
                    setToBeEditedTask={setToBeEditedTask}
                    deleteTask={deleteTask}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
        </ScrollShadow>
      </CardBody>
      <Button
        isIconOnly
        className="absolute bottom-5 right-5 p-0 m-0 max-w-[1rem]"
        color="primary"
        variant="shadow"
        size="lg"
        ref={modalBtnRef}
        onPress={onOpen}
        onClick={() => setIsEdit(false)}>
        <AddIcon />
      </Button>
      <TaskModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        taskTitleRef={taskTitleRef}
        taskDescRef={taskDescRef}
        addTask={addTask}
        addTaskBtnRef={addTaskBtnRef}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        toBeEditedTask={toBeEditedTask}
        setToBeEditedTask={setToBeEditedTask}
        editTask={editTask}
      />
    </Card>
  );
}
