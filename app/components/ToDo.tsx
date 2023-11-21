"use client";

import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Card,
  CardBody,
  Tabs,
  Tab,
  Chip,
  Button,
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
import Swipeable from "./Swipeable";

const useHandleResize = () => {
  const [isWidthSmaller, setIsWidthSmaller] = useState<boolean>();
  useLayoutEffect(() => {
    const onUpdateSize = () =>
      setIsWidthSmaller(window.innerWidth <= window.innerHeight);
    window.addEventListener("resize", onUpdateSize);
    onUpdateSize();
    return () => window.removeEventListener("resize", onUpdateSize);
  }, []);
  return isWidthSmaller;
};

const ToDo: React.FC = () => {
  const initialRender = useRef(true);
  const isWidthSmaller = useHandleResize();

  interface Tab {
    name: string;
    count: number;
  }

  const TAB_NAMES = {
    REMAINING: "Remaining",
    DONE: "Done",
  };

  const initialTabs: Tab[] = [
    { name: TAB_NAMES.REMAINING, count: 0 },
    { name: TAB_NAMES.DONE, count: 0 },
  ];
  const [tabs, setTabs] = useState<Tab[]>(initialTabs);

  const [activeTab, setActiveTab] = useState<boolean>(false);
  const toggleTaskVisibility = (e: React.Key) =>
    setActiveTab(e == 0 ? false : true);

  const initialTasks: Task[] = [];
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const LOCAL_STORAGE_KEY = "todoListData";
  const getStoredData = () => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)!);
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      return null;
    }
  };

  const saveData = (tabs: Tab[], tasks: Task[]) =>
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ tabs, tasks }));

  useEffect(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        const storedData = getStoredData();
        if (storedData) {
          setTabs(storedData.tabs);
          setTasks(storedData.tasks);
        }
      } catch (error) {
        console.error("Error parsing localStorage data: ", error);
      }
    }

    const handleArrowKeys = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight")
        setActiveTab((prevActiveTab) => !prevActiveTab);
    };
    window.addEventListener("keydown", handleArrowKeys);
    return () => window.removeEventListener("keydown", handleArrowKeys);
  }, []);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    if (typeof window !== "undefined" && typeof localStorage !== "undefined")
      saveData(tabs, tasks);
  }, [tabs, tasks]);

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

    setTabs((tabs) =>
      tabs.map((tab) =>
        tab.name === TAB_NAMES.REMAINING
          ? { ...tab, count: tab.count + 1 }
          : tab
      )
    );
  };

  const editTask = (beingEditedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === beingEditedTask.id
          ? {
              ...task,
              title: taskTitleRef.current?.value ?? "",
              description: taskDescRef.current?.value ?? "",
            }
          : task
      )
    );

    setIsEdit(false);
  };

  const deleteTask = (taskId: number, taskStatus: boolean) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== taskId));

    setTabs((tabs) =>
      tabs.map((tab) => ({
        ...tab,
        count:
          tab.name === (taskStatus ? TAB_NAMES.DONE : TAB_NAMES.REMAINING)
            ? Math.max(tab.count - 1, 0)
            : tab.count,
      }))
    );
  };

  const updateTaskStatus = (isCheckedOrSwiped: boolean, taskId: number) => {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: isCheckedOrSwiped } : task
      )
    );

    setTabs((tabs) =>
      tabs.map((tab) => ({
        ...tab,
        count:
          tab.name ===
          (isCheckedOrSwiped ? TAB_NAMES.REMAINING : TAB_NAMES.DONE)
            ? Math.max(tab.count - 1, 0)
            : tab.count + 1,
      }))
    );
  };

  const dndId = useId();
  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (active.id !== over?.id) {
      setTasks((tasks) => {
        const fromIndex = tasks.findIndex((task) => task.id === active.id);
        const toIndex = tasks.findIndex((task) => task.id === over?.id);
        return arrayMove(tasks, fromIndex, toIndex).map(
          (task: Task, key: number) => ({
            ...task,
            id: key + 1,
          })
        );
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
    return () => document.removeEventListener("keydown", handleEnter);
  }, [isOpen, modalBtnRef]);

  return (
    <Swipeable
      swipeDirection={activeTab ? "right" : "left"}
      onSwipe={() => setActiveTab(!activeTab)}
      className={`${isWidthSmaller ? "w-full" : "w-[32rem]"} h-full`}>
      <Card
        className={`${
          isWidthSmaller ? "w-full" : "w-[32rem]"
        } h-full bg-slate-50 border-1 border-slate-300 shadow-[0rem_0rem_3rem_-0.4rem_rgba(0,0,0,0.15)]`}
        style={{
          boxShadow: "0rem 0rem 3rem -0.4rem rgba(0,0,0,0.15)",
        }}
        shadow="none">
        <Tabs
          selectedKey={activeTab ? "1" : "0"}
          onSelectionChange={toggleTaskVisibility}
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
          {tabs.map((tab, key) => (
            <Tab
              key={key}
              title={
                <div className="flex items-center space-x-2">
                  <span className="font-bold">{tab.name}</span>
                  <Chip
                    size="sm"
                    variant="flat"
                    radius="none"
                    className=" text-slate-500 pb-[0.15rem] rounded-md">
                    {tab.count}
                  </Chip>
                </div>
              }
            />
          ))}
        </Tabs>
        <CardBody className="w-full h-full px-6 pb-1">
          <DndContext
            id={dndId}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}>
            <SortableContext
              items={tasks}
              strategy={verticalListSortingStrategy}>
              {tasks.map((task: Task) => (
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
              ))}
            </SortableContext>
          </DndContext>
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
    </Swipeable>
  );
};

export default ToDo;
