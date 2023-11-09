"use client";

import React, { useEffect, useRef, useState } from "react";
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
// const tailwindRandomColor = require("@videsk/tailwind-random-color");

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

  const taskTitleRef: React.RefObject<any> = useRef();
  const taskDescRef: React.RefObject<any> = useRef();
  const initialTasks: Task[] = [];
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [toBeEditedTask, setToBeEditedTask] = useState<any>();

  // const taskCardTheme = () => {
  //   return (
  //     new tailwindRandomColor({
  //       colors: [
  //         "slate",
  //         "gray",
  //         "zinc",
  //         "neutral",
  //         "stone",
  //         "red",
  //         "orange",
  //         "amber",
  //         "yellow",
  //         "lime",
  //         "green",
  //         "emerald",
  //         "teal",
  //         "cyan",
  //         "sky",
  //         "blue",
  //         "indigo",
  //         "violet",
  //         "purple",
  //         "fuchsia",
  //         "pink",
  //         "rose",
  //       ],
  //       range: [2, 7],
  //     }).pick() + " absolute w-2 h-full left-0"
  //   );
  // };

  const addTask = () => {
    let task: Task = {
      id: tasks.length + 1,
      title: taskTitleRef.current.value,
      description:
        taskDescRef.current.value != "" ? taskDescRef.current.value : null,
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
          ? { ...task, title: taskTitleRef.current.value }
          : task;
      });
    });
    setIsEdit(false);
  };

  const deleteTask = (taskId: number, taskStatus: boolean) => {
    setTasks((tasks) => {
      return tasks.filter((task) => task.id != taskId);
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

  const updateTaskStatus = (isChecked: boolean, taskId: number) => {
    setTasks((tasks) => {
      return tasks.map((task) => {
        return task.id == taskId ? { ...task, status: isChecked } : task;
      });
    });

    setTabs((tabs) => {
      return tabs.map((tab) => {
        return isChecked
          ? tab.name == "Remaining"
            ? { ...tab, count: tab.count - 1 }
            : { ...tab, count: tab.count + 1 }
          : tab.name == "Remaining"
          ? { ...tab, count: tab.count + 1 }
          : { ...tab, count: tab.count > 0 ? tab.count - 1 : 0 };
      });
    });
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const modalBtnRef = useRef<HTMLButtonElement>(null);
  const addTaskBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isOpen) modalBtnRef.current!.click();
    };

    document.addEventListener("keydown", handleEnter);
    return () => {
      document.removeEventListener("keydown", handleEnter);
    };
  }, [isOpen, modalBtnRef]);

  return (
    <Card
      className="w-full sm:w-full md:w-[35rem] lg:w-[35rem] xl:w-[35rem] 2xl:w-[35rem] h-full bg-slate-50 border-1 border-slate-300 shadow-[0rem_0rem_3rem_-0.4rem_rgb(0,0,0,0.15)]"
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
        <ScrollShadow className="w-full h-full flex flex-col gap-4 p-6">
          {tasks.map((task: Task) => {
            return (
              task.status == activeTab && (
                <Card
                  key={task.id}
                  // className="flex items-center min-h-[3.5rem] rounded-lg border-1 border-slate-300 shadow-none transition-[shadow, border, scale] hover:shadow-[0rem_0rem_3rem_-0.4rem_rgb(0,0,0,0.2)] hover:border-none"
                  className="flex items-center min-h-[3.5rem] border-1 border-slate-300 shadow-none transition-[shadow, border, scale] hover:shadow-[0rem_0rem_3rem_-0.4rem_rgb(0,0,0,0.2)]"
                  shadow="none">
                  {/* <div className="bg-red-100 absolute w-2 h-full left-0" /> */}
                  {/* <div className={taskCardTheme()} /> */}
                  <div className="w-full flex flex-row items-center py-4 pl-4 pr-3">
                    <div className="w-full overflow-hidden mr-3">
                      <Checkbox
                        lineThrough={task.status}
                        checked={task.status}
                        defaultChecked={task.status}
                        onChange={(e) =>
                          updateTaskStatus(e.target.checked, task.id)
                        }
                        color="success">
                        <span className="font-regular text-slate-700">
                          {task.title}
                        </span>
                      </Checkbox>
                    </div>
                    <div className="flex flex-row gap-2">
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
                    // <div className="w-full m-0 p-4 pt-0 pl-5">
                    <div className="w-full m-0 p-4 pt-0 pl-4">
                      <p className="break-words leading-5 text-sm text-slate-500">
                        {task.description}
                      </p>
                    </div>
                  ) : null}
                </Card>
              )
            );
          })}
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
