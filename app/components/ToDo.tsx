"use client";

import React, { useRef, useState } from "react";
import {
  Card,
  CardBody,
  Checkbox,
  Tabs,
  Tab,
  Chip,
  Button,
  ScrollShadow,
  useDisclosure,
} from "@nextui-org/react";
import { Task } from "@/app/types";
import AddIcon from "@/app/assets/AddIcon.jsx";
import EditIcon from "@/app/assets/EditIcon";
import DeleteIcon from "@/app/assets/DeleteIcon";
import TaskModal from "./TaskModal";

export default function ToDo() {
  interface Tab {
    name: string;
    count: number;
  }

  const [tabs, setTabs] = useState<Tab[]>([
    { name: "Remaining", count: 0 },
    { name: "Done", count: 0 },
  ]);

  const taskInputRef: React.RefObject<any> = useRef();

  const initialTasks: Task[] = [];
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [toBeEditedTask, setToBeEditedTask] = useState<any>();

  const addTask = () => {
    let task: Task = {
      id: tasks.length + 1,
      title: taskInputRef.current.value,
      status: false,
    };
    setTasks((prevTasks) => [...prevTasks, task]);

    setTabs((tabs) => {
      return tabs.map((tab) => {
        if (tab.name == "Remaining") return { ...tab, count: tab.count + 1 };
        return tab;
      });
    });
  };

  const editTask = (beingEditedTask: Task) => {
    setTasks((prevTasks) => {
      return prevTasks.map((task) => {
        if (task.id == beingEditedTask.id)
          return { ...task, title: taskInputRef.current.value };
        return task;
      });
    });
    setIsEdit(false);
  };

  const deleteTask = (taskId: number, taskStatus: boolean) => {
    setTasks((tasks) => {
      return tasks.filter((task) => task.id != taskId);
    });

    setTabs((tabs) => {
      if (taskStatus) {
        return tabs.map((tab) => {
          if (tab.name == "Done")
            return { ...tab, count: tab.count > 0 ? tab.count - 1 : 0 };
          return tab;
        });
      } else {
        return tabs.map((tab) => {
          if (tab.name == "Remaining")
            return { ...tab, count: tab.count > 0 ? tab.count - 1 : 0 };
          return tab;
        });
      }
    });
  };

  const updateTaskStatus = (isChecked: boolean, taskId: number) => {
    setTasks((tasks) => {
      return tasks.map((task) => {
        if (task.id == taskId) return { ...task, status: isChecked };
        return task;
      });
    });

    setTabs((tabs) => {
      return tabs.map((tab) => {
        if (isChecked) {
          if (tab.name == "Remaining") return { ...tab, count: tab.count - 1 };
          return { ...tab, count: tab.count + 1 };
        } else if (tab.name == "Remaining")
          return { ...tab, count: tab.count + 1 };
        return { ...tab, count: tab.count > 0 ? tab.count - 1 : 0 };
      });
    });
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <Card
      className="w-[25rem] h-[36rem] bg-slate-50 border-1 border-slate-300 "
      shadow="none">
      <Tabs
        onSelectionChange={(e) => console.log(e)}
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
        <ScrollShadow className="w-full h-full flex flex-col gap-4 p-6">
          {tasks.map((task: Task) => {
            return (
              <Card
                key={task.id}
                className="flex flex-row items-center min-h-[4rem] border-1 border-slate-300 shadow-none transition-shadow hover:shadow-[0rem_0rem_1.8rem_-0.4rem_rgb(0,0,0,0.2)] hover:border-none"
                shadow="none">
                <Checkbox
                  lineThrough={task.status}
                  onChange={(e) => updateTaskStatus(e.target.checked, task.id)}
                  color="success"
                  className="p-6">
                  {task.title}
                </Checkbox>
                <Button
                  isIconOnly
                  variant="flat"
                  color="secondary"
                  aria-label="Edit task"
                  size="sm"
                  className="absolute right-10 mr-3"
                  onPress={onOpen}
                  onClick={() => {
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
                  className="absolute right-0 mr-3"
                  onClick={() => deleteTask(task.id, task.status)}>
                  <DeleteIcon />
                </Button>
              </Card>
            );
          })}
        </ScrollShadow>
      </CardBody>
      <Button
        isIconOnly
        className="absolute bottom-5 right-5 p-0 m-0 max-w-[1rem]"
        color="primary"
        variant="shadow"
        onPress={onOpen}
        onClick={() => setIsEdit(false)}>
        <AddIcon />
      </Button>
      <TaskModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        taskInputRef={taskInputRef}
        addTask={addTask}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        toBeEditedTask={toBeEditedTask}
        setToBeEditedTask={setToBeEditedTask}
        editTask={editTask}
      />
    </Card>
  );
}
